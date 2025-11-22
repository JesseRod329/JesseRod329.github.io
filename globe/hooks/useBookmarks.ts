import { useState, useEffect } from 'react';
import { Bookmark } from '../types';

const STORAGE_KEY = 'globe_bookmarks';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load bookmarks', e);
      }
    }
  }, []);

  const saveBookmarks = (newBookmarks: Bookmark[]) => {
    setBookmarks(newBookmarks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
  };

  const addBookmark = (bookmark: Bookmark) => {
    const exists = bookmarks.find(b => b.countryName === bookmark.countryName);
    if (!exists) {
      saveBookmarks([...bookmarks, bookmark]);
    }
  };

  const removeBookmark = (countryName: string) => {
    saveBookmarks(bookmarks.filter(b => b.countryName !== countryName));
  };

  const isBookmarked = (countryName: string) => {
    return bookmarks.some(b => b.countryName === countryName);
  };

  const toggleBookmark = (bookmark: Bookmark) => {
    if (isBookmarked(bookmark.countryName)) {
      removeBookmark(bookmark.countryName);
    } else {
      addBookmark(bookmark);
    }
  };

  const exportBookmarks = () => {
    const dataStr = JSON.stringify(bookmarks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'globe-bookmarks.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
    exportBookmarks,
  };
};

