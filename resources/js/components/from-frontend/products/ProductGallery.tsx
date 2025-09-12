import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export const ProductGallery = ({ images, alt }: ProductGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!images || images.length === 0) {
    return (
      <div className="w-full bg-gray-100 rounded-lg overflow-hidden aspect-square">
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <span>No image available</span>
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full">
      {/* Main Image */}
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          src={images[currentIndex] || '/placeholder-product.jpg'}
          alt={`${alt} ${currentIndex + 1}`}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-gray-800 shadow-md hover:bg-white"
          >
            <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">Previous image</span>
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-gray-800 shadow-md hover:bg-white"
          >
            <ChevronRightIcon className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">Next image</span>
          </button>
        </>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`overflow-hidden rounded-lg border-2 ${
                currentIndex === index
                  ? 'border-blue-500 ring-2 ring-blue-500'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={image || '/placeholder-product.jpg'}
                alt={`${alt} thumbnail ${index + 1}`}
                className="h-20 w-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
