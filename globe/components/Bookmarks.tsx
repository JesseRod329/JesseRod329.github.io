import React from 'react';
import { Bookmark as BookmarkType } from '../types';
import { Star, Download, Trash2 } from 'lucide-react';

interface BookmarksProps {
  bookmarks: BookmarkType[];
  onSelect: (countryName: string) => void;
  onRemove: (countryName: string) => void;
  onExport: () => void;
}

export const Bookmarks: React.FC<BookmarksProps> = ({ bookmarks, onSelect, onRemove, onExport }) => {
  if (bookmarks.length === 0) {
    return (
      <div className="bg-cyber-black/90 border border-cyber-cyan/50 backdrop-blur-md p-4 text-center">
        <Star className="mx-auto text-cyber-cyan/30 mb-2" size={24} />
        <p className="text-cyber-cyan/50 text-sm font-mono">NO BOOKMARKS YET</p>
        <p className="text-gray-500 text-xs mt-1">Click star icon to bookmark locations</p>
      </div>
    );
  }

  return (
    <div className="bg-cyber-black/90 border border-cyber-cyan/50 backdrop-blur-md p-4 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-cyber-cyan font-mono text-sm font-bold flex items-center gap-2">
          <Star size={16} />
          BOOKMARKS ({bookmarks.length})
        </h3>
        <button
          onClick={onExport}
          className="text-cyber-pink hover:text-white transition-colors"
          title="Export bookmarks"
        >
          <Download size={16} />
        </button>
      </div>

      <div className="space-y-2">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.countryName}
            className="bg-cyber-black/50 border border-cyber-cyan/30 p-2 hover:border-cyber-cyan transition-colors group"
          >
            <div className="flex justify-between items-start">
              <button
                onClick={() => onSelect(bookmark.countryName)}
                className="flex-1 text-left"
              >
                <p className="text-white font-mono text-sm">{bookmark.countryName}</p>
                <p className="text-gray-500 text-xs">
                  {new Date(bookmark.timestamp).toLocaleDateString()}
                </p>
                {bookmark.analysis && (
                  <p className="text-cyber-cyan text-xs mt-1">
                    Threat: {bookmark.analysis.threatLevel} | Tech: {bookmark.analysis.techIndex}%
                  </p>
                )}
              </button>
              <button
                onClick={() => onRemove(bookmark.countryName)}
                className="text-cyber-pink/50 hover:text-cyber-pink opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

