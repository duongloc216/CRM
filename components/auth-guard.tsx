"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Kiểm tra token khi component mount
    const token = localStorage.getItem("token")
    
    if (!token) {
      // Nếu không có token, chuyển về trang login
      router.push("/login")
      return
    }

    // Nếu có token, cho phép truy cập
    setIsAuthenticated(true)
    setIsLoading(false)
  }, [router])

  // Hiển thị loading khi đang kiểm tra
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    )
  }

  // Chỉ hiển thị children nếu đã xác thực
  return isAuthenticated ? <>{children}</> : null
} 