import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  HeartIcon,
  ShareIcon,
  PrinterIcon,
  BookOpenIcon,
  MusicalNoteIcon,
  UserIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Button from '../../components/UI/Button';
import ConfirmDialog from '../../components/UI/ConfirmDialog';

export default function ThevaramDetails() {
  const { id } = useParams<{ id: string }>();
  const { user, hasRole } = useAuth();
  const { pathigams, deletePathigam } = useData();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const pathigam = pathigams.find(p => p.id === id);

  if (!pathigam) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Pathigam not found</h1>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/thevaram')}
            className="mt-4"
          >
            Back to Thevaram
          </Button>
        </div>
      </div>
    );
  }

  const canManagePathigam = hasRole(['admin', 'organizer']);

  const handleDeletePathigam = () => {
    deletePathigam(pathigam.id);
    toast.success('Pathigam deleted successfully');
    navigate('/thevaram');
  };

  const handlePlayAudio = () => {
    if (!pathigam.audioUrl) {
      toast.error('No audio available for this pathigam');
      return;
    }
    
    setIsPlaying(!isPlaying);
    // Audio playback logic would go here
    toast.success(isPlaying ? 'Audio paused' : 'Audio playing');
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pathigam.title,
          text: `Check out this sacred hymn: ${pathigam.title}`,
          url: window.location.href,
        });
      } catch (error) {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const categoryColors = {
    'thevaram': 'bg-blue-100 text-blue-800',
    'guru-pathigam': 'bg-purple-100 text-purple-800'
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
            onClick={() => navigate('/thevaram')}
            icon={<ArrowLeftIcon className="w-5 h-5" />}
            className="mr-4"
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{pathigam.title}</h1>
            <h2 className="text-2xl font-medium text-orange-600 mt-1" style={{ fontFamily: 'serif' }}>
              {pathigam.titleTamil}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[pathigam.category]}`}>
            {pathigam.category === 'thevaram' ? 'Thevaram' : 'Guru Pathigam'}
          </span>
          
          <Button
            variant="ghost"
            onClick={handleToggleFavorite}
            icon={<HeartIcon className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />}
          >
            {isFavorite ? 'Favorited' : 'Favorite'}
          </Button>

          <Button
            variant="ghost"
            onClick={handleShare}
            icon={<ShareIcon className="w-4 h-4" />}
          >
            Share
          </Button>

          {canManagePathigam && (
            <>
              <Button
                variant="secondary"
                onClick={() => navigate(`/thevaram/${pathigam.id}/edit`)}
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
          {/* Pathigam Info */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pathigam Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pathigam.guru && (
                <div className="flex items-start space-x-3">
                  <UserIcon className="w-6 h-6 text-orange-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Guru/Saint</p>
                    <p className="text-gray-600">{pathigam.guru}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <BookOpenIcon className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Category</p>
                  <p className="text-gray-600 capitalize">
                    {pathigam.category.replace('-', ' ')}
                  </p>
                </div>
              </div>

              {pathigam.audioUrl && (
                <div className="flex items-start space-x-3">
                  <MusicalNoteIcon className="w-6 h-6 text-orange-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Audio Available</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handlePlayAudio}
                      icon={isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                      className="mt-2"
                    >
                      {isPlaying ? 'Pause' : 'Play'} Audio
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tamil Content */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tamil Text</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap" style={{ fontFamily: 'serif' }}>
                {pathigam.contentTamil}
              </p>
            </div>
          </div>

          {/* Transliteration */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Transliteration</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed italic whitespace-pre-wrap">
                {pathigam.transliteration}
              </p>
            </div>
          </div>

          {/* English Translation */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">English Translation</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {pathigam.content}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Audio Player */}
          {pathigam.audioUrl && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MusicalNoteIcon className="w-5 h-5 text-orange-600 mr-2" />
                Audio Player
              </h3>
              
              <div className="space-y-4">
                <Button
                  fullWidth
                  onClick={handlePlayAudio}
                  icon={isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                >
                  {isPlaying ? 'Pause Audio' : 'Play Audio'}
                </Button>
                
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>0:00</span>
                    <span>3:45</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {pathigam.tags.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TagIcon className="w-5 h-5 text-orange-600 mr-2" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {pathigam.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

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
                Print Pathigam
              </Button>
              
              <Button
                fullWidth
                variant="secondary"
                onClick={handleToggleFavorite}
                icon={<HeartIcon className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />}
              >
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>

              <Link to="/thevaram" className="block">
                <Button
                  fullWidth
                  variant="secondary"
                  icon={<BookOpenIcon className="w-4 h-4" />}
                >
                  Browse More Pathigams
                </Button>
              </Link>
            </div>
          </div>

          {/* Related Pathigams */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Pathigams</h3>
            <div className="space-y-3">
              {pathigams
                .filter(p => p.id !== pathigam.id && (p.guru === pathigam.guru || p.category === pathigam.category))
                .slice(0, 3)
                .map(relatedPathigam => (
                  <Link
                    key={relatedPathigam.id}
                    to={`/thevaram/${relatedPathigam.id}`}
                    className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <p className="font-medium text-gray-900 text-sm">{relatedPathigam.title}</p>
                    <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'serif' }}>
                      {relatedPathigam.titleTamil}
                    </p>
                    {relatedPathigam.guru && (
                      <p className="text-xs text-orange-600 mt-1">By {relatedPathigam.guru}</p>
                    )}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDeletePathigam}
        title="Delete Pathigam"
        message="Are you sure you want to delete this pathigam? This action cannot be undone."
        type="danger"
      />
    </motion.div>
  );
}