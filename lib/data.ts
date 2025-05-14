// Mock data for the application

export type User = {
  id: string
  name: string
  email: string
  role: "manager" | "team_member"
  avatar?: string
}

export type Project = {
  id: string
  name: string
  description: string
  managerId: string
  createdAt: string
  deadline?: string
  status?: "active" | "completed" | "on-hold"
  priority?: "low" | "medium" | "high"
}

export type Task = {
  id: string
  title: string
  description: string
  projectId: string
  assignedTo: string | null
  createdBy: string
  status: "pending" | "approved" | "rejected" | "completed"
  progress: number
  createdAt: string
  updatedAt: string
  deadline?: string
  priority?: "low" | "medium" | "high"
  comments?: Comment[]
}

export type Comment = {
  id: string
  taskId: string
  userId: string
  content: string
  createdAt: string
}

export type Notification = {
  id: string
  userId: string
  message: string
  read: boolean
  createdAt: string
  type?: "task_assigned" | "task_approved" | "task_rejected" | "task_completed" | "comment_added"
  relatedId?: string // ID of the related task, project, etc.
}

// Mock users
export const users: User[] = [
  {
    id: "1",
    name: "John Manager",
    email: "manager@example.com",
    role: "manager",
  },
  {
    id: "2",
    name: "Jane Team",
    email: "team@example.com",
    role: "team_member",
  },
  {
    id: "3",
    name: "Alice Developer",
    email: "alice@example.com",
    role: "team_member",
  },
  {
    id: "4",
    name: "Bob Designer",
    email: "bob@example.com",
    role: "team_member",
  },
]

// Mock projects
export const projects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Redesign the company website with a modern look and feel",
    managerId: "1",
    createdAt: "2023-01-15T10:00:00Z",
    deadline: "2023-06-30T23:59:59Z",
    status: "active",
    priority: "high",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Develop a mobile app for iOS and Android platforms",
    managerId: "1",
    createdAt: "2023-02-20T14:30:00Z",
    deadline: "2023-08-15T23:59:59Z",
    status: "active",
    priority: "medium",
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description: "Plan and execute a marketing campaign for Q2",
    managerId: "1",
    createdAt: "2023-03-10T09:15:00Z",
    deadline: "2023-07-01T23:59:59Z",
    status: "on-hold",
    priority: "low",
  },
]

// Mock tasks
export const tasks: Task[] = [
  {
    id: "1",
    title: "Design Homepage",
    description: "Create wireframes and mockups for the homepage",
    projectId: "1",
    assignedTo: "4",
    createdBy: "1",
    status: "approved",
    progress: 75,
    createdAt: "2023-01-16T11:00:00Z",
    updatedAt: "2023-01-20T15:30:00Z",
    deadline: "2023-02-15T23:59:59Z",
    priority: "high",
  },
  {
    id: "2",
    title: "Implement Frontend",
    description: "Develop the frontend using React",
    projectId: "1",
    assignedTo: "2",
    createdBy: "1",
    status: "approved",
    progress: 50,
    createdAt: "2023-01-18T09:00:00Z",
    updatedAt: "2023-01-25T14:00:00Z",
    deadline: "2023-03-01T23:59:59Z",
    priority: "medium",
  },
  {
    id: "3",
    title: "Setup Backend API",
    description: "Create RESTful API endpoints",
    projectId: "1",
    assignedTo: "3",
    createdBy: "1",
    status: "pending",
    progress: 0,
    createdAt: "2023-01-20T13:45:00Z",
    updatedAt: "2023-01-20T13:45:00Z",
    deadline: "2023-03-15T23:59:59Z",
    priority: "high",
  },
  {
    id: "4",
    title: "App Architecture",
    description: "Design the architecture for the mobile app",
    projectId: "2",
    assignedTo: "3",
    createdBy: "1",
    status: "approved",
    progress: 100,
    createdAt: "2023-02-21T10:30:00Z",
    updatedAt: "2023-02-28T16:15:00Z",
    deadline: "2023-03-15T23:59:59Z",
    priority: "high",
  },
  {
    id: "5",
    title: "UI Design for App",
    description: "Create UI designs for all app screens",
    projectId: "2",
    assignedTo: "4",
    createdBy: "1",
    status: "approved",
    progress: 60,
    createdAt: "2023-02-22T14:00:00Z",
    updatedAt: "2023-03-01T11:30:00Z",
    deadline: "2023-04-01T23:59:59Z",
    priority: "medium",
  },
  {
    id: "6",
    title: "Social Media Strategy",
    description: "Develop a social media strategy for the campaign",
    projectId: "3",
    assignedTo: "2",
    createdBy: "2",
    status: "pending",
    progress: 0,
    createdAt: "2023-03-12T09:00:00Z",
    updatedAt: "2023-03-12T09:00:00Z",
    deadline: "2023-04-15T23:59:59Z",
    priority: "medium",
  },
  {
    id: "7",
    title: "Content Creation",
    description: "Create content for the marketing campaign",
    projectId: "3",
    assignedTo: null,
    createdBy: "3",
    status: "rejected",
    progress: 0,
    createdAt: "2023-03-15T13:00:00Z",
    updatedAt: "2023-03-16T10:45:00Z",
    deadline: "2023-04-30T23:59:59Z",
    priority: "low",
  },
]

// Mock notifications
export const notifications: Notification[] = [
  {
    id: "1",
    userId: "2",
    message: "You have been assigned a new task: Implement Frontend",
    read: false,
    createdAt: "2023-01-18T09:05:00Z",
    type: "task_assigned",
    relatedId: "2",
  },
  {
    id: "2",
    userId: "3",
    message: "You have been assigned a new task: Setup Backend API",
    read: true,
    createdAt: "2023-01-20T13:50:00Z",
    type: "task_assigned",
    relatedId: "3",
  },
  {
    id: "3",
    userId: "4",
    message: "You have been assigned a new task: Design Homepage",
    read: false,
    createdAt: "2023-01-16T11:05:00Z",
    type: "task_assigned",
    relatedId: "1",
  },
  {
    id: "4",
    userId: "3",
    message: "You have been assigned a new task: App Architecture",
    read: true,
    createdAt: "2023-02-21T10:35:00Z",
    type: "task_assigned",
    relatedId: "4",
  },
  {
    id: "5",
    userId: "4",
    message: "You have been assigned a new task: UI Design for App",
    read: false,
    createdAt: "2023-02-22T14:05:00Z",
    type: "task_assigned",
    relatedId: "5",
  },
  {
    id: "6",
    userId: "2",
    message: "You have been assigned a new task: Social Media Strategy",
    read: false,
    createdAt: "2023-03-12T09:05:00Z",
    type: "task_assigned",
    relatedId: "6",
  },
  {
    id: "7",
    userId: "1",
    message: "A new task has been suggested: Content Creation",
    read: true,
    createdAt: "2023-03-15T13:05:00Z",
    type: "task_assigned",
    relatedId: "7",
  },
]

// Mock comments
export const comments: Comment[] = [
  {
    id: "1",
    taskId: "1",
    userId: "1",
    content: "Looking good! Make sure to follow the brand guidelines.",
    createdAt: "2023-01-18T14:30:00Z",
  },
  {
    id: "2",
    taskId: "1",
    userId: "4",
    content: "Thanks for the feedback. I'll make the necessary adjustments.",
    createdAt: "2023-01-18T15:45:00Z",
  },
  {
    id: "3",
    taskId: "2",
    userId: "1",
    content: "How's the progress on this task?",
    createdAt: "2023-01-22T10:15:00Z",
  },
  {
    id: "4",
    taskId: "2",
    userId: "2",
    content: "I've completed the initial setup. Working on the components now.",
    createdAt: "2023-01-22T11:30:00Z",
  },
  {
    id: "5",
    taskId: "4",
    userId: "1",
    content: "Great job on completing this task!",
    createdAt: "2023-02-28T16:20:00Z",
  },
]

// Helper functions to simulate API calls

// Get all projects
export function getProjects() {
  return [...projects]
}

// Get project by ID
export function getProjectById(id: string) {
  return projects.find((project) => project.id === id)
}

// Get tasks by project
export function getTasksByProject(projectId: string) {
  return tasks.filter((task) => task.projectId === projectId)
}

// Get tasks by user
export function getTasksByUser(userId: string) {
  return tasks.filter((task) => task.assignedTo === userId)
}

// Get tasks by status
export function getTasksByStatus(status: Task["status"]) {
  return tasks.filter((task) => task.status === status)
}

// Get user by ID
export function getUserById(id: string) {
  return users.find((user) => user.id === id)
}

// Get team members
export function getTeamMembers() {
  return users.filter((user) => user.role === "team_member")
}

// Get notifications by user
export function getNotificationsByUser(userId: string) {
  return notifications.filter((notification) => notification.userId === userId)
}

// Get task by ID
export function getTaskById(id: string) {
  return tasks.find((task) => task.id === id)
}

// Get comments by task
export function getCommentsByTask(taskId: string) {
  return comments.filter((comment) => comment.taskId === taskId)
}

// Add a new project
export function addProject(project: Omit<Project, "id" | "createdAt">) {
  const newProject = {
    ...project,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
  }
  projects.push(newProject)
  return newProject
}

// Add a new task
export function addTask(task: Omit<Task, "id" | "createdAt" | "updatedAt" | "progress">) {
  const newTask = {
    ...task,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    progress: 0,
  }
  tasks.push(newTask)
  return newTask
}

// Add a new team member
export function addTeamMember(user: Omit<User, "id" | "role">) {
  const newUser = {
    ...user,
    id: Math.random().toString(36).substring(2, 9),
    role: "team_member" as const,
  }
  users.push(newUser)
  return newUser
}

// Update task status
export function updateTaskStatus(taskId: string, status: Task["status"]) {
  const taskIndex = tasks.findIndex((task) => task.id === taskId)
  if (taskIndex !== -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      status,
      updatedAt: new Date().toISOString(),
    }
    return tasks[taskIndex]
  }
  return null
}

// Update task progress
export function updateTaskProgress(taskId: string, progress: number) {
  const taskIndex = tasks.findIndex((task) => task.id === taskId)
  if (taskIndex !== -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      progress,
      updatedAt: new Date().toISOString(),
    }
    return tasks[taskIndex]
  }
  return null
}

// Assign task to team member
export function assignTask(taskId: string, userId: string) {
  const taskIndex = tasks.findIndex((task) => task.id === taskId)
  if (taskIndex !== -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      assignedTo: userId,
      updatedAt: new Date().toISOString(),
    }

    // Create notification
    const newNotification = {
      id: Math.random().toString(36).substring(2, 9),
      userId,
      message: `You have been assigned a new task: ${tasks[taskIndex].title}`,
      read: false,
      createdAt: new Date().toISOString(),
      type: "task_assigned" as const,
      relatedId: taskId,
    }
    notifications.push(newNotification)

    return tasks[taskIndex]
  }
  return null
}

// Add a comment to a task
export function addComment(comment: Omit<Comment, "id" | "createdAt">) {
  const newComment = {
    ...comment,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
  }
  comments.push(newComment)
  return newComment
}

// Send email notification (mock function)
export function sendEmailNotification(to: string, subject: string, body: string) {
  console.log(`Email sent to ${to} with subject: ${subject}`)
  console.log(`Body: ${body}`)
  return true
}

// Get tasks by date range
export function getTasksByDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()

  return tasks.filter((task) => {
    const taskDate = new Date(task.createdAt).getTime()
    return taskDate >= start && taskDate <= end
  })
}

// Get tasks by priority
export function getTasksByPriority(priority: Task["priority"]) {
  return tasks.filter((task) => task.priority === priority)
}

// Generate report data
export function generateReportData(filters: {
  projectId?: string
  userId?: string
  status?: Task["status"]
  startDate?: string
  endDate?: string
  priority?: Task["priority"]
}) {
  let filteredTasks = [...tasks]

  if (filters.projectId) {
    filteredTasks = filteredTasks.filter((task) => task.projectId === filters.projectId)
  }

  if (filters.userId) {
    filteredTasks = filteredTasks.filter((task) => task.assignedTo === filters.userId)
  }

  if (filters.status) {
    filteredTasks = filteredTasks.filter((task) => task.status === filters.status)
  }

  if (filters.priority) {
    filteredTasks = filteredTasks.filter((task) => task.priority === filters.priority)
  }

  if (filters.startDate && filters.endDate) {
    const start = new Date(filters.startDate).getTime()
    const end = new Date(filters.endDate).getTime()

    filteredTasks = filteredTasks.filter((task) => {
      const taskDate = new Date(task.createdAt).getTime()
      return taskDate >= start && taskDate <= end
    })
  }

  return filteredTasks
}
