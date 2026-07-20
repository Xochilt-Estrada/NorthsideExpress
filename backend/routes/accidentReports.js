// backend/routes/accidentReports.js
const express = require('express');
const router = express.Router();
const AccidentReport = require('../models/AccidentReport');
const User = require('../models/User');

// @desc    Create accident report
// @route   POST /api/accident-reports
// @access  Private
router.post('/', async (req, res) => {
  try {
    console.log('\n📝 Creating accident report...');
    console.log('📦 Request body:', req.body);

    const {
      userId,
      driver,
      truckNumber,
      accidentType,
      location,
      date,
      time,
      description,
      injuries,
      vehicleDamage,
      otherDamage,
      witnesses,
      weatherConditions,
      roadConditions,
      coordinates,
      locationAccuracy
    } = req.body;

    // Validate required fields
    if (!userId || !accidentType || !description) {
      return res.status(400).json({
        success: false,
        error: 'Please provide required fields: userId, accidentType, description'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Create accident report
    const accidentReport = new AccidentReport({
      user: userId,
      driver: driver || user.name,
      truckNumber: truckNumber || user.truckNumber,
      accidentType,
      location: {
        rawString: location,
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude,
        accuracy: locationAccuracy
      },
      date: date || new Date(),
      time: time || new Date().toLocaleTimeString(),
      description,
      injuries: injuries || false,
      vehicleDamage: vehicleDamage || false,
      otherDamage: otherDamage || false,
      witnesses: witnesses || '',
      weatherConditions: weatherConditions || '',
      roadConditions: roadConditions || '',
      status: 'submitted'
    });

    // Save report
    await accidentReport.save();
    console.log('✅ Accident report saved:', accidentReport.reportNumber);

    // Add report to user's accidentReports array
    user.accidentReports.push(accidentReport._id);
    
    // Update safety score (decrease by 5 for each accident)
    user.safetyScore = Math.max(0, (user.safetyScore || 100) - 5);
    await user.save();

    console.log('✅ User updated with new accident report');

    // Return response with populated data
    const populatedReport = await AccidentReport.findById(accidentReport._id);
    
    res.status(201).json({
      success: true,
      message: 'Accident report submitted successfully',
      data: {
        report: populatedReport,
        user: {
          id: user._id,
          name: user.name,
          safetyScore: user.safetyScore,
          totalAccidents: user.accidentReports.length
        }
      }
    });

  } catch (error) {
    console.error('🔥 Error creating accident report:', error);
    
    // Handle duplicate report number
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Report number already exists'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while creating accident report'
    });
  }
});

// @desc    Get all accident reports for a user
// @route   GET /api/accident-reports/user/:userId
// @access  Private
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`\n📋 Fetching accident reports for user: ${userId}`);

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get accident reports
    const accidentReports = await AccidentReport.find({ user: userId })
      .sort({ submittedAt: -1 }) // Most recent first
      .lean(); // Convert to plain objects for better performance

    console.log(`✅ Found ${accidentReports.length} accident reports`);

    res.json({
      success: true,
      count: accidentReports.length,
      data: accidentReports
    });

  } catch (error) {
    console.error('🔥 Error fetching accident reports:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching accident reports'
    });
  }
});

// @desc    Get single accident report
// @route   GET /api/accident-reports/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const accidentReport = await AccidentReport.findById(req.params.id);
    
    if (!accidentReport) {
      return res.status(404).json({
        success: false,
        error: 'Accident report not found'
      });
    }

    res.json({
      success: true,
      data: accidentReport
    });

  } catch (error) {
    console.error('🔥 Error fetching accident report:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching accident report'
    });
  }
});

// @desc    Update accident report
// @route   PUT /api/accident-reports/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let accidentReport = await AccidentReport.findById(req.params.id);

    if (!accidentReport) {
      return res.status(404).json({
        success: false,
        error: 'Accident report not found'
      });
    }

    // Update report
    accidentReport = await AccidentReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: accidentReport
    });

  } catch (error) {
    console.error('🔥 Error updating accident report:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating accident report'
    });
  }
});

// @desc    Delete accident report
// @route   DELETE /api/accident-reports/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const accidentReport = await AccidentReport.findById(req.params.id);

    if (!accidentReport) {
      return res.status(404).json({
        success: false,
        error: 'Accident report not found'
      });
    }

    // Remove from user's accidentReports array
    const user = await User.findById(accidentReport.user);
    if (user) {
      user.accidentReports = user.accidentReports.filter(
        reportId => reportId.toString() !== accidentReport._id.toString()
      );
      // Increase safety score when deleting report
      user.safetyScore = Math.min(100, (user.safetyScore || 0) + 5);
      await user.save();
    }

    // Delete the report
    await accidentReport.deleteOne();

    res.json({
      success: true,
      message: 'Accident report deleted successfully'
    });

  } catch (error) {
    console.error('🔥 Error deleting accident report:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting accident report'
    });
  }
});

module.exports = router;