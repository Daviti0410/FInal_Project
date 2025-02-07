"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BlogUpload from "@/components/BlogUpload";

type Blog = {
  id: number;
  title: string;
  description: string;
  created_at: string;
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blogs:", error);
    } else {
      setBlogs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("blogs").delete().match({ id });

    if (error) {
      console.error("Error deleting blog:", error);
    } else {
      setBlogs(blogs.filter((blog) => blog.id !== id));
    }
  };

  return (
    <div className="p-4">
      <BlogUpload refreshBlogs={fetchBlogs} />
      <h1 className="text-2xl font-bold mb-4">Blogs</h1>
      {loading ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <ul className="space-y-4">
          {blogs.map((blog) => (
            <li
              key={blog.id}
              className="border p-4 rounded-lg shadow-md flex justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <p className="text-gray-500">{blog.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(blog.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(blog.id)}
                className="bg-red-500 text-white px-1 h-9 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
