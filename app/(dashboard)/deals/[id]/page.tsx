"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calendar, DollarSign, User, Building2, FileText, Clock } from "lucide-react"

type Deal = {
  id: number
  title: string
  customer_id: number | null
  customer_name?: string
  value: number | null
  stage: string
  probability: number
  expected_close_date: string | null
  actual_close_date: string | null
  description: string | null
  owner_id: number | null
  owner_name?: string
  created_at: string
  updated_at: string
  activities?: any[]
}

const stageLabels: { [key: string]: { label: string, color: string } } = {
  "prospect": { label: "Tiềm năng", color: "bg-blue-500" },
  "Đăng ký": { label: "Đăng ký", color: "bg-purple-500" },
  "demo": { label: "Demo", color: "bg-yellow-500" },
  "proposal": { label: "Đề xuất", color: "bg-orange-500" },
  "negotiation": { label: "Đàm phán", color: "bg-pink-500" },
  "won": { label: "Thành công", color: "bg-green-500" },
  "lost": { label: "Thất bại", color: "bg-red-500" },
}

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/deals/${params.id}`)
        .then((res) => res.json())
        .then((response) => {
          if (response.success) {
            setDeal(response.data)
          } else {
            setError(response.message || "Không tìm thấy cơ hội")
          }
          setLoading(false)
        })
        .catch(() => {
          setError("Có lỗi xảy ra khi tải dữ liệu")
          setLoading(false)
        })
    }
  }, [params.id])

  if (loading) return <div className="p-6">Đang tải dữ liệu...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>
  if (!deal) return <div className="p-6">Không tìm thấy cơ hội</div>

  const stageInfo = stageLabels[deal.stage] || { label: deal.stage, color: "bg-gray-500" }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-black">{deal.title}</h1>
            <p className="text-gray-500">ID: {deal.id}</p>
          </div>
        </div>
        <Badge className={`${stageInfo.color} text-white px-3 py-1`}>
          {stageInfo.label}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <Card className="lg:col-span-2 bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Thông tin chi tiết</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-gray-500">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Giá trị
                </div>
                <p className="text-2xl font-bold text-black">
                  {deal.value ? deal.value.toLocaleString('vi-VN') + ' đ' : '-'}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-gray-500">
                  <span className="mr-2">%</span>
                  Xác suất
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-black">{deal.probability}%</p>
                  <Progress value={deal.probability} className="h-2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-gray-500">
                  <Building2 className="h-4 w-4 mr-2" />
                  Khách hàng
                </div>
                <p className="font-medium text-black">{deal.customer_name || '-'}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-gray-500">
                  <User className="h-4 w-4 mr-2" />
                  Người phụ trách
                </div>
                <p className="font-medium text-black">{deal.owner_name || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ngày đóng dự kiến
                </div>
                <p className="font-medium text-black">
                  {deal.expected_close_date ? new Date(deal.expected_close_date).toLocaleDateString('vi-VN') : '-'}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ngày đóng thực tế
                </div>
                <p className="font-medium text-black">
                  {deal.actual_close_date ? new Date(deal.actual_close_date).toLocaleDateString('vi-VN') : '-'}
                </p>
              </div>
            </div>

            {deal.description && (
              <div className="space-y-2">
                <div className="flex items-center text-gray-500">
                  <FileText className="h-4 w-4 mr-2" />
                  Mô tả
                </div>
                <p className="text-black whitespace-pre-wrap">{deal.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline / Activities */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Hoạt động</CardTitle>
            <CardDescription className="text-gray-500">Lịch sử hoạt động của cơ hội</CardDescription>
          </CardHeader>
          <CardContent>
            {deal.activities && deal.activities.length > 0 ? (
              <div className="space-y-4">
                {deal.activities.map((activity: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium text-black">{activity.type}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.activity_date || activity.created_at).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Chưa có hoạt động nào</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Meta Info */}
      <Card className="bg-white border-gray-200">
        <CardContent className="pt-6">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Tạo lúc: {new Date(deal.created_at).toLocaleString('vi-VN')}</span>
            <span>Cập nhật: {new Date(deal.updated_at).toLocaleString('vi-VN')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
