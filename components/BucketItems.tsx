"use client";

import React from "react";

interface Product {
  id: string;
  product_name: string;
  price: number;
  description: string;
  image_url: string;
}

interface User {
  id: string;
  email?: string;
}

interface BucketItemsProps {
  user: User | null;
  bucketItems: Product[];
}

export default function BucketItems({ user, bucketItems }: BucketItemsProps) {
  if (!user) {
    return <p className="text-red-500">User not authenticated.</p>;
  }

  const totalPrice = bucketItems.reduce(
    (acc, product) => acc + product.price,
    0
  );

  return (
    <div className="p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">Your Bucket</h1>

      {bucketItems.length === 0 ? (
        <p>No items in your bucket.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {bucketItems.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg shadow-md p-4 bg-gray-800 text-white"
            >
              <img
                src={product.image_url}
                alt={product.product_name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-xl font-semibold mt-2">
                {product.product_name}
              </h2>
              <p className="text-gray-300">{product.description}</p>
              <p className="text-green-400 font-bold mt-1">${product.price}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-xl font-semibold">
        Total Price:{" "}
        <span className="text-green-500">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}
