interface Product {
  id: string;
  product_name: string;
  price: string;
  description: string;
  image_url: string;
}

export default async function ProductList() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/getProducts`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products: Product[] = await response.json();

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 mt-20">
        {products.map((product) => (
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
            <button className="bg-orange-600 px-5 py-2 mt-2 rounded-lg hover:bg-orange-700 transition">
              Add To Cart
            </button>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <p className="text-center text-red-500 mt-10">Failed to load products.</p>
    );
  }
}
