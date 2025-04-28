"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Plus, Search, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { signOut } from "@/app/actions/auth"
import type { List, Word } from "@/lib/supabase/database.types"
import { Definition, DictionaryResponse } from "@/types/dictionary-api"
import SiteFooter from "@/components/ui/site-footer"

export default function ListDetailContent({ id }: { id: string }) {
  const [list, setList] = useState<List | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [newTerm, setNewTerm] = useState("")
  const [newDefinition, setNewDefinition] = useState("")
  const [newPartOfSpeech, setNewPartOfSpeech] = useState("")
  const [newExample, setNewExample] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const [searchResults, setSearchResults] = useState<Definition[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1)

  const supabase = createClient()
  const { toast } = useToast()
  const { user } = useAuth()

  // Fetch list and words from the database
  useEffect(() => {
    const fetchListAndWords = async () => {
      try {
        // Fetch list details
        const { data: listData, error: listError } = await supabase.from("lists").select("*").eq("id", id).single()

        if (listError) {
          throw listError
        }

        setList(listData)

        // Fetch words in the list
        const { data: wordsData, error: wordsError } = await supabase
          .from("words")
          .select("*")
          .eq("list_id", id)
          .order("created_at", { ascending: false })

        if (wordsError) {
          throw wordsError
        }

        setWords(wordsData || [])
      } catch (error) {
        console.error("Error fetching list details:", error)
        toast({
          title: "Error",
          description: "Failed to load list details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchListAndWords()
  }, [id, supabase, toast])

  // Debounced search function for dictionary API
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchError("")
    setSearchResults([])

    try {
      const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(searchQuery.trim())
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(response.status === 404 ? "No definitions found for this word" : "Failed to fetch definition")
      }

      const data: DictionaryResponse[] = await response.json()

      // Process and format the results
      // const formattedResults = data.flatMap((entry) => {
      //   return entry.meanings.flatMap((meaning) =>
      //     meaning.definitions.map((def) => ({
      //       word: entry.word,
      //       partOfSpeech: meaning.partOfSpeech,
      //       definition: def.definition,
      //       example: def.example,
      //     })),
      //   )
      // }).slice(0, 8) // Limit to 8 results for better UX
      const formattedResults = data.map((entry) => ({
        word: entry.word,
        phonetics: entry.phonetics.map((phonetic) => ({
          text: phonetic.text,
          audio: phonetic.audio || undefined,
          sourceUrl: phonetic.sourceUrl || undefined,
        })),
        meanings: entry.meanings.map((meaning) => ({
          partOfSpeech: meaning.partOfSpeech,
          definitions: meaning.definitions.map((def) => ({
            definition: def.definition,
            synonyms: def.synonyms || undefined,
            antonyms: def.antonyms || undefined,
            example: def.example || undefined,
          })),
        })),
      }))

      setSearchResults(formattedResults)
    } catch (error: any) {
      console.error("Error searching for word:", error)
      setSearchError(error?.message || "Failed to search for word")
    } finally {
      setIsSearching(false)
    }
  }

  // TODO fix this
  const handleSelectDefinition = (result: Definition) => {
    // setNewTerm(result.word)
    // setNewDefinition(result.definition)
    // setNewPartOfSpeech(result.partOfSpeech || "")
    // setNewExample(result.example || "")
    // setSearchResults([])
    // setSearchQuery("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (searchResults.length === 0) return

    // Handle arrow down (select next result)
    if (e.key === "ArrowDown") {
      e.preventDefault()
      const nextIndex = selectedResultIndex < searchResults.length - 1 ? selectedResultIndex + 1 : 0
      setSelectedResultIndex(nextIndex)
    }

    // Handle arrow up (select previous result)
    if (e.key === "ArrowUp") {
      e.preventDefault()
      const prevIndex = selectedResultIndex > 0 ? selectedResultIndex - 1 : searchResults.length - 1
      setSelectedResultIndex(prevIndex)
    }

    // Handle enter (select current result)
    if (e.key === "Enter" && selectedResultIndex !== -1) {
      e.preventDefault()
      handleSelectDefinition(searchResults[selectedResultIndex])
    }
  }

  const filteredWords = words.filter(
    (word) =>
      word.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddWord = async () => {
    if (newTerm.trim() && newDefinition.trim()) {
      setIsCreating(true)
      try {
        const { data, error } = await supabase
          .from("words")
          .insert({
            list_id: id,
            term: newTerm,
            definition: newDefinition,
            part_of_speech: newPartOfSpeech || null,
            example: newExample || null,
          })
          .select()
          .single()

        if (error) {
          throw error
        }

        setWords([data, ...words])
        setNewTerm("")
        setNewDefinition("")
        setNewPartOfSpeech("")
        setNewExample("")
        setSearchQuery("")
        setSearchResults([])
        setSearchError("")
        setIsDialogOpen(false)

        toast({
          title: "Word added",
          description: `"${data.term}" has been added to your list.`,
        })
      } catch (error) {
        console.error("Error adding word:", error)
        toast({
          title: "Error",
          description: "Failed to add word. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsCreating(false)
      }
    }
  }

  const handleDeleteWord = async (wordId: string) => {
    setIsDeleting(wordId)
    try {
      const { error } = await supabase.from("words").delete().eq("id", wordId)

      if (error) {
        throw error
      }

      setWords(words.filter((word) => word.id !== wordId))

      toast({
        title: "Word removed",
        description: "The word has been removed from your list.",
      })
    } catch (error) {
      console.error("Error deleting word:", error)
      toast({
        title: "Error",
        description: "Failed to delete word. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-muted-foreground">Loading word list...</p>
      </div>
    )
  }

  if (!list) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">List not found</h1>
        <p className="text-muted-foreground mt-2">The list you're looking for doesn't exist.</p>
        <Link href="/lists">
          <Button className="mt-4">Go back to lists</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/lists">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Lists
            </Button>
          </Link>
          <Badge variant="outline" className="ml-2">
            {words.length} words
          </Badge>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{list.name}</h1>
            <p className="text-muted-foreground mt-1">{list.description}</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search words..."
                className="pl-8 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Word
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add a new word</DialogTitle>
                  <DialogDescription>
                    Search for a word to add it to your list or enter details manually.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="search">Search for a word</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="search"
                        placeholder="Type to search..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          setSelectedResultIndex(-1)
                        }}
                        onKeyDown={handleKeyDown}
                      />
                      <Button type="button" size="icon" variant="outline" onClick={handleSearch} disabled={isSearching}>
                        {isSearching ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {searchError && <p className="text-sm text-destructive">{searchError}</p>}
                  </div>

                  {searchResults.length > 0 && (
                    <div className="max-h-[200px] overflow-y-auto rounded-md border">
                      {searchResults.map((result, index) => (
                        <div
                          key={index}
                          className={`flex flex-col p-3 hover:bg-muted cursor-pointer border-b last:border-0 ${index === selectedResultIndex ? "bg-muted" : ""
                            }`}
                          onClick={() => handleSelectDefinition(result)}
                        >
                          <div className="font-medium">{result.word}</div>
                          {result.meanings.map((meaning) => (
                            <div key={meaning.partOfSpeech}>
                              <span className="font-medium">{meaning.partOfSpeech}</span>
                              {meaning.definitions.map((def) => (
                                <div key={def.definition}>
                                  <p className="text-sm text-muted-foreground line-clamp-2">{def.definition}</p>
                                  {def.example && <p className="text-sm text-muted-foreground line-clamp-2">Example: {def.example}</p>}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid gap-2 pt-2">
                    <div className="flex items-center">
                      <div className="h-px flex-1 bg-muted"></div>
                      <span className="px-2 text-xs text-muted-foreground">OR ADD MANUALLY</span>
                      <div className="h-px flex-1 bg-muted"></div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="term">Word/Term</Label>
                    <Input
                      id="term"
                      value={newTerm}
                      onChange={(e) => setNewTerm(e.target.value)}
                      placeholder="e.g., Catalyst"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="definition">Definition</Label>
                    <Input
                      id="definition"
                      value={newDefinition}
                      onChange={(e) => setNewDefinition(e.target.value)}
                      placeholder="e.g., A substance that increases the rate of a chemical reaction..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="partOfSpeech">Part of Speech (optional)</Label>
                    <Input
                      id="partOfSpeech"
                      value={newPartOfSpeech}
                      onChange={(e) => setNewPartOfSpeech(e.target.value)}
                      placeholder="e.g., noun, verb, adjective"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="example">Example (optional)</Label>
                    <Input
                      id="example"
                      value={newExample}
                      onChange={(e) => setNewExample(e.target.value)}
                      placeholder="e.g., Enzymes are biological catalysts."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isCreating}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddWord} disabled={!newTerm.trim() || !newDefinition.trim() || isCreating}>
                    {isCreating ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Adding...
                      </>
                    ) : (
                      "Add Word"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="cards" className="mb-8">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="cards">Card View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            <div className="text-sm text-muted-foreground">
              {filteredWords.length} {filteredWords.length === 1 ? "word" : "words"}
            </div>
          </div>

          <TabsContent value="cards" className="mt-6">
            {filteredWords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No words found</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  {searchQuery ? `No words match "${searchQuery}"` : "You haven't added any words to this list yet"}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Word
                    </Button>
                  </DialogTrigger>
                  <DialogContent>{/* Same content as above */}</DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWords.map((word) => (
                  <Card key={word.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="font-semibold text-lg mb-2">{word.term}</div>
                      {word.part_of_speech && (
                        <div className="text-sm text-muted-foreground mb-2">{word.part_of_speech}</div>
                      )}
                      <div className="text-muted-foreground">{word.definition}</div>
                      {word.example && (
                        <div className="text-sm italic mt-2 text-muted-foreground">"{word.example}"</div>
                      )}
                      <div className="flex justify-end mt-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteWord(word.id)}
                          disabled={isDeleting === word.id}
                        >
                          {isDeleting === word.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            {filteredWords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No words found</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  {searchQuery ? `No words match "${searchQuery}"` : "You haven't added any words to this list yet"}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Word
                    </Button>
                  </DialogTrigger>
                  <DialogContent>{/* Same content as above */}</DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="rounded-md border">
                <div className="grid grid-cols-12 p-4 font-medium border-b">
                  <div className="col-span-3">Term</div>
                  <div className="col-span-8">Definition</div>
                  <div className="col-span-1"></div>
                </div>
                {filteredWords.map((word) => (
                  <div
                    key={word.id}
                    className="grid grid-cols-12 p-4 items-center hover:bg-muted/50 border-b last:border-0"
                  >
                    <div className="col-span-3">
                      <div className="font-medium">{word.term}</div>
                      {word.part_of_speech && (
                        <div className="text-xs text-muted-foreground">{word.part_of_speech}</div>
                      )}
                    </div>
                    <div className="col-span-8">
                      <div>{word.definition}</div>
                      {word.example && (
                        <div className="text-sm italic mt-1 text-muted-foreground">"{word.example}"</div>
                      )}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteWord(word.id)}
                        disabled={isDeleting === word.id}
                      >
                        {isDeleting === word.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  )
}
