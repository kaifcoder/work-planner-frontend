import { projects, tasks, users, notifications } from "./data"
import { sendTaskAssignmentEmail, sendTaskApprovalEmail, sendTaskRejectionEmail } from "./email"

// Helper function to generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Helper function to add a new project
export function addProject(projectData: {
  name: string
  description: string
  managerId: string
  priority?: "low" | "medium" | "high"
  deadline?: string
  status?: "active" | "completed" | "on-hold"
}) {
  const newProject = {
    id: generateId(),
    name: projectData.name,
    description: projectData.description,
    managerId: projectData.managerId,
    createdAt: new Date().toISOString(),
    priority: projectData.priority || "medium",
    deadline: projectData.deadline,
    status: projectData.status || "active",
  }

  projects.push(newProject)
  return newProject
}

// Helper function to add a new team member
export function addTeamMember(memberData: {
  name: string
  email: string
}) {
  const newMember = {
    id: generateId(),
    name: memberData.name,
    email: memberData.email,
    role: "team_member" as const,
  }

  users.push(newMember)
  return newMember
}

// Helper function to add a new task
export function addTask(taskData: {
  title: string
  description: string
  projectId: string
  assignedTo: string | null
  createdBy: string
  status: "pending" | "approved" | "rejected"
  priority?: "low" | "medium" | "high"
  deadline?: string
}) {
  const now = new Date().toISOString()

  const newTask = {
    id: generateId(),
    title: taskData.title,
    description: taskData.description,
    projectId: taskData.projectId,
    assignedTo: taskData.assignedTo,
    createdBy: taskData.createdBy,
    status: taskData.status,
    progress: 0,
    createdAt: now,
    updatedAt: now,
    priority: taskData.priority || "medium",
    deadline: taskData.deadline,
  }

  tasks.push(newTask)

  // If the task is assigned to someone, send an email notification
  if (newTask.assignedTo && newTask.status === "approved") {
    const assignedUser = users.find((user) => user.id === newTask.assignedTo)
    if (assignedUser) {
      sendTaskAssignmentEmail(newTask.id, newTask.title, assignedUser.email, assignedUser.name)

      // Add a notification
      addNotification({
        userId: newTask.assignedTo,
        message: `You have been assigned a new task: ${newTask.title}`,
      })
    }
  }

  return newTask
}

// Helper function to update task progress
export function updateTaskProgress(taskId: string, progress: number) {
  const task = tasks.find((task) => task.id === taskId)
  if (task) {
    task.progress = progress
    task.updatedAt = new Date().toISOString()

    // If task is completed, update status and send notification
    if (progress === 100) {
      task.status = "completed"

      // Notify the manager
      const project = projects.find((p) => p.id === task.projectId)
      if (project) {
        const manager = users.find((u) => u.id === project.managerId)
        const teamMember = users.find((u) => u.id === task.assignedTo)

        if (manager && teamMember) {
          addNotification({
            userId: manager.id,
            message: `Task "${task.title}" has been completed by ${teamMember.name}`,
          })
        }
      }
    }
  }
  return task
}

// Helper function to approve a task
export function approveTask(taskId: string) {
  const task = tasks.find((task) => task.id === taskId)
  if (task) {
    task.status = "approved"
    task.updatedAt = new Date().toISOString()

    // If the task is assigned to someone, send an email notification
    if (task.assignedTo) {
      const assignedUser = users.find((user) => user.id === task.assignedTo)
      if (assignedUser) {
        sendTaskApprovalEmail(task.id, task.title, assignedUser.email, assignedUser.name)

        // Add a notification
        addNotification({
          userId: task.assignedTo,
          message: `Your task "${task.title}" has been approved`,
        })
      }
    }
  }
  return task
}

// Helper function to reject a task
export function rejectTask(taskId: string, reason?: string) {
  const task = tasks.find((task) => task.id === taskId)
  if (task) {
    task.status = "rejected"
    task.updatedAt = new Date().toISOString()

    // Notify the creator
    const creator = users.find((user) => user.id === task.createdBy)
    if (creator) {
      sendTaskRejectionEmail(task.id, task.title, creator.email, creator.name, reason)

      // Add a notification
      addNotification({
        userId: task.createdBy,
        message: `Your task "${task.title}" has been rejected${reason ? `: ${reason}` : ""}`,
      })
    }
  }
  return task
}

// Helper function to assign a task to a team member
export function assignTask(taskId: string, userId: string) {
  const task = tasks.find((task) => task.id === taskId)
  if (task) {
    task.assignedTo = userId
    task.updatedAt = new Date().toISOString()

    // Send email notification
    const assignedUser = users.find((user) => user.id === userId)
    if (assignedUser) {
      sendTaskAssignmentEmail(task.id, task.title, assignedUser.email, assignedUser.name)

      // Add a notification
      addNotification({
        userId,
        message: `You have been assigned a new task: ${task.title}`,
      })
    }
  }
  return task
}

// Helper function to add a notification
export function addNotification(notificationData: {
  userId: string
  message: string
  read?: boolean
}) {
  const newNotification = {
    id: generateId(),
    userId: notificationData.userId,
    message: notificationData.message,
    read: notificationData.read || false,
    createdAt: new Date().toISOString(),
  }

  notifications.push(newNotification)
  return newNotification
}

// Helper function to add a comment to a task
export function addComment(commentData: {
  taskId: string
  userId: string
  content: string
}) {
  const newComment = {
    id: generateId(),
    taskId: commentData.taskId,
    userId: commentData.userId,
    content: commentData.content,
    createdAt: new Date().toISOString(),
  }

  // In a real app, this would be stored in a comments array or database
  // For this demo, we'll just return the comment
  return newComment
}

// Helper function to get comments for a task
export function getCommentsByTask(taskId: string) {
  // In a real app, this would fetch from a comments array or database
  // For this demo, we'll return an empty array or mock data
  return [
    {
      id: "comment1",
      taskId,
      userId: "1", // Manager
      content: "Please provide regular updates on this task.",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: "comment2",
      taskId,
      userId: "2", // Team member
      content: "I've started working on this. Will update progress soon.",
      createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    },
  ]
}

// Helper function to mark a notification as read
export function markNotificationAsRead(notificationId: string) {
  const notification = notifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.read = true
  }
  return notification
}

// Helper function to get tasks by date range
export function getTasksByDateRange(startDate: Date, endDate: Date) {
  return tasks.filter((task) => {
    const taskDate = new Date(task.createdAt)
    return taskDate >= startDate && taskDate <= endDate
  })
}

// Helper function to get tasks by priority
export function getTasksByPriority(priority: "low" | "medium" | "high") {
  return tasks.filter((task) => task.priority === priority)
}

// Helper function to get tasks by progress range
export function getTasksByProgressRange(minProgress: number, maxProgress: number) {
  return tasks.filter((task) => task.progress >= minProgress && task.progress <= maxProgress)
}
