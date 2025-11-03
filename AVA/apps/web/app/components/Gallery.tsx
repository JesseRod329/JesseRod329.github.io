'use client';

import { useState } from 'react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

interface GalleryProps {
  images: GalleryImage[];
}

const categories = ['All', 'Gel', 'Acrylic', 'Nail Art', 'Glamour'];

export default function Gallery({ images }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filteredImages = selectedCategory === 'All' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  return (
    <div className="w-full">
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 shadow-lg shadow-pink-500/50'
                : 'glass hover:bg-white/10'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Masonry Gallery Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            className="mb-6 break-inside-avoid cursor-pointer group fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setLightboxImage(image.src)}
          >
            <div className="relative overflow-hidden rounded-2xl aspect-[3/4]">
              {/* Real image */}
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                <span className="text-white font-medium">{image.alt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={() => setLightboxImage(null)}
        >
            <div className="relative max-w-5xl max-h-full">
            <button
              className="absolute top-4 right-4 text-white text-4xl hover:text-pink-400 transition-colors"
              onClick={() => setLightboxImage(null)}
            >
              ×
            </button>
            <div className="rounded-2xl overflow-hidden">
              <img
                src={lightboxImage || ''}
                alt="Full size"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

