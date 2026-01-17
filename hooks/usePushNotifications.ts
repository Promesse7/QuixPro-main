"use client"

import { useEffect, useState } from "react"

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    const supported = "serviceWorker" in navigator && "Notification" in window
    setIsSupported(supported)

    if (supported && Notification.permission === "granted") {
      setIsSubscribed(true)
    }
  }, [])

  const requestPermission = async () => {
    if (!isSupported) return false

    try {
      const permission = await Notification.requestPermission()
      const granted = permission === "granted"
      setIsSubscribed(granted)
      return granted
    } catch (error) {
      console.error("Failed to request notification permission:", error)
      return false
    }
  }

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!isSupported || !isSubscribed) return

    if (Notification.permission === "granted") {
      new Notification(title, {
        icon: "/icon-192x192.png",
        badge: "/badge-72x72.png",
        ...options,
      })
    }
  }

  return {
    isSupported,
    isSubscribed,
    requestPermission,
    sendNotification,
  }
}
