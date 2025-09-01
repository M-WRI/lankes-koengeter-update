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
  const [activeSection, setActiveSection] = useState<string>("");
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

  // Set dynamic height for sections
  useEffect(() => {
    if (information.length === 0) return;

    const setSectionHeights = () => {
      Object.values(sectionRefs.current).forEach((section) => {
        if (section) {
          const contentHeight = section.scrollHeight;
          const viewportHeight = window.innerHeight;

          // Set height to 100vh if content fits, otherwise use content height
          if (contentHeight <= viewportHeight) {
            section.style.height = "100vh";
          } else {
            section.style.height = `${contentHeight}px`;
          }
        }
      });
    };

    // Set heights after content is rendered
    const timer = setTimeout(setSectionHeights, 100);

    // Also set heights on window resize
    window.addEventListener("resize", setSectionHeights);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", setSectionHeights);
    };
  }, [information]);

  // Set up Intersection Observer for active section detection
  useEffect(() => {
    if (information.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px", // Section is active when it's in the center 50% of viewport
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute("data-section-id");
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    }, observerOptions);

    // Observe all sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [information]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <InformationNavigation
        information={information}
        activeSection={activeSection}
        sectionRefs={sectionRefs}
      />
      <div ref={contentRef}>
        {information.map((item) => (
          <div
            key={item._id}
            ref={(el) => {
              sectionRefs.current[item._id] = el;
            }}
            data-section-id={item._id}
            className="min-h-screen flex items-center justify-center px-8"
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
  );
}

export const InformationNavigation = ({
  information,
  activeSection,
  sectionRefs,
}: {
  information: Information[];
  activeSection: string;
  sectionRefs: React.RefObject<{ [key: string]: HTMLDivElement | null }>;
}) => {
  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId];
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  return (
    <div className="fixed z-50 top-[14px] right-12">
      <div className="bg-white px-4 py-2 rounded-md flex gap-4">
        {information.map((item) => (
          <button
            key={item._id}
            onClick={() => scrollToSection(item._id)}
            className={`cursor-pointer transition-all duration-300 ${
              activeSection === item._id
                ? "text-black underline"
                : "text-black hover:underline"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
};
