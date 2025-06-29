const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Instrument name is required'],
    trim: true,
    maxlength: [100, 'Instrument name cannot exceed 100 characters']
  },
  nameTamil: {
    type: String,
    trim: true,
    maxlength: [100, 'Tamil name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Percussion', 'String', 'Wind', 'Other']
  },
  subcategory: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  origin: {
    region: String,
    country: {
      type: String,
      default: 'India'
    },
    historicalPeriod: String
  },
  materials: [{
    type: String,
    trim: true
  }],
  construction: {
    method: String,
    craftsmen: String,
    timeRequired: String
  },
  specifications: {
    dimensions: {
      length: String,
      width: String,
      height: String,
      diameter: String
    },
    weight: String,
    tuning: String,
    range: String
  },
  playingTechnique: {
    method: String,
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    learningDuration: String
  },
  musicalContext: {
    genres: [{
      type: String,
      enum: ['Carnatic', 'Hindustani', 'Folk', 'Devotional', 'Classical', 'Contemporary']
    }],
    ensembleRole: String,
    commonPairings: [String]
  },
  culturalSignificance: {
    religiousImportance: String,
    festivals: [String],
    traditions: [String],
    mythology: String
  },
  images: [{
    url: String,
    caption: String,
    type: {
      type: String,
      enum: ['main', 'detail', 'construction', 'playing', 'historical']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  audioSamples: [{
    url: String,
    title: String,
    description: String,
    duration: Number, // in seconds
    artist: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  videos: [{
    url: String,
    title: String,
    description: String,
    type: {
      type: String,
      enum: ['tutorial', 'performance', 'construction', 'history']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  availability: {
    forRent: {
      type: Boolean,
      default: false
    },
    forSale: {
      type: Boolean,
      default: false
    },
    rentalPrice: {
      daily: Number,
      weekly: Number,
      monthly: Number
    },
    salePrice: {
      min: Number,
      max: Number
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
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
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
instrumentSchema.index({ category: 1 });
instrumentSchema.index({ 'musicalContext.genres': 1 });
instrumentSchema.index({ status: 1 });
instrumentSchema.index({ isVerified: 1 });
instrumentSchema.index({ tags: 1 });
instrumentSchema.index({ name: 'text', description: 'text' });
instrumentSchema.index({ 'playingTechnique.difficulty': 1 });

// Method to increment view count
instrumentSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save({ validateBeforeSave: false });
};

// Method to add rating
instrumentSchema.methods.addRating = function(rating) {
  const currentTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (currentTotal + rating) / this.rating.count;
  return this.save();
};

// Static method to get instruments by category
instrumentSchema.statics.getByCategory = function(category) {
  return this.find({ category, status: 'active' })
    .sort({ name: 1 })
    .populate('createdBy', 'name');
};

// Static method to get popular instruments
instrumentSchema.statics.getPopular = function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ viewCount: -1, 'rating.average': -1 })
    .limit(limit)
    .populate('createdBy', 'name');
};

module.exports = mongoose.model('Instrument', instrumentSchema);