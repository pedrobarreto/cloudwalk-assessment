'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-sm text-gray-500">Redirecionando para login...</p>
    </div>
  );
}
