"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

// Dummy data for posts
const dummyPosts = [
  {
    id: 1,
    title: "Mountain Adventure",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop", // Vertical
      "https://images.unsplash.com/photo-1464822759844-d150baec0134?w=800&h=600&fit=crop", // Wide
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop", // Vertical
    ],
  },
  {
    id: 2,
    title: "City Life",
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop", // Wide
      "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=400&h=600&fit=crop", // Vertical
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop", // Wide
    ],
  },
  {
    id: 3,
    title: "Ocean Views",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop", // Wide
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop", // Vertical
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop", // Wide
    ],
  },
  {
    id: 4,
    title: "Forest Walk",
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop", // Vertical
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", // Wide
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop", // Vertical
    ],
  },
  {
    id: 5,
    title: "Desert Sunset",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", // Wide
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop", // Vertical
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", // Wide
    ],
  },
  {
    id: 6,
    title: "Urban Architecture",
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop", // Vertical
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop", // Wide
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop", // Vertical
    ],
  },
];

export default function Home() {
  const [selectedPost, setSelectedPost] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const postsContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to specific post
  const scrollToPost = (postIndex: number) => {
    setSelectedPost(postIndex);

    if (postsContainerRef.current) {
      const container = postsContainerRef.current;
      const postWidth = container.scrollWidth / dummyPosts.length;
      const targetScrollLeft = postIndex * postWidth;

      container.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (postsContainerRef.current && !isScrolling) {
      setIsScrolling(true);

      setTimeout(() => {
        if (postsContainerRef.current) {
          const container = postsContainerRef.current;
          const postWidth = container.scrollWidth / dummyPosts.length;
          const currentScrollLeft = container.scrollLeft;
          const newSelectedPost = Math.round(currentScrollLeft / postWidth);

          if (newSelectedPost !== selectedPost) {
            setSelectedPost(newSelectedPost);
          }
        }
        setIsScrolling(false);
      }, 150);
    }
  };

  useEffect(() => {
    const container = postsContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [selectedPost]);

  // Add global wheel event listener (desktop only)
  useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      // Only apply horizontal scrolling on desktop (md and up)
      if (window.innerWidth >= 768 && postsContainerRef.current) {
        const container = postsContainerRef.current;

        // Handle both vertical and horizontal wheel movement
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          container.scrollLeft += e.deltaY;
        } else {
          e.preventDefault();
          container.scrollLeft += e.deltaX;
        }
      }
    };

    document.addEventListener("wheel", handleGlobalWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleGlobalWheel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Logo in top left corner */}
      <div className="absolute top-4 left-4 z-10">
        <Image
          src="/logo-mobile.svg"
          alt="Logo"
          width={120}
          height={28}
          className="h-7 w-auto"
        />
      </div>

      <main className="w-full py-8 px-4 md:px-0 flex items-center justify-center min-h-screen">
        <div
          ref={postsContainerRef}
          className="flex flex-col md:flex-row gap-8 overflow-y-auto md:overflow-x-auto scrollbar-hide w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {dummyPosts.map((post, index) => (
            <div
              key={post.id}
              className={`flex-shrink-0 bg-white rounded-lg cursor-pointer transition-all duration-300 ${
                index === 0
                  ? "ml-0 md:ml-4"
                  : index === dummyPosts.length - 1
                  ? "mr-0 md:mr-4"
                  : ""
              }`}
              onClick={() => scrollToPost(index)}
            >
              {/* Images container */}
              <div className="flex flex-col md:flex-row gap-2 overflow-y-auto md:overflow-x-auto">
                {post.images.map((image, imageIndex) => (
                  <div key={imageIndex} className="flex-shrink-0">
                    <Image
                      src={image}
                      alt={`${post.title} - Image ${imageIndex + 1}`}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="h-auto md:h-[50vh] w-full md:w-auto object-cover"
                      style={{ width: "100%" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
