import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice'; // Adjust import path

const Navbar = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const popupRef = useRef(null);

  const user = useSelector((state) => state.auth.user); // Access user information from Redux store

  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Redirect to the login page
  };

  const handleSwitchAccount = () => {
    navigate('/'); // Redirect to login or switch account page
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  // Handle click outside the popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="text-white p-4 flex justify-between items-center">
      <div className="flex-1">
        <h1 className="text-xl font-bold tracking-wider">DEEPLAB V3</h1>
      </div>
      <div className="relative">
        {user && (
          <>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={togglePopup}>
              <span className='font-bold text-xl'>{user.name}</span> 
              <img
                src={user.imagePath || 'https://e7.pngegg.com/pngimages/340/946/png-clipart-avatar-user-computer-icons-software-developer-avatar-child-face-thumbnail.png'}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border"
              />
            </div>
            {isPopupVisible && (
              <div
                ref={popupRef}
                className="absolute right-0 top-full mt-2 bg-white text-gray-800 rounded shadow-lg p-4 w-48"
              >
                <button
                  onClick={handleSwitchAccount}
                  className="bg-yellow-500 hover:bg-black text-white px-4 py-2 rounded w-full mb-2"
                >
                  Switch Account
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-black text-white px-4 py-2 rounded w-full"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
