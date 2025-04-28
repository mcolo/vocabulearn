"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Check, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { signOut } from "@/app/actions/auth"
import type { List, Word, LearningProgress } from "@/lib/supabase/database.types"

export default function LearnContent() {
  const [lists, setLists] = useState<List[]>([])
  const [selectedList, setSelectedList] = useState("")
  const [currentWords, setCurrentWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [learningMode, setLearningMode] = useState("flashcards")
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([])
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number; percentage: number } | null>(null)
  const [progress, setProgress] = useState({
    dailyGoal: 20,
    wordsLearned: 0,
    streakDays: 0,
    totalWords: 0,
    masteredWords: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [learningData, setLearningData] = useState<LearningProgress[]>([])

  const supabase = createClient()
  const { toast } = useToast()
  const { user } = useAuth()

  // Fetch user and lists
  useEffect(() => {
    const fetchUserAndLists = async () => {
      if (!user) return

      try {
        // Fetch lists
        const { data: listsData, error: listsError } = await supabase
          .from("lists")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (listsError) {
          throw listsError
        }

        setLists(listsData || [])

        // Fetch learning progress
        const { data: progressData, error: progressError } = await supabase
          .from("learning_progress")
          .select(`
            *,
            words (
              id,
              term,
              definition,
              list_id,
              part_of_speech,
              example
            )
          `)
          .eq("user_id", user.id)
          .order("next_review", { ascending: true })

        if (progressError) {
          throw progressError
        }

        setLearningData(progressData || [])

        // Calculate progress stats
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

        const wordsLearnedToday =
          progressData?.filter((item) => new Date(item.last_reviewed) >= new Date(today)).length || 0

        const masteredWords = progressData?.filter((item) => item.repetitions >= 5).length || 0

        setProgress({
          dailyGoal: 20,
          wordsLearned: wordsLearnedToday,
          streakDays: calculateStreak(progressData || []),
          totalWords: progressData?.length || 0,
          masteredWords,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load your learning data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAndLists()
  }, [supabase, toast, user])

  // Calculate streak days
  const calculateStreak = (progressData: LearningProgress[]) => {
    if (!progressData.length) return 0

    const dates = progressData.map((item) => {
      const date = new Date(item.last_reviewed)
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    })

    const uniqueDates = [...new Set(dates)].sort()

    // Simple implementation - just return the number of unique dates in the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentDates = uniqueDates.filter((dateStr) => {
      const [year, month, day] = dateStr.split("-").map(Number)
      const date = new Date(year, month, day)
      return date >= thirtyDaysAgo
    })

    return recentDates.length
  }

  useEffect(() => {
    if (selectedList) {
      const fetchWordsForList = async () => {
        try {
          const { data, error } = await supabase
            .from("words")
            .select("*")
            .eq("list_id", selectedList)
            .order("created_at", { ascending: false })

          if (error) {
            throw error
          }

          // Shuffle the words for learning
          const shuffled = [...(data || [])].sort(() => Math.random() - 0.5)
          setCurrentWords(shuffled)
          setCurrentIndex(0)
          setIsFlipped(false)
          setQuizAnswers([])
          setQuizScore(null)
        } catch (error) {
          console.error("Error fetching words:", error)
          toast({
            title: "Error",
            description: "Failed to load words for this list. Please try again.",
            variant: "destructive",
          })
        }
      }

      fetchWordsForList()
    }
  }, [selectedList, supabase, toast])

  const handleNextCard = () => {
    if (currentIndex < currentWords.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleQuizAnswer = async (isCorrect: boolean) => {
    if (!user) return

    const newAnswers = [...quizAnswers, isCorrect]
    setQuizAnswers(newAnswers)

    // Update learning progress in the database
    try {
      const currentWord = currentWords[currentIndex]

      // Check if we already have a learning progress record for this word
      const existingProgress = learningData.find((item) => item.word_id === currentWord.id)

      // Calculate new values using spaced repetition algorithm
      const quality = isCorrect ? 5 : 2 // 5 for correct, 2 for incorrect but familiar
      const easeFactor = existingProgress?.ease_factor || 2.5
      const interval = existingProgress?.interval || 0
      const repetitions = existingProgress?.repetitions || 0

      // Simple SM-2 algorithm implementation
      let nextEaseFactor = easeFactor
      let nextInterval = 1
      let nextRepetitions = 0

      if (isCorrect) {
        nextEaseFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * 0.08))

        if (repetitions === 0) {
          nextInterval = 1
        } else if (repetitions === 1) {
          nextInterval = 6
        } else {
          nextInterval = Math.round(interval * nextEaseFactor)
        }

        nextRepetitions = repetitions + 1
      } else {
        nextEaseFactor = Math.max(1.3, easeFactor - 0.2)
        nextInterval = 1
        nextRepetitions = 0
      }

      const now = new Date()
      const nextReview = new Date(now)
      nextReview.setDate(nextReview.getDate() + nextInterval)

      if (existingProgress) {
        // Update existing record
        await supabase
          .from("learning_progress")
          .update({
            ease_factor: nextEaseFactor,
            interval: nextInterval,
            repetitions: nextRepetitions,
            next_review: nextReview.toISOString(),
            last_reviewed: now.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq("id", existingProgress.id)
      } else {
        // Create new record
        await supabase.from("learning_progress").insert({
          user_id: user.id,
          word_id: currentWord.id,
          ease_factor: nextEaseFactor,
          interval: nextInterval,
          repetitions: nextRepetitions,
          next_review: nextReview.toISOString(),
          last_reviewed: now.toISOString(),
        })
      }

      // Update local progress stats
      setProgress((prev) => ({
        ...prev,
        wordsLearned: prev.wordsLearned + 1,
      }))
    } catch (error) {
      console.error("Error updating learning progress:", error)
    }

    if (currentIndex < currentWords.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Calculate quiz score
      const correctAnswers = newAnswers.filter((answer) => answer).length
      setQuizScore({
        correct: correctAnswers,
        total: currentWords.length,
        percentage: Math.round((correctAnswers / currentWords.length) * 100),
      })
    }
  }

  const resetLearningSession = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setQuizAnswers([])
    setQuizScore(null)
  }

  // Get suggested lists to review
  const getSuggestedLists = () => {
    if (!learningData.length || !lists.length) return []

    // Group words by list_id
    const listWordCounts = {}
    learningData.forEach((item) => {
      if (item.words && item.words.list_id) {
        if (!listWordCounts[item.words.list_id]) {
          listWordCounts[item.words.list_id] = 0
        }
        listWordCounts[item.words.list_id]++
      }
    })

    // Sort lists by number of words in learning progress
    return lists
      .filter((list) => listWordCounts[list.id])
      .sort((a, b) => (listWordCounts[b.id] || 0) - (listWordCounts[a.id] || 0))
      .slice(0, 2)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading your learning data...</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-3/4">
              <h1 className="text-3xl font-bold tracking-tight mb-6">Learn Your Words</h1>

              {!selectedList ? (
                <div className="bg-muted rounded-lg p-8 text-center">
                  <h2 className="text-xl font-semibold mb-4">Select a list to start learning</h2>
                  <p className="text-muted-foreground mb-6">
                    Choose one of your word lists from the dropdown below to begin your learning session.
                  </p>
                  <Select onValueChange={setSelectedList}>
                    <SelectTrigger className="w-full max-w-xs mx-auto">
                      <SelectValue placeholder="Select a word list" />
                    </SelectTrigger>
                    <SelectContent>
                      {lists.map((list) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedList("")}>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Change List
                      </Button>
                      <h2 className="text-xl font-semibold">{lists.find((list) => list.id === selectedList)?.name}</h2>
                    </div>
                    <Tabs value={learningMode} onValueChange={setLearningMode} className="w-auto">
                      <TabsList>
                        <TabsTrigger value="flashcards" onClick={resetLearningSession}>
                          Flashcards
                        </TabsTrigger>
                        <TabsTrigger value="quiz" onClick={resetLearningSession}>
                          Quiz
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <TabsContent value="flashcards" className="mt-0">
                    {currentWords.length > 0 && (
                      <div className="flex flex-col items-center">
                        <div className="w-full max-w-2xl">
                          <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                            <span>
                              Card {currentIndex + 1} of {currentWords.length}
                            </span>
                            <span>Click card to flip</span>
                          </div>
                          <div
                            className={`relative w-full aspect-[3/2] rounded-xl shadow-md cursor-pointer transition-all duration-500 transform ${
                              isFlipped ? "rotate-y-180" : ""
                            }`}
                            style={{ perspective: "1000px" }}
                            onClick={() => setIsFlipped(!isFlipped)}
                          >
                            <div
                              className={`absolute inset-0 backface-hidden rounded-xl border p-8 flex flex-col items-center justify-center transition-all duration-500 ${
                                isFlipped ? "opacity-0" : "opacity-100"
                              }`}
                            >
                              <h3 className="text-2xl font-bold mb-4">{currentWords[currentIndex].term}</h3>
                              {currentWords[currentIndex].part_of_speech && (
                                <div className="text-muted-foreground mb-2">
                                  {currentWords[currentIndex].part_of_speech}
                                </div>
                              )}
                              <p className="text-muted-foreground text-center">Click to see definition</p>
                            </div>
                            <div
                              className={`absolute inset-0 backface-hidden rounded-xl border p-8 flex flex-col items-center justify-center bg-muted transition-all duration-500 ${
                                isFlipped ? "opacity-100" : "opacity-0"
                              }`}
                            >
                              <p className="text-center">{currentWords[currentIndex].definition}</p>
                              {currentWords[currentIndex].example && (
                                <p className="text-sm italic mt-4 text-muted-foreground">
                                  "{currentWords[currentIndex].example}"
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between mt-6">
                            <Button variant="outline" onClick={handlePrevCard} disabled={currentIndex === 0}>
                              <ChevronLeft className="h-4 w-4 mr-1" />
                              Previous
                            </Button>
                            <Button onClick={handleNextCard} disabled={currentIndex === currentWords.length - 1}>
                              Next
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="quiz" className="mt-0">
                    {currentWords.length > 0 && !quizScore && (
                      <div className="flex flex-col items-center">
                        <div className="w-full max-w-2xl">
                          <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                            <span>
                              Question {currentIndex + 1} of {currentWords.length}
                            </span>
                            <span>{quizAnswers.length} answered</span>
                          </div>
                          <Card>
                            <CardHeader>
                              <CardTitle>Do you know this word?</CardTitle>
                              <CardDescription>
                                Read the definition and decide if you know the corresponding term.
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="p-4 bg-muted rounded-md">
                                <p>{currentWords[currentIndex].definition}</p>
                                {currentWords[currentIndex].example && (
                                  <p className="text-sm italic mt-2">"{currentWords[currentIndex].example}"</p>
                                )}
                              </div>
                              <div className="mt-6 text-center">
                                <p className="font-semibold">The term is: {currentWords[currentIndex].term}</p>
                                {currentWords[currentIndex].part_of_speech && (
                                  <p className="text-sm text-muted-foreground">
                                    ({currentWords[currentIndex].part_of_speech})
                                  </p>
                                )}
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <Button variant="outline" className="w-1/2 mr-2" onClick={() => handleQuizAnswer(false)}>
                                <X className="h-4 w-4 mr-2 text-destructive" />I didn't know
                              </Button>
                              <Button className="w-1/2 ml-2" onClick={() => handleQuizAnswer(true)}>
                                <Check className="h-4 w-4 mr-2 text-green-500" />I knew it
                              </Button>
                            </CardFooter>
                          </Card>
                        </div>
                      </div>
                    )}

                    {quizScore && (
                      <div className="flex flex-col items-center">
                        <div className="w-full max-w-2xl">
                          <Card>
                            <CardHeader>
                              <CardTitle>Quiz Results</CardTitle>
                              <CardDescription>
                                You've completed the quiz for {lists.find((list) => list.id === selectedList)?.name}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-col items-center py-6">
                                <div className="text-5xl font-bold mb-2">{quizScore.percentage}%</div>
                                <p className="text-muted-foreground">
                                  You got {quizScore.correct} out of {quizScore.total} correct
                                </p>
                                <Progress value={quizScore.percentage} className="w-full max-w-md h-3 mt-6" />
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <Button variant="outline" onClick={() => setSelectedList("")}>
                                Change List
                              </Button>
                              <Button onClick={resetLearningSession}>Try Again</Button>
                            </CardFooter>
                          </Card>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </>
              )}
            </div>

            <div className="w-full md:w-1/4">
              <div className="rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Daily Goal</span>
                      <span className="text-sm font-medium">
                        {progress.wordsLearned}/{progress.dailyGoal} words
                      </span>
                    </div>
                    <Progress value={(progress.wordsLearned / progress.dailyGoal) * 100} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm">Current Streak</span>
                    <span className="font-medium">{progress.streakDays} days</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm">Total Words</span>
                    <span className="font-medium">{progress.totalWords}</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm">Mastered Words</span>
                    <span className="font-medium">{progress.masteredWords}</span>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-3">Suggested Lists to Review</h3>
                    <div className="space-y-2">
                      {getSuggestedLists().map((list) => (
                        <Button
                          key={list.id}
                          variant="outline"
                          className="w-full justify-start text-left"
                          onClick={() => setSelectedList(list.id)}
                        >
                          <div className="truncate">{list.name}</div>
                        </Button>
                      ))}
                      {getSuggestedLists().length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No lists to review yet. Start learning to get suggestions!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="font-semibold">Vocabulearn</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vocabulearn. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
