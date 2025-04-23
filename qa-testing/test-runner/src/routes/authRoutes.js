const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// In a real application, this would be stored in a database
// The password should be hashed in a production environment
const users = {
  // Username: { hashedPassword, salt }
};

// Initialize admin user from environment variables
const adminUsername = process.env.AUTH_USERNAME || 'admin';
const adminPassword = process.env.AUTH_PASSWORD || 'password';

// Create salt and hash for admin user
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.pbkdf2Sync(
  adminPassword,
  salt,
  1000,
  64,
  'sha512'
).toString('hex');

// Store admin user
users[adminUsername] = {
  hashedPassword: hash,
  salt: salt
};

// Login endpoint
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const user = users[username];
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Hash the provided password with the stored salt
    const hashedPassword = crypto.pbkdf2Sync(
      password,
      user.salt,
      1000,
      64,
      'sha512'
    ).toString('hex');
    
    // Compare the hashed password with the stored hash
    if (hashedPassword !== user.hashedPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Generate a JWT token
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || 'test-runner-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      username,
      message: 'Authentication successful'
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-runner-secret');
    res.json({ 
      valid: true, 
      username: decoded.username 
    });
  } catch (error) {
    res.status(401).json({ 
      valid: false, 
      error: 'Invalid token' 
    });
  }
});

module.exports = router; 