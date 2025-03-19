"use client"

import FileUpload from "@/components/FileUpload";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-6">
      <h1 className="text-2xl font-bold">Car Inventory Upload</h1>

      <FileUpload />

      <button
        onClick={() => router.push("/cars")}
        className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md"
      >
        View Car Listings
      </button>
    </div>
  );
}
