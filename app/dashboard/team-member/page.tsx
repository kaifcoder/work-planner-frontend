"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getNotificationsByUser, getTasksByUser } from "@/lib/data"
import { CheckCircle, Clock, Plus, Bell } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { StatusBadge } from "@/components/status-badge"

export default function TeamMemberDashboard() {
  const { user } = useAuth()
  const [myTasks, setMyTasks] = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (user) {
      // Fetch data
      setMyTasks(getTasksByUser(user.id))
      setNotifications(getNotificationsByUser(user.id))
    }
  }, [user])

  if (!user || user.role !== "team_member") {
    return <div>Access denied. Team member role required.</div>
  }

  const approvedTasks = myTasks.filter((task) => task.status === "approved")
  const pendingTasks = myTasks.filter((task) => task.status === "pending")
  const completedTasks = myTasks.filter((task) => task.progress === 100)
  const inProgressTasks = approvedTasks.filter((task) => task.progress < 100 && task.progress > 0)
  const notStartedTasks = approvedTasks.filter((task) => task.progress === 0)

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, {user.name}. Here's an overview of your tasks.</p>
        </div>
        <Link href="/tasks/new">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Suggest New Task
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedTasks.length}</div>
            <p className="text-xs text-muted-foreground">Approved tasks assigned to you</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks.length}</div>
            <p className="text-xs text-muted-foreground">Tasks currently in progress</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground">Tasks you have completed</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks.length}</div>
            <p className="text-xs text-muted-foreground">Tasks waiting for manager approval</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="approved" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="approved">Approved Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="approved" className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
              <CardDescription>Tasks assigned to you that have been approved by the manager</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approvedTasks.length > 0 ? (
                  approvedTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4 hover:border-purple-200 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{task.title}</h3>
                            {task.priority === "high" && (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                High Priority
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">Progress: {task.progress}%</div>
                          <Progress value={task.progress} className="h-2 mt-1 w-24" />
                          <StatusBadge
                            status={task.progress === 100 ? "completed" : task.progress > 0 ? "inprogress" : "approved"}
                            className="mt-2"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Link href={`/tasks/${task.id}`}>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </Link>
                        <Link href={`/tasks/${task.id}/update`}>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            Update Progress
                          </Button>
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
        <TabsContent value="pending" className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Pending Approval</CardTitle>
              <CardDescription>Tasks you've suggested that are waiting for manager approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.length > 0 ? (
                  pendingTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4 hover:border-purple-200 transition-colors">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <StatusBadge status="pending" />
                          <span className="text-sm text-muted-foreground">
                            Submitted on {new Date(task.createdAt).toLocaleDateString()}
                          </span>
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
        <TabsContent value="notifications" className="space-y-4">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Recent notifications and updates</CardDescription>
              </div>
              <Bell className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border rounded-lg p-4 ${
                        notification.read ? "bg-muted/30" : "bg-card border-purple-200"
                      } hover:border-purple-300 transition-colors`}
                    >
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                      {notification.relatedId && (
                        <div className="mt-2">
                          <Link href={`/tasks/${notification.relatedId}`}>
                            <Button size="sm" variant="outline" className="text-xs">
                              View Task
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No notifications</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
