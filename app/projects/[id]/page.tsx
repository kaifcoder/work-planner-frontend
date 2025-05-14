"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProjectById, getTasksByProject, getTeamMembers, getUserById } from "@/lib/data"
import { CalendarDays, CheckCircle, Clock, Plus, User, XCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ProjectDetailsPage() {
  const { user } = useAuth()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [teamMembers, setTeamMembers] = useState([])

  useEffect(() => {
    const projectData = getProjectById(projectId)
    if (projectData) {
      setProject(projectData)
      setTasks(getTasksByProject(projectId))
      setTeamMembers(getTeamMembers())
    }
  }, [projectId])

  if (!user || user.role !== "manager") {
    return <div>Access denied. Manager role required.</div>
  }

  if (!project) {
    return <div>Project not found</div>
  }

  const pendingTasks = tasks.filter((task) => task.status === "pending")
  const approvedTasks = tasks.filter((task) => task.status === "approved")
  const rejectedTasks = tasks.filter((task) => task.status === "rejected")
  const completedTasks = tasks.filter((task) => task.progress === 100)

  const progress = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0

  // Get unique team members assigned to this project
  const projectTeamMembers = [...new Set(tasks.filter((task) => task.assignedTo).map((task) => task.assignedTo))]
    .map((memberId) => teamMembers.find((member) => member.id === memberId))
    .filter(Boolean)

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <Badge variant="outline" className="ml-2">
              {tasks.length} Tasks
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{project.description}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays className="mr-1 h-4 w-4" />
              Created on {new Date(project.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <User className="mr-1 h-4 w-4" />
              Manager: {getUserById(project.managerId)?.name || "Unknown"}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/projects/${projectId}/tasks/new`}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </Link>
          <Link href={`/projects/${projectId}/edit`}>
            <Button variant="outline">Edit Project</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">Tasks in this project</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground">Tasks completed successfully</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks.length}</div>
            <p className="text-xs text-muted-foreground">Tasks awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectTeamMembers.length}</div>
            <p className="text-xs text-muted-foreground">People working on this project</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
          <CardDescription>Overall completion status of the project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">{progress}% Complete</span>
              <span className="text-sm text-muted-foreground">
                {completedTasks.length} of {tasks.length} tasks completed
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tasks</CardTitle>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>All tasks associated with this project</CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="all" className="space-y-4">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <span>Assigned to: {getUserById(task.assignedTo)?.name || "Unassigned"}</span>
                            <span className="mx-2">•</span>
                            <span>Status: {task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">Progress: {task.progress}%</div>
                          <Progress value={task.progress} className="h-2 mt-1 w-24" />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link href={`/tasks/${task.id}`}>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No tasks in this project</p>
                )}
              </TabsContent>
              <TabsContent value="approved" className="space-y-4">
                {approvedTasks.length > 0 ? (
                  approvedTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <span>Assigned to: {getUserById(task.assignedTo)?.name || "Unassigned"}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">Progress: {task.progress}%</div>
                          <Progress value={task.progress} className="h-2 mt-1 w-24" />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link href={`/tasks/${task.id}`}>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No approved tasks</p>
                )}
              </TabsContent>
              <TabsContent value="pending" className="space-y-4">
                {pendingTasks.length > 0 ? (
                  pendingTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <span>Created by: {getUserById(task.createdBy)?.name || "Unknown"}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No pending tasks</p>
                )}
              </TabsContent>
              <TabsContent value="rejected" className="space-y-4">
                {rejectedTasks.length > 0 ? (
                  rejectedTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <span>Created by: {getUserById(task.createdBy)?.name || "Unknown"}</span>
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
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>People working on this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectTeamMembers.length > 0 ? (
                projectTeamMembers.map((member) => {
                  const memberTasks = tasks.filter((task) => task.assignedTo === member.id)
                  const completedCount = memberTasks.filter((task) => task.progress === 100).length

                  return (
                    <div key={member.id} className="flex items-center">
                      <Avatar className="h-9 w-9 mr-3">
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {completedCount}/{memberTasks.length} tasks completed
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-center text-muted-foreground py-4">No team members assigned yet</p>
              )}
              <Button variant="outline" className="w-full mt-4">
                Assign Team Members
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
