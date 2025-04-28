"use client"

import type React from "react"

import { Suspense } from "react"
import Link from "next/link"
import SiteHeader from "@/components/ui/site-header"
import LoginContent from "./login-content"

export default function LoginPage() {


  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
          </Suspense>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link className="underline" href="/register">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
