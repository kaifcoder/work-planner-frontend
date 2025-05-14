"use client"

import Link from "next/link"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { UserCircle } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          ProjectHub
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              {user.role === "manager" ? (
                <>
                  <Link href="/dashboard/manager" className="text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link href="/projects" className="text-sm font-medium">
                    Projects
                  </Link>
                  <Link href="/team" className="text-sm font-medium">
                    Team
                  </Link>
                  <Link href="/reports" className="text-sm font-medium">
                    Reports
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard/team-member" className="text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link href="/tasks" className="text-sm font-medium">
                    My Tasks
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium">
                Login
              </Link>
              <Link href="/register" className="text-sm font-medium">
                Register
              </Link>
            </>
          )}
        </nav>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserCircle className="h-6 w-6" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="font-medium">{user.name}</DropdownMenuItem>
              <DropdownMenuItem className="text-muted-foreground text-sm">{user.email}</DropdownMenuItem>
              <DropdownMenuItem className="text-muted-foreground text-sm">
                {user.role === "manager" ? "Manager" : "Team Member"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
