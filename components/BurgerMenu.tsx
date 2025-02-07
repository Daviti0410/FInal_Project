"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const BurgerMenu = ({
  user,
  signOutAction,
}: {
  user: any;
  signOutAction: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const headerHeight = 64;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden relative">
      <button
        className="text-2xl z-50 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div
          className="fixed right-0 w-1/2 bg-gray-900 text-white z-50 shadow-lg flex items-center justify-center rounded-tl-lg"
          style={{
            top: `${headerHeight}px`,
            height: `calc(100vh - ${headerHeight}px)`,
            bottom: "0",
          }}
        >
          <div className="flex flex-col space-y-4 text-center">
            <Link href="/protected/Blogs" onClick={() => setIsOpen(false)}>
              <h2 className="hover:text-slate-300">Blogs</h2>
            </Link>
            <Link href="/protected/Contact" onClick={() => setIsOpen(false)}>
              <h2 className="hover:text-slate-300">Contact</h2>
            </Link>
            <Link href="/protected/Bucket" onClick={() => setIsOpen(false)}>
              <h2 className="cursor-pointer">Bucket</h2>
            </Link>
            <Link href="/protected/Profile" onClick={() => setIsOpen(false)}>
              <h2>Profile</h2>
            </Link>
            <form action={signOutAction} className="w-full text-center">
              <Button type="submit" variant={"outline"} className="w-full">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BurgerMenu;
