import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, List } from "lucide-react"
import SiteHeader from "@/components/ui/site-header"
import HeroImage from "@/components/ui/hero-image"

export default function Home() {
  
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main>
        <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Expand Your Vocabulary with Spaced Repetition
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Create custom word lists, learn definitions, and master new vocabulary with our scientifically-proven
                  spaced repetition system.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link href="/register">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" size="lg">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <HeroImage className={"[&_path]:fill-foreground"}/>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32 flex justify-center bg-slate-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="text-muted-foreground md:text-xl">
                  Our app uses proven learning techniques to help you remember new words
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              {[
                {
                  title: "Create Word Lists",
                  description: "Organize words into custom lists for different subjects, books, or difficulty levels.",
                  icon: <List className="h-10 w-10" />,
                },
                {
                  title: "Learn with Spaced Repetition",
                  description: "Our algorithm schedules reviews at optimal intervals to maximize long-term retention.",
                  icon: <BookOpen className="h-10 w-10" />,
                },
                {
                  title: "Track Your Progress",
                  description: "See your improvement over time with detailed statistics and learning insights.",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-10 w-10"
                    >
                      <path d="M3 3v18h18" />
                      <path d="m19 9-5 5-4-4-3 3" />
                    </svg>
                  ),
                },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                  <div className="text-primary">{item.icon}</div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-center text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted py-6 md:py-8 flex justify-center">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="font-semibold">VocabVault</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} VocabVault. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
