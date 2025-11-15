'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { FileText, Image as ImageIcon, Video, Calculator, Eye, Save, Send, Wand2, Plus, Loader2 } from 'lucide-react'

type BlockType = 'text' | 'image' | 'video' | 'quiz'

interface ContentBlock {
  id: string
  type: BlockType
  content: any
  order: number
}

interface CourseDraft {
  title: string
  description: string
  grade_level: string
  subject: string
  blocks: ContentBlock[]
}

export default function QuixEditorPage() {
  const [course, setCourse] = useState<CourseDraft>({
    title: '',
    description: '',
    grade_level: '',
    subject: '',
    blocks: [],
  })

  const [aiTopic, setAiTopic] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState(false)

  const addBlock = (type: BlockType) => {
    const block: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      order: course.blocks.length,
      content:
        type === 'text'
          ? { text: 'Enter your text here...' }
          : type === 'image'
          ? { url: '', caption: 'Image caption' }
          : type === 'video'
          ? { url: '', title: 'Video title' }
          : { questions: [{ question: 'Sample question?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 }] },
    }
    setCourse((p) => ({ ...p, blocks: [...p.blocks, block] }))
  }

  const updateBlock = (id: string, content: any) => {
    setCourse((p) => ({
      ...p,
      blocks: p.blocks.map((b) => (b.id === id ? { ...b, content } : b)),
    }))
  }

  const removeBlock = (id: string) => {
    setCourse((p) => ({ ...p, blocks: p.blocks.filter((b) => b.id !== id) }))
  }

  const generateOutline = async () => {
    if (!aiTopic.trim()) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/ai/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          grade_level: course.grade_level || 'General',
          duration: '2 weeks',
          learning_objectives: ['Understand basics', 'Apply knowledge'],
        }),
      })
      const json = await res.json()
      if (json?.success && json?.data?.outline?.modules) {
        const blocks: ContentBlock[] = json.data.outline.modules.map((m: any, i: number) => ({
          id: `ai-${Date.now()}-${i}`,
          type: 'text',
          order: course.blocks.length + i,
          content: {
            text: `# ${m.title}\n\n**Duration:** ${m.duration}\n\n**Topics:** ${m.topics.join(', ')}`,
          },
        }))
        setCourse((p) => ({ ...p, blocks: [...p.blocks, ...blocks] }))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const saveDraft = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      })
      const json = await res.json()
      if (!json?.success) {
        alert('Failed to save draft (demo)')
      } else {
        alert('Draft saved (demo)')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b px-6 py-4 bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Quix Editor</h1>
            <p className="text-sm text-muted-foreground">AI-powered course creation (Demo)</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setPreview((p) => !p)} className="gap-2">
              <Eye className="h-4 w-4" /> {preview ? 'Edit' : 'Preview'}
            </Button>
            <Button variant="outline" onClick={saveDraft} disabled={isLoading} className="gap-2">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Draft
            </Button>
            <Button className="gap-2">
              <Send className="h-4 w-4" /> Publish (Demo)
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <aside className="w-80 border-r p-6 space-y-6 bg-card">
          <div className="space-y-4">
            <h2 className="text-sm font-medium">Course Settings</h2>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={course.description}
                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                className="mt-2 w-full h-24 rounded-md border px-3 py-2"
              />
            </div>
            <div>
              <Label htmlFor="grade">Grade Level</Label>
              <Input id="grade" value={course.grade_level} onChange={(e) => setCourse({ ...course, grade_level: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={course.subject} onChange={(e) => setCourse({ ...course, subject: e.target.value })} />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">AI Assistant</h3>
            <Input placeholder="Enter topic for outline" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} />
            <Button onClick={generateOutline} disabled={isLoading || !aiTopic.trim()} className="gap-2">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} Generate Outline
            </Button>
            <p className="text-xs text-muted-foreground">Demo mode: AI features are simulated. Real AI coming soon.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Add Blocks</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => addBlock('text')} className="gap-2">
                <FileText className="h-4 w-4" /> Text
              </Button>
              <Button variant="outline" onClick={() => addBlock('image')} className="gap-2">
                <ImageIcon className="h-4 w-4" /> Image
              </Button>
              <Button variant="outline" onClick={() => addBlock('video')} className="gap-2">
                <Video className="h-4 w-4" /> Video
              </Button>
              <Button variant="outline" onClick={() => addBlock('quiz')} className="gap-2">
                <Calculator className="h-4 w-4" /> Quiz
              </Button>
            </div>
          </div>

          <div className="rounded-md border p-3 text-xs">
            <p className="font-medium">Coming Soon</p>
            <ul className="mt-2 list-disc pl-4 space-y-1">
              <li>PDF/Doc upload with auto-structuring</li>
              <li>Real-time collaboration</li>
              <li>Advanced rich-text editor</li>
              <li>Publishing workflows and approvals</li>
            </ul>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          {course.blocks.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Start building your course</h3>
              <p className="mt-1 text-sm text-muted-foreground">Add blocks or generate an AI outline.</p>
              <Button onClick={() => addBlock('text')} className="mt-4 gap-2">
                <Plus className="h-4 w-4" /> Add First Block
              </Button>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {course.blocks.map((b) => (
                <Card key={b.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {b.type === 'text' && <FileText className="h-4 w-4" />}
                      {b.type === 'image' && <ImageIcon className="h-4 w-4" />}
                      {b.type === 'video' && <Video className="h-4 w-4" />}
                      {b.type === 'quiz' && <Calculator className="h-4 w-4" />}
                      <span className="capitalize">{b.type}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeBlock(b.id)}>
                      Remove
                    </Button>
                  </div>

                  {b.type === 'text' && (
                    preview ? (
                      <div dangerouslySetInnerHTML={{ __html: b.content.text.replace(/\n/g, '<br/>') }} />
                    ) : (
                      <textarea
                        value={b.content.text}
                        onChange={(e) => updateBlock(b.id, { ...b.content, text: e.target.value })}
                        className="w-full h-32 rounded-md border px-3 py-2"
                      />
                    )
                  )}

                  {b.type === 'image' && (
                    preview ? (
                      <div className="rounded-md border h-48 flex items-center justify-center text-muted-foreground">Image preview</div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Image URL"
                          value={b.content.url}
                          onChange={(e) => updateBlock(b.id, { ...b.content, url: e.target.value })}
                        />
                        <Input
                          placeholder="Caption"
                          value={b.content.caption}
                          onChange={(e) => updateBlock(b.id, { ...b.content, caption: e.target.value })}
                        />
                      </div>
                    )
                  )}

                  {b.type === 'video' && (
                    preview ? (
                      <div className="rounded-md border h-48 flex items-center justify-center text-muted-foreground">Video preview</div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Video URL"
                          value={b.content.url}
                          onChange={(e) => updateBlock(b.id, { ...b.content, url: e.target.value })}
                        />
                        <Input
                          placeholder="Title"
                          value={b.content.title}
                          onChange={(e) => updateBlock(b.id, { ...b.content, title: e.target.value })}
                        />
                      </div>
                    )
                  )}

                  {b.type === 'quiz' && (
                    <div className="space-y-3">
                      <div className="rounded-md border p-3 bg-muted/20">
                        <div className="text-sm font-medium">Quiz (Demo)</div>
                        <div className="text-xs text-muted-foreground">Generate questions via AI coming soon</div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      <div className="px-6 py-4 text-center text-xs text-muted-foreground">
        <span>Need help? Visit </span>
        <Link href="/explore" className="underline">Explore</Link>
        <span> to see examples.</span>
      </div>
    </div>
  )
}

