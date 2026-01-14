import { Award, Star } from "lucide-react"

export interface CertificateData {
  title: string
  course: string
  score: number
  completedAt: string
  level: string
  type: "quiz" | "course" | "achievement"
  studentName: string
  description?: string
  skills?: string[]
}

export function CertificateTemplateClassic({ data }: { data: CertificateData }) {
  return (
    <div className="p-10 bg-white text-gray-900 rounded-xl shadow-xl border-8 border-yellow-600">
      <div className="text-center mb-6">
        <Award className="w-12 h-12 mx-auto text-yellow-700" />
        <h1 className="text-3xl font-extrabold mt-2 tracking-wide">Certificate of Achievement</h1>
        <p className="text-sm text-gray-600">Qouta Learning Platform</p>
      </div>
      <p className="text-center text-gray-700 mb-1">This certifies that</p>
      <h2 className="text-2xl font-bold text-center mb-4">{data.studentName}</h2>
      <p className="text-center mb-6">has successfully completed</p>
      <h3 className="text-xl font-semibold text-center text-yellow-700 mb-4">{data.title}</h3>
      {data.description && <p className="text-center max-w-2xl mx-auto mb-6">{data.description}</p>}
      <div className="flex items-center justify-center gap-2 mb-6">
        <Star className="w-5 h-5 text-yellow-600" />
        <span className="text-xl font-bold">{data.score}%</span>
        <Star className="w-5 h-5 text-yellow-600" />
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs uppercase text-gray-500">Course</div>
          <div className="font-medium">{data.course}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-500">Level</div>
          <div className="font-medium">{data.level}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-500">Completed</div>
          <div className="font-medium">{new Date(data.completedAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  )
}

export function CertificateTemplateModern({ data }: { data: CertificateData }) {
  return (
    <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold">Certificate</h1>
        <p className="opacity-90">Qouta Learning</p>
      </div>
      <p className="text-center opacity-90">Awarded to</p>
      <h2 className="text-2xl font-bold text-center mb-2">{data.studentName}</h2>
      <p className="text-center">for completing</p>
      <h3 className="text-xl font-semibold text-center mb-4">{data.title}</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs uppercase opacity-80">Course</div>
          <div className="font-semibold">{data.course}</div>
        </div>
        <div>
          <div className="text-xs uppercase opacity-80">Score</div>
          <div className="font-semibold">{data.score}%</div>
        </div>
        <div>
          <div className="text-xs uppercase opacity-80">Date</div>
          <div className="font-semibold">{new Date(data.completedAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  )
}

export function CertificateTemplateMinimal({ data }: { data: CertificateData }) {
  return (
    <div className="p-10 rounded-xl border border-gray-300 bg-white text-gray-900">
      <h1 className="text-2xl font-bold mb-6">Certificate</h1>
      <div className="space-y-2">
        <div className="text-sm text-gray-600">Recipient</div>
        <div className="text-xl font-semibold">{data.studentName}</div>
      </div>
      <div className="mt-6 space-y-1">
        <div className="text-sm text-gray-600">Title</div>
        <div className="font-medium">{data.title}</div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-gray-600">Course</div>
          <div className="font-medium">{data.course}</div>
        </div>
        <div>
          <div className="text-gray-600">Level</div>
          <div className="font-medium">{data.level}</div>
        </div>
        <div>
          <div className="text-gray-600">Completed</div>
          <div className="font-medium">{new Date(data.completedAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  )
}
