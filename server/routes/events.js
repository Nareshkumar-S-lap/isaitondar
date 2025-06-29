const express = require('express');
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');
const { validateEvent, validateObjectId, validatePagination, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', validatePagination, handleValidationErrors, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by temple
    if (req.query.temple) {
      query.temple = req.query.temple;
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
    
    // Search by name or location
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Sort
    let sort = {};
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      sort = sortBy;
    } else {
      sort = '-date';
    }

    const events = await Event.find(query)
      .populate('temple', 'name location.city')
      .populate('createdBy', 'name role')
      .populate('membersJoined.user', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      count: events.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: events
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', validateObjectId('id'), handleValidationErrors, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('temple', 'name location contact')
      .populate('createdBy', 'name role')
      .populate('membersJoined.user', 'name role')
      .populate('thevaramPathigam', 'title titleTamil');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin, Organizer)
router.post('/', protect, authorize('admin', 'organizer'), validateEvent, handleValidationErrors, async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    
    const event = await Event.create(req.body);
    
    // Automatically join the creator
    await event.addMember(req.user.id, 'organizer');
    
    const populatedEvent = await Event.findById(event._id)
      .populate('temple', 'name location.city')
      .populate('createdBy', 'name role');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: populatedEvent
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin, Event Creator)
router.put('/:id', protect, validateObjectId('id'), handleValidationErrors, async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is admin or event creator
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('temple', 'name location.city')
      .populate('createdBy', 'name role');

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin, Event Creator)
router.delete('/:id', protect, validateObjectId('id'), handleValidationErrors, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is admin or event creator
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Join event
// @route   POST /api/events/:id/join
// @access  Private
router.post('/:id/join', protect, validateObjectId('id'), handleValidationErrors, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        message: 'Cannot join this event'
      });
    }

    await event.addMember(req.user.id, req.body.role || 'participant');

    const updatedEvent = await Event.findById(req.params.id)
      .populate('membersJoined.user', 'name role');

    res.json({
      success: true,
      message: 'Successfully joined the event',
      data: updatedEvent
    });
  } catch (error) {
    if (error.message === 'User has already joined this event') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    if (error.message === 'Event is full') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
});

// @desc    Leave event
// @route   POST /api/events/:id/leave
// @access  Private
router.post('/:id/leave', protect, validateObjectId('id'), handleValidationErrors, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (!event.hasUserJoined(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You have not joined this event'
      });
    }

    await event.removeMember(req.user.id);

    res.json({
      success: true,
      message: 'Successfully left the event'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user's events
// @route   GET /api/events/my/events
// @access  Private
router.get('/my/events', protect, async (req, res, next) => {
  try {
    const events = await Event.find({
      $or: [
        { createdBy: req.user.id },
        { 'membersJoined.user': req.user.id }
      ]
    })
    .populate('temple', 'name location.city')
    .populate('createdBy', 'name role')
    .sort('-date');

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;