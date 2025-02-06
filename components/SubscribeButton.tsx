"use client";

import React from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface SubscribeButtonProps {
  userId: string;
  userEmail: string;
}

export default function SubscribeButton({
  userId,
  userEmail,
}: SubscribeButtonProps) {
  const handleSubscribe = async () => {
    try {
      const stripe = await stripePromise;

      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, userEmail }),
      });

      const session = await response.json();

      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });

        if (result.error) {
          console.error(result.error.message);
        } else {
          console.log(" Payment successful! Reloading...");
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Subscription Error:", error);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
    >
      Subscribe for $10/month
    </button>
  );
}
