import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    let query = supabase.from("products").select("*");

    const { data: products, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
