const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
// const { OAuth2Client } = require('google-auth-library');
const { sendResetEmail } = require('./utils/emailService');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost'],
  methods: ['GET', 'POST','PUT','DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Remove or modify COOP policy to allow Google OAuth flow
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // Fixes postMessage issue
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// Test email route
app.get('/test-email', async (req, res) => {
  try {
    await sendResetEmail('your-test-email@example.com', '123456');
    res.json({ msg: 'Test email sent' });
  } catch (err) {
    console.error('Test email error:', err);
    res.status(500).json({ msg: err.message });
  }
});

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// app.post("/auth/google", async (req, res) => {
//   const { token } = req.body;

//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     console.log("User Info:", payload);

//     // Create your own JWT token for session management
//     res.json({
//       success: true,
//       user: {
//         name: payload.name,
//         email: payload.email,
//         picture: payload.picture,
//       },
//       message: "User authenticated",
//     });
//   } catch (error) {
//     res.status(401).json({ error: "Invalid Google token" });
//   }
// });
// Error handling middleware


 // Path to downloaded key

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// // // Middleware to verify Firebase token
// // const verifyFirebaseToken = async (req, res, next) => {
// //   const token = req.headers.authorization?.split("Bearer ")[1];

// //   if (!token) {
// //     return res.status(401).json({ message: "Unauthorized: No token provided" });
// //   }

// //   try {
// //     const decodedToken = await admin.auth().verifyIdToken(token);
// //     req.user = decodedToken;
// //     next();
// //   } catch (error) {
// //     return res.status(403).json({ message: "Unauthorized: Invalid token" });
// //   }
// // };

// // // Protected Route
// // app.post("/api/protected", verifyFirebaseToken, async (req, res) => {
// //   const { uid, name, email, picture } = req.user;

// //   let user = await User.findOne({ uid });

// //   if (!user) {
// //     user = new User({ uid, name, email, picture });
// //     await user.save();
// //   }

// //   res.send(user);
// // });

// // API Routes
// app.post('/api/googleusers', async (req, res) => {
//   try {
//     const { uid, email, displayName, photoURL } = req.body;
    
//     // Verify the Firebase token if you want extra security
//     // const token = req.headers.authorization?.split('Bearer ')[1];
//     // await admin.auth().verifyIdToken(token);
    
//     // Find user or create a new one (upsert)
//     const user = await User.findOneAndUpdate(
//       { uid }, 
//       { 
//         uid,
//         email, 
//         displayName, 
//         photoURL,
//         lastLogin: new Date()
//       },
//       { upsert: true, new: true }
//     );
    
//     res.status(200).json({ success: true, user });
//   } catch (error) {
//     console.error('Error saving user:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Get user by ID
// app.get('/api/googleusers/:uid', async (req, res) => {
//   try {
//     const user = await User.findOne({ uid: req.params.uid });
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
//     res.status(200).json({ success: true, user });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 