import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 md:p-8">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Streamline Your Project Management</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Efficiently manage projects, assign tasks, and track progress with our comprehensive project management
          solution.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link href="/login">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline">
              Create Account
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
            <CheckCircle className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Task Management</h3>
            <p className="text-muted-foreground text-center">
              Create, assign, and track tasks with an intuitive interface.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
            <CheckCircle className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-muted-foreground text-center">
              Seamlessly collaborate with team members on projects and tasks.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
            <CheckCircle className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
            <p className="text-muted-foreground text-center">
              Monitor project progress with detailed reports and visualizations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
