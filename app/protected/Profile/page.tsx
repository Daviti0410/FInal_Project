import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import UploadButton from "@/components/UploadButton";

export default async function Profile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <div className="flex gap-9 justify-center">
        <Image
          className="rounded-lg"
          src={user?.user_metadata?.avatar_url}
          alt={"Profile Image"}
          width={200}
          height={200}
        />
        <div className="flex flex-col justify-center gap-5">
          <ul>
            <li>Mail: {user?.email ?? "Guest"}</li>
            <li>Full Name: {user?.user_metadata?.full_name ?? "Guest"}</li>
            <li>Phone: {user?.phone ?? "Guest"}</li>
          </ul>
          <UploadButton authUser={user} />
        </div>
      </div>
    </>
  );
}
