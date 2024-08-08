# DeepLab V3 

## Semantic segmentation is the problem of detecting and delineating each object of interest appearing in an image. Currently, there are several approaches that solve this problem and produce results as seen below.

This project uses TensorFlow.js to perform segmentation on uploaded image using any one of the 3 models (pascal / cityscapes / ade20k)



https://github.com/user-attachments/assets/dc01d0ff-41f5-474e-b10b-fdffc1175b88


## Getting Started

### Front-end 

To run the front-end use these following steps :

```
cd client 
npm install 
npm run dev 
```
now use http://localhost:5173 to view your front-end app

### Back-end 

To run the Back-end use these following steps :

```
cd server
```
Make sure you already have docker installed in your system

now first build the container
```
docker-compose up --build
```
