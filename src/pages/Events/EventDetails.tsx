import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  UserMinusIcon,
  ShareIcon,
  PrinterIcon,
  MusicalNoteIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Button from '../../components/UI/Button';
import ConfirmDialog from '../../components/UI/ConfirmDialog';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { user, hasRole } = useAuth();
  const { events, deleteEvent, joinEvent } = useData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);

  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Event not found</h1>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/events')}
            className="mt-4"
          >
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  const canManageEvent = hasRole(['admin']) || (hasRole(['organizer']) && event.createdBy === user?.id);
  const isUserJoined = user && event.membersJoined.includes(user.id);
  const canJoin = event.status === 'upcoming' && event.membersJoined.length < event.membersNeeded;

  const handleDeleteEvent = () => {
    deleteEvent(event.id);
    toast.success('Event deleted successfully');
    navigate('/events');
  };

  const handleJoinEvent = () => {
    if (user) {
      joinEvent(event.id, user.id);
      toast.success('Successfully joined the event!');
    }
  };

  const handleLeaveEvent = () => {
    // Implementation for leaving event
    toast.success('Left the event successfully');
    setLeaveConfirm(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: `Join us for ${event.name} at ${event.templeName}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success('Event link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  const statusColors = {
    upcoming: 'bg-green-100 text-green-800',
    ongoing: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/events')}
            icon={<ArrowLeftIcon className="w-5 h-5" />}
            className="mr-4"
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
            <p className="text-gray-600">{event.templeName}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[event.status]}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
          
          <Button
            variant="ghost"
            onClick={handleShare}
            icon={<ShareIcon className="w-4 h-4" />}
          >
            Share
          </Button>

          {canManageEvent && (
            <>
              <Button
                variant="secondary"
                onClick={() => navigate(`/events/${event.id}/edit`)}
                icon={<PencilIcon className="w-4 h-4" />}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => setDeleteConfirm(true)}
                icon={<TrashIcon className="w-4 h-4" />}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Event Info */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Event Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-gray-600">{event.location}</p>
                  {event.locationUrl && (
                    <a
                      href={event.locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 text-sm"
                    >
                      View on Map →
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CalendarIcon className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Date & Time</p>
                  <p className="text-gray-600">
                    {format(new Date(event.date), 'EEEE, MMMM dd, yyyy')}
                  </p>
                  <p className="text-gray-600">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <UsersIcon className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Participants</p>
                  <p className="text-gray-600">
                    {event.membersJoined.length} of {event.membersNeeded} members
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(event.membersJoined.length / event.membersNeeded) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {event.guru && (
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="w-6 h-6 text-orange-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Guru/Saint</p>
                    <p className="text-gray-600">{event.guru}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instruments */}
          {event.instruments.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <MusicalNoteIcon className="w-6 h-6 text-orange-600 mr-2" />
                Instruments Needed
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {event.instruments.map((instrument, index) => (
                  <motion.div
                    key={instrument}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center"
                  >
                    <span className="text-orange-800 font-medium">{instrument}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Food Information */}
          {event.foodRequired && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Food Arrangements</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">
                  <span className="font-medium">Food will be provided</span>
                  {event.foodType && `: ${event.foodType}`}
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          {event.notes && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Additional Notes</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 whitespace-pre-wrap">{event.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Join/Leave Event */}
          {user && event.status === 'upcoming' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Participation</h3>
              
              {!isUserJoined && canJoin && (
                <Button
                  fullWidth
                  onClick={handleJoinEvent}
                  icon={<UserPlusIcon className="w-5 h-5" />}
                >
                  Join Event
                </Button>
              )}

              {!isUserJoined && !canJoin && (
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Event is full</p>
                  <Button fullWidth disabled>
                    Cannot Join
                  </Button>
                </div>
              )}

              {isUserJoined && (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-800 font-medium">You're participating!</p>
                  </div>
                  <Button
                    fullWidth
                    variant="danger"
                    onClick={() => setLeaveConfirm(true)}
                    icon={<UserMinusIcon className="w-5 h-5" />}
                  >
                    Leave Event
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Event Statistics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">
                  {format(new Date(event.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Members Joined</span>
                <span className="font-medium">{event.membersJoined.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spots Available</span>
                <span className="font-medium">
                  {event.membersNeeded - event.membersJoined.length}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                fullWidth
                variant="secondary"
                onClick={() => window.print()}
                icon={<PrinterIcon className="w-4 h-4" />}
              >
                Print Details
              </Button>
              <Link to="/expenses/create" state={{ eventId: event.id }}>
                <Button
                  fullWidth
                  variant="secondary"
                >
                  Add Expense
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDeleteEvent}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        type="danger"
      />

      <ConfirmDialog
        isOpen={leaveConfirm}
        onClose={() => setLeaveConfirm(false)}
        onConfirm={handleLeaveEvent}
        title="Leave Event"
        message="Are you sure you want to leave this event?"
        type="warning"
      />
    </motion.div>
  );
}