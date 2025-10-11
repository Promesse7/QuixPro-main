"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Award, Calendar, BookOpen, RefreshCw } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

interface Certificate {
  id: string
  title: string
  course: string
  score: number
  completedAt: string
  level: string
  type: "quiz" | "course" | "achievement"
}

// Removed mock data; fetch from API

export default function CertificatesPage() {
  const [user, setUser] = useState<any | null>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const fetchCertificates = async () => {
    try {
      if (!user) return
      setRefreshing(true)
      const res = await fetch(`/api/certificates?userId=${user.id}`)
      if (!res.ok) throw new Error("Failed to fetch certificates")
      const data = await res.json()
      setCertificates(
        (data.certificates || []).map((c: any) => ({
          id: c._id?.toString?.() || c.id,
          title: c.title,
          course: c.course,
          score: c.score,
          completedAt: c.completedAt || c.createdAt,
          level: c.level,
          type: c.type || "achievement",
        }))
      )
    } catch (e) {
      console.error("Failed to load certificates", e)
      setCertificates([])
    } finally {
      setRefreshing(false)
    }
  }

  const downloadCertificate = (certificate: Certificate) => {
    // Mock download functionality
    console.log("[v0] Downloading certificate:", certificate.id)
    alert(`Downloading certificate: ${certificate.title}`)
  }

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (currentUser?.role === "student") {
      fetchCertificates()
      
      // Refresh certificates every 30 seconds to catch new ones
      const interval = setInterval(fetchCertificates, 30000)
      return () => clearInterval(interval)
    }
  }, [])

  const getCertificateTypeColor = (type: Certificate["type"]) => {
    switch (type) {
      case "quiz":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "course":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "achievement":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <p className="text-gray-400">Please log in to view your certificates.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
                <Award className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">My Certificates</h1>
                <p className="text-gray-400">Your achievements and completed courses</p>
              </div>
            </div>
            <Button 
              onClick={fetchCertificates} 
              disabled={refreshing}
              variant="outline"
              className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Certificates</p>
                  <p className="text-2xl font-bold text-white">{certificates.length}</p>
                </div>
                <Award className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Average Score</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(certificates.reduce((acc, cert) => acc + cert.score, 0) / certificates.length)}%
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">This Month</p>
                  <p className="text-2xl font-bold text-white">
                    {
                      certificates.filter((cert) => new Date(cert.completedAt).getMonth() === new Date().getMonth())
                        .length
                    }
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <Card
              key={certificate.id}
              className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-all duration-300 group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-white mb-2">{certificate.title}</CardTitle>
                    <p className="text-gray-400 text-sm">{certificate.course}</p>
                  </div>
                  <Badge className={`${getCertificateTypeColor(certificate.type)} capitalize`}>
                    {certificate.type}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Score */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Score</span>
                    <span className="text-white font-semibold">{certificate.score}%</span>
                  </div>

                  {/* Level */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Level</span>
                    <Badge className="bg-gray-800 text-gray-300 border-gray-700">{certificate.level}</Badge>
                  </div>

                  {/* Date */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Completed</span>
                    <span className="text-gray-300 text-sm">
                      {new Date(certificate.completedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={() => downloadCertificate(certificate)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {certificates.length === 0 && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-12 text-center">
              <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Certificates Yet</h3>
              <p className="text-gray-400 mb-6">Complete quizzes and courses to earn your first certificate!</p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                Start Learning
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
