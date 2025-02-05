"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  product_name: string;
  price: number;
  description: string;
  image_url: string;
}

interface UserProductsProps {
  userId: string;
}

export default function UserProducts({ userId }: UserProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/getUserProducts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const result = await response.json();
      setProducts(result.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [userId]);

  const handleUpdate = (updatedProduct: Product) => {
    if (!updatedProduct || !updatedProduct.id) {
      console.error("Invalid updated product:", updatedProduct);
      return;
    }

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product?.id === updatedProduct.id
          ? { ...product, ...updatedProduct }
          : product
      )
    );
  };

  const handleDelete = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  return (
    <div className="mt-6 w-full max-w-4xl">
      <h2 className="text-2xl font-semibold mb-4">Your Registered Products</h2>
      {products.length === 0 ? (
        <p>No registered products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
