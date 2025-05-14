"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTasksByUser, getTeamMembers } from "@/lib/data"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function TeamPage() {
  const { user } = useAuth()
  const [teamMembers, setTeamMembers] = useState([])

  useEffect(() => {
    setTeamMembers(getTeamMembers())
  }, [])

  if (!user || user.role !== "manager") {
    return <div>Access denied. Manager role required.</div>
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">Manage your team and track their progress</p>
        </div>
        <Link href="/team/add">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Team Member
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => {
          const memberTasks = getTasksByUser(member.id)
          const completedTasks = memberTasks.filter((task) => task.progress === 100)
          const inProgressTasks = memberTasks.filter((task) => task.progress < 100 && task.progress > 0)
          const notStartedTasks = memberTasks.filter((task) => task.progress === 0)

          const progressPercentage =
            memberTasks.length > 0 ? Math.round((completedTasks.length / memberTasks.length) * 100) : 0

          return (
            <Card key={member.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="space-y-1">
                      <span className="text-2xl font-bold block">{memberTasks.length}</span>
                      <span className="text-muted-foreground">Total Tasks</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-2xl font-bold block">{completedTasks.length}</span>
                      <span className="text-muted-foreground">Completed</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-2xl font-bold block">{inProgressTasks.length}</span>
                      <span className="text-muted-foreground">In Progress</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Link href={`/team/${member.id}`}>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </Link>
                    <Link href={`/team/${member.id}/tasks`}>
                      <Button size="sm">Assign Task</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
