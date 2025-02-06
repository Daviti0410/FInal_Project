import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import UploadButton from "@/components/UploadButton";
import UserProducts from "@/components/UserProducts";
import EditProfile from "@/components/EditProfile";
import SubscribeButton from "@/components/SubscribeButton";
import { revalidatePath } from "next/cache";

export default async function Profile({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-9">
        <p className="text-red-500">
          You must be logged in to access this page.
        </p>
      </div>
    );
  }

  const { data: subscriptionData, error } = await supabase
    .from("subscriptions")
    .select("id, isSubscribed")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching subscription data:", error);
  }

  const isSubscribed = subscriptionData?.isSubscribed ?? false;

  if (searchParams.success === "true") {
    if (subscriptionData) {
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ isSubscribed: true })
        .eq("user_id", user.id);

      if (updateError) {
        console.error(" Error updating subscription:", updateError);
      } else {
        console.log("✅ Subscription updated successfully!");
      }
    } else {
      const { error: insertError } = await supabase
        .from("subscriptions")
        .insert({ user_id: user.id, isSubscribed: true });

      if (insertError) {
        console.error("Error inserting new subscription:", insertError);
      } else {
        console.log("✅ New subscription inserted successfully!");
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-9">
      <div className="flex gap-9 justify-center">
        <Image
          className="rounded-lg"
          src={user.user_metadata?.avatar_url || "/default-avatar.png"}
          alt="Profile Image"
          width={200}
          height={200}
        />
        <div className="flex flex-col justify-center gap-5">
          <EditProfile user={user} />

          {isSubscribed ? (
            <UploadButton authUser={user} />
          ) : (
            <SubscribeButton userId={user.id} userEmail={user.email!} />
          )}
        </div>
      </div>

      {user && <UserProducts userId={user.id} />}
    </div>
  );
}
