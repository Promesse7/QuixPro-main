"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Star, Users, BookOpen, MapPin, Search } from "lucide-react"

// Mock tutoring data
const mockTutors = [
  {
    id: "1",
    name: "Jean Baptiste Nkurunziza",
    avatar: "/student-avatar.png",
    level: "S6",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    rating: 4.9,
    reviews: 23,
    hourlyRate: 2000,
    location: "Kigali",
    availability: "Mon-Fri 4-8 PM",
    description: "Expert in advanced mathematics and sciences. Helped 50+ students improve their grades.",
    languages: ["English", "Kinyarwanda", "French"],
  },
  {
    id: "2",
    name: "Marie Claire Uwimana",
    avatar: "/student-avatar.png",
    level: "S5",
    subjects: ["English", "Literature", "History"],
    rating: 4.8,
    reviews: 18,
    hourlyRate: 1500,
    location: "Musanze",
    availability: "Weekends",
    description: "Passionate about languages and humanities. Interactive teaching style.",
    languages: ["English", "Kinyarwanda"],
  },
  {
    id: "3",
    name: "Patrick Habimana",
    avatar: "/student-avatar.png",
    level: "S4",
    subjects: ["ICT", "Computer Science"],
    rating: 4.7,
    reviews: 15,
    hourlyRate: 1800,
    location: "Huye",
    availability: "Flexible",
    description: "Tech enthusiast with practical programming experience. Makes coding fun!",
    languages: ["English", "Kinyarwanda"],
  },
]

export default function PeerTutoringPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")

  const filteredTutors = mockTutors.filter((tutor) => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects.some((subject) => subject.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSubject = selectedSubject === "all" || tutor.subjects.includes(selectedSubject)
    const matchesLevel = selectedLevel === "all" || tutor.level === selectedLevel

    return matchesSearch && matchesSubject && matchesLevel
  })

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold glow-text mb-4">Peer Tutoring Marketplace</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with fellow students for personalized learning sessions. Learn from peers who excel in subjects
              you want to master.
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="glass-effect border-border/50 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tutors or subjects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 glass-effect"
                    />
                  </div>
                </div>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-48 glass-effect">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="ICT">ICT</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-32 glass-effect">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="S1">S1</SelectItem>
                    <SelectItem value="S2">S2</SelectItem>
                    <SelectItem value="S3">S3</SelectItem>
                    <SelectItem value="S4">S4</SelectItem>
                    <SelectItem value="S5">S5</SelectItem>
                    <SelectItem value="S6">S6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tutors Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <Card key={tutor.id} className="feature-card marketplace-glow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={tutor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {tutor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg glow-text">{tutor.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">{tutor.level}</Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{tutor.rating}</span>
                          <span className="text-sm text-muted-foreground">({tutor.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{tutor.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-wrap gap-1">
                        {tutor.subjects.map((subject) => (
                          <Badge key={subject} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{tutor.location}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{tutor.availability}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div>
                      <span className="text-lg font-bold glow-text">{tutor.hourlyRate} RWF</span>
                      <span className="text-sm text-muted-foreground">/hour</span>
                    </div>
                    <Button className="glow-effect">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Become a Tutor CTA */}
          <Card className="glass-effect border-border/50 mt-12">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold glow-text mb-2">Become a Peer Tutor</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Share your knowledge and earn points while helping fellow students succeed. Join Rwanda's collaborative
                learning community.
              </p>
              <Button size="lg" className="glow-effect">
                Apply to Tutor
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
