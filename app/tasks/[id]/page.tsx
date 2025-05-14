"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/status-badge"
import { getTaskById, getProjectById, getUserById, getCommentsByTask, addComment } from "@/lib/data"
import { useNotification } from "@/components/notification-toast"
import { CalendarDays, Clock, ArrowUpRight, MessageSquare, Send } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function TaskDetailsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string
  const { showNotification } = useNotification()

  const [task, setTask] = useState(null)
  const [project, setProject] = useState(null)
  const [assignedUser, setAssignedUser] = useState(null)
  const [createdByUser, setCreatedByUser] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const taskData = getTaskById(taskId)
    if (taskData) {
      setTask(taskData)

      const projectData = getProjectById(taskData.projectId)
      if (projectData) {
        setProject(projectData)
      }

      if (taskData.assignedTo) {
        setAssignedUser(getUserById(taskData.assignedTo))
      }

      setCreatedByUser(getUserById(taskData.createdBy))
      setComments(getCommentsByTask(taskId))
    }
  }, [taskId])

  if (!user) {
    return <div>Access denied. Please log in.</div>
  }

  if (!task) {
    return <div>Task not found</div>
  }

  // Team members can only view approved tasks or tasks they created
  if (user.role === "team_member" && task.status !== "approved" && task.createdBy !== user.id) {
    return <div>Access denied. You can only view approved tasks or tasks you created.</div>
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!newComment.trim()) {
        showNotification({
          title: "Error",
          description: "Comment cannot be empty",
          type: "error",
        })
        setIsSubmitting(false)
        return
      }

      const comment = addComment({
        taskId,
        userId: user.id,
        content: newComment,
      })

      setComments([...comments, comment])
      setNewComment("")

      showNotification({
        title: "Success",
        description: "Comment added successfully",
        type: "success",
      })
    } catch (error) {
      showNotification({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusForDisplay = () => {
    if (task.status === "approved") {
      if (task.progress === 100) return "completed"
      if (task.progress > 0) return "inprogress"
      return "approved"
    }
    return task.status
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={getStatusForDisplay()} />
            <span className="text-muted-foreground">
              in{" "}
              <Link href={`/projects/${project?.id}`} className="hover:underline">
                {project?.name}
              </Link>
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {task.status === "approved" && (user.role === "manager" || task.assignedTo === user.id) && (
            <Link href={`/tasks/${taskId}/update`}>
              <Button>Update Progress</Button>
            </Link>
          )}
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{task.description || "No description provided."}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Progress</CardTitle>
              <span className="font-medium">{task.progress}%</span>
            </CardHeader>
            <CardContent>
              <Progress value={task.progress} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Not Started</span>
                <span>In Progress</span>
                <span>Completed</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>Discussion about this task</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => {
                    const commentUser = getUserById(comment.userId)
                    return (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{commentUser?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{commentUser?.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                          </div>
                          <p className="mt-1">{comment.content}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No comments yet</p>
              )}

              <form onSubmit={handleSubmitComment} className="mt-6">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={isSubmitting}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(task.createdAt), "MMM d, yyyy")}</p>
                </div>
              </div>

              {task.deadline && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Deadline</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(task.deadline), "MMM d, yyyy")}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Comments</p>
                  <p className="text-sm text-muted-foreground">{comments.length} comments</p>
                </div>
              </div>

              {task.priority && (
                <div>
                  <p className="text-sm font-medium">Priority</p>
                  <div
                    className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    }`}
                  >
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>People</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Created by</p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{createdByUser?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{createdByUser?.name}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Assigned to</p>
                {assignedUser ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{assignedUser?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{assignedUser?.name}</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">Not assigned</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/projects/${project?.id}`} className="w-full">
                <Button variant="outline" className="w-full flex items-center justify-between">
                  View Project
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>

              {user.role === "manager" && task.status === "pending" && (
                <>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Approve Task</Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    Reject Task
                  </Button>
                </>
              )}

              {user.role === "manager" && !task.assignedTo && <Button className="w-full">Assign Task</Button>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
