import { BookOpen } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-muted py-6 md:py-8 flex justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Vocabulearn</span>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          © 2025 Vocabulearn. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
