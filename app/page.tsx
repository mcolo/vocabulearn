import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, List, LogIn } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">VocabVault</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/lists" className="text-sm font-medium hover:underline">
              My Lists
            </Link>
            <Link href="/learn" className="text-sm font-medium hover:underline">
              Learn
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline">
              About
            </Link>
          </nav>
          <Link href="/login">
            <Button>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 bg-muted">
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
              <div className="rounded-lg border bg-background p-8">
                <div className="flex items-center gap-2 mb-4">
                  <List className="h-5 w-5" />
                  <h3 className="font-semibold">Sample Word List: Literature Terms</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    {
                      word: "Allegory",
                      definition:
                        "A story, poem, or picture that can be interpreted to reveal a hidden meaning, typically a moral or political one.",
                    },
                    {
                      word: "Metaphor",
                      definition:
                        "A figure of speech in which a word or phrase is applied to an object or action to which it is not literally applicable.",
                    },
                    {
                      word: "Protagonist",
                      definition: "The leading character or one of the major characters in a story, play, or film.",
                    },
                  ].map((item, index) => (
                    <li key={index} className="rounded-md border p-3">
                      <div className="font-medium">{item.word}</div>
                      <div className="text-sm text-muted-foreground mt-1">{item.definition}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32">
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
      <footer className="border-t py-6 md:py-8">
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
