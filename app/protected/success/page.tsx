import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  const sessionId = searchParams.session_id;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (sessionId) {
    try {
      const { error } = await supabase
        .from("bucket")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed to clear the bucket:", error.message);
      } else {
        console.log("Bucket cleared successfully!");
      }
    } catch (error) {
      console.error("Server error:", error);
    }
  }

  return (
    <div className="p-4 mt-20 text-center">
      <h1 className="text-3xl font-bold text-green-500">Payment Successful!</h1>
      <p className="mt-4">Thank you for your purchase.</p>
      <Link
        href="/protected/Bucket"
        className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Back to Bucket
      </Link>
    </div>
  );
}
