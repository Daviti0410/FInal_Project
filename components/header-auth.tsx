import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { FaBucket } from "react-icons/fa6";
import BurgerMenu from "@/components/BurgerMenu";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <div className="flex gap-4 items-center">
        <Badge variant="default" className="font-normal pointer-events-none">
          Please update .env.local file with anon key and url
        </Badge>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" disabled>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" variant="default" disabled>
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-44">
      <div className="hidden md:flex gap-4 ml-32">
        <Link href="/protected/Blogs">
          <h2 className="font-medium text-lg hover:text-slate-300">Blogs</h2>
        </Link>
        <Link href="/protected/Contact">
          <h2 className="font-medium text-lg hover:text-slate-300">Contact</h2>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <Link href="/protected/Bucket">
          <FaBucket className="cursor-pointer text-red-800 text-xl" />
        </Link>
        <div className="cursor-pointer">
          <Link href="/protected/Profile">Hey, {user?.email}!</Link>
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>
      <BurgerMenu user={user} signOutAction={signOutAction} />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
