"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getProjects, getTasksByProject, Project } from "@/lib/data"
import { CalendarDays, Plus, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[] | any>([])

  useEffect(() => {
    setProjects(getProjects())
  }, [])

  if (!user || user.role !== "manager") {
    return <div>Access denied. Manager role required.</div>
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and monitor all your projects</p>
        </div>
        <Link href="/projects/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: Project) => {
          const projectTasks = getTasksByProject(project.id)
          const completedTasks = projectTasks.filter((task) => task.progress === 100).length
          const totalTasks = projectTasks.length
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

          return (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>{project.name}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <CalendarDays className="mr-1 h-4 w-4" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    {new Set(projectTasks.map((task) => task.assignedTo).filter(Boolean)).size} members
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{completedTasks} completed</span>
                    <span>{totalTasks} total tasks</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <Link href={`/projects/${project.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Project
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
