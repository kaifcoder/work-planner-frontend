"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProjectById, getTasksByUser } from "@/lib/data"
import { CheckCircle, Clock, Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

export default function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (user) {
      setTasks(getTasksByUser(user.id))
    }
  }, [user])

  if (!user || user.role !== "team_member") {
    return <div>Access denied. Team member role required.</div>
  }

  const approvedTasks = tasks.filter((task) => task.status === "approved")
  const pendingTasks = tasks.filter((task) => task.status === "pending")
  const completedTasks = tasks.filter((task) => task.progress === 100)
  const inProgressTasks = approvedTasks.filter((task) => task.progress < 100 && task.progress > 0)
  const notStartedTasks = approvedTasks.filter((task) => task.progress === 0)

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">View and manage all your assigned tasks</p>
        </div>
        <Link href="/tasks/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Suggest New Task
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedTasks.length}</div>
            <p className="text-xs text-muted-foreground">Approved tasks assigned to you</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks.length}</div>
            <p className="text-xs text-muted-foreground">Tasks currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground">Tasks you have completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Started</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notStartedTasks.length}</div>
            <p className="text-xs text-muted-foreground">Tasks you haven't started yet</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="not-started">Not Started</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>All tasks assigned to you that have been approved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approvedTasks.length > 0 ? (
                  approvedTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Project: {getProjectById(task.projectId)?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">Progress: {task.progress}%</div>
                          <Progress value={task.progress} className="h-2 mt-1 w-24" />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Link href={`/tasks/${task.id}`}>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </Link>
                        <Link href={`/tasks/${task.id}/update`}>
                          <Button size="sm">Update Progress</Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No approved tasks assigned to you</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="in-progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>In Progress</CardTitle>
              <CardDescription>Tasks you are currently working on</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inProgressTasks.length > 0 ? (
                  inProgressTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Project: {getProjectById(task.projectId)?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">Progress: {task.progress}%</div>
                          <Progress value={task.progress} className="h-2 mt-1 w-24" />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link href={`/tasks/${task.id}/update`}>
                          <Button size="sm">Update Progress</Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No tasks in progress</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed</CardTitle>
              <CardDescription>Tasks you have completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedTasks.length > 0 ? (
                  completedTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Project: {getProjectById(task.projectId)?.name}
                          </p>
                        </div>
                        <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-100">
                          Completed
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No completed tasks</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="not-started" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Not Started</CardTitle>
              <CardDescription>Tasks you haven't started yet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notStartedTasks.length > 0 ? (
                  notStartedTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Project: {getProjectById(task.projectId)?.name}
                          </p>
                        </div>
                        <Link href={`/tasks/${task.id}/update`}>
                          <Button size="sm">Start Task</Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No tasks waiting to be started</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approval</CardTitle>
              <CardDescription>Tasks you've suggested that are waiting for manager approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.length > 0 ? (
                  pendingTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Project: {getProjectById(task.projectId)?.name}
                        </p>
                        <div className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                          Pending Approval
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No tasks pending approval</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
