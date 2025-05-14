"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { addTeamMember } from "@/lib/data"
import { useNotification } from "@/components/notification-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AddTeamMemberPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { showNotification } = useNotification()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [newMemberId, setNewMemberId] = useState<string | null>(null)

  if (!user || user.role !== "manager") {
    return <div>Access denied. Manager role required.</div>
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!name.trim() || !email.trim()) {
        showNotification({
          title: "Validation Error",
          description: "Name and email are required",
          type: "error",
        })
        setIsSubmitting(false)
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        showNotification({
          title: "Validation Error",
          description: "Please enter a valid email address",
          type: "error",
        })
        setIsSubmitting(false)
        return
      }

      // Add new team member
      const newMember = addTeamMember({
        name,
        email,
      })

      setNewMemberId(newMember.id)
      setShowSuccessDialog(true)

      // Reset form
      setName("")
      setEmail("")
    } catch (error) {
      showNotification({
        title: "Error",
        description: "Failed to add team member. Please try again.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewTeam = () => {
    router.push("/team")
  }

  const handleAddAnother = () => {
    setShowSuccessDialog(false)
    setNewMemberId(null)
  }

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Team Member</h1>
        <p className="text-muted-foreground">Add a new member to your team</p>
      </div>

      <Card className="max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Team Member Details</CardTitle>
            <CardDescription>Enter the details for the new team member</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Team Member"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Team Member Added Successfully!</DialogTitle>
            <DialogDescription>
              The new team member has been added to your team. What would you like to do next?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleAddAnother}>
              Add Another Member
            </Button>
            <Button onClick={handleViewTeam}>View Team</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
