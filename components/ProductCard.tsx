"use client";
import { useState } from "react";

interface Product {
  id: string;
  product_name: string;
  price: number;
  description: string;
  image_url: string;
}

interface ProductCardProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
  onDelete: (productId: string) => void;
}

export default function ProductCard({
  product,
  onUpdate,
  onDelete,
}: ProductCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    product_name: product.product_name,
    price: product.price,
    description: product.description,
    image_url: product.image_url,
  });

  const handleEdit = async () => {
    try {
      const response = await fetch("/api/products/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id, ...formData }),
      });

      if (response.ok) {
        const result = await response.json();
        const updatedProduct = result.data; // Ensure 'data' contains the updated product

        if (updatedProduct && updatedProduct.id) {
          setIsEditing(false);
          onUpdate(updatedProduct); // Pass the updated product to the handler
        } else {
          console.error("Invalid response from server:", result);
        }
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch("/api/products/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id }),
      });

      if (response.ok) {
        onDelete(product.id);
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="border p-4 rounded-md shadow-md bg-gray-800 text-white">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={formData.product_name}
            onChange={(e) =>
              setFormData({ ...formData, product_name: e.target.value })
            }
            className="mb-2 w-full p-2 rounded"
          />
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="mb-2 w-full p-2 rounded"
          />
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
            className="mb-2 w-full p-2 rounded"
          />
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Save
          </button>
        </div>
      ) : (
        <>
          <img
            src={product.image_url}
            alt={product.product_name}
            className="w-full h-48 object-cover rounded-md mb-3"
          />
          <h2 className="text-xl font-bold">{product.product_name}</h2>
          <p>{product.description}</p>
          <p className="text-green-400 font-bold">${product.price}</p>

          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}
