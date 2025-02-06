import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, full_name, email, phone } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("🔧 Updating user:", { user_id, full_name, email, phone });

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      user_id,
      {
        email,
        user_metadata: { full_name },
        phone: phone || null,
      }
    );

    if (error) {
      console.error(" Supabase Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(" User updated successfully:", data);

    return NextResponse.json(
      { message: "User updated successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error(" API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
