import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();

    console.log(user_id);

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    // ✅ Get all bucket items for the specific user
    const { data: bucketItems, error: bucketError } = await supabase
      .from("bucket")
      .select("product_id")
      .eq("user_id", user_id);

    if (bucketError) {
      return NextResponse.json({ error: bucketError.message }, { status: 400 });
    }

    const productIds = bucketItems.map((item) => item.product_id);

    if (productIds.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    // ✅ Fetch products that match the product IDs in the user's bucket
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds); // Filter products with matching IDs

    if (productsError) {
      return NextResponse.json(
        { error: productsError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: products }, { status: 200 });
  } catch (err: any) {
    console.error("Server error:", err.message);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
