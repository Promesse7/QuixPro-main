import { Db, ObjectId } from 'mongodb'
import { NotificationService, INotification, NotificationType, NotificationEvent, categorizeNotification } from '@/models/Notification'
import { notificationFirebase } from '@/lib/notificationFirebase'

// Notification creation service - handles event-driven notification creation
export class NotificationCreatorService {
  private notificationService: NotificationService
  private db: Db

  constructor(db: Db) {
    this.db = db
    this.notificationService = new NotificationService(db)
  }

  // Create notification for new chat message
  async createNewMessageNotification(
    senderId: string,
    recipientId: string,
    messageId: string,
    messageContent: string,
    senderName: string,
    isGroupMessage = false,
    groupName?: string
  ): Promise<void> {
    const title = isGroupMessage ? `New message in ${groupName}` : `New message from ${senderName}`
    const message = messageContent.length > 50 
      ? `${messageContent.substring(0, 50)}...` 
      : messageContent

    const notification = await this.notificationService.create({
      userId: recipientId,
      type: 'chat',
      event: 'new_message',
      title,
      message,
      entityType: 'message',
      entityId: messageId,
      isRead: false,
      priority: 'normal',
      metadata: {
        senderId,
        senderName,
        isGroupMessage,
        groupName,
        fullMessage: messageContent
      }
    })

    // Update Firebase badge count
    await notificationFirebase.incrementCategoryCount(recipientId, 'chat')
  }

  // Create notification for message mention
  async createMessageMentionNotification(
    senderId: string,
    mentionedUserId: string,
    messageId: string,
    messageContent: string,
    senderName: string,
    groupName?: string
  ): Promise<void> {
    const title = `${senderName} mentioned you`
    const message = messageContent.length > 50 
      ? `${messageContent.substring(0, 50)}...` 
      : messageContent

    const notification = await this.notificationService.create({
      userId: mentionedUserId,
      type: 'chat',
      event: 'message_mention',
      title,
      message,
      entityType: 'message',
      entityId: messageId,
      isRead: false,
      priority: 'high', // Mentions are higher priority
      metadata: {
        senderId,
        senderName,
        groupName,
        fullMessage: messageContent
      }
    })

    // Update Firebase badge count
    await notificationFirebase.incrementCategoryCount(mentionedUserId, 'chat')
  }

  // Create notification for quiz assignment
  async createQuizAssignedNotification(
    teacherId: string,
    studentIds: string[],
    quizId: string,
    quizTitle: string,
    dueDate?: Date
  ): Promise<void> {
    const notifications = studentIds.map(studentId => ({
      userId: studentId,
      type: 'quiz' as NotificationType,
      event: 'quiz_assigned' as NotificationEvent,
      title: 'New Quiz Assigned',
      message: `Quiz "${quizTitle}" has been assigned to you${dueDate ? ` - Due ${dueDate.toLocaleDateString()}` : ''}`,
      entityType: 'quiz' as const,
      entityId: quizId,
      isRead: false,
      priority: 'high',
      metadata: {
        teacherId,
        quizTitle,
        dueDate: dueDate?.toISOString()
      }
    }))

    // Create notifications in batch
    const createdNotifications = await Promise.all(
      notifications.map(notification => this.notificationService.create(notification))
    )

    // Update Firebase badge counts for all students
    await Promise.all(
      studentIds.map(studentId => notificationFirebase.incrementCategoryCount(studentId, 'academic'))
    )
  }

  // Create notification for quiz deadline approaching
  async createQuizDeadlineNotification(
    studentId: string,
    quizId: string,
    quizTitle: string,
    dueDate: Date,
    hoursUntilDeadline: number
  ): Promise<void> {
    const timeText = hoursUntilDeadline < 24 
      ? `${hoursUntilDeadline} hours` 
      : `${Math.floor(hoursUntilDeadline / 24)} days`

    const notification = await this.notificationService.create({
      userId: studentId,
      type: 'quiz',
      event: 'quiz_deadline_approaching',
      title: 'Quiz Deadline Approaching',
      message: `Quiz "${quizTitle}" is due in ${timeText}`,
      entityType: 'quiz',
      entityId: quizId,
      isRead: false,
      priority: hoursUntilDeadline < 24 ? 'high' : 'normal',
      metadata: {
        quizTitle,
        dueDate: dueDate.toISOString(),
        hoursUntilDeadline
      },
      expiresAt: dueDate // Expire after due date
    })

    // Update Firebase badge count
    await notificationFirebase.incrementCategoryCount(studentId, 'academic')
  }

  // Create notification for quiz results published
  async createQuizResultsNotification(
    studentId: string,
    quizId: string,
    quizTitle: string,
    score: number,
    totalScore: number,
    teacherId: string
  ): Promise<void> {
    const percentage = Math.round((score / totalScore) * 100)
    const title = percentage >= 80 ? 'Excellent Work!' : percentage >= 60 ? 'Quiz Results Available' : 'Quiz Results Available'
    
    const notification = await this.notificationService.create({
      userId: studentId,
      type: 'quiz',
      event: 'quiz_results_published',
      title,
      message: `You scored ${score}/${totalScore} (${percentage}%) on "${quizTitle}"`,
      entityType: 'quiz',
      entityId: quizId,
      isRead: false,
      priority: 'normal',
      metadata: {
        quizTitle,
        score,
        totalScore,
        percentage,
        teacherId
      }
    })

    // Update Firebase badge count
    await notificationFirebase.incrementCategoryCount(studentId, 'academic')
  }

  // Create notification for certificate earned
  async createCertificateNotification(
    userId: string,
    certificateId: string,
    courseName: string,
    certificateTitle: string
  ): Promise<void> {
    const notification = await this.notificationService.create({
      userId,
      type: 'quiz',
      event: 'certificate_earned',
      title: '🎉 Certificate Earned!',
      message: `Congratulations! You earned a certificate for completing ${courseName}`,
      entityType: 'certificate',
      entityId: certificateId,
      isRead: false,
      priority: 'high',
      metadata: {
        courseName,
        certificateTitle
      }
    })

    // Update Firebase badge count
    await notificationFirebase.incrementCategoryCount(userId, 'academic')
  }

  // Create notification for group invite
  async createGroupInviteNotification(
    inviterId: string,
    invitedUserId: string,
    groupId: string,
    groupName: string,
    inviterName: string
  ): Promise<void> {
    const notification = await this.notificationService.create({
      userId: invitedUserId,
      type: 'group',
      event: 'group_invite',
      title: 'Group Invitation',
      message: `${inviterName} invited you to join "${groupName}"`,
      entityType: 'group',
      entityId: groupId,
      isRead: false,
      priority: 'normal',
      metadata: {
        inviterId,
        inviterName,
        groupName
      }
    })

    // Update Firebase badge count
    await notificationFirebase.incrementCategoryCount(invitedUserId, 'social')
  }

  // Create notification for new member joined
  async createMemberJoinedNotification(
    memberIds: string[],
    newMemberId: string,
    groupId: string,
    groupName: string,
    newMemberName: string
  ): Promise<void> {
    const notifications = memberIds.map(memberId => ({
      userId: memberId,
      type: 'group' as NotificationType,
      event: 'member_joined' as NotificationEvent,
      title: 'New Group Member',
      message: `${newMemberName} joined "${groupName}"`,
      entityType: 'group' as const,
      entityId: groupId,
      isRead: false,
      priority: 'low',
      metadata: {
        newMemberId,
        newMemberName,
        groupName
      }
    }))

    // Create notifications in batch
    await Promise.all(
      notifications.map(notification => this.notificationService.create(notification))
    )

    // Update Firebase badge counts
    await Promise.all(
      memberIds.map(memberId => notificationFirebase.incrementCategoryCount(memberId, 'social'))
    )
  }

  // Create notification for Quix Sites question answered
  async createQuestionAnsweredNotification(
    questionAuthorId: string,
    answererId: string,
    questionId: string,
    questionTitle: string,
    answererName: string
  ): Promise<void> {
    const notification = await this.notificationService.create({
      userId: questionAuthorId,
      type: 'site',
      event: 'question_answered',
      title: 'Question Answered',
      message: `${answererName} answered your question "${questionTitle}"`,
      entityType: 'post',
      entityId: questionId,
      isRead: false,
      priority: 'normal',
      metadata: {
        answererId,
        answererName,
        questionTitle
      }
    })

    // Update Firebase badge count
    await notificationFirebase.incrementCategoryCount(questionAuthorId, 'academic')
  }

  // Create notification for answer accepted
  async createAnswerAcceptedNotification(
    answererId: string,
    questionId: string,
    questionTitle: string,
    accepterName: string
  ): Promise<void> {
    const notification = await this.notificationService.create({
      userId: answererId,
      type: 'site',
      event: 'answer_accepted',
      title: '✅ Answer Accepted',
      message: `${accepterName} accepted your answer to "${questionTitle}"`,
      entityType: 'post',
      entityId: questionId,
      isRead: false,
      priority: 'high',
      metadata: {
        questionTitle,
        accepterName
      }
    })

    // Update Firebase badge count
    await notificationFirebase.incrementCategoryCount(answererId, 'academic')
  }

  // Mark notification as read and update Firebase count
  async markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
    const notification = await this.notificationService.findById(notificationId)
    
    if (!notification || notification.userId !== userId || notification.isRead) {
      return
    }

    // Mark as read in MongoDB
    await this.notificationService.markSingleAsRead(notificationId)

    // Decrement Firebase count
    const category = categorizeNotification(notification.type)
    await notificationFirebase.decrementCategoryCount(userId, category)
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<void> {
    // Get unread notifications to determine categories
    const unreadNotifications = await this.notificationService.findUnreadByUser(userId, 100)
    
    if (unreadNotifications.length === 0) {
      return
    }

    // Group by category
    const categoryCounts = unreadNotifications.reduce((acc, notification) => {
      const category = categorizeNotification(notification.type)
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Mark all as read in MongoDB
    await this.notificationService.markAsRead(userId)

    // Update Firebase counts
    await Promise.all(
      Object.entries(categoryCounts).map(([category, count]) => 
        notificationFirebase.updateBadgeCount(userId, { 
          [category]: -count,
          total: -count
        })
      )
    )
  }

  // Sync badge counts from MongoDB (for initial load or recovery)
  async syncBadgeCounts(userId: string): Promise<void> {
    const counts = {
      chat: await this.notificationService.getUnreadCount(userId, 'chat'),
      academic: await this.notificationService.getUnreadCount(userId, 'quiz') + 
                await this.notificationService.getUnreadCount(userId, 'site'),
      social: await this.notificationService.getUnreadCount(userId, 'group'),
      system: await this.notificationService.getUnreadCount(userId, 'system')
    }

    counts.total = counts.chat + counts.academic + counts.social + counts.system

    await notificationFirebase.setBadgeCount(userId, counts)
  }
}

// Factory function to create service instance
export function createNotificationService(db: Db): NotificationCreatorService {
  return new NotificationCreatorService(db)
}
