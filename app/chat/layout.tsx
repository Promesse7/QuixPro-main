'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { ConversationListPanel } from '@/components/chat/ConversationListPanel'

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Unified Sidebar */}
            <div className={`
                ${isSidebarOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden'} 
                md:flex md:relative w-80 h-full
            `}>
                <ConversationListPanel
                    isMobile={!isSidebarOpen}
                    onCloseMobile={() => setIsSidebarOpen(false)}
                />
            </div>

            {/* Main Content */}
            <main className="flex-1 h-full w-full relative overflow-hidden flex flex-col">
                {/* Mobile Header Trigger */}
                <div className="md:hidden p-4 border-b border-border bg-background/80 backdrop-blur-md flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                        <Menu className="w-5 h-5" />
                    </Button>
                    <span className="font-semibold">Chat</span>
                </div>

                <div className="flex-1 overflow-y-auto relative">
                    {children}
                </div>
            </main>
        </div>
    )
}
