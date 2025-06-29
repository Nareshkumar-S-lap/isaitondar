const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    maxlength: [200, 'Event name cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  locationUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  temple: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Temple',
    required: [true, 'Temple is required']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  time: {
    type: String,
    required: [true, 'Event time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
  },
  duration: {
    type: Number, // Duration in minutes
    default: 120
  },
  membersNeeded: {
    type: Number,
    required: [true, 'Number of members needed is required'],
    min: [1, 'At least 1 member is required'],
    max: [1000, 'Cannot exceed 1000 members']
  },
  membersJoined: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['participant', 'performer', 'organizer'],
      default: 'participant'
    }
  }],
  instruments: [{
    type: String,
    trim: true
  }],
  foodRequired: {
    type: Boolean,
    default: false
  },
  foodType: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  guru: {
    type: String,
    trim: true,
    enum: ['Thirugnana Sambandar', 'Appar', 'Sundarar', 'Manikkavacakar', '']
  },
  thevaramPathigam: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ThevaramPathigam'
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  maxCapacity: {
    type: Number,
    default: function() {
      return this.membersNeeded;
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ temple: 1 });
eventSchema.index({ createdBy: 1 });
eventSchema.index({ 'membersJoined.user': 1 });
eventSchema.index({ tags: 1 });

// Virtual for members count
eventSchema.virtual('membersCount').get(function() {
  return this.membersJoined.length;
});

// Virtual for spots available
eventSchema.virtual('spotsAvailable').get(function() {
  return this.membersNeeded - this.membersJoined.length;
});

// Virtual for is full
eventSchema.virtual('isFull').get(function() {
  return this.membersJoined.length >= this.membersNeeded;
});

// Method to check if user has joined
eventSchema.methods.hasUserJoined = function(userId) {
  return this.membersJoined.some(member => member.user.toString() === userId.toString());
};

// Method to add member
eventSchema.methods.addMember = function(userId, role = 'participant') {
  if (this.hasUserJoined(userId)) {
    throw new Error('User has already joined this event');
  }
  
  if (this.isFull) {
    throw new Error('Event is full');
  }
  
  this.membersJoined.push({
    user: userId,
    role: role
  });
  
  return this.save();
};

// Method to remove member
eventSchema.methods.removeMember = function(userId) {
  this.membersJoined = this.membersJoined.filter(
    member => member.user.toString() !== userId.toString()
  );
  
  return this.save();
};

// Ensure virtuals are included in JSON output
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);