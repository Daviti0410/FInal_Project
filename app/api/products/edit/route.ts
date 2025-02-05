import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { product_id, product_name, price, description, image_url } =
      await req.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .update({ product_name, price, description, image_url })
      .eq("id", product_id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err) {
    console.error("Server error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
