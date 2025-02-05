import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import UploadButton from "@/components/UploadButton";
import SubscribeButton from "@/components/SubscribeButton";

export default async function Profile({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return (
      <p className="text-center text-red-500 mt-10">User not authenticated.</p>
    );

  const { data: subscriptionData } = await supabase
    .from("subscriptions")
    .select("isSubscribed")
    .eq("user_id", user.id)
    .single();

  const isSubscribed = subscriptionData?.isSubscribed || false;

  if (searchParams.success === "true" && !isSubscribed) {
    await supabase
      .from("subscriptions")
      .upsert({ user_id: user.id, isSubscribed: true });
  }

  return (
    <div className="flex gap-9 justify-center mt-10">
      <Image
        className="rounded-lg"
        src={user.user_metadata?.avatar_url || "/default-avatar.png"}
        alt="Profile Image"
        width={200}
        height={200}
      />

      <div className="flex flex-col justify-center gap-5">
        <ul className="text-white">
          <li>Mail: {user.email}</li>
          <li>Full Name: {user.user_metadata?.full_name ?? "Guest"}</li>
        </ul>

        {isSubscribed ? (
          <UploadButton authUser={user} />
        ) : (
          <SubscribeButton userId={user.id} userEmail={user.email!} />
        )}
      </div>
    </div>
  );
}
