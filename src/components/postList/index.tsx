"use client";

import { Post } from "@/sanity/lib/types";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { PostItem } from "./PostItem";

export const PostList = ({
  posts,
  loading,
}: {
  posts: Post[];
  loading: boolean;
}) => {
  const [selectedPost, setSelectedPost] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const postsContainerRef = useRef<HTMLDivElement>(null);
  const postsRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToPost = (postIndex: number) => {
    setSelectedPost(postIndex);

    if (postsContainerRef.current && posts.length > 0) {
      const container = postsContainerRef.current;
      const postWidth = container.scrollWidth / posts.length;
      const targetScrollLeft = postIndex * postWidth;

      container.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (postsContainerRef.current && !isScrolling && posts.length > 0) {
      setIsScrolling(true);

      setTimeout(() => {
        if (postsContainerRef.current) {
          const container = postsContainerRef.current;
          const postWidth = container.scrollWidth / posts.length;
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
  }, [selectedPost, posts.length]);

  useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      if (window.innerWidth >= 768 && postsContainerRef.current) {
        const container = postsContainerRef.current;

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

  useEffect(() => {
    if (!loading && posts.length > 0) {
      const overlay = document.querySelector("[data-overlay]");
      if (overlay) {
        gsap.to(overlay, {
          width: "0%",
          duration: 0.4,
          ease: "power2.inOut",
        });
      }
    }
  }, [loading, posts.length]);

  return (
    <div
      ref={postsContainerRef}
      className="md:h-[calc(100vh+50px)] md:translate-y-[-50px] px-4 pb-4 pt-16 md:p-0 w-full flex flex-col md:flex-row gap-[6.5rem] md:gap-[195px] overflow-y-auto md:overflow-x-auto scrollbar-hide"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        alignItems: "center",
      }}
    >
      {posts.map((post, index) => (
        <div
          key={post._id}
          ref={(el) => {
            postsRefs.current[index] = el;
          }}
          className={`w-full md:w-auto flex-shrink-0 transition-all duration-300 ${
            index === 0
              ? "ml-0 md:ml-4"
              : index === posts.length - 1
                ? "mr-0 md:mr-4"
                : ""
          }`}
          onClick={() => scrollToPost(index)}
        >
          <div className="flex flex-col md:flex-row gap-[19.5px]">
            {post.images.map((image, imageIndex) => (
              <PostItem
                key={image._key}
                post={post}
                image={image}
                imageIndex={imageIndex}
                posts={posts}
                postsRefs={postsRefs}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
