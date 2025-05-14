"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProjects, getTasksByStatus, getTeamMembers, tasks, updateTaskStatus } from "@/lib/data"
import { CheckCircle, Clock, FileText, Users, XCircle, BarChart, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useNotification } from "@/components/notification-toast"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

export default function ManagerDashboard() {
  const { user } = useAuth()
  const { showNotification } = useNotification()
  const [projects, setProjects] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [pendingTasks, setPendingTasks] = useState([])
  const [approvedTasks, setApprovedTasks] = useState([])
  const [rejectedTasks, setRejectedTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ type: "approve" | "reject"; taskId: string } | null>(null)

  useEffect(() => {
    // Fetch data
    setProjects(getProjects())
    setTeamMembers(getTeamMembers())
    setPendingTasks(getTasksByStatus("pending"))
    setApprovedTasks(getTasksByStatus("approved"))
    setRejectedTasks(getTasksByStatus("rejected"))
    setCompletedTasks(tasks.filter((task) => task.progress === 100))
  }, [])

  if (!user || user.role !== "manager") {
    return <div>Access denied. Manager role required.</div>
  }

  const handleApproveTask = (taskId: string) => {
    setConfirmAction({ type: "approve", taskId })
    setConfirmDialogOpen(true)
  }

  const handleRejectTask = (taskId: string) => {
    setConfirmAction({ type: "reject", taskId })
    setConfirmDialogOpen(true)
  }

  const handleConfirmAction = () => {
    if (!confirmAction) return

    const { type, taskId } = confirmAction
    const newStatus = type === "approve" ? "approved" : "rejected"

    try {
      updateTaskStatus(taskId, newStatus)

      // Update local state
      const updatedTask = tasks.find((t) => t.id === taskId)

      if (type === "approve") {
        setPendingTasks(pendingTasks.filter((t) => t.id !== taskId))
        setApprovedTasks([...approvedTasks, updatedTask])
      } else {
        setPendingTasks(pendingTasks.filter((t) => t.id !== taskId))
        setRejectedTasks([...rejectedTasks, updatedTask])
      }

      showNotification({
        title: "Success",
        description: `Task ${type === "approve" ? "approved" : "rejected"} successfully`,
        type: "success",
      })
    } catch (error) {
      showNotification({
        title: "Error",
        description: `Failed to ${type} task. Please try again.`,
        type: "error",
      })
    }

    setConfirmDialogOpen(false)
    setConfirmAction(null)
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Manager Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}. Here's an overview of your projects and tasks.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/projects/new">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              New Project
            </Button>
          </Link>
          <Link href="/team/add">
            <Button variant="outline">Add Team Member</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">Active projects under management</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">People working on your projects</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks.length}</div>
            <p className="text-xs text-muted-foreground">Tasks awaiting approval</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground">Tasks finished successfully</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">Pending Tasks</TabsTrigger>
          <TabsTrigger value="approved">Approved Tasks</TabsTrigger>
          <TabsTrigger value="rejected">Rejected Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Projects Overview</CardTitle>
              <CardDescription>Summary of all active projects and their progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Link href={`/projects/${project.id}`} className="font-medium hover:underline flex items-center">
                      {project.name}
                      {project.priority === "high" && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                          High Priority
                        </span>
                      )}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      {tasks.filter((task) => task.projectId === project.id).length} tasks
                    </span>
                  </div>
                  <Progress
                    value={
                      tasks.filter((task) => task.projectId === project.id).length > 0
                        ? (tasks.filter((task) => task.projectId === project.id && task.progress === 100).length /
                            tasks.filter((task) => task.projectId === project.id).length) *
                          100
                        : 0
                    }
                    className="h-2"
                  />
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Activity</CardTitle>
                <CardDescription>Recent activity from your team members</CardDescription>
              </div>
              <Link href="/reports">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" />
                  View Reports
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => {
                  const memberTasks = tasks.filter((task) => task.assignedTo === member.id)
                  const completedCount = memberTasks.filter((task) => task.progress === 100).length
                  const progressPercentage = memberTasks.length > 0 ? (completedCount / memberTasks.length) * 100 : 0

                  return (
                    <div key={member.id} className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white mr-3">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">{member.name}</p>
                          <span className="text-sm text-muted-foreground">
                            {completedCount}/{memberTasks.length} tasks
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>Tasks awaiting your approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.length > 0 ? (
                  pendingTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4 hover:border-purple-200 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <span>Project: {projects.find((p) => p.id === task.projectId)?.name}</span>
                            <span className="mx-2">•</span>
                            <span>
                              Created by: {teamMembers.find((m) => m.id === task.createdBy)?.name || "Manager"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                            onClick={() => handleApproveTask(task.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleRejectTask(task.id)}
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No pending tasks to approve</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="approved" className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Approved Tasks</CardTitle>
              <CardDescription>Tasks you have approved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approvedTasks.length > 0 ? (
                  approvedTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4 hover:border-purple-200 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <span>Project: {projects.find((p) => p.id === task.projectId)?.name}</span>
                            <span className="mx-2">•</span>
                            <span>
                              Assigned to: {teamMembers.find((m) => m.id === task.assignedTo)?.name || "Unassigned"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">Progress: {task.progress}%</div>
                          <Progress value={task.progress} className="h-2 mt-1 w-24" />
                          <Link
                            href={`/tasks/${task.id}`}
                            className="text-xs text-purple-600 hover:underline mt-1 inline-block"
                          >
                            View Details <ArrowUpRight className="h-3 w-3 inline" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No approved tasks</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rejected" className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Rejected Tasks</CardTitle>
              <CardDescription>Tasks you have rejected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rejectedTasks.length > 0 ? (
                  rejectedTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4 hover:border-purple-200 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <span>Project: {projects.find((p) => p.id === task.projectId)?.name}</span>
                            <span className="mx-2">•</span>
                            <span>
                              Created by: {teamMembers.find((m) => m.id === task.createdBy)?.name || "Unknown"}
                            </span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Reconsider
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No rejected tasks</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title={confirmAction?.type === "approve" ? "Approve Task" : "Reject Task"}
        description={
          confirmAction?.type === "approve"
            ? "Are you sure you want to approve this task? The task will be visible to the assigned team member."
            : "Are you sure you want to reject this task? The team member will be notified."
        }
        onConfirm={handleConfirmAction}
        confirmLabel={confirmAction?.type === "approve" ? "Approve" : "Reject"}
        variant={confirmAction?.type === "approve" ? "default" : "destructive"}
      />
    </div>
  )
}
