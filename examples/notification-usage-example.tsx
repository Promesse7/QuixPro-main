// Example of how to trigger notifications from different parts of the app
'use client'

import { createNotification } from '@/services/notificationService'

// Example: Trigger a notification when a quiz is completed
export async function triggerQuizCompletionNotification(userId: string, quizId: string, score: number) {
  try {
    await createNotification({
      userId,
      type: 'quiz',
      event: 'quiz_completed',
      title: 'Quiz Completed! 🎉',
      message: `You scored ${score}% on your recent quiz. Great job!`,
      entityType: 'quiz',
      entityId: quizId,
      priority: score >= 70 ? 'high' : 'normal',
      metadata: {
        score,
        passed: score >= 70
      }
    })
  } catch (error) {
    console.error('Failed to create quiz notification:', error)
  }
}

// Example: Trigger a notification for certificate earned
export async function triggerCertificateNotification(userId: string, certificateId: string, quizTitle: string) {
  try {
    await createNotification({
      userId,
      type: 'quiz',
      event: 'certificate_earned',
      title: 'Certificate Earned! 🏆',
      message: `Congratulations! You earned a certificate for completing ${quizTitle}`,
      entityType: 'certificate',
      entityId: certificateId,
      priority: 'high',
      metadata: {
        quizTitle,
        certificateId
      }
    })
  } catch (error) {
    console.error('Failed to create certificate notification:', error)
  }
}

// Example: Trigger a notification for new chat message
export async function triggerChatNotification(userId: string, messageId: string, senderName: string) {
  try {
    await createNotification({
      userId,
      type: 'chat',
      event: 'new_message',
      title: 'New Message 💬',
      message: `${senderName} sent you a message`,
      entityType: 'message',
      entityId: messageId,
      priority: 'normal'
    })
  } catch (error) {
    console.error('Failed to create chat notification:', error)
  }
}

// Example: Trigger a notification for group update
export async function triggerGroupNotification(userId: string, groupId: string, groupName: string, updateType: string) {
  try {
    await createNotification({
      userId,
      type: 'group',
      event: 'group_update',
      title: 'Group Update 👥',
      message: `${groupName} has a new ${updateType}`,
      entityType: 'group',
      entityId: groupId,
      priority: 'normal'
    })
  } catch (error) {
    console.error('Failed to create group notification:', error)
  }
}

// Example: System notification
export async function triggerSystemNotification(userId: string, message: string) {
  try {
    await createNotification({
      userId,
      type: 'system',
      event: 'system_announcement',
      title: 'System Update ⚙️',
      message,
      entityType: 'site',
      entityId: 'system',
      priority: 'normal'
    })
  } catch (error) {
    console.error('Failed to create system notification:', error)
  }
}
