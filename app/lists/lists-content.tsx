"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { BookOpen, Plus, Search, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { signOut } from "@/app/actions/auth"
import type { List } from "@/lib/supabase/database.types"
import SiteFooter from "@/components/ui/site-footer"
import SiteHeader from "@/components/ui/site-header"

export default function ListsContent() {
  const [lists, setLists] = useState<List[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [newListName, setNewListName] = useState("")
  const [newListDescription, setNewListDescription] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [wordCounts, setWordCounts] = useState<Record<string, number>>({})

  const supabase = createClient()
  const { toast } = useToast()
  const { user } = useAuth()

  // Fetch lists from the database
  useEffect(() => {
    const fetchLists = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("lists")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setLists(data || [])

        // Fetch word counts for each list
        const counts: Record<string, number> = {}
        for (const list of data || []) {
          const { count, error: countError } = await supabase
            .from("words")
            .select("*", { count: "exact", head: true })
            .eq("list_id", list.id)

          if (!countError) {
            counts[list.id] = count || 0
          }
        }
        setWordCounts(counts)
      } catch (error) {
        console.error("Error fetching lists:", error)
        toast({
          title: "Error",
          description: "Failed to load your word lists. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLists()
  }, [supabase, toast, user])

  const filteredLists = lists.filter(
    (list) =>
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (list.description && list.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleCreateList = async () => {
    if (newListName.trim()) {
      setIsCreating(true)
      try {
        if (!user) {
          toast({
            title: "Error",
            description: "You must be logged in to create a list.",
            variant: "destructive",
          })
          return
        }

        const { data, error } = await supabase
          .from("lists")
          .insert({
            name: newListName,
            description: newListDescription || null,
            user_id: user.id,
          })
          .select()
          .single()

        if (error) {
          throw error
        }

        setLists([data, ...lists])
        setWordCounts({ ...wordCounts, [data.id]: 0 })
        setNewListName("")
        setNewListDescription("")
        setIsDialogOpen(false)

        toast({
          title: "List created",
          description: `"${data.name}" has been created successfully.`,
        })
      } catch (error) {
        console.error("Error creating list:", error)
        toast({
          title: "Error",
          description: "Failed to create list. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsCreating(false)
      }
    }
  }

  const handleDeleteList = async (id: string) => {
    setIsDeleting(id)
    try {
      const { error } = await supabase.from("lists").delete().eq("id", id)

      if (error) {
        throw error
      }

      setLists(lists.filter((list) => list.id !== id))

      toast({
        title: "List deleted",
        description: "The list has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting list:", error)
      toast({
        title: "Error",
        description: "Failed to delete list. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Word Lists</h1>
            <p className="text-muted-foreground mt-1">Create and manage your custom word collections</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search lists..."
                className="pl-8 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New List
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new word list</DialogTitle>
                  <DialogDescription>
                    Give your list a name and optional description to help you organize your words.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">List Name</Label>
                    <Input
                      id="name"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="e.g., Chemistry Terms"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Input
                      id="description"
                      value={newListDescription}
                      onChange={(e) => setNewListDescription(e.target.value)}
                      placeholder="e.g., Important terms for my Chemistry class"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isCreating}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateList} disabled={!newListName.trim() || isCreating}>
                    {isCreating ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Creating...
                      </>
                    ) : (
                      "Create List"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading your word lists...</p>
          </div>
        ) : (
          <Tabs defaultValue="grid" className="mb-8">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
              <div className="text-sm text-muted-foreground">
                {filteredLists.length} {filteredLists.length === 1 ? "list" : "lists"}
              </div>
            </div>

            <TabsContent value="grid" className="mt-6">
              {filteredLists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No lists found</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    {searchQuery ? `No lists match "${searchQuery}"` : "You haven't created any word lists yet"}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First List
                      </Button>
                    </DialogTrigger>
                    <DialogContent>{/* Same content as above */}</DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLists.map((list) => (
                    <Card key={list.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle>{list.name}</CardTitle>
                        <CardDescription>{list.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{wordCounts[list.id] || 0} words</span>
                          <span className="mx-2">•</span>
                          <span>Updated {new Date(list.updated_at).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-3 border-t">
                        <Link href={`/lists/${list.id}`}>
                          <Button variant="outline">View Words</Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteList(list.id)}
                          disabled={isDeleting === list.id}
                        >
                          {isDeleting === list.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              {filteredLists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No lists found</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    {searchQuery ? `No lists match "${searchQuery}"` : "You haven't created any word lists yet"}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First List
                      </Button>
                    </DialogTrigger>
                    <DialogContent>{/* Same content as above */}</DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 p-4 font-medium border-b">
                    <div className="col-span-5">Name</div>
                    <div className="col-span-3">Words</div>
                    <div className="col-span-3">Last Updated</div>
                    <div className="col-span-1"></div>
                  </div>
                  {filteredLists.map((list) => (
                    <div key={list.id} className="grid grid-cols-12 p-4 items-center hover:bg-muted/50">
                      <div className="col-span-5">
                        <div className="font-medium">{list.name}</div>
                        <div className="text-sm text-muted-foreground">{list.description}</div>
                      </div>
                      <div className="col-span-3">{wordCounts[list.id] || 0} words</div>
                      <div className="col-span-3">{new Date(list.updated_at).toLocaleDateString()}</div>
                      <div className="col-span-1 flex justify-end gap-2">
                        <Link href={`/lists/${list.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteList(list.id)}
                          disabled={isDeleting === list.id}
                        >
                          {isDeleting === list.id ? (
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
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
