"use client"

import { signOut } from "@/app/actions/auth";
import { Button } from "../button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import SiteLogo from "./site-logo";

export default function SiteHeader({ logoOnly }: { logoOnly?: boolean }) {
  const { user } = useAuth()
  
  async function handleSignOut() {
    await signOut()
  }

  if (logoOnly) {
    return (
      <header className="flex justify-center px-4">
      <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-bold">
            <SiteLogo className="md:w-56 w-44" />
          </Link>
      </div>
    </header>
    )
  }

  return (
    <header className="flex justify-center px-4">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold">
            <SiteLogo className="md:w-56 w-44" />
          </Link>
        </div>
        <nav className="flex items-center">
          {user === null &&
            <Link href="/login">
              <Button variant="outline">
                Sign In
                <LogIn className="ml-0 h-4 w-4" />
              </Button>
            </Link>
          }
          {user !== null &&
            <>
              <Link href="/lists">
                <Button variant="ghost">
                  My Lists
                </Button>
              </Link>
              <Link href="/learn">
                <Button variant="ghost">
                  Learn
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost">
                  Profile
                </Button>
              </Link>
              <Button className="ml-4" variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          }
        </nav>
      </div>
    </header>
  )
}
