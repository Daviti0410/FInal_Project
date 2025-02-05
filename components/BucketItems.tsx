"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

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
  const [items, setItems] = useState<Product[]>(bucketItems);

  if (!user) {
    return <p className="text-red-500">User not authenticated.</p>;
  }

  const totalPrice = items.reduce((acc, product) => acc + product.price, 0);

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          userEmail: user.email,
        }),
      });

      const session = await response.json();

      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });

        if (result.error) {
          console.error(result.error.message);
        }
      }
    } catch (error) {
      console.error("Stripe Checkout Error:", error);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch("/api/deleteBucketItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, product_id: productId }),
      });

      if (response.ok) {
        setItems((prevItems) =>
          prevItems.filter((product) => product.id !== productId)
        );
        console.log("Item removed from bucket.");
      } else {
        console.error("Failed to remove item.");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">Your Bucket</h1>

      {items.length === 0 ? (
        <p>No items in your bucket.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg shadow-md p-4 bg-gray-800 text-white relative"
            >
              <button
                onClick={() => handleDelete(product.id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition"
              >
                -
              </button>
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

      {items.length > 0 && (
        <button
          onClick={handleCheckout}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
}
