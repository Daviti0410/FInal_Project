"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BlogUpload({
  refreshBlogs,
}: {
  refreshBlogs: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("blogs")
      .insert([{ title, description }]);

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Blog uploaded successfully!");
      setTitle("");
      setDescription("");
      refreshBlogs();
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-slate-800 mb-10 rounded-md">
      <h2 className="text-2xl font-bold mb-4">Upload a Blog</h2>
      {message && <p className="text-green-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
