"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useRouter, usePathname } from "next/navigation";

export const NavBar = ({
  startAnimation = true,
}: {
  startAnimation: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const logoRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleNavigate = () => {
    gsap.to([overlayRef.current], {
      width: "100%",
      duration: 0.4,
      onComplete: () => {
        if (pathname === "/about-us") {
          router.push("/");
        } else {
          router.push("/about-us");
        }
      },
    });
  };

  useEffect(() => {
    if (startAnimation) {
      // Set initial opacity to 0 for all elements
      gsap.set([logoRef.current], {
        opacity: 0,
        y: 20,
      });

      // Animate logo, contact, and posts all at the same time
      gsap.to([logoRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.8,
      });
    }
  }, [startAnimation]);

  return (
    <div>
      <div
        ref={logoRef}
        className="fixed top-4 left-4 right-4 z-20 flex justify-between items-center gap-2 mix-blend-difference"
      >
        <Image
          src="/logo-mobile.svg"
          alt="Logo"
          width={120}
          height={28}
          className="h-7 w-auto invert"
        />
        <div onClick={handleNavigate} className="cursor-pointer">
          <svg
            width="32"
            height="32"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-black invert"
          >
            {/* Second line (diagonal for arrow head) */}
            <line
              x1="8"
              y1="4"
              x2="12"
              y2="8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Third line (diagonal for arrow head) */}
            <line
              x1="8"
              y1="12"
              x2="12"
              y2="8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      <div
        ref={overlayRef}
        data-overlay
        className="absolute top-0 left-0 w-0 h-full bg-white z-10"
      />
    </div>
  );
};
