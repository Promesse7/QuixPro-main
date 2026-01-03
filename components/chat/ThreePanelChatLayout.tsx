"use client"

import React, { useState, createContext, useContext } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConversationListPanel } from '@/components/chat/ConversationListPanel'
import { ChatContextPanel } from '@/components/chat/ChatContextPanel'
import { EmojiButton } from './EmojiPicker'

// Chat context for managing active chat state
interface ChatContextType {
  activeChatId: string | null
  activeChatType: 'direct' | 'group' | null
  setActiveChat: (id: string | null, type: 'direct' | 'group' | null) => void
  isRightPanelOpen: boolean
  setRightPanelOpen: (open: boolean) => void
  onEmojiSelect?: (emoji: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within ChatLayoutProvider')
  }
  return context
}

interface ChatLayoutProviderProps {
  children: React.ReactNode
  onEmojiSelect?: (emoji: string) => void
}

export function ChatLayoutProvider({ children, onEmojiSelect }: ChatLayoutProviderProps) {
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [activeChatType, setActiveChatType] = useState<'direct' | 'group' | null>(null)
  const [isRightPanelOpen, setRightPanelOpen] = useState(true)

  const setActiveChat = (id: string | null, type: 'direct' | 'group' | null) => {
    setActiveChatId(id)
    setActiveChatType(type)
  }

  return (
    <ChatContext.Provider value={{
      activeChatId,
      activeChatType,
      setActiveChat,
      isRightPanelOpen,
      setRightPanelOpen,
      onEmojiSelect
    }}>
      {children}
    </ChatContext.Provider>
  )
}

interface ThreePanelChatLayoutProps {
  children: React.ReactNode
  className?: string
}

export function ThreePanelChatLayout({ children, className = "" }: ThreePanelChatLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobileRightPanelOpen, setIsMobileRightPanelOpen] = useState(false)
  const { activeChatId, setActiveChat, isRightPanelOpen, setRightPanelOpen, onEmojiSelect } = useChatContext()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
    if (isMobileRightPanelOpen) setIsMobileRightPanelOpen(false)
  }

  const toggleMobileRightPanel = () => {
    setIsMobileRightPanelOpen(!isMobileRightPanelOpen)
    if (isSidebarOpen) setIsSidebarOpen(false)
  }

  const toggleDesktopRightPanel = () => {
    setRightPanelOpen(!isRightPanelOpen)
  }

  return (
    <div className={cn("flex h-screen w-full bg-gray-50")}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Right Panel Overlay */}
      {isMobileRightPanelOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileRightPanelOpen(false)}
        />
      )}

      {/* Left Panel - Conversations */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-lg border-gray-200",
          "transform transition-transform duration-300 ease-in-out lg:transform-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <ConversationListPanel
          activeId={activeChatId || undefined}
          isMobile={!isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />
      </aside>

      {/* Middle Panel - Chat Conversation */}
      <main className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Mobile/Tablet Header */}
        <header className="flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-gray-200 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <h1 className="font-semibold text-lg truncate">Quix Chat Messages</h1>

          <div className="flex items-center gap-1">
            {onEmojiSelect && (
              <EmojiButton onEmojiSelect={onEmojiSelect} />
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileRightPanel}
              className="shrink-0"
            >
              {isMobileRightPanelOpen ? <X className="h-5 w-5" /> : <Info className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>


      {/* Right Panel - Context/Tools */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 right-0 z-50 w-80 bg-white border-lg border-gray-200",
          "transform transition-transform duration-300 ease-in-out",
          isMobileRightPanelOpen ? "translate-x-0" : "translate-x-full",
          "lg:translate-x-0",
          !isRightPanelOpen && "lg:hidden"
        )}
      >
          <ChatContextPanel
          isMobile={!isMobileRightPanelOpen}
          onCloseMobile={() => setIsMobileRightPanelOpen(false)}
        />
      </aside>

      {/* Desktop Right Panel Toggle (when closed) */}
      {!isRightPanelOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDesktopRightPanel}
          className="hidden lg:flex fixed right-4 top-4 z-30"
        >
          <Info className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}

