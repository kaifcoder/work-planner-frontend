"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  role: "manager" | "team_member"
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: "manager" | "team_member") => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Mock users for demo purposes
  const mockUsers = [
    {
      id: "1",
      name: "John Manager",
      email: "manager@example.com",
      password: "password123",
      role: "manager" as const,
    },
    {
      id: "2",
      name: "Jane Team",
      email: "team@example.com",
      password: "password123",
      role: "team_member" as const,
    },
  ]

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Redirect based on auth state and role
    if (!isLoading) {
      const publicPaths = ["/", "/login", "/register"]

      if (!user && !publicPaths.includes(pathname)) {
        router.push("/login")
      } else if (user) {
        if (publicPaths.includes(pathname)) {
          if (user.role === "manager") {
            router.push("/dashboard/manager")
          } else {
            router.push("/dashboard/team-member")
          }
        }
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    // Mock login
    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))

      if (foundUser.role === "manager") {
        router.push("/dashboard/manager")
      } else {
        router.push("/dashboard/team-member")
      }
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const register = async (name: string, email: string, password: string, role: "manager" | "team_member") => {
    // Mock registration
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      role,
    }

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))

    if (role === "manager") {
      router.push("/dashboard/manager")
    } else {
      router.push("/dashboard/team-member")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
