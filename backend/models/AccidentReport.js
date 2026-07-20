// backend/models/AccidentReport.js - SIMPLIFIED VERSION
const mongoose = require('mongoose');

const accidentReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: String,
    required: true
  },
  // REMOVE reportNumber or make it optional
  reportNumber: {
    type: String,
    unique: true
    // No required: true
  },
  accidentType: {
    type: String,
    required: true,
    enum: ['collision', 'pedestrian', 'object', 'rollover', 'fire', 'mechanical', 'tire', 'other']
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'resolved', 'closed'],
    default: 'submitted'
  },
  location: {
    rawString: String,
    latitude: Number,
    longitude: Number,
    accuracy: Number
  },
  date: {
    type: Date,
    default: Date.now
  },
  time: String,
  description: {
    type: String,
    required: true
  },
  injuries: {
    type: Boolean,
    default: false
  },
  vehicleDamage: {
    type: Boolean,
    default: false
  },
  otherDamage: {
    type: Boolean,
    default: false
  },
  witnesses: String,
  weatherConditions: String,
  roadConditions: String,
  photos: [String],
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true  // This adds createdAt and updatedAt automatically
});

// Simple pre-save hook to auto-generate reportNumber if not provided
accidentReportSchema.pre('save', async function(next) {
  if (!this.reportNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000);
    
    this.reportNumber = `ACC-${year}${month}${day}-${String(random).padStart(4, '0')}`;
  }
  
  // Auto-set severity based on conditions
  if (this.injuries || this.accidentType === 'fire' || this.accidentType === 'rollover') {
    this.severity = 'high';
  } else if (this.vehicleDamage) {
    this.severity = 'medium';
  } else {
    this.severity = 'low';
  }
  
  next();
});

module.exports = mongoose.model('AccidentReport', accidentReportSchema);