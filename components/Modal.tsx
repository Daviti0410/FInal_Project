"use client";
import { User } from "@supabase/supabase-js";
import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  authUser: User | null;
}

export default function Modal({ authUser, isOpen, onClose }: ModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !productName || !price || !description) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    setError("");

    const user_id = authUser?.id || "";

    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", productName);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("user.id", user_id);

    try {
      const response = await fetch("/api/UploadProducts", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      alert("Product uploaded successfully!");
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Add Product
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            className="w-full p-2 mb-2 border rounded-lg"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <input
            type="text"
            placeholder="Product Name"
            className="w-full p-2 mb-2 border rounded-lg"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            className="w-full p-2 mb-2 border rounded-lg"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 mb-2 border rounded-lg"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
