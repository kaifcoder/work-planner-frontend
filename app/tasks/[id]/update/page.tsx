"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getTaskById, getProjectById, updateTaskProgress, addComment } from "@/lib/data"
import { useNotification } from "@/components/notification-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function UpdateTaskPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string
  const { showNotification } = useNotification()

  const [task, setTask] = useState(null)
  const [project, setProject] = useState(null)
  const [progress, setProgress] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  useEffect(() => {
    const taskData = getTaskById(taskId)
    if (taskData) {
      setTask(taskData)
      setProgress(taskData.progress)

      const projectData = getProjectById(taskData.projectId)
      if (projectData) {
        setProject(projectData)
      }
    }
  }, [taskId])

  if (!user) {
    return <div>Access denied. Please log in.</div>
  }

  if (!task) {
    return <div>Task not found</div>
  }

  // Team members can only update their assigned tasks
  if (user.role === "team_member" && task.assignedTo !== user.id) {
    return <div>Access denied. You can only update tasks assigned to you.</div>
  }

  // Tasks must be approved to be updated
  if (task.status !== "approved") {
    return <div>This task cannot be updated because it has not been approved yet.</div>
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Update task progress
      updateTaskProgress(taskId, progress)

      // Add comment if provided
      if (comment.trim()) {
        addComment({
          taskId,
          userId: user.id,
          content: comment,
        })
      }

      setShowSuccessDialog(true)
    } catch (error) {
      showNotification({
        title: "Error",
        description: "Failed to update task progress. Please try again.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewTask = () => {
    router.push(`/tasks/${taskId}`)
  }

  const handleViewAllTasks = () => {
    router.push("/tasks")
  }

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Update Task Progress</h1>
        <p className="text-muted-foreground">
          Update progress for task: <span className="font-medium">{task.title}</span>
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Task Progress</CardTitle>
            <CardDescription>
              Project: {project?.name} | Current Progress: {task.progress}%
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label htmlFor="progress">Progress ({progress}%)</Label>
                <span className="text-sm text-muted-foreground">
                  {progress === 0 ? "Not Started" : progress === 100 ? "Completed" : "In Progress"}
                </span>
              </div>
              <Slider
                id="progress"
                value={[progress]}
                onValueChange={(values) => setProgress(values[0])}
                max={100}
                step={5}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Add a Comment (Optional)</Label>
              <Textarea
                id="comment"
                placeholder="Add details about your progress..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Progress"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Progress Updated Successfully!</DialogTitle>
            <DialogDescription>
              {progress === 100
                ? "Congratulations! You've marked this task as completed."
                : `The task progress has been updated to ${progress}%.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleViewAllTasks}>
              View All Tasks
            </Button>
            <Button onClick={handleViewTask}>View Task Details</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
