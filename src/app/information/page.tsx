"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Information() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to about-us page
    router.replace("/about-us");
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-black">Redirecting...</div>
    </div>
  );
}
