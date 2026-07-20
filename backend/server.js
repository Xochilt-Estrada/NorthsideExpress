// backend/server.js - COMPLETE VERSION WITH JWT AUTH
const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // JWT for authentication
require('dotenv').config();

// Import models and routes
const User = require('./models/User');
const accidentReportsRouter = require('./routes/accidentReports');

// Initialize express app
const app = express();
// ====================
// MIDDLEWARE SETUP
// ====================
app.use(express.json()); // Body parser

// Request logging middleware - KEEP THIS FIRST
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST' && req.body) {
    console.log('📦 Body:', { 
      ...req.body, 
      password: req.body.password ? '***' : 'not provided' 
    });
  }
  next();
});

// ====================
// CORS CONFIGURATION (UPDATED)
// ====================

// Define allowed origins for development
const allowedOrigins = [
  'http://localhost:8081',    // Expo Web default port
  'http://localhost:19006',   // Expo dev server
  'http://localhost:5001',    // Your backend (for web same-origin)
  'http://10.0.0.6:8081',     // Mobile with your IP
  'http://10.0.0.6:19006',    // Expo dev on your IP
  'exp://10.0.0.6:8081',      // Expo URL scheme
  'http://10.0.0.6:5001'      // Your backend on your IP
];

// Main CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) {
      console.log('🌐 CORS: No origin (mobile/curl request)');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS: Allowed origin:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS: Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: true,  // IMPORTANT for cookies/sessions
  exposedHeaders: ['Authorization', 'Set-Cookie'],  // Expose auth headers
  maxAge: 86400  // 24 hours for preflight cache
}));

// Additional CORS headers for preflight
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // If origin is in allowed list, set it explicitly
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // Otherwise, use the wildcard (but credentials won't work)
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'Authorization, Set-Cookie');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✈️ Preflight request handled');
    return res.status(200).json({
      message: 'Preflight OK',
      allowedOrigins: allowedOrigins,
      timestamp: new Date().toISOString()
    });
  }
  
  next();
});


// ====================
// CORS TEST ENDPOINT (for debugging)
// ====================
app.get('/api/cors-test', (req, res) => {
  const origin = req.headers.origin || 'No origin header';
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const method = req.method;
  
  console.log('🔍 CORS Test Request:');
  console.log('  Origin:', origin);
  console.log('  User-Agent:', userAgent);
  console.log('  Method:', method);
  console.log('  Headers:', JSON.stringify(req.headers, null, 2));
  
  res.json({
    success: true,
    message: 'CORS test successful!',
    requestInfo: {
      origin,
      userAgent,
      method,
      timestamp: new Date().toISOString(),
      allowedOrigins: allowedOrigins,
      isOriginAllowed: allowedOrigins.includes(origin),
      headers: req.headers
    },
    corsConfig: {
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
    }
  });
});

// Also add a POST endpoint to test with data
app.post('/api/cors-test', (req, res) => {
  console.log('📨 CORS POST Test with data:', req.body);
  
  res.json({
    success: true,
    message: 'POST request successful',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// ====================
// JWT HELPER FUNCTIONS
// ====================

// Generate JWT Token
const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// ====================
// AUTH MIDDLEWARE
// ====================

// Protect routes - requires valid JWT token
const protect = async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized. No token provided.'
    });
  }

  try {
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Get user from database
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    next(); // Continue to route
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};

// Admin middleware - requires user to be admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Admin privileges required.'
    });
  }
};

// ====================
// ROUTES
// ====================

// Root endpoint - API info
app.get('/', (req, res) => {
  res.json({ 
    message: 'Brew & Bean Café API',
    status: 'running',
    database: 'MongoDB',
    version: '2.0.0',
    features: ['JWT Auth', 'Admin System', 'Accident Reports'],
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        adminLogin: 'POST /api/auth/admin/login',
        register: 'POST /api/auth/register',
        forgotPassword: 'POST /api/auth/forgot-password',
        resetPassword: 'PUT /api/auth/reset-password/:token',
        myProfile: 'GET /api/auth/me (protected)'
      },
      admin: {
        stats: 'GET /api/admin/stats (admin)',
        allUsers: 'GET /api/admin/users (admin)',
        userDetail: 'GET /api/admin/users/:id (admin)',
        updateRole: 'PUT /api/admin/users/:id/role (admin)',
        deleteUser: 'DELETE /api/admin/users/:id (admin)',
        allReports: 'GET /api/admin/accident-reports (admin)'
      },
      public: {
        health: 'GET /health',
        debug: 'GET /api/debug/status'
      }
    }
  });
});

// ====================
// AUTH ROUTES
// ====================

// 1. REGULAR USER LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }
    
    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Check password
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Generate JWT token
    const token = generateToken(user._id, user.role);
    
    // Return success response
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        truckNumber: user.truckNumber,
        licenseNumber: user.licenseNumber,
        company: user.company,
        favoriteDrink: user.favoriteDrink,
        totalOrders: user.totalOrders,
        totalTrips: user.totalTrips,
        safetyScore: user.safetyScore,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
});

// 2. ADMIN LOGIN (with debug logging)
app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 ADMIN LOGIN ATTEMPT:');
    console.log('  Email:', email);
    console.log('  Origin:', req.headers.origin || 'No origin');
    console.log('  User-Agent:', req.headers['user-agent'] || 'Unknown');
    
    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }
    
    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      console.log('❌ User is not admin:', email, 'Role:', user.role);
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }
    
    // Check password
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Generate JWT token
    const token = generateToken(user._id, user.role);
    
    console.log('✅ Admin login successful:', email);
    console.log('  Token generated:', token ? 'Yes' : 'No');
    
    // Return success response
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: true,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('🔥 Admin login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during admin login'
    });
  }
});

// 3. CREATE ADMIN USER (One-time setup)
app.post('/api/auth/create-admin', async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;
    
    // Security check
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized. Invalid secret key.'
      });
    }
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password'
      });
    }
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(409).json({
        success: false,
        error: 'User already exists with this email'
      });
    }
    
    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });
    
    // Generate token
    const token = generateToken(user._id, user.role);
    
    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during admin creation'
    });
  }
});

// 4. REGISTER USER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password'
      });
    }
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(409).json({
        success: false,
        error: 'User already exists with this email'
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: 'user' // Default role
    });
    
    // Generate token
    const token = generateToken(user._id, user.role);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        favoriteDrink: user.favoriteDrink,
        totalOrders: user.totalOrders,
        totalTrips: user.totalTrips,
        safetyScore: user.safetyScore,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'User already exists with this email'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
});

// 5. GET CURRENT USER PROFILE (Protected)
app.get('/api/auth/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.json({
      success: true,
      user
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// ====================
// ADMIN ROUTES (Protected + Admin Middleware)
// ====================

// 1. ADMIN STATISTICS
app.get('/api/admin/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    
    // Last 30 days users
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Accident reports count
    let totalAccidents = 0;
    let recentAccidents = [];
    
    try {
      const AccidentReport = require('./models/AccidentReport');
      totalAccidents = await AccidentReport.countDocuments();
      
      // Get 5 most recent accidents
      recentAccidents = await AccidentReport.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email truckNumber')
        .lean();
    } catch (error) {
      console.log('AccidentReport model not loaded yet');
    }
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        adminUsers,
        regularUsers,
        activeUsers,
        totalAccidents,
        recentAccidents
      }
    });
    
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching admin statistics'
    });
  }
});

// 2. GET ALL USERS
app.get('/api/admin/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: users.length,
      users
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching users'
    });
  }
});

// 3. GET USER BY ID
app.get('/api/admin/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Get user's accident reports
    let accidentReports = [];
    try {
      const AccidentReport = require('./models/AccidentReport');
      accidentReports = await AccidentReport.find({ user: user._id })
        .sort({ createdAt: -1 });
    } catch (error) {
      console.log('Could not load accident reports');
    }
    
    res.json({
      success: true,
      user: {
        ...user.toObject(),
        accidentReports
      }
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching user'
    });
  }
});

// 4. UPDATE USER ROLE
app.put('/api/admin/users/:id/role', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;
    
    // Validate role
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid role (user or admin)'
      });
    }
    
    // Prevent self-demotion
    if (req.params.id === req.user.id && role === 'user') {
      return res.status(400).json({
        success: false,
        error: 'You cannot remove your own admin privileges'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user
    });
    
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating user role'
    });
  }
});

// 5. DELETE USER
app.delete('/api/admin/users/:id', protect, admin, async (req, res) => {
  try {
    // Prevent self-deletion
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot delete your own account'
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Log deletion
    console.log(`🗑️ Admin ${req.user.email} deleted user ${user.email}`);
    
    await user.deleteOne();
    
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: {
        deletedAt: new Date().toISOString(),
        deletedBy: req.user.email
      }
    });
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting user'
    });
  }
});

// 6. GET ALL ACCIDENT REPORTS
app.get('/api/admin/accident-reports', protect, admin, async (req, res) => {
  try {
    const AccidentReport = require('./models/AccidentReport');
    const reports = await AccidentReport.find()
      .populate('user', 'name email truckNumber company')
      .sort({ date: -1, createdAt: -1 });
    
    res.json({
      success: true,
      count: reports.length,
      reports
    });
    
  } catch (error) {
    console.error('Get accident reports error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching accident reports'
    });
  }
});

// ====================
// EXISTING ROUTES (Keep these as they are)
// ====================

app.post('/api/auth/forgot-password', async (req, res) => {
  // Keep your existing forgot password code
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Please provide your email address'
      });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.json({
        success: true,
        message: 'If your email exists in our system, you will receive a password reset link.'
      });
    }
    
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    
    const resetUrl = `http://localhost:8081/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;
    
    // For now, return token (in production, send email)
    res.json({
      success: true,
      message: 'Password reset email sent successfully',
      token: resetToken,
      resetUrl // For testing
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

app.put('/api/auth/reset-password/:resetToken', async (req, res) => {
  // Keep your existing reset password code
  try {
    const { resetToken } = req.params;
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a password with at least 6 characters'
      });
    }
    
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }
    
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Password has been reset successfully!',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

app.get('/api/auth/verify-reset-token/:resetToken', async (req, res) => {
  // Keep your existing verify token code
  try {
    const { resetToken } = req.params;
    
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
        isValid: false
      });
    }
    
    res.json({
      success: true,
      isValid: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
    
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      isValid: false
    });
  }
});

// Health check
app.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : 
                    dbState === 2 ? 'connecting' :
                    dbState === 3 ? 'disconnecting' : 'disconnected';
    
    const userCount = await User.countDocuments();
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        connection: mongoose.connection.name,
        host: mongoose.connection.host,
        userCount
      },
      auth: {
        jwt: 'enabled',
        admin: 'enabled'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message,
      database: {
        status: 'disconnected'
      }
    });
  }
});

// Add accident reports router
app.use('/api/accident-reports', accidentReportsRouter);

// Keep your existing debug endpoints
app.get('/api/debug/status', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const userCount = await User.countDocuments();
    let accidentReportCount = 0;
    
    try {
      const AccidentReport = require('./models/AccidentReport');
      accidentReportCount = await AccidentReport.countDocuments();
    } catch (error) {
      console.log('AccidentReport model not loaded yet');
    }
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: {
        connected: dbState === 1,
        state: dbState,
        name: mongoose.connection.name
      },
      stats: {
        users: userCount,
        accidentReports: accidentReportCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Keep your existing DELETE ACCOUNT endpoint
app.delete('/api/auth/delete-account', async (req, res) => {
  try {
    const { email, password, confirmation } = req.body;
    
    console.log('\n' + '🗑️ '.repeat(20));
    console.log('🗑️  ACCOUNT DELETION REQUEST');
    console.log(`📧 Email: ${email}`);
    console.log(`⏰ Time: ${new Date().toLocaleTimeString()}`);
    
    if (!email || !password || !confirmation) {
      console.log('❌ MISSING REQUIRED FIELDS');
      console.log('🗑️ '.repeat(20) + '\n');
      return res.status(400).json({
        success: false,
        error: 'Please provide email, password, and confirmation'
      });
    }
    
    const validConfirmations = [
      'delete my account',
      'DELETE MY ACCOUNT',
      'Delete my account',
      'I want to delete my account',
      'Delete account'
    ];
    
    if (!validConfirmations.includes(confirmation.trim())) {
      console.log('❌ INVALID CONFIRMATION PHRASE');
      console.log(`📝 Provided: "${confirmation}"`);
      console.log('🗑️ '.repeat(20) + '\n');
      return res.status(400).json({
        success: false,
        error: 'Please type "delete my account" exactly to confirm'
      });
    }
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ USER NOT FOUND');
      console.log('🗑️ '.repeat(20) + '\n');
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const isPasswordValid = await user.matchPassword(password);
    
    if (!isPasswordValid) {
      console.log('❌ INVALID PASSWORD');
      console.log('🗑️ '.repeat(20) + '\n');
      return res.status(401).json({
        success: false,
        error: 'Invalid password'
      });
    }
    
    const userInfo = {
      id: user._id,
      name: user.name,
      email: user.email,
      orders: user.totalOrders,
      memberSince: user.createdAt,
      favoriteDrink: user.favoriteDrink
    };
    
    await User.findByIdAndDelete(user._id);
    
    console.log('✅ ACCOUNT DELETED SUCCESSFULLY');
    console.log(`👤 User: ${userInfo.name} (${userInfo.email})`);
    console.log(`🆔 User ID: ${userInfo.id}`);
    console.log(`📅 Member since: ${new Date(userInfo.memberSince).toLocaleDateString()}`);
    console.log(`🛒 Total orders: ${userInfo.orders}`);
    console.log(`☕ Favorite drink: ${userInfo.favoriteDrink || 'Not set'}`);
    console.log('🗑️ '.repeat(20) + '\n');
    
    res.json({
      success: true,
      message: 'Your account has been permanently deleted. We\'re sorry to see you go!',
      data: {
        deletedAt: new Date().toISOString(),
        email: userInfo.email,
        name: userInfo.name
      }
    });
    
  } catch (error) {
    console.error('🔥 ACCOUNT DELETION ERROR:', error);
    console.log('🗑️ '.repeat(20) + '\n');
    res.status(500).json({
      success: false,
      error: 'Server error during account deletion'
    });
  }
});

// ====================
// DATABASE CONNECTION
// ====================
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('\n' + '🗄️ '.repeat(15));
    console.log('✅ MONGODB CONNECTED');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🏠 Host: ${mongoose.connection.host}`);
    
    const userCount = await User.countDocuments();
    console.log(`👥 Total users: ${userCount}`);
    
    // Count admins
    const adminCount = await User.countDocuments({ role: 'admin' });
    console.log(`👑 Admin users: ${adminCount}`);
    
    if (adminCount === 0) {
      console.log('\n⚠️  NO ADMIN USERS FOUND');
      console.log('To create an admin user, use:');
      console.log('POST /api/auth/create-admin');
      console.log('Body: { name, email, password, secretKey: "brewbean-admin-2024-secret" }');
    }
    
    if (userCount > 0) {
      const users = await User.find().select('name email role createdAt').limit(5);
      console.log('\n📋 Recent users:');
      users.forEach(user => {
        const roleIcon = user.role === 'admin' ? '👑' : '👤';
        console.log(`   ${roleIcon} ${user.name} (${user.email}) - ${user.role} - ${new Date(user.createdAt).toLocaleDateString()}`);
      });
      if (userCount > 5) {
        console.log(`   ... and ${userCount - 5} more`);
      }
    }
    
    console.log('🗄️ '.repeat(15) + '\n');
    
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log('\n' + '🚀'.repeat(20));
      console.log('✅ SERVER STARTED');
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`🔐 Auth: JWT Enabled`);
      console.log(`👑 Admin System: Ready`);
      console.log(`💾 Database: MongoDB (Persistent)`);
      console.log('🚀'.repeat(20) + '\n');
      
      console.log('📋 ADMIN SETUP INSTRUCTIONS:');
      console.log('1. Create admin user: POST http://localhost:5001/api/auth/create-admin');
      console.log('2. Use secretKey: "brewbean-admin-2024-secret"');
      console.log('3. Login at: /api/auth/admin/login');
      console.log('\n');
    });
  })
  .catch(err => {
    console.error('\n❌ MONGODB CONNECTION ERROR:', err.message);
    console.log('\n⚠️  TROUBLESHOOTING:');
    console.log('1. Is MongoDB running? (mongod)');
    console.log('2. Check MONGODB_URI in .env file');
    console.log('3. For macOS: brew services start mongodb-community');
    console.log('4. For Windows: net start MongoDB');
    console.log('5. For Linux: sudo systemctl start mongod\n');
    process.exit(1);
  });

// Export app for testing
module.exports = app;