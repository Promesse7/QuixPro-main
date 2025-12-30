"use client"

import { useState, useEffect } from "react"
import { LovedOnesManager, LovedOne } from "@/lib/lovedOnes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, X, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function LovedOnesPage() {
  const [lovedOnes, setLovedOnes] = useState<LovedOne[]>([])

  useEffect(() => {
    setLovedOnes(LovedOnesManager.getLovedOnes())
  }, [])

  const removeLovedOne = (email: string) => {
    LovedOnesManager.removeLovedOne(email)
    setLovedOnes(LovedOnesManager.getLovedOnes())
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Loved Ones 💕</h1>
        <p className="text-gray-600">
          People you love - their messages will be highlighted with special care
        </p>
      </div>

      {lovedOnes.length === 0 ? (
        <Card className="text-center p-12">
          <CardContent>
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No loved ones yet</h3>
            <p className="text-gray-500 mb-4">
              Start a conversation and click the heart icon next to someone's message to add them to your loved ones.
            </p>
            <Link href="/chat/discover">
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" />
                Find People to Chat With
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lovedOnes.map((lovedOne) => (
            <Card key={lovedOne.email} className="relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeLovedOne(lovedOne.email)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 relative">
                    <AvatarImage src={lovedOne.avatar} alt={lovedOne.name} />
                    <AvatarFallback>{lovedOne.name.charAt(0)}</AvatarFallback>
                    <div className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-1">
                      <Heart className="h-3 w-3 text-white fill-white" />
                    </div>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{lovedOne.name}</CardTitle>
                    <p className="text-sm text-gray-500">{lovedOne.email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    Added {new Date(lovedOne.addedAt).toLocaleDateString()}
                  </p>
                  <Link href={`/chat/direct/${lovedOne.email}`}>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-pink-50 rounded-lg">
        <div className="flex items-center space-x-2 text-pink-700">
          <Heart className="h-5 w-5 fill-pink-500" />
          <span className="font-medium">Pro Tip:</span>
        </div>
        <p className="text-pink-600 text-sm mt-1">
          Messages from your loved ones will appear with a special pink heart and highlighting. 
          This helps you quickly find messages from people who matter most to you! 💕
        </p>
      </div>
    </div>
  )
}
