"use client"

import type React from "react"
import { useState, createContext, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { ConversationListPanel } from "@/components/chat/ConversationListPanel"
import { ChatContextPanel } from "@/components/chat/ChatContextPanel"

// Chat context for managing active chat state
interface ChatContextType {
  activeChatId: string | null
  activeChatType: "direct" | "group" | null
  setActiveChat: (id: string | null, type: "direct" | "group" | null) => void
  isRightPanelOpen: boolean
  setRightPanelOpen: (open: boolean) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChatContext must be used within ChatLayoutProvider")
  }
  return context
}

interface ChatLayoutProviderProps {
  children: React.ReactNode
}

export function ChatLayoutProvider({ children }: ChatLayoutProviderProps) {
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [activeChatType, setActiveChatType] = useState<"direct" | "group" | null>(null)
  const [isRightPanelOpen, setRightPanelOpen] = useState(true)

  const setActiveChat = (id: string | null, type: "direct" | "group" | null) => {
    setActiveChatId(id)
    setActiveChatType(type)
  }

  return (
    <ChatContext.Provider
      value={{
        activeChatId,
        activeChatType,
        setActiveChat,
        isRightPanelOpen,
        setRightPanelOpen,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

interface ThreePanelChatLayoutProps {
  children: React.ReactNode
  className?: string
}

export function ThreePanelChatLayout({ children, className = "" }: ThreePanelChatLayoutProps) {
  const { activeChatId, setActiveChat, isRightPanelOpen, setRightPanelOpen } = useChatContext()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobileRightPanelOpen, setIsMobileRightPanelOpen] = useState(false)

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
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Mobile Right Panel Overlay */}
      {isMobileRightPanelOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileRightPanelOpen(false)} />
      )}

      {/* Left Panel - Conversations */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200",
          "transform transition-transform duration-300 ease-in-out lg:transform-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
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
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="shrink-0">
            <Menu className="h-5 w-5" />
          </Button>

          <h1 className="font-semibold text-lg truncate">Quix Chat Messages</h1>

          <Button variant="ghost" size="icon" onClick={toggleMobileRightPanel} className="shrink-0">
            {isMobileRightPanelOpen ? <X className="h-5 w-5" /> : <Info className="h-5 w-5" />}
          </Button>
        </header>

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </main>

      {/* Right Panel - Context/Tools */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 right-0 z-50 w-80 bg-white border-l border-gray-200",
          "transform transition-transform duration-300 ease-in-out",
          isMobileRightPanelOpen ? "translate-x-0" : "translate-x-full",
          "lg:translate-x-0",
          !isRightPanelOpen && "lg:hidden",
        )}
      >
        {/* Desktop close button */}
        <div className="hidden lg:flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Details</h2>
          <Button variant="ghost" size="icon" onClick={toggleDesktopRightPanel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ChatContextPanel isMobile={!isMobileRightPanelOpen} onCloseMobile={() => setIsMobileRightPanelOpen(false)} />
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

// Demo Component
export default function ChatDemo() {
  return (
    <ChatLayoutProvider>
      <ThreePanelChatLayout>
        <div className="h-full flex flex-col bg-white">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 shrink-0" />
              <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                <p className="text-sm">Hey! How's the project going?</p>
                <span className="text-xs text-gray-500 mt-1 block">10:30 AM</span>
              </div>
            </div>

            <div className="flex items-start gap-3 justify-end">
              <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[70%]">
                <p className="text-sm">Going great! Just finished the layout.</p>
                <span className="text-xs text-blue-100 mt-1 block">10:32 AM</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-500 shrink-0" />
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 shrink-0" />
              <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                <p className="text-sm">Awesome! Can you show me?</p>
                <span className="text-xs text-gray-500 mt-1 block">10:33 AM</span>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button className="shrink-0">Send</Button>
            </div>
          </div>
        </div>
      </ThreePanelChatLayout>
    </ChatLayoutProvider>
  )
}
