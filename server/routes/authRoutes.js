const express = require('express');
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);
// router.post('/google-login', async (req, res) => {
//   try {
//     // Verify the Firebase token
//     const { token } = req.body;
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     console.log(decodedToken);
//     // Get user info from the token
//     const { email, name, picture, uid } = decodedToken;
    
//     // Check if user exists in your database
//     let user = await User.findOne({ email });
    
//     if (!user) {
//       // Create new user if they don't exist
//       user = new User({
//         email,
//         name,
//         profilePicture: picture,
//         firebaseUid: uid,
//         role: 'user' // Default role
//       });
//       await user.save();
//     }
    
//     // Generate your JWT tokens
//     const accessToken = generateAccessToken(user); // Implement this function
//     const refreshToken = generateRefreshToken(user); // Implement this function
    
//     // Return the tokens and user info
//     res.json({
//       accessToken,
//       refreshToken,
//       user: {
//         id: user._id,
//         email: user.email,
//         name: user.name,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     console.error('Google login error:', error);
//     res.status(401).json({ msg: 'Invalid token or authentication failed' });
//   }
// });


module.exports = router;