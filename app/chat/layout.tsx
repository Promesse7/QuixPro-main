'use client'

import React from 'react'
import { ChatLayoutProvider, ThreePanelChatLayout } from '@/components/chat/ThreePanelChatLayout'

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const handleEmojiSelect = (emoji: string) => {
        // This will be passed down to the ChatWindow component
        console.log('Emoji selected in layout:', emoji);
    };

    return (
        <ChatLayoutProvider onEmojiSelect={handleEmojiSelect}>
            <ThreePanelChatLayout>{children}</ThreePanelChatLayout>
        </ChatLayoutProvider>
    )
}
