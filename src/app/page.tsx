"use client";

import { useState, useEffect } from "react";
import { getContacts, getPosts } from "@/sanity/lib/data";
import type { Contact, Post } from "@/sanity/lib/types";
import { ContactBar } from "@/components/contactBar";
import { PostList } from "@/components/postList";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResult, contactsResult] = await Promise.all([
          getPosts(),
          getContacts(),
        ]);

        setPosts(postsResult);
        setContacts(contactsResult);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      {contacts.length > 0 && <ContactBar contacts={contacts} />}
      <main>
        <PostList posts={posts} loading={loading} />
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
