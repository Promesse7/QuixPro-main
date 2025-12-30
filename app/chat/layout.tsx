'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { ConversationListPanel } from '@/components/chat/ConversationListPanel'
import { Sheet, SheetContent } from '@/components/ui/sheet'

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen bg-background overflow-hidden relative">
            {/* Unified Sidebar - Desktop */}
            <aside className="hidden md:flex w-80 lg:w-96 h-full border-r border-border flex-shrink-0">
                <ConversationListPanel className="w-full" />
            </aside>

            {/* Mobile Sidebar - Using Sheet for consistency */}
            <div className="md:hidden">
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetContent side="left" className="p-0 w-[85%] sm:w-80 border-r border-border shadow-2xl">
                        <ConversationListPanel
                            isMobile={true}
                            onCloseMobile={() => setIsSidebarOpen(false)}
                            className="border-none"
                        />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 h-full w-full relative overflow-hidden flex flex-col min-w-0">
                {/* Mobile Header Trigger - Only visible when NO conversation is active or on specific sub-pages */}
                <div className="md:hidden p-4 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="hover:bg-muted font-bold">
                            <Menu className="w-6 h-6 text-foreground" />
                        </Button>
                        <span className="font-bold text-lg tracking-tight">Quix Chat</span>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative flex flex-col">
                    {children}
                </div>
            </main>
        </div>
    )
}
