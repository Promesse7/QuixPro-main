'use client'

import React from 'react'
import { ChatLayoutProvider, ThreePanelChatLayout } from '@/components/chat/ThreePanelChatLayout'

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ChatLayoutProvider>
            <ThreePanelChatLayout>{children}</ThreePanelChatLayout>
        </ChatLayoutProvider>
    )
}
