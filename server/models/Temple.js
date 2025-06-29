const mongoose = require('mongoose');

const templeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Temple name is required'],
    trim: true,
    maxlength: [200, 'Temple name cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    country: {
      type: String,
      default: 'India',
      trim: true
    },
    pincode: {
      type: String,
      trim: true,
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    }
  },
  contact: {
    phone: {
      type: String,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL']
    }
  },
  deity: {
    primary: {
      type: String,
      required: [true, 'Primary deity is required'],
      trim: true
    },
    secondary: [{
      type: String,
      trim: true
    }]
  },
  established: {
    type: String,
    trim: true
  },
  architecture: {
    style: String,
    period: String,
    features: [String]
  },
  festivals: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    duration: String, // e.g., "3 days", "1 week"
    timing: String, // e.g., "Tamil month Chithirai"
    significance: String
  }],
  timings: {
    morning: {
      open: String,
      close: String
    },
    evening: {
      open: String,
      close: String
    },
    specialDays: String
  },
  facilities: [{
    type: String,
    enum: [
      'parking',
      'restrooms',
      'drinking_water',
      'prasadam_counter',
      'book_stall',
      'audio_system',
      'wheelchair_accessible',
      'accommodation',
      'dining_hall'
    ]
  }],
  images: [{
    url: String,
    caption: String,
    type: {
      type: String,
      enum: ['exterior', 'interior', 'deity', 'festival', 'architecture']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'under_renovation'],
    default: 'active'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  visitCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
templeSchema.index({ 'location.city': 1 });
templeSchema.index({ 'location.state': 1 });
templeSchema.index({ 'deity.primary': 1 });
templeSchema.index({ status: 1 });
templeSchema.index({ isVerified: 1 });
templeSchema.index({ tags: 1 });
templeSchema.index({ name: 'text', description: 'text' });
templeSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for full address
templeSchema.virtual('fullAddress').get(function() {
  const { address, city, state, country, pincode } = this.location;
  return `${address}, ${city}, ${state}, ${country}${pincode ? ` - ${pincode}` : ''}`;
});

// Method to increment visit count
templeSchema.methods.incrementVisitCount = function() {
  this.visitCount += 1;
  return this.save({ validateBeforeSave: false });
};

// Method to add rating
templeSchema.methods.addRating = function(rating) {
  const currentTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (currentTotal + rating) / this.rating.count;
  return this.save();
};

// Static method to find nearby temples
templeSchema.statics.findNearby = function(longitude, latitude, maxDistance = 10000) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    }
  });
};

// Ensure virtuals are included in JSON output
templeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Temple', templeSchema);