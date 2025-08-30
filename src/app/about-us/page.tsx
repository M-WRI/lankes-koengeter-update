"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Information() {
  const contentRef = useRef<HTMLDivElement>(null);

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

    // Set initial opacity to 0 for content
    gsap.set([contentRef.current], {
      opacity: 0,
      y: 20,
    });

    // Animate content in
    gsap.to([contentRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.8,
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20 px-4">
        <div ref={contentRef} className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-black">Information</h1>

          <div className="prose prose-lg max-w-none text-black">
            <p className="text-lg mb-6">
              Welcome to our information page. This is where you can find
              important details about our work, services, and contact
              information.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div>
                <h2 className="text-2xl font-semibold mb-4">About Us</h2>
                <p className="text-gray-700">
                  We are dedicated to creating meaningful experiences through
                  design and technology. Our team works collaboratively to
                  deliver innovative solutions that meet the needs of our
                  clients and users.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Services</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Web Design & Development</li>
                  <li>User Experience Design</li>
                  <li>Brand Identity</li>
                  <li>Digital Strategy</li>
                  <li>Content Creation</li>
                </ul>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p className="text-gray-700 mb-4">
                Get in touch with us to discuss your project or learn more about
                our services.
              </p>
              <div className="space-y-2 text-gray-700">
                <p>Email: info@example.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Design Street, Creative City, CC 12345</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
