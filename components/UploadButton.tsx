"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { User } from "@supabase/supabase-js";

interface UploadButtonProps {
  authUser: User | null;
}

export default function UploadButton({ authUser }: UploadButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <button
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md"
        onClick={() => setIsModalOpen(true)}
      >
        Add Product
      </button>
      <Modal
        authUser={authUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
