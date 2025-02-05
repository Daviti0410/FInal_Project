import BucketItems from "@/components/BucketItems";
import { createClient } from "@/utils/supabase/server";

export default async function Bucket() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getBucketItem`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user?.id }),
      cache: "no-store",
    }
  );

  const result = await response.json();
  const bucketItems = result.data || [];

  return (
    <div>
      <BucketItems user={user} bucketItems={bucketItems} />
    </div>
  );
}
