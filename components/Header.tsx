"use client";
import React from "react";
import { useRouter } from "next/navigation";

function Header() {
  const router = useRouter();
  const handleRedirect = () => {
    router.push("/protected");
  };
  return (
    <div className="flex flex-row justify-center gap-8 mt-4">
      <ul>
        <li
          className="w-20 text-[20px] text-center pb-3 cursor-pointer select-none hover:ease-out duration-200 hover:scale-110"
          onClick={handleRedirect}
        >
          House.ge
        </li>
      </ul>
    </div>
  );
}

export default Header;
