import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { user_id, product_id } = await req.json();

    const supabase = createClient();
    const { error } = await (await supabase)
      .from("bucket")
      .delete()
      .eq("user_id", user_id)
      .eq("product_id", product_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Item deleted successfully!" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error:", err.message);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
