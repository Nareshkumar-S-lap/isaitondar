const express = require('express');
const Expense = require('../models/Expense');
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');
const { validateExpense, validateObjectId, validatePagination, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
router.get('/', protect, validatePagination, handleValidationErrors, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query based on user role
    let query = {};
    
    // Non-admin users can only see their own expenses or expenses from events they're part of
    if (req.user.role !== 'admin') {
      const userEvents = await Event.find({
        $or: [
          { createdBy: req.user.id },
          { 'membersJoined.user': req.user.id }
        ]
      }).select('_id');
      
      const eventIds = userEvents.map(event => event._id);
      
      query.$or = [
        { paidBy: req.user.id },
        { event: { $in: eventIds } }
      ];
    }
    
    // Filter by event
    if (req.query.event) {
      query.event = req.query.event;
    }
    
    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Filter by reimbursement status
    if (req.query.reimbursed !== undefined) {
      query.reimbursed = req.query.reimbursed === 'true';
    }
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      query.date = {};
      if (req.query.startDate) {
        query.date.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.date.$lte = new Date(req.query.endDate);
      }
    }

    // Sort
    let sort = {};
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      sort = sortBy;
    } else {
      sort = '-date';
    }

    const expenses = await Expense.find(query)
      .populate('event', 'name date temple')
      .populate('paidBy', 'name role')
      .populate('reimbursedBy', 'name')
      .populate('approvedBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Expense.countDocuments(query);

    // Calculate totals
    const totals = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          reimbursedAmount: {
            $sum: { $cond: ['$reimbursed', '$amount', 0] }
          },
          pendingAmount: {
            $sum: { $cond: ['$reimbursed', 0, '$amount'] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      count: expenses.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      totals: totals[0] || { totalAmount: 0, reimbursedAmount: 0, pendingAmount: 0 },
      data: expenses
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
router.get('/:id', protect, validateObjectId('id'), handleValidationErrors, async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('event', 'name date temple location')
      .populate('paidBy', 'name role email')
      .populate('reimbursedBy', 'name')
      .populate('approvedBy', 'name');

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Check if user has access to this expense
    if (req.user.role !== 'admin' && expense.paidBy._id.toString() !== req.user.id) {
      // Check if user is part of the event
      const event = await Event.findById(expense.event._id);
      if (!event || (!event.createdBy.equals(req.user.id) && !event.hasUserJoined(req.user.id))) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this expense'
        });
      }
    }

    res.json({
      success: true,
      data: expense
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
router.post('/', protect, validateExpense, handleValidationErrors, async (req, res, next) => {
  try {
    // Check if event exists and user has access
    const event = await Event.findById(req.body.event);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is part of the event or is admin
    if (req.user.role !== 'admin' && 
        !event.createdBy.equals(req.user.id) && 
        !event.hasUserJoined(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add expenses to this event'
      });
    }

    req.body.paidBy = req.user.id;
    
    const expense = await Expense.create(req.body);
    
    const populatedExpense = await Expense.findById(expense._id)
      .populate('event', 'name date')
      .populate('paidBy', 'name role');

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: populatedExpense
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
router.put('/:id', protect, validateObjectId('id'), handleValidationErrors, async (req, res, next) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Check if user is admin or expense creator
    if (req.user.role !== 'admin' && expense.paidBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this expense'
      });
    }

    // Don't allow updating if already reimbursed
    if (expense.reimbursed && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update reimbursed expense'
      });
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('event', 'name date')
      .populate('paidBy', 'name role');

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
router.delete('/:id', protect, validateObjectId('id'), handleValidationErrors, async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Check if user is admin or expense creator
    if (req.user.role !== 'admin' && expense.paidBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this expense'
      });
    }

    // Don't allow deleting if already reimbursed
    if (expense.reimbursed && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete reimbursed expense'
      });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Mark expense as reimbursed
// @route   PUT /api/expenses/:id/reimburse
// @access  Private (Admin only)
router.put('/:id/reimburse', protect, authorize('admin'), validateObjectId('id'), handleValidationErrors, async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    if (expense.reimbursed) {
      return res.status(400).json({
        success: false,
        message: 'Expense is already reimbursed'
      });
    }

    await expense.markAsReimbursed(req.user.id);

    const updatedExpense = await Expense.findById(req.params.id)
      .populate('event', 'name date')
      .populate('paidBy', 'name role')
      .populate('reimbursedBy', 'name');

    res.json({
      success: true,
      message: 'Expense marked as reimbursed',
      data: updatedExpense
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Approve expense
// @route   PUT /api/expenses/:id/approve
// @access  Private (Admin, Organizer)
router.put('/:id/approve', protect, authorize('admin', 'organizer'), validateObjectId('id'), handleValidationErrors, async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    if (expense.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Expense is already approved'
      });
    }

    await expense.approve(req.user.id);

    const updatedExpense = await Expense.findById(req.params.id)
      .populate('event', 'name date')
      .populate('paidBy', 'name role')
      .populate('approvedBy', 'name');

    res.json({
      success: true,
      message: 'Expense approved successfully',
      data: updatedExpense
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get expense summary by event
// @route   GET /api/expenses/summary/:eventId
// @access  Private
router.get('/summary/:eventId', protect, validateObjectId('eventId'), handleValidationErrors, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has access to this event
    if (req.user.role !== 'admin' && 
        !event.createdBy.equals(req.user.id) && 
        !event.hasUserJoined(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this event\'s expenses'
      });
    }

    const summary = await Expense.getEventSummary(req.params.eventId);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;