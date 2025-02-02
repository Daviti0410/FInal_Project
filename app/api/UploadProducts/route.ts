import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const productName = formData.get("name") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;
    const user_id = formData.get("user.id") as string;

    if (!file || !productName || !price || !description) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileName = `images/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

    const { data: uploadData, error } = await supabase.storage
      .from("images")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(uploadData.path);

    const { error: dbError } = await supabase.from("products").insert([
      {
        user_id: user_id,
        product_name: productName,
        price,
        description,
        image_url: publicUrlData.publicUrl,
      },
    ]);

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to store product" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Product uploaded successfully",
      publicUrlData,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
