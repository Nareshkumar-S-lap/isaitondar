import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Play, Pause, BookOpen, Volume2, Heart } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function ThevaramList() {
  const { pathigams } = useData();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPathigam, setSelectedPathigam] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredPathigams = pathigams.filter(pathigam => {
    const matchesSearch = pathigam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pathigam.titleTamil.includes(searchTerm) ||
                         pathigam.guru?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || pathigam.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (pathigamId: string) => {
    setFavorites(prev => 
      prev.includes(pathigamId) 
        ? prev.filter(id => id !== pathigamId)
        : [...prev, pathigamId]
    );
  };

  const handlePlayAudio = (pathigamId: string, audioUrl?: string) => {
    if (!audioUrl) return;
    
    if (playingAudio === pathigamId) {
      setPlayingAudio(null);
      // Stop audio playback
    } else {
      setPlayingAudio(pathigamId);
      // Start audio playback
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('thevaram')}</h1>
        <p className="text-gray-600">Sacred hymns and Guru Pathigams for divine music</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search pathigams, gurus, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Categories</option>
            <option value="thevaram">Thevaram</option>
            <option value="guru-pathigam">Guru Pathigam</option>
          </select>
        </div>
      </div>

      {/* Pathigams List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPathigams.map((pathigam) => (
          <div key={pathigam.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{pathigam.title}</h3>
                  <h4 className="text-lg font-medium text-orange-600 mb-2" style={{ fontFamily: 'serif' }}>
                    {pathigam.titleTamil}
                  </h4>
                  {pathigam.guru && (
                    <p className="text-sm text-gray-600">By {pathigam.guru}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleFavorite(pathigam.id)}
                    className={`p-2 rounded-full transition-colors ${
                      favorites.includes(pathigam.id) 
                        ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Heart className="w-5 h-5" fill={favorites.includes(pathigam.id) ? 'currentColor' : 'none'} />
                  </button>
                  
                  {pathigam.audioUrl && (
                    <button
                      onClick={() => handlePlayAudio(pathigam.id, pathigam.audioUrl)}
                      className="p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
                    >
                      {playingAudio === pathigam.id ? 
                        <Pause className="w-5 h-5" /> : 
                        <Play className="w-5 h-5" />
                      }
                    </button>
                  )}
                </div>
              </div>

              {/* Content Preview */}
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tamil:</p>
                  <p className="text-gray-800 leading-relaxed" style={{ fontFamily: 'serif' }}>
                    {pathigam.contentTamil.length > 100 
                      ? pathigam.contentTamil.substring(0, 100) + '...'
                      : pathigam.contentTamil
                    }
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Transliteration:</p>
                  <p className="text-gray-700 italic">
                    {pathigam.transliteration.length > 100 
                      ? pathigam.transliteration.substring(0, 100) + '...'
                      : pathigam.transliteration
                    }
                  </p>
                </div>
              </div>

              {/* Tags */}
              {pathigam.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {pathigam.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pathigam.category === 'thevaram' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {pathigam.category === 'thevaram' ? 'Thevaram' : 'Guru Pathigam'}
                </span>
                
                <button
                  onClick={() => setSelectedPathigam(pathigam.id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read Full</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPathigams.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pathigams found</h3>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      )}

      {/* Full Content Modal */}
      {selectedPathigam && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedPathigam(null)}></div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
              {(() => {
                const pathigam = pathigams.find(p => p.id === selectedPathigam);
                if (!pathigam) return null;

                return (
                  <>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{pathigam.title}</h2>
                        <h3 className="text-xl font-medium text-orange-600 mb-2" style={{ fontFamily: 'serif' }}>
                          {pathigam.titleTamil}
                        </h3>
                        {pathigam.guru && (
                          <p className="text-gray-600">By {pathigam.guru}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {pathigam.audioUrl && (
                          <button
                            onClick={() => handlePlayAudio(pathigam.id, pathigam.audioUrl)}
                            className="p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
                          >
                            {playingAudio === pathigam.id ? 
                              <Pause className="w-5 h-5" /> : 
                              <Play className="w-5 h-5" />
                            }
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedPathigam(null)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Tamil Text</h4>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <p className="text-gray-800 leading-relaxed text-lg" style={{ fontFamily: 'serif' }}>
                            {pathigam.contentTamil}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Transliteration</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700 leading-relaxed italic">
                            {pathigam.transliteration}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">English Translation</h4>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-gray-800 leading-relaxed">
                            {pathigam.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}