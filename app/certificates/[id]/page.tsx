"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Award, Calendar, BookOpen, Star } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

interface CertificateDetails {
  id: string
  title: string
  course: string
  score: number
  completedAt: string
  level: string
  type: "quiz" | "course" | "achievement"
  studentName: string
  description: string
  skills: string[]
}

export default function CertificateViewPage() {
  const params = useParams()
  const [user, setUser] = useState(null)
  const [certificate, setCertificate] = useState(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    // Mock certificate data
    const mockCertificate = {
      id: params.id as string,
      title: "Mathematics Excellence Certificate",
      course: "Mathematics",
      score: 95,
      completedAt: "2024-01-15",
      level: "S2",
      type: "quiz",
      studentName: currentUser?.name || "Student",
      description:
        "This certificate is awarded for demonstrating exceptional understanding and mastery of mathematical concepts at the S2 level.",
      skills: ["Algebra", "Geometry", "Problem Solving", "Mathematical Reasoning"],
    }

    setCertificate(mockCertificate)
  }, [params.id])

  const downloadCertificate = () => {
    console.log("[v0] Downloading certificate PDF")
    alert("Certificate PDF downloaded successfully!")
  }

  if (!certificate || !user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading certificate...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Certificate Display */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gradient-to-r from-blue-500/50 to-purple-500/50 shadow-2xl">
          <CardContent className="p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
                  <Award className="w-12 h-12 text-blue-400" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Certificate of Achievement</h1>
              <p className="text-gray-400">Qouta Learning Platform</p>
            </div>

            {/* Certificate Content */}
            <div className="text-center mb-8">
              <p className="text-gray-300 text-lg mb-4">This is to certify that</p>
              <h2 className="text-3xl font-bold text-white mb-4">{certificate.studentName}</h2>
              <p className="text-gray-300 text-lg mb-2">has successfully completed</p>
              <h3 className="text-2xl font-semibold text-blue-400 mb-6">{certificate.title}</h3>

              <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
                <p className="text-gray-300 mb-4">{certificate.description}</p>

                {/* Score Display */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">{certificate.score}%</span>
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2">Skills Demonstrated:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {certificate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <BookOpen className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Course</p>
                  <p className="text-white font-semibold">{certificate.course}</p>
                </div>
                <div className="text-center">
                  <Calendar className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Level</p>
                  <p className="text-white font-semibold">{certificate.level}</p>
                </div>
                <div className="text-center">
                  <Calendar className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-white font-semibold">{new Date(certificate.completedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Signature Area */}
              <div className="border-t border-gray-700 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="h-16 border-b border-gray-600 mb-2"></div>
                    <p className="text-gray-400 text-sm">Platform Director</p>
                    <p className="text-white font-semibold">Qouta Learning</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 border-b border-gray-600 mb-2"></div>
                    <p className="text-gray-400 text-sm">Date Issued</p>
                    <p className="text-white font-semibold">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="text-center">
              <Button
                onClick={downloadCertificate}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-3 text-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF Certificate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
