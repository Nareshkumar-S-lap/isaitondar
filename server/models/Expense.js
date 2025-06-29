const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event is required']
  },
  type: {
    type: String,
    required: [true, 'Expense type is required'],
    enum: [
      'Food & Catering',
      'Transportation',
      'Instruments Rental',
      'Decorations',
      'Sound System',
      'Venue Charges',
      'Printing & Materials',
      'Miscellaneous'
    ]
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Paid by user is required']
  },
  paidTo: {
    type: String,
    trim: true,
    maxlength: [200, 'Paid to cannot exceed 200 characters']
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank_transfer', 'cheque'],
    default: 'cash'
  },
  date: {
    type: Date,
    required: [true, 'Expense date is required'],
    default: Date.now
  },
  reimbursed: {
    type: Boolean,
    default: false
  },
  reimbursedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reimbursedAt: {
    type: Date
  },
  receipt: {
    url: String,
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'reimbursed'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
expenseSchema.index({ event: 1 });
expenseSchema.index({ paidBy: 1 });
expenseSchema.index({ date: 1 });
expenseSchema.index({ status: 1 });
expenseSchema.index({ reimbursed: 1 });
expenseSchema.index({ type: 1 });

// Virtual for formatted amount
expenseSchema.virtual('formattedAmount').get(function() {
  return `${this.currency} ${this.amount.toLocaleString()}`;
});

// Method to mark as reimbursed
expenseSchema.methods.markAsReimbursed = function(reimbursedBy) {
  this.reimbursed = true;
  this.reimbursedBy = reimbursedBy;
  this.reimbursedAt = new Date();
  this.status = 'reimbursed';
  return this.save();
};

// Method to approve expense
expenseSchema.methods.approve = function(approvedBy) {
  this.status = 'approved';
  this.approvedBy = approvedBy;
  this.approvedAt = new Date();
  return this.save();
};

// Method to reject expense
expenseSchema.methods.reject = function() {
  this.status = 'rejected';
  return this.save();
};

// Static method to get expense summary by event
expenseSchema.statics.getEventSummary = function(eventId) {
  return this.aggregate([
    { $match: { event: mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        reimbursedAmount: {
          $sum: { $cond: ['$reimbursed', '$amount', 0] }
        }
      }
    },
    {
      $project: {
        type: '$_id',
        totalAmount: 1,
        count: 1,
        reimbursedAmount: 1,
        pendingAmount: { $subtract: ['$totalAmount', '$reimbursedAmount'] }
      }
    }
  ]);
};

// Ensure virtuals are included in JSON output
expenseSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Expense', expenseSchema);