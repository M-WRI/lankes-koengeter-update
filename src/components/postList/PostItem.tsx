"use client";

import { Post } from "@/sanity/lib/types";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

export const PostItem = ({
  post,
  image,
  imageIndex,
  posts,
  postsRefs,
}: {
  post: Post;
  image: Post["images"][number];
  imageIndex: number;
  posts: Post[];
  postsRefs: React.RefObject<(HTMLDivElement | null)[]> | null;
}) => {
  const imagesRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[][]>([]);

  useEffect(() => {
    gsap.set([...imagesRefs.current.flat(), ...textRefs.current.flat()], {
      opacity: 0,
      y: 15,
    });

    postsRefs?.current.forEach((postRef, postIndex) => {
      if (postRef) {
        const postImages = imagesRefs.current[postIndex] || [];
        const postTexts = textRefs.current[postIndex] || [];

        gsap.to(postImages, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.2 + postIndex * 0.4,
        });

        gsap.to(postTexts, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          delay: 0.6 + postIndex * 0.4,
        });
      }
    });
  }, []);
  return (
    <div
      key={image._key}
      ref={(el) => {
        if (!imagesRefs.current[posts.findIndex((p) => p._id === post._id)]) {
          imagesRefs.current[posts.findIndex((p) => p._id === post._id)] = [];
        }
        imagesRefs.current[posts.findIndex((p) => p._id === post._id)][
          imageIndex
        ] = el;
      }}
      className="opacity-0"
    >
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
          <div
            ref={(el) => {
              if (
                !textRefs.current[posts.findIndex((p) => p._id === post._id)]
              ) {
                textRefs.current[posts.findIndex((p) => p._id === post._id)] =
                  [];
              }
              textRefs.current[posts.findIndex((p) => p._id === post._id)][
                imageIndex
              ] = el;
            }}
            className="hidden md:grid gap-[6.5px] absolute top-[calc(60vh+6.5px)] left-0"
          >
            <p className="font-bold leading-3">{post.title}</p>

            <p className="text-black break-words">{image.text}</p>
          </div>
        )}
      </div>
      {imageIndex === post.images.length - 1 && (
        <div className="md:hidden mt-4">
          {post.images.map(
            (image, mobileTextIndex) =>
              image.text && (
                <div
                  key={`text-${image._key}`}
                  ref={(el) => {
                    if (
                      !textRefs.current[
                        posts.findIndex((p) => p._id === post._id)
                      ]
                    ) {
                      textRefs.current[
                        posts.findIndex((p) => p._id === post._id)
                      ] = [];
                    }
                    const textIndex = imageIndex + mobileTextIndex + 1;
                    textRefs.current[
                      posts.findIndex((p) => p._id === post._id)
                    ][textIndex] = el;
                  }}
                  className="grid gap-[6.5px]"
                >
                  <p className="font-bold leading-3">{post.title}</p>

                  <p className="text-sm text-black break-words">{image.text}</p>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};
