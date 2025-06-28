"use client";
import { useState, useCallback } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PhotoGallery({
  images,
  mainImage,
  houseTitle,
  thumbnailImages,
}: {
  images: { imageId: number; imageUrl: string }[];
  mainImage: string;
  houseTitle: string;
  thumbnailImages: { imageId: number; imageUrl: string }[];
}) {
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openGallery = useCallback((index = 0) => {
    setSelectedImageIndex(index);
    setShowGallery(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when gallery is open
  }, []);

  const closeGallery = useCallback(() => {
    setShowGallery(false);
    document.body.style.overflow = ''; // Re-enable scrolling
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeGallery();
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
        {/* Main Featured Image - Slightly smaller */}
        <div
          className="md:col-span-3 rounded-lg overflow-hidden h-56 md:h-90 relative cursor-pointer group"
          onClick={() => openGallery(0)}
          tabIndex={0}
          aria-label="View all photos"
        >
          <img
            src={mainImage}
            alt={`Featured - ${houseTitle}`}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/80 p-2 rounded-full">
              <ImageIcon className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>
        {/* Thumbnails - Vertical on right side (desktop) */}
        {thumbnailImages.length > 0 && (
          <div className="md:col-span-2 flex flex-col gap-3 h-56 md:h-80">
            {thumbnailImages.map((img, index) => (
              <div
                key={img.imageId}
                className="flex-1 rounded-md overflow-hidden cursor-pointer group"
                onClick={() => openGallery(index + 1)}
                tabIndex={0}
                aria-label={`View photo ${index + 2}`}
              >
                <img
                  src={img.imageUrl}
                  alt={`Thumbnail ${index + 1} - ${houseTitle}`}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
                  loading="lazy"
                  style={{ height: "100%" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {/* View All Photos Button */}
      {images.length > 1 && (
        <Button 
          variant="outline" 
          className="gap-2 mt-2" 
          onClick={() => openGallery(0)}
        >
          <ImageIcon className="h-4 w-4" />
          View All Photos ({images.length})
        </Button>
      )}

      {/* Full-screen Gallery Modal */}
      {showGallery && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 text-white hover:bg-white/10 rounded-full p-2 transition-colors"
            onClick={closeGallery}
            aria-label="Close gallery"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Main image display */}
          <div className="relative w-full max-w-6xl h-full max-h-[90vh]">
            <img
              src={images[selectedImageIndex].imageUrl}
              alt={`Photo ${selectedImageIndex + 1} - ${houseTitle}`}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Thumbnail navigation */}
          <div className="absolute bottom-4 left-0 right-0">
            <div className="flex justify-center gap-2 overflow-x-auto px-4 py-2">
              {images.map((img, idx) => (
                <button
                  key={img.imageId}
                  className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden transition-opacity ${idx === selectedImageIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(idx);
                  }}
                >
                  <img
                    src={img.imageUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}