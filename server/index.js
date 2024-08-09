const express = require('express');
const multer = require('multer');
const cors = require('cors');
const tf = require('@tensorflow/tfjs-node');
const { load } = require('@tensorflow-models/deeplab');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const port = 3100;


app.use(cors());
app.use(express.json());

// Set up multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) { 
      return cb(null, true);
    } else {
      cb('Error: File upload only supports images!');
    }
  }
});

// Fetch and initialize models with retry logic
const fetchModelWithRetry = async (base, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await load({
        base: base,
        quantizationBytes: 2,
      });
    } catch (error) {
      console.error(`Failed to load model ${base}, attempt ${i + 1}:`, error);
      if (i === retries - 1) throw error;
      await new Promise(res => setTimeout(res, 1000)); // Wait before retrying
    }
  }
};
let models = {};

const initializeModels = async () => {
  const modelNames = ['pascal', 'cityscapes', 'ade20k'];
  for (const base of modelNames) {
    models[base] = await fetchModelWithRetry(base);
  }
  console.log('Models initialized');
};

initializeModels();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB', error);
});

// Define the User schema and model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  imagePath: { type: String }
});

const User = mongoose.model('User', userSchema);

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied, token missing!' });
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

// Signup route
app.post('/signup', upload.single('image'), [
  body('name').not().isEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  console.log('Signup endpoint hit');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    imagePath: req.file.path
  });

  try {
    await user.save();
    const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Define the LoginHistory schema and model
const loginHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  loginTime: { type: Date, default: Date.now }
});

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);

// Login route
app.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Save login history
  const loginHistory = new LoginHistory({
    userId: user._id,
    userName: user.name
  });
  await loginHistory.save();

  res.json({ token });
});

// New endpoint to fetch login history
app.get('/login-history', authMiddleware, async (req, res) => {
  try {
    const history = await LoginHistory.find().populate('userId').sort({ loginTime: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching login history' });
  }
});

app.delete('/login-history/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await LoginHistory.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'History deleted successfully' });
    } else {
      res.status(404).send({ message: 'History not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});



// implement logout route also
/** 
 * app.post('/logout', (req, res) => {
 * 
 * });
 */
// Image upload and segmentation route
app.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const imageTensor = tf.node.decodeImage(imageBuffer);
    console.log('Image uploaded');

    const modelName = req.body.modelName || 'cityscapes';
    const model = models[modelName];
    if (!model) {
      return res.status(400).send('Invalid model name.');
    }

    const result = await model.segment(imageTensor);
    const segmentationMap = result.segmentationMap;
    const { height, width, legend } = result;

    const segmentationData = Array.from(segmentationMap);

    const outputPath = `output/${req.file.filename}.json`;
    fs.writeFileSync(outputPath, JSON.stringify({ segmentationMap: segmentationData, height, width, legend }));

    res.sendFile(path.resolve(outputPath));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing image.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
