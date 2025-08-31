"use client";

import type { Contact } from "@/sanity/lib/types";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const ContactBar = ({ contacts }: { contacts: Contact[] }) => {
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contactRef.current) {
      gsap.set([contactRef.current], {
        opacity: 0,
        y: 10,
      });

      gsap.to([contactRef.current], {
        opacity: 1,
        y: 0,
        duration: 1.2,
      });
    }
  }, []);

  return (
    <div
      ref={contactRef}
      className="opacity-0 hidden md:flex fixed bottom-4 right-4 z-10 gap-2"
    >
      {contacts.map((contact) => (
        <a
          key={contact._id}
          href={contact.link}
          className="hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {contact.title}
        </a>
      ))}
    </div>
  );
};
