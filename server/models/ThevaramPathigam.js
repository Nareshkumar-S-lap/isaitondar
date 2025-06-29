const mongoose = require('mongoose');

const thevaramPathigamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  titleTamil: {
    type: String,
    required: [true, 'Tamil title is required'],
    trim: true,
    maxlength: [200, 'Tamil title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'English content is required'],
    trim: true
  },
  contentTamil: {
    type: String,
    required: [true, 'Tamil content is required'],
    trim: true
  },
  transliteration: {
    type: String,
    required: [true, 'Transliteration is required'],
    trim: true
  },
  audioUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  guru: {
    type: String,
    trim: true,
    enum: ['Thirugnana Sambandar', 'Appar', 'Sundarar', 'Manikkavacakar', '']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['thevaram', 'guru-pathigam'],
    default: 'thevaram'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  pathigamNumber: {
    type: Number,
    min: 1
  },
  verseCount: {
    type: Number,
    min: 1
  },
  raga: {
    type: String,
    trim: true
  },
  tala: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'published', 'archived'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    source: String,
    originalLanguage: String,
    translator: String,
    notes: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
thevaramPathigamSchema.index({ guru: 1 });
thevaramPathigamSchema.index({ category: 1 });
thevaramPathigamSchema.index({ tags: 1 });
thevaramPathigamSchema.index({ status: 1 });
thevaramPathigamSchema.index({ createdBy: 1 });
thevaramPathigamSchema.index({ title: 'text', titleTamil: 'text', content: 'text' });

// Virtual for likes count
thevaramPathigamSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Virtual for comments count
thevaramPathigamSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// Method to check if user has liked
thevaramPathigamSchema.methods.hasUserLiked = function(userId) {
  return this.likes.some(like => like.user.toString() === userId.toString());
};

// Method to toggle like
thevaramPathigamSchema.methods.toggleLike = function(userId) {
  const existingLikeIndex = this.likes.findIndex(
    like => like.user.toString() === userId.toString()
  );
  
  if (existingLikeIndex > -1) {
    this.likes.splice(existingLikeIndex, 1);
  } else {
    this.likes.push({ user: userId });
  }
  
  return this.save();
};

// Method to add comment
thevaramPathigamSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    user: userId,
    content: content
  });
  
  return this.save();
};

// Method to increment views
thevaramPathigamSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save({ validateBeforeSave: false });
};

// Static method to get popular pathigams
thevaramPathigamSchema.statics.getPopular = function(limit = 10) {
  return this.find({ status: 'published' })
    .sort({ views: -1, likesCount: -1 })
    .limit(limit)
    .populate('createdBy', 'name')
    .populate('verifiedBy', 'name');
};

// Ensure virtuals are included in JSON output
thevaramPathigamSchema.set('toJSON', { virtuals: true });
thevaramPathigamSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ThevaramPathigam', thevaramPathigamSchema);