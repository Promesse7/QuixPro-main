// Emoji utility functions for the chat system

// Frequently used emojis for quick access
export const FREQUENT_EMOJIS = [
  '😀', '😂', '😍', '🥰', '😊', '🤔', '😎', '🥺', '😭', '😅',
  '👍', '👎', '❤️', '💔', '🔥', '✨', '🎉', '👏', '🙏', '💯',
  '😘', '😁', '😆', '😉', '😌', '😇', '🤗', '🤩', '🥳', '😋',
  '😛', '😜', '🤪', '😝', '🤑', '🤭', '🤫', '🤔', '🤐', '🤨',
  '😐', '😑', '😶', '😏', '🙄', '😬', '🤥', '😔', '😪', '😴'
]

// Emoji to text mapping for accessibility
export const EMOJI_DESCRIPTIONS: Record<string, string> = {
  '😀': 'grinning face',
  '😂': 'face with tears of joy',
  '😍': 'smiling face with heart-eyes',
  '🥰': 'smiling face with hearts',
  '😊': 'smiling face with smiling eyes',
  '🤔': 'thinking face',
  '😎': 'smiling face with sunglasses',
  '🥺': 'pleading face',
  '😭': 'loudly crying face',
  '😅': 'grinning face with sweat',
  '👍': 'thumbs up',
  '👎': 'thumbs down',
  '❤️': 'red heart',
  '💔': 'broken heart',
  '🔥': 'fire',
  '✨': 'sparkles',
  '🎉': 'party popper',
  '👏': 'clapping hands',
  '🙏': 'folded hands',
  '💯': 'hundred points'
}

// Check if a character is an emoji
export function isEmoji(char: string): boolean {
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u
  return emojiRegex.test(char)
}

// Count emojis in a text
export function countEmojis(text: string): number {
  return Array.from(text).filter(char => isEmoji(char)).length
}

// Extract all emojis from text
export function extractEmojis(text: string): string[] {
  return Array.from(text).filter(char => isEmoji(char))
}

// Check if text contains only emojis (no other characters)
export function isEmojiOnly(text: string): boolean {
  const trimmed = text.trim()
  return trimmed.length > 0 && Array.from(trimmed).every(char => isEmoji(char))
}

// Get emoji size based on message content
export function getEmojiSize(text: string): string {
  const emojiCount = countEmojis(text)
  const textLength = text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').length
  
  if (isEmojiOnly(text)) {
    if (emojiCount === 1) return 'text-6xl'
    if (emojiCount <= 3) return 'text-4xl'
    if (emojiCount <= 6) return 'text-3xl'
    return 'text-2xl'
  }
  
  if (emojiCount > 0 && textLength === 0) return 'text-2xl'
  return 'text-sm'
}

// Convert emoji shortcuts to actual emojis
export function convertEmojiShortcuts(text: string): string {
  const shortcuts: Record<string, string> = {
    ':)': '😊',
    ':-)': '😊',
    ':(': '😢',
    ':-(': '😢',
    ':D': '😃',
    ':-D': '😃',
    ':P': '😛',
    ':-P': '😛',
    ';)': '😉',
    ';-)': '😉',
    ':o': '😮',
    ':-o': '😮',
    ':O': '😮',
    ':-O': '😮',
    'xD': '😆',
    'XD': '😆',
    ':|': '😐',
    ':-|': '😐',
    ':/': '😕',
    ':-/': '😕',
    ':*': '😘',
    ':-*:': '😘',
    '<3': '❤️',
    '</3': '💔',
    ':fire:': '🔥',
    ':star:': '⭐',
    ':check:': '✅',
    ':x:': '❌',
    ':100:': '💯',
    ':ok:': '👌',
    ':thumbsup:': '👍',
    ':thumbsdown:': '👎',
    ':pray:': '🙏',
    ':clap:': '👏',
    ':party:': '🎉',
    ':sparkles:': '✨'
  }
  
  let result = text
  Object.entries(shortcuts).forEach(([shortcut, emoji]) => {
    result = result.replace(new RegExp(escapeRegex(shortcut), 'g'), emoji)
  })
  
  return result
}

// Helper function to escape regex special characters
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Get frequently used emojis from localStorage
export function getFrequentEmojis(): string[] {
  if (typeof window === 'undefined') return FREQUENT_EMOJIS
  
  try {
    const stored = localStorage.getItem('frequent-emojis')
    return stored ? JSON.parse(stored) : FREQUENT_EMOJIS
  } catch {
    return FREQUENT_EMOJIS
  }
}

// Update frequently used emojis
export function updateFrequentEmojis(emoji: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const frequent = getFrequentEmojis()
    const updated = [emoji, ...frequent.filter(e => e !== emoji)].slice(0, 20)
    localStorage.setItem('frequent-emojis', JSON.stringify(updated))
  } catch {
    // Silently fail if localStorage is not available
  }
}

// Get emoji description for accessibility
export function getEmojiDescription(emoji: string): string {
  return EMOJI_DESCRIPTIONS[emoji] || 'emoji'
}

// Format message with proper emoji rendering
export function formatMessageWithEmojis(content: string): {
  text: string
  hasEmojis: boolean
  emojiCount: number
  isEmojiOnly: boolean
  emojiSize: string
} {
  const processedContent = convertEmojiShortcuts(content)
  const emojiCount = countEmojis(processedContent)
  const hasEmojis = emojiCount > 0
  const isEmojiOnlyMessage = isEmojiOnly(processedContent)
  const emojiSize = getEmojiSize(processedContent)
  
  return {
    text: processedContent,
    hasEmojis,
    emojiCount,
    isEmojiOnly: isEmojiOnlyMessage,
    emojiSize
  }
}
