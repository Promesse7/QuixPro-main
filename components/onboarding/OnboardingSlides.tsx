"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { ArrowRight, MessageSquare, Users, Check, ChevronRight, X, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type OnboardingStep = 'welcome' | 'first_message' | 'discovery' | 'mission' | 'complete'

type Message = {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

type MissionStep = {
  id: string
  text: string
  completed: boolean
}

export function OnboardingSlides({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [missionSteps, setMissionSteps] = useState<MissionStep[]>([
    { id: '1', text: 'Send your first message', completed: false },
    { id: '2', text: 'React to a message', completed: false },
    { id: '3', text: 'Start a group chat', completed: false },
  ])
  const [showTooltip, setShowTooltip] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input when step changes
  useEffect(() => {
    if (currentStep === 'first_message' || currentStep === 'discovery') {
      setTimeout(() => inputRef.current?.focus(), 500)
    }
  }, [currentStep])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initial welcome message
  useEffect(() => {
    if (currentStep === 'welcome') {
      const timer = setTimeout(() => {
        setCurrentStep('first_message')
        addBotMessage("Hey there! I'm your Quix assistant. What brings you here today?")
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  const addBotMessage = (text: string, delay: number = 0) => {
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text,
        sender: 'bot',
        timestamp: new Date()
      }])
    }, delay)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user' as const,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setMessage('')

    // Update mission step 1 if not completed
    if (currentStep === 'first_message') {
      setMissionSteps(prev => 
        prev.map(step => 
          step.id === '1' ? { ...step, completed: true } : step
        )
      )
      
      // Show tooltip for reactions
      setShowTooltip('reactions')
      
      // Bot response
      setTimeout(() => {
        addBotMessage("Got it! You can react to messages with an emoji like this:")
        
        // Add a message with a reaction example
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: 'example-msg',
            text: "This is an example message with a reaction",
            sender: 'bot',
            timestamp: new Date()
          }])
          
          // After showing the example, move to discovery
          setTimeout(() => {
            setCurrentStep('discovery')
            addBotMessage("What will you mostly use Quix for?")
          }, 1000)
        }, 1000)
      }, 800)
    } 
    // Handle purpose selection
    else if (currentStep === 'discovery') {
      // Update mission step 2
      setMissionSteps(prev => 
        prev.map(step => 
          step.id === '2' ? { ...step, completed: true } : step
        )
      )
      
      // Move to mission
      setTimeout(() => {
        setCurrentStep('mission')
        addBotMessage("Perfect! Let's complete your quick setup mission:")
      }, 800)
    }
  }

  const completeMission = () => {
    setMissionSteps(prev => 
      prev.map(step => 
        step.id === '3' ? { ...step, completed: true } : step
      )
    )
    
    // Show completion UI
    setTimeout(() => {
      setCurrentStep('complete')
      addBotMessage("🎉 You're all set! Start exploring Quix and connect with others.")
      
      // Auto-complete after a moment
      setTimeout(() => {
        onComplete()
      }, 2000)
    }, 500)
  }

  const skipOnboarding = () => {
    onComplete()
  }

  // Format time as HH:MM
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="relative h-screen w-full bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">Q</span>
          </div>
          <span className="font-semibold">Quix</span>
        </div>
        
        <button 
          onClick={skipOnboarding}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Skip
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex max-w-[85%] md:max-w-[65%]",
                msg.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto'
              )}
            >
              <div 
                className={cn(
                  "rounded-2xl px-4 py-2 text-sm",
                  msg.sender === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-br-none' 
                    : 'bg-muted rounded-bl-none'
                )}
              >
                {msg.text}
                <div className="text-xs opacity-50 mt-1 text-right">
                  {formatTime(msg.timestamp)}
                </div>
                
                {msg.id === 'example-msg' && (
                  <div className="flex items-center gap-1 mt-1 text-xs">
                    <span className="opacity-50">👍</span>
                    <span className="opacity-50">1</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {showTooltip === 'reactions' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted p-3 rounded-lg text-sm max-w-[85%] md:max-w-[65%]"
            >
              Click the emoji button to add a reaction to any message
              <div className="w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-muted ml-4"></div>
            </motion.div>
          )}
          
          {currentStep === 'discovery' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mt-4"
            >
              {['School', 'Work', 'Friends', 'Personal'].map((purpose) => (
                <button
                  key={purpose}
                  onClick={() => {
                    setMessage(purpose)
                    const fakeEvent = { preventDefault: () => {} } as React.FormEvent
                    handleSendMessage(fakeEvent)
                  }}
                  className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm transition-colors"
                >
                  {purpose}
                </button>
              ))}
            </motion.div>
          )}
          
          {currentStep === 'mission' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted/50 p-4 rounded-lg mt-4 space-y-3 max-w-[85%] md:max-w-[65%]"
            >
              <h3 className="font-medium text-sm">Quick Setup Mission</h3>
              <div className="space-y-2">
                {missionSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-2">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-muted-foreground/10 text-muted-foreground'
                    )}>
                      {step.completed ? <Check size={12} /> : step.id}
                    </div>
                    <span className={cn(
                      "text-sm",
                      step.completed ? 'text-muted-foreground line-through' : ''
                    )}>
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
              
              {missionSteps.every(s => s.completed) ? (
                <Button 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={completeMission}
                >
                  Continue to Quix
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={() => {
                    // Auto-complete for demo purposes
                    missionSteps.forEach(step => {
                      if (!step.completed) {
                        setMissionSteps(prev => 
                          prev.map(s => 
                            s.id === step.id ? { ...s, completed: true } : s
                          )
                        )
                      }
                    })
                    completeMission()
                  }}
                >
                  Skip Setup
                </Button>
              )}
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {(currentStep === 'first_message' || currentStep === 'discovery') && (
          <motion.form 
            onSubmit={handleSendMessage}
            className="border-t border-border p-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full p-3 pr-12 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                disabled={!message.trim()}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.form>
        )}
      </main>
      
      {/* Completion Overlay */}
      <AnimatePresence>
        {currentStep === 'complete' && (
          <motion.div 
            className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center"
            >
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Welcome to Quix. Start connecting with others and make the most of your learning experience.
            </p>
            <Button onClick={onComplete}>
              Start Exploring
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
