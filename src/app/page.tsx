"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

interface Post {
  _id: string;
  title: string;
  images: Array<{
    _key: string;
    asset: {
      _ref: string;
      _type: string;
    };
    alt?: string;
    text?: string;
  }>;
  publishedAt?: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [loading, setLoading] = useState(true);

  const postsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const query = `*[_type == "post"] | order(publishedAt desc) {
          _id,
          title,
          images[] {
            _key,
            asset->,
            alt,
            text
          },
          publishedAt
        }`;

        const result = await client.fetch<Post[]>(query);
        setPosts(result);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-black rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="fixed top-4 left-4 z-10">
        <Image
          src="/logo-mobile.svg"
          alt="Logo"
          width={120}
          height={28}
          className="h-7 w-auto"
        />
      </div>

      <main>
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
              className={`w-full md:w-auto flex-shrink-0 transition-all duration-300 ${
                index === 0
                  ? "ml-0 md:ml-4"
                  : index === posts.length - 1
                    ? "mr-0 md:mr-4"
                    : ""
              }`}
              onClick={() => scrollToPost(index)}
            >
              {/* Images container */}
              <div className="flex flex-col md:flex-row gap-[19.5px]">
                {post.images.map((image, imageIndex) => (
                  <div key={image._key}>
                    <div className="relative">
                      <Image
                        src={urlFor(image).url()}
                        alt={image.alt || `${post.title} - Image`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full md:w-auto h-auto md:h-[60vh] object-contain"
                      />
                      {/* Desktop: Show text underneath each image */}
                      {image.text && post.title && (
                        <div className="hidden md:grid gap-[6.5px] absolute top-[calc(60vh+6.5px)] left-0">
                          <p className="text-[13px] font-bold leading-3">
                            {post.title}
                          </p>

                          <p className="text-[13px] text-black break-words">
                            {image.text}
                          </p>
                        </div>
                      )}
                    </div>
                    {imageIndex === post.images.length - 1 && (
                      <div className="md:hidden mt-4">
                        {post.images.map(
                          (image) =>
                            image.text && (
                              <div
                                key={`text-${image._key}`}
                                className="grid gap-[6.5px]"
                              >
                                <p className="text-[13px] font-bold leading-3">
                                  {post.title}
                                </p>

                                <p className="text-sm text-black break-words">
                                  {image.text}
                                </p>
                              </div>
                            )
                        )}
                      </div>
                    )}
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
