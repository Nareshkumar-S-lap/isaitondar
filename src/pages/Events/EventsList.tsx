import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';
import ConfirmDialog from '../../components/UI/ConfirmDialog';

export default function EventsList() {
  const { user, hasRole } = useAuth();
  const { events, deleteEvent, joinEvent } = useData();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; eventId?: string }>({ isOpen: false });
  const [leaveConfirm, setLeaveConfirm] = useState<{ isOpen: boolean; eventId?: string }>({ isOpen: false });

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.templeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    setDeleteConfirm({ isOpen: false });
  };

  const handleJoinEvent = (eventId: string) => {
    if (user) {
      joinEvent(eventId, user.id);
    }
  };

  const handleLeaveEvent = (eventId: string) => {
    // Implementation for leaving event
    setLeaveConfirm({ isOpen: false });
  };

  const canManageEvent = (event: any) => {
    return hasRole(['admin']) || (hasRole(['organizer']) && event.createdBy === user?.id);
  };

  const isUserJoined = (event: any) => {
    return user && event.membersJoined.includes(user.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('events')}</h1>
          <p className="text-gray-600">Manage temple events and musical performances</p>
        </div>
        {hasRole(['admin', 'organizer']) && (
          <Link
            to="/events/create"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('createEvent')}
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events or temples..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Status Badge */}
            <div className="relative">
              <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
                event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{event.templeName}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{event.time}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm">{event.membersJoined.length}/{event.membersNeeded} members</span>
                </div>
              </div>

              {/* Instruments */}
              {event.instruments.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Instruments needed:</p>
                  <div className="flex flex-wrap gap-1">
                    {event.instruments.map((instrument, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        {instrument}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                <Link
                  to={`/events/${event.id}`}
                  className="flex-1 text-center py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  View Details
                </Link>
                
                {event.status === 'upcoming' && user && !isUserJoined(event) && (
                  <button
                    onClick={() => handleJoinEvent(event.id)}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Join
                  </button>
                )}
                
                {event.status === 'upcoming' && user && isUserJoined(event) && (
                  <button
                    onClick={() => setLeaveConfirm({ isOpen: true, eventId: event.id })}
                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <UserMinus className="w-4 h-4 mr-1" />
                    Leave
                  </button>
                )}
                
                {canManageEvent(event) && (
                  <>
                    <Link
                      to={`/events/${event.id}/edit`}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Link>
                    
                    <button
                      onClick={() => setDeleteConfirm({ isOpen: true, eventId: event.id })}
                      className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={() => deleteConfirm.eventId && handleDeleteEvent(deleteConfirm.eventId)}
        title="Delete Event"
        message={t('deleteEventConfirm')}
        type="danger"
      />

      <ConfirmDialog
        isOpen={leaveConfirm.isOpen}
        onClose={() => setLeaveConfirm({ isOpen: false })}
        onConfirm={() => leaveConfirm.eventId && handleLeaveEvent(leaveConfirm.eventId)}
        title="Leave Event"
        message={t('leaveEventConfirm')}
        type="warning"
      />
    </div>
  );
}