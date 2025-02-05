import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import UploadButton from "@/components/UploadButton";

export default async function Profile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getUserProducts`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user?.id }),
    }
  );

  const result = await response.json();
  const userProducts = result.data || [];

  return (
    <div className="flex flex-col items-center gap-9">
      <div className="flex gap-9 justify-center">
        <Image
          className="rounded-lg"
          src={user?.user_metadata?.avatar_url}
          alt={"Profile Image"}
          width={200}
          height={200}
        />
        <div className="flex flex-col justify-center gap-5">
          <ul>
            <li>Mail: {user?.email ?? "Guest"}</li>
            <li>Full Name: {user?.user_metadata?.full_name ?? "Guest"}</li>
            <li>Phone: {user?.phone ?? "Guest"}</li>
          </ul>
          <UploadButton authUser={user} />
        </div>
      </div>

      <div className="mt-6 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">
          Your Registered Products
        </h2>
        {userProducts.length === 0 ? (
          <p>No registered products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {userProducts.map((product: any) => (
              <div
                key={product.id}
                className="border rounded-lg shadow-md p-4 bg-gray-800 text-white"
              >
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="w-full h-48 object-cover rounded-md"
                />
                <h3 className="text-xl font-semibold mt-2">
                  {product.product_name}
                </h3>
                <p className="text-gray-300">{product.description}</p>
                <p className="text-green-400 font-bold mt-1">
                  ${product.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
