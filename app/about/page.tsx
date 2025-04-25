import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <Link href="/" className="text-xl font-bold">
              VocabVault
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/lists" className="text-sm font-medium hover:underline">
              My Lists
            </Link>
            <Link href="/learn" className="text-sm font-medium hover:underline">
              Learn
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline underline">
              About
            </Link>
          </nav>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About VocabVault</h1>
                <p className="text-muted-foreground md:text-xl max-w-[700px] mx-auto">
                  Our mission is to help you expand your vocabulary and retain new words through effective learning
                  techniques.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-12 mt-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">The Science of Spaced Repetition</h2>
                <p className="text-muted-foreground">
                  VocabVault uses spaced repetition, a learning technique that incorporates increasing intervals of time
                  between reviews of previously learned material. This approach leverages the psychological spacing
                  effect, which demonstrates that information is more effectively memorized when reviewed over
                  increasing time intervals rather than all at once.
                </p>
                <p className="text-muted-foreground">
                  Our algorithm schedules reviews at optimal intervals to maximize long-term retention while minimizing
                  the time spent studying. This makes learning new words more efficient and effective.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">How VocabVault Works</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 rounded-full bg-primary text-primary-foreground p-1 text-xs">1</span>
                    <span>
                      <strong>Create Lists:</strong> Organize words into custom lists for different subjects, books, or
                      courses.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 rounded-full bg-primary text-primary-foreground p-1 text-xs">2</span>
                    <span>
                      <strong>Add Words:</strong> Search for words and add them with their definitions to your lists.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 rounded-full bg-primary text-primary-foreground p-1 text-xs">3</span>
                    <span>
                      <strong>Learn:</strong> Use flashcards, quizzes, and other learning tools to memorize your words.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 rounded-full bg-primary text-primary-foreground p-1 text-xs">4</span>
                    <span>
                      <strong>Track Progress:</strong> Monitor your learning journey with detailed statistics and
                      insights.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Who Can Benefit?</h2>
                <p className="text-muted-foreground md:text-xl max-w-[700px] mx-auto">
                  VocabVault is designed for anyone looking to expand their vocabulary and improve their language
                  skills.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
              <div className="rounded-lg border bg-background p-6">
                <h3 className="text-xl font-bold mb-2">Students</h3>
                <p className="text-muted-foreground">
                  Create lists for different subjects, prepare for standardized tests, and master technical terminology
                  for your courses.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <h3 className="text-xl font-bold mb-2">Book Lovers</h3>
                <p className="text-muted-foreground">
                  Collect and learn new words from your reading, organize them by book or genre, and enhance your
                  reading comprehension.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <h3 className="text-xl font-bold mb-2">Language Learners</h3>
                <p className="text-muted-foreground">
                  Build vocabulary in a new language, create themed word lists, and practice with our spaced repetition
                  system.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Get Started Today</h2>
                <p className="text-muted-foreground md:text-xl max-w-[700px] mx-auto">
                  Join thousands of users who are expanding their vocabulary with VocabVault.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg">Create Free Account</Button>
                </Link>
                <Link href="/lists">
                  <Button variant="outline" size="lg">
                    Explore Features
                  </Button>
                </Link>
              </div>
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
