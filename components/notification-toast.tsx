"use client"

import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle, Info } from "lucide-react"

type NotificationType = "success" | "error" | "info" | "warning"

interface NotificationProps {
  title: string
  description?: string
  type?: NotificationType
}

export function useNotification() {
  const { toast } = useToast()

  const showNotification = ({ title, description, type = "info" }: NotificationProps) => {
    const icons = {
      success: <CheckCircle className="h-5 w-5 text-green-500" />,
      error: <AlertCircle className="h-5 w-5 text-red-500" />,
      warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      info: <Info className="h-5 w-5 text-blue-500" />,
    }

    toast({
      title,
      description,
      variant: type === "error" ? "destructive" : "default",
      icon: icons[type],
    })
  }

  return { showNotification }
}
