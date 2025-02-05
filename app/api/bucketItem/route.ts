import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface AddToBucketRequest {
  product_id: string;
  user_id: string;
}

export async function POST(req: Request) {
  try {
    const { product_id, user_id }: AddToBucketRequest = await req.json();

    console.log("Received product_id:", product_id);
    console.log("Received user_id:", user_id);

    if (!user_id || !product_id) {
      return NextResponse.json(
        { error: "User ID or Product ID is missing." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from("bucket").insert([
      {
        product_id,
        user_id,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Product added to bucket successfully!", data },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Server error:", err.message);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
