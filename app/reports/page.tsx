"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProjects, getTasksByStatus, getTeamMembers, tasks, generateReportData } from "@/lib/data"
import { BarChart, CheckCircle, Download, PieChart, XCircle, Clock, Filter } from "lucide-react"
import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { DatePicker } from "@/components/ui/date-picker"

export default function ReportsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [pendingTasks, setPendingTasks] = useState([])
  const [approvedTasks, setApprovedTasks] = useState([])
  const [rejectedTasks, setRejectedTasks] = useState([])
  const [selectedProject, setSelectedProject] = useState("all")
  const [selectedMember, setSelectedMember] = useState("all")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [filteredTasks, setFilteredTasks] = useState([])

  useEffect(() => {
    setProjects(getProjects())
    setTeamMembers(getTeamMembers())
    setPendingTasks(getTasksByStatus("pending"))
    setApprovedTasks(getTasksByStatus("approved"))
    setRejectedTasks(getTasksByStatus("rejected"))
    setFilteredTasks(tasks)
  }, [])

  useEffect(() => {
    // Apply filters
    const filters: any = {}

    if (selectedProject !== "all") {
      filters.projectId = selectedProject
    }

    if (selectedMember !== "all") {
      filters.userId = selectedMember
    }

    if (startDate && endDate) {
      filters.startDate = startDate.toISOString()
      filters.endDate = endDate.toISOString()
    }

    setFilteredTasks(generateReportData(filters))
  }, [selectedProject, selectedMember, startDate, endDate])

  if (!user || user.role !== "manager") {
    return <div>Access denied. Manager role required.</div>
  }

  const filteredPendingTasks = filteredTasks.filter((task) => task.status === "pending")
  const filteredApprovedTasks = filteredTasks.filter((task) => task.status === "approved")
  const filteredRejectedTasks = filteredTasks.filter((task) => task.status === "rejected")
  const filteredCompletedTasks = filteredTasks.filter((task) => task.progress === 100)

  // Calculate task distribution for the pie chart
  const taskDistribution = [
    { name: "Completed", value: filteredCompletedTasks.length, color: "bg-green-500" },
    {
      name: "In Progress",
      value: filteredApprovedTasks.filter((t) => t.progress < 100 && t.progress > 0).length,
      color: "bg-blue-500",
    },
    { name: "Not Started", value: filteredApprovedTasks.filter((t) => t.progress === 0).length, color: "bg-gray-500" },
    { name: "Pending", value: filteredPendingTasks.length, color: "bg-yellow-500" },
    { name: "Rejected", value: filteredRejectedTasks.length, color: "bg-red-500" },
  ]

  const totalTasks = taskDistribution.reduce((sum, item) => sum + item.value, 0)

  const handleExportReport = () => {
    // In a real application, this would generate a PDF or CSV report
    alert("Report exported successfully!")
  }

  const clearFilters = () => {
    setSelectedProject("all")
    setSelectedMember("all")
    setStartDate(null)
    setEndDate(null)
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">View and analyze project and team performance</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2" onClick={handleExportReport}>
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter the report data by project, team member and date range</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project</label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Team Member</label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Team Members</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex items-center space-x-2">
                <DatePicker placeholder="Start date" selected={startDate} onSelect={setStartDate} />
                <DatePicker placeholder="End date" selected={endDate} onSelect={setEndDate} />
              </div>
            </div>
            <Button variant="secondary" className="w-full" onClick={clearFilters}>
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Task Distribution</CardTitle>
              <CardDescription>Overview of task status distribution</CardDescription>
            </div>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {totalTasks > 0 ? (
                <>
                  <div className="flex items-center space-x-2 text-sm">
                    {taskDistribution.map((item) => (
                      <div key={item.name} className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${item.color} mr-1`}></div>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-4 w-full rounded-full overflow-hidden flex">
                    {taskDistribution.map((item) => (
                      <div
                        key={item.name}
                        className={`${item.color}`}
                        style={{ width: `${(item.value / totalTasks) * 100}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    {taskDistribution.map((item) => (
                      <div key={item.name} className="text-center">
                        <div className="text-2xl font-bold">{item.value}</div>
                        <div className="text-xs text-muted-foreground">{item.name}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-8">No data available with current filters</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="by-project">By Project</TabsTrigger>
          <TabsTrigger value="by-member">By Team Member</TabsTrigger>
          <TabsTrigger value="by-status">By Status</TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Task Summary</CardTitle>
                <CardDescription>Overview of all tasks based on current filters</CardDescription>
              </div>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2 text-center">
                    <div className="text-3xl font-bold">
                      {filteredApprovedTasks.length + filteredPendingTasks.length + filteredRejectedTasks.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Tasks</div>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="text-3xl font-bold">{filteredCompletedTasks.length}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="text-3xl font-bold">{filteredPendingTasks.length}</div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="text-3xl font-bold">{filteredRejectedTasks.length}</div>
                    <div className="text-sm text-muted-foreground">Rejected</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Overall Completion</span>
                    <span>{totalTasks > 0 ? Math.round((filteredCompletedTasks.length / totalTasks) * 100) : 0}%</span>
                  </div>
                  <Progress
                    value={totalTasks > 0 ? (filteredCompletedTasks.length / totalTasks) * 100 : 0}
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="by-project" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Performance</CardTitle>
              <CardDescription>Task completion rate by project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projects.length > 0 ? (
                  projects.map((project) => {
                    const projectTasks = tasks.filter((task) => task.projectId === project.id)
                    const completedProjectTasks = projectTasks.filter((task) => task.progress === 100)
                    const progressPercentage =
                      projectTasks.length > 0
                        ? Math.round((completedProjectTasks.length / projectTasks.length) * 100)
                        : 0

                    return (
                      <div key={project.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{project.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {completedProjectTasks.length}/{projectTasks.length} tasks
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                          <span>{progressPercentage}% complete</span>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-8">No projects available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="by-member" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Member Performance</CardTitle>
              <CardDescription>Task completion rate by team member</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {teamMembers.length > 0 ? (
                  teamMembers.map((member) => {
                    const memberTasks = tasks.filter((task) => task.assignedTo === member.id)
                    const completedMemberTasks = memberTasks.filter((task) => task.progress === 100)
                    const progressPercentage =
                      memberTasks.length > 0 ? Math.round((completedMemberTasks.length / memberTasks.length) * 100) : 0

                    return (
                      <div key={member.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {completedMemberTasks.length}/{memberTasks.length} tasks
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{member.email}</span>
                          <span>{progressPercentage}% complete</span>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-8">No team members available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="by-status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks by Status</CardTitle>
              <CardDescription>Detailed breakdown of tasks by their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <h3 className="font-medium">Completed Tasks</h3>
                    </div>
                    <span className="font-medium">{filteredCompletedTasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {filteredCompletedTasks.length > 0 ? (
                      filteredCompletedTasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="text-sm border rounded-lg p-2">
                          <div className="font-medium">{task.title}</div>
                          <div className="text-muted-foreground">
                            Project: {projects.find((p) => p.id === task.projectId)?.name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No completed tasks</p>
                    )}
                    {filteredCompletedTasks.length > 3 && (
                      <div className="text-sm text-center">
                        +{filteredCompletedTasks.length - 3} more completed tasks
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                      <h3 className="font-medium">Pending Tasks</h3>
                    </div>
                    <span className="font-medium">{filteredPendingTasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {filteredPendingTasks.length > 0 ? (
                      filteredPendingTasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="text-sm border rounded-lg p-2">
                          <div className="font-medium">{task.title}</div>
                          <div className="text-muted-foreground">
                            Project: {projects.find((p) => p.id === task.projectId)?.name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No pending tasks</p>
                    )}
                    {filteredPendingTasks.length > 3 && (
                      <div className="text-sm text-center">+{filteredPendingTasks.length - 3} more pending tasks</div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      <h3 className="font-medium">Rejected Tasks</h3>
                    </div>
                    <span className="font-medium">{filteredRejectedTasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {filteredRejectedTasks.length > 0 ? (
                      filteredRejectedTasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="text-sm border rounded-lg p-2">
                          <div className="font-medium">{task.title}</div>
                          <div className="text-muted-foreground">
                            Project: {projects.find((p) => p.id === task.projectId)?.name}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No rejected tasks</p>
                    )}
                    {filteredRejectedTasks.length > 3 && (
                      <div className="text-sm text-center">+{filteredRejectedTasks.length - 3} more rejected tasks</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
