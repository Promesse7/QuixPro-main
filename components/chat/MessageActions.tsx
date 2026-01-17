"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2, Copy, Reply, Check } from "lucide-react"
import type { Message } from "@/models/Chat"

interface MessageActionsProps {
  message: Message
  isCurrentUser: boolean
  onEdit?: (messageId: string, content: string) => Promise<void>
  onDelete?: (messageId: string) => Promise<void>
  onReply?: (message: Message) => void
}

export function MessageActions({ message, isCurrentUser, onEdit, onDelete, onReply }: MessageActionsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = async () => {
    if (!onEdit) return
    setIsDeleting(true)
    try {
      await onEdit(message._id?.toString() || "", editContent)
      setIsEditing(false)
    } catch (error) {
      console.error("[v0] Edit error:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    setIsDeleting(true)
    try {
      await onDelete(message._id?.toString() || "")
    } catch (error) {
      console.error("[v0] Delete error:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
  }

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {onReply && (
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onReply(message)} title="Reply">
          <Reply className="h-3.5 w-3.5" />
        </Button>
      )}

      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={copyToClipboard} title="Copy">
        <Copy className="h-3.5 w-3.5" />
      </Button>

      {isCurrentUser && onEdit && (
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsEditing(!isEditing)} title="Edit">
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
      )}

      {isCurrentUser && onDelete && (
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}

      {isEditing && (
        <div className="absolute top-full mt-1 left-0 bg-background border border-border rounded p-2 w-64">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-20 p-2 border border-border rounded resize-none text-sm"
          />
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={handleEdit} disabled={isDeleting} className="flex-1">
              <Check className="h-3.5 w-3.5 mr-1" /> Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsEditing(false)
                setEditContent(message.content)
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
