"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Briefcase,
  GraduationCap,
  TrendingUp,
  MapPin,
  DollarSign,
  Users,
  BookOpen,
  Search,
  Star,
  ArrowRight,
} from "lucide-react"

// Mock career data
const mockCareers = [
  {
    id: "1",
    title: "Software Engineer",
    field: "Technology",
    description: "Design and develop software applications and systems",
    subjects: ["Mathematics", "ICT", "Physics"],
    education: "Bachelor's in Computer Science",
    averageSalary: "800,000 - 2,000,000 RWF",
    growth: "High",
    location: "Kigali, Remote",
    skills: ["Programming", "Problem Solving", "Teamwork"],
    companies: ["Andela", "Zipline", "Carnegie Mellon University Rwanda"],
  },
  {
    id: "2",
    title: "Medical Doctor",
    field: "Healthcare",
    description: "Diagnose and treat patients, promote health and wellness",
    subjects: ["Biology", "Chemistry", "Physics", "Mathematics"],
    education: "Bachelor of Medicine (MBChB)",
    averageSalary: "600,000 - 1,500,000 RWF",
    growth: "High",
    location: "Nationwide",
    skills: ["Critical Thinking", "Communication", "Empathy"],
    companies: ["King Faisal Hospital", "Rwanda Military Hospital", "Butaro Hospital"],
  },
  {
    id: "3",
    title: "Agricultural Engineer",
    field: "Agriculture",
    description: "Apply engineering principles to agricultural production and processing",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
    education: "Bachelor's in Agricultural Engineering",
    averageSalary: "400,000 - 800,000 RWF",
    growth: "Medium",
    location: "Rural Areas, Kigali",
    skills: ["Technical Design", "Problem Solving", "Project Management"],
    companies: ["RAB", "MINAGRI", "Private Agribusiness"],
  },
]

const mockProfessionals = [
  {
    id: "1",
    name: "Dr. Aline Uwimana",
    title: "Senior Software Engineer",
    company: "Andela Rwanda",
    avatar: "/student-avatar.png",
    story: "Started coding in S4, now leading AI projects that impact millions across Africa",
    subjects: ["Mathematics", "ICT"],
    education: "University of Rwanda - Computer Science",
    advice: "Focus on problem-solving skills and never stop learning new technologies",
  },
  {
    id: "2",
    name: "Dr. Jean Baptiste Nkusi",
    title: "Pediatric Surgeon",
    company: "King Faisal Hospital",
    avatar: "/student-avatar.png",
    story: "From rural Rwanda to saving children's lives through advanced surgical procedures",
    subjects: ["Biology", "Chemistry", "Physics"],
    education: "University of Rwanda - Medicine",
    advice: "Medicine requires dedication, but the impact you make on lives is immeasurable",
  },
]

export default function CareerExplorerPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedField, setSelectedField] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")

  const filteredCareers = mockCareers.filter((career) => {
    const matchesSearch =
      career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesField = selectedField === "all" || career.field === selectedField
    const matchesSubject = selectedSubject === "all" || career.subjects.includes(selectedSubject)

    return matchesSearch && matchesField && matchesSubject
  })

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold glow-text mb-4">Career Path Explorer</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how your current subjects connect to exciting career opportunities. Learn from Rwandan
              professionals who've walked the path before you.
            </p>
          </div>

          <Tabs defaultValue="careers" className="w-full">
            <TabsList className="grid w-full grid-cols-2 glass-effect mb-8">
              <TabsTrigger value="careers">Career Paths</TabsTrigger>
              <TabsTrigger value="professionals">Success Stories</TabsTrigger>
            </TabsList>

            <TabsContent value="careers" className="space-y-6">
              {/* Search and Filters */}
              <Card className="glass-effect border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search careers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 glass-effect"
                        />
                      </div>
                    </div>
                    <Select value={selectedField} onValueChange={setSelectedField}>
                      <SelectTrigger className="w-48 glass-effect">
                        <SelectValue placeholder="Field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Fields</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Agriculture">Agriculture</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="w-48 glass-effect">
                        <SelectValue placeholder="Your Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="ICT">ICT</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Career Cards */}
              <div className="grid lg:grid-cols-2 gap-6">
                {filteredCareers.map((career) => (
                  <Card key={career.id} className="feature-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl glow-text mb-2">{career.title}</CardTitle>
                          <CardDescription>{career.description}</CardDescription>
                        </div>
                        <Badge variant="secondary">{career.field}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">{career.education}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">{career.averageSalary}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">{career.growth} Growth</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">{career.location}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Required Subjects:</h4>
                        <div className="flex flex-wrap gap-1">
                          {career.subjects.map((subject) => (
                            <Badge key={subject} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Key Skills:</h4>
                        <div className="flex flex-wrap gap-1">
                          {career.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Top Employers:</h4>
                        <p className="text-sm text-muted-foreground">{career.companies.join(", ")}</p>
                      </div>

                      <Button className="w-full glow-effect">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Explore Career Path
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="professionals" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {mockProfessionals.map((professional) => (
                  <Card key={professional.id} className="feature-card">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={professional.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {professional.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg glow-text">{professional.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{professional.title}</p>
                          <p className="text-sm font-medium">{professional.company}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm italic">"{professional.story}"</p>

                      <div>
                        <h4 className="font-medium mb-2">Educational Background:</h4>
                        <p className="text-sm text-muted-foreground">{professional.education}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Key Subjects in School:</h4>
                        <div className="flex flex-wrap gap-1">
                          {professional.subjects.map((subject) => (
                            <Badge key={subject} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-accent/20 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Star className="h-4 w-4 mr-2 text-yellow-400" />
                          Advice for Students:
                        </h4>
                        <p className="text-sm italic">"{professional.advice}"</p>
                      </div>

                      <Button variant="outline" className="w-full glass-effect bg-transparent">
                        <Users className="h-4 w-4 mr-2" />
                        Connect & Learn More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* CTA for more stories */}
              <Card className="glass-effect border-border/50">
                <CardContent className="p-8 text-center">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold glow-text mb-2">Share Your Story</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Are you a successful professional who wants to inspire the next generation of Rwandan students?
                    Share your journey and help students see the possibilities ahead.
                  </p>
                  <Button size="lg" className="glow-effect">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Submit Your Story
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
