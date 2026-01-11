"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface LoginGuardProps {
  children: React.ReactNode
}

export function LoginGuard({ children }: LoginGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Kiểm tra token khi component mount
    const token = localStorage.getItem("token")
    
    if (token) {
      // Nếu đã có token, chuyển về dashboard
      router.push("/dashboard")
      return
    }

    // Nếu không có token, cho phép hiển thị trang login
    setIsLoading(false)
  }, [router])

  // Hiển thị loading khi đang kiểm tra
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra...</p>
        </div>
      </div>
    )
  }

  // Hiển thị trang login nếu chưa đăng nhập
  return <>{children}</>
} 