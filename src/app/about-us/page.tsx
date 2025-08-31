"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { getInformation } from "@/sanity/lib/data";
import { useRouter } from "next/navigation";
import type { Information } from "@/sanity/lib/types";

export default function AboutUs() {
  const navigate = useRouter();
  const [information, setInformation] = useState<Information[]>([]);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const data = await getInformation();
        setInformation(data || []);
      } catch (error) {
        console.error("Error fetching information:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInformation();
  }, []);

  useEffect(() => {
    // Animate the overlay away when the page loads
    const overlay = document.querySelector("[data-overlay]");
    if (overlay) {
      gsap.to(overlay, {
        width: "0%",
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    navigate.push(`#${sectionId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed z-50 top-[22px] right-12 w-full flex justify-end gap-4">
        {information.map((item) => (
          <button
            key={item._id}
            onClick={() => scrollToSection(item.id)}
            className="cursor-pointer hover:underline"
          >
            {item.title}
          </button>
        ))}
      </nav>
      <div className="pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div
            ref={contentRef}
            className="prose prose-lg max-w-none text-black space-y-12"
          >
            {information.map((item) => (
              <div
                key={item._id}
                ref={(el) => {
                  sectionRefs.current[item._id] = el;
                }}
                className="space-y-6 h-screen flex flex-col justify-center items-center"
                id={item.id}
              >
                <span>
                  {item.contentBlocks.map((block, index) => (
                    <span key={index}>
                      {block.title ? (
                        <span>
                          <strong>{block.title}</strong> {block.text}
                        </span>
                      ) : (
                        <span>{block.text}</span>
                      )}
                      {index < item.contentBlocks.length - 1 && " "}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
