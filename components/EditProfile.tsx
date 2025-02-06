"use client";

import { useState } from "react";

interface User {
  id: string;
  email?: string;
  user_metadata: {
    full_name?: string;
  };
  phone?: string;
}

interface EditProfileProps {
  user: User | null;
}

export default function EditProfile({ user }: EditProfileProps) {
  const [formData, setFormData] = useState({
    full_name: user?.user_metadata.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/updateUserInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        window.location.reload();
      } else {
        console.error("Update failed:", result.error);
        alert(result.error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating.");
    }
    setLoading(false);
  };
  return (
    <div className="p-4 border rounded-lg shadow-md bg-gray-800 text-white">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
            placeholder="Full Name"
            className="w-full p-2 rounded bg-gray-700 mb-2"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Email"
            className="w-full p-2 rounded bg-gray-700 mb-2"
          />
          <input
            type="text"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="Phone (optional)"
            className="w-full p-2 rounded bg-gray-700 mb-2"
          />
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <p>
            <strong>Full Name:</strong> {user?.user_metadata.full_name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Phone:</strong> {user?.phone || "N/A"}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}
