"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Target,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// T4.2.2: Deal type interface
type Deal = {
  id: number;
  title: string;
  customer_id: number | null;
  customer_name?: string;
  value: number | null;
  stage: string;
  probability: number;
  expected_close_date: string | null;
  actual_close_date: string | null;
  description: string | null;
  owner_id: number | null;
  owner_name?: string;
  created_at: string;
  updated_at: string;
}

type Customer = { id: number; name: string; company: string }
type User = { id: number; name: string; email: string }

// T2.4.1: Stage-Probability mapping
const stageProbabilityMap: { [key: string]: number } = {
  "prospect": 10,
  "Đăng ký": 20,
  "demo": 40,
  "proposal": 60,
  "negotiation": 80,
  "won": 100,
  "lost": 0,
}

export default function DealsPage() {
  const router = useRouter()
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // T3.1.1, T3.1.2: Fetch customers và users cho dropdowns
  const [customers, setCustomers] = useState<Customer[]>([])
  const [users, setUsers] = useState<User[]>([])

  // T1.2.3: Form state cho deal
  const [formData, setFormData] = useState({
    title: "",
    customer_id: "",
    value: "",
    stage: "prospect",
    probability: "10",
    expected_close_date: "",
    actual_close_date: "",
    description: "",
    owner_id: ""
  })

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      customer_id: "",
      value: "",
      stage: "prospect",
      probability: "10",
      expected_close_date: "",
      actual_close_date: "",
      description: "",
      owner_id: ""
    })
  }

  // T1.2.4: onChange handler
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      // T2.4.2: Auto-fill probability khi chọn stage
      if (field === "stage" && stageProbabilityMap[value] !== undefined) {
        updated.probability = stageProbabilityMap[value].toString()
      }
      return updated
    })
  }

  // T1.3.2: Submit handler
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("Vui lòng nhập tiêu đề cơ hội")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        title: formData.title,
        customer_id: formData.customer_id ? parseInt(formData.customer_id) : null,
        value: formData.value ? parseFloat(formData.value) : null,
        stage: formData.stage,
        probability: parseInt(formData.probability) || 0,
        expected_close_date: formData.expected_close_date || null,
        description: formData.description,
        owner_id: formData.owner_id ? parseInt(formData.owner_id) : null
      }

      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const result = await res.json()
      
      if (!res.ok) {
        alert(result.message || "Có lỗi xảy ra")
        return
      }

      // Refresh data
      const refreshRes = await fetch("/api/deals")
      const refreshData = await refreshRes.json()
      setDeals(refreshData.data || [])

      setIsAddDialogOpen(false)
      resetForm()
      alert("Tạo cơ hội thành công!")
    } catch (err) {
      alert("Có lỗi xảy ra khi tạo cơ hội")
    } finally {
      setSubmitting(false)
    }
  }

  // T3.5.3: Delete handler
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa cơ hội này?")) return

    try {
      const res = await fetch(`/api/deals/${id}`, { method: "DELETE" })
      const result = await res.json()
      
      if (!res.ok) {
        alert(result.message || "Có lỗi xảy ra")
        return
      }

      const refreshRes = await fetch("/api/deals")
      const refreshData = await refreshRes.json()
      setDeals(refreshData.data || [])
      alert("Xóa cơ hội thành công!")
    } catch (err) {
      alert("Có lỗi xảy ra khi xóa cơ hội")
    }
  }

  // T3.4.1: Edit Dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [editFormData, setEditFormData] = useState({
    title: "",
    customer_id: "",
    value: "",
    stage: "prospect",
    probability: "10",
    expected_close_date: "",
    actual_close_date: "",
    description: "",
    owner_id: ""
  })

  // T3.4.2: Populate form khi click Edit
  const openEditDialog = (deal: Deal) => {
    setEditingDeal(deal)
    setEditFormData({
      title: deal.title || "",
      customer_id: deal.customer_id?.toString() || "",
      value: deal.value?.toString() || "",
      stage: deal.stage || "prospect",
      probability: deal.probability?.toString() || "10",
      expected_close_date: deal.expected_close_date?.split('T')[0] || "",
      actual_close_date: deal.actual_close_date?.split('T')[0] || "",
      description: deal.description || "",
      owner_id: deal.owner_id?.toString() || ""
    })
    setIsEditDialogOpen(true)
  }

  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData(prev => {
      const updated = { ...prev, [field]: value }
      // Auto-fill probability khi chọn stage
      if (field === "stage" && stageProbabilityMap[value] !== undefined) {
        updated.probability = stageProbabilityMap[value].toString()
      }
      return updated
    })
  }

  // T3.4.3: handleUpdate gọi PUT API
  const handleUpdate = async () => {
    if (!editingDeal) return
    if (!editFormData.title.trim()) {
      alert("Vui lòng nhập tiêu đề cơ hội")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        title: editFormData.title,
        customer_id: editFormData.customer_id ? parseInt(editFormData.customer_id) : null,
        value: editFormData.value ? parseFloat(editFormData.value) : null,
        stage: editFormData.stage,
        probability: parseInt(editFormData.probability) || 0,
        expected_close_date: editFormData.expected_close_date || null,
        actual_close_date: editFormData.actual_close_date || null,
        description: editFormData.description,
        owner_id: editFormData.owner_id ? parseInt(editFormData.owner_id) : null
      }

      const res = await fetch(`/api/deals/${editingDeal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const result = await res.json()
      
      if (!res.ok) {
        alert(result.message || "Có lỗi xảy ra")
        return
      }

      // Refresh data
      const refreshRes = await fetch("/api/deals")
      const refreshData = await refreshRes.json()
      setDeals(refreshData.data || [])

      setIsEditDialogOpen(false)
      setEditingDeal(null)
      alert("Cập nhật cơ hội thành công!")
    } catch (err) {
      alert("Có lỗi xảy ra khi cập nhật cơ hội")
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    // Fetch deals
    fetch("/api/deals")
      .then((res) => res.json())
      .then((response) => {
        setDeals(response.data || [])
        setLoading(false)
      })
    
    // T3.1.1: Fetch customers cho dropdown
    fetch("/api/customers")
      .then((res) => res.json())
      .then((response) => setCustomers(response.data || []))

    // T3.1.2: Fetch users cho dropdown
    fetch("/api/users")
      .then((res) => res.json())
      .then((response) => setUsers(response.data || []))
  }, [])

  const stages = [
    { key: "Đăng ký", label: "Đăng ký", color: "bg-purple-500", textColor: "text-purple-400" },
    { key: "prospect", label: "Tiềm năng", color: "bg-blue-500", textColor: "text-blue-400" },
    { key: "demo", label: "Demo", color: "bg-yellow-500", textColor: "text-yellow-400" },
    { key: "proposal", label: "Đề xuất", color: "bg-orange-500", textColor: "text-orange-400" },
    { key: "negotiation", label: "Đàm phán", color: "bg-pink-500", textColor: "text-pink-400" },
    { key: "won", label: "Thành công", color: "bg-green-500", textColor: "text-green-400" },
    { key: "lost", label: "Thất bại", color: "bg-red-500", textColor: "text-red-400" },
  ]

  const getStageBadge = (stageKey: string) => {
    const stageInfo = stages.find((s) => s.key === stageKey)
    if (!stageInfo) return null

    return (
      <Badge className={`${stageInfo.color}/20 ${stageInfo.textColor} border-${stageInfo.color}/30`}>
        {stageInfo.label}
      </Badge>
    )
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return "text-green-400"
    if (probability >= 50) return "text-yellow-400"
    if (probability >= 25) return "text-orange-400"
    return "text-red-400"
  }

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = stageFilter === "all" || deal.stage === stageFilter
    return matchesSearch && matchesStage
  })

  const totalValue = filteredDeals.reduce((sum, deal) => sum + (deal.value || 0), 0)

  // T2.3.1: Tính tỷ lệ thành công từ data thật
  const closedDeals = deals.filter(d => d.stage === 'won' || d.stage === 'lost')
  const wonDeals = deals.filter(d => d.stage === 'won')
  const winRate = closedDeals.length > 0 ? Math.round((wonDeals.length / closedDeals.length) * 100) : 0

  // T2.3.2: Đếm deals có expected_close_date trong tuần này
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)
  
  const dueThisWeek = deals.filter(d => {
    if (!d.expected_close_date || d.stage === 'won' || d.stage === 'lost') return false
    const closeDate = new Date(d.expected_close_date)
    return closeDate >= startOfWeek && closeDate < endOfWeek
  }).length

  if (loading) return <div>Đang tải dữ liệu...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý cơ hội & Giao dịch</h1>
          <p className="text-slate-400">Theo dõi và quản lý pipeline bán hàng</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Tạo cơ hội mới
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-black">Tạo cơ hội mới</DialogTitle>
              <DialogDescription className="text-gray-500">
                Nhập thông tin chi tiết của cơ hội bán hàng
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="title" className="text-gray-700">
                  Tiêu đề cơ hội <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="title" 
                  className="bg-white border-gray-200 text-black placeholder:text-gray-400"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer" className="text-gray-700">
                  Khách hàng
                </Label>
                <Select value={formData.customer_id} onValueChange={(v) => handleInputChange("customer_id", v)}>
                  <SelectTrigger className="bg-white border-gray-200 text-black">
                    <SelectValue placeholder="Chọn khách hàng" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 max-h-60">
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name} {c.company ? `(${c.company})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value" className="text-gray-700">
                  Giá trị (VNĐ)
                </Label>
                <Input 
                  id="value" 
                  type="number" 
                  className="bg-white border-gray-200 text-black placeholder:text-gray-400"
                  value={formData.value}
                  onChange={(e) => handleInputChange("value", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage" className="text-gray-700">
                  Giai đoạn
                </Label>
                <Select value={formData.stage} onValueChange={(v) => handleInputChange("stage", v)}>
                  <SelectTrigger className="bg-white border-gray-200 text-black">
                    <SelectValue placeholder="Chọn giai đoạn" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {stages.map((stage) => (
                      <SelectItem key={stage.key} value={stage.key}>{stage.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="probability" className="text-gray-700">
                  Xác suất (%)
                </Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  className="bg-white border-gray-200 text-black placeholder:text-gray-400"
                  value={formData.probability}
                  onChange={(e) => handleInputChange("probability", e.target.value)}
                />
                {stageProbabilityMap[formData.stage] !== undefined && 
                 parseInt(formData.probability) !== stageProbabilityMap[formData.stage] && (
                  <p className="text-xs text-orange-500">
                    ⚠️ Đề xuất: {stageProbabilityMap[formData.stage]}% cho stage này
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedClose" className="text-gray-700">
                  Ngày đóng dự kiến
                </Label>
                <Input 
                  id="expectedClose" 
                  type="date" 
                  className="bg-white border-gray-200 text-black placeholder:text-gray-400"
                  value={formData.expected_close_date}
                  onChange={(e) => handleInputChange("expected_close_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner" className="text-gray-700">
                  Người phụ trách
                </Label>
                <Select value={formData.owner_id} onValueChange={(v) => handleInputChange("owner_id", v)}>
                  <SelectTrigger className="bg-white border-gray-200 text-black">
                    <SelectValue placeholder="Chọn người phụ trách" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 max-h-60">
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description" className="text-gray-700">
                  Mô tả
                </Label>
                <Textarea 
                  id="description" 
                  className="bg-white border-gray-200 text-black placeholder:text-gray-400"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => { setIsAddDialogOpen(false); resetForm(); }}
                className="bg-white border-gray-200 text-black hover:bg-gray-100"
              >
                Hủy
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Đang tạo..." : "Tạo cơ hội"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Tổng cơ hội</CardTitle>
            <Target className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{filteredDeals.length}</div>
            <p className="text-xs text-gray-500">Đang theo dõi</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Tổng giá trị</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{totalValue.toFixed(1)}M VNĐ</div>
            <p className="text-xs text-gray-500">Pipeline hiện tại</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Tỷ lệ thành công</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{winRate}%</div>
            <p className="text-xs text-gray-500">Won / (Won + Lost)</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Đến hạn</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{dueThisWeek}</div>
            <p className="text-xs text-gray-500">Tuần này</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white border-gray-200">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm cơ hội..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200 text-black"
              />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-48 bg-white border-gray-200 text-black">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">Tất cả giai đoạn</SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage.key} value={stage.key}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Danh sách cơ hội</CardTitle>
          <CardDescription className="text-gray-500">{filteredDeals.length} cơ hội được tìm thấy</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="text-gray-600">Cơ hội</TableHead>
                <TableHead className="text-gray-600">Khách hàng</TableHead>
                <TableHead className="text-gray-600">Giá trị</TableHead>
                <TableHead className="text-gray-600">Giai đoạn</TableHead>
                <TableHead className="text-gray-600">Xác suất</TableHead>
                <TableHead className="text-gray-600">Ngày đóng</TableHead>
                <TableHead className="text-gray-600">Người phụ trách</TableHead>
                <TableHead className="text-gray-600"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.map((deal) => (
                <TableRow key={deal.id} className="border-gray-200">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-black">{deal.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{deal.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{deal.customer_name || '-'}</TableCell>
                  <TableCell className="text-gray-600 font-medium">
                    {deal.value ? deal.value.toLocaleString('vi-VN') + ' đ' : '-'}
                  </TableCell>
                  <TableCell>{getStageBadge(deal.stage)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className={`text-sm font-medium ${getProbabilityColor(deal.probability)}`}>
                        {deal.probability}%
                      </div>
                      <Progress value={deal.probability} className="h-1 w-16" />
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {deal.expected_close_date ? new Date(deal.expected_close_date).toLocaleDateString('vi-VN') : '-'}
                  </TableCell>
                  <TableCell className="text-gray-600">{deal.owner_name || '-'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-black">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-gray-200">
                        <DropdownMenuItem 
                          className="text-gray-600 hover:bg-gray-100"
                          onClick={() => router.push(`/deals/${deal.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-gray-600 hover:bg-gray-100"
                          onClick={() => openEditDialog(deal)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 hover:bg-gray-100"
                          onClick={() => handleDelete(deal.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* T3.4.1: Edit Deal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white border-gray-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-black">Chỉnh sửa cơ hội</DialogTitle>
            <DialogDescription className="text-gray-500">Cập nhật thông tin cơ hội bán hàng</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-title" className="text-gray-700">
                Tiêu đề cơ hội <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="edit-title" 
                className="bg-white border-gray-200 text-black"
                value={editFormData.title}
                onChange={(e) => handleEditInputChange("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Khách hàng</Label>
              <Select value={editFormData.customer_id} onValueChange={(v) => handleEditInputChange("customer_id", v)}>
                <SelectTrigger className="bg-white border-gray-200 text-black">
                  <SelectValue placeholder="Chọn khách hàng" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 max-h-60">
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name} {c.company ? `(${c.company})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Giá trị (VNĐ)</Label>
              <Input 
                type="number"
                className="bg-white border-gray-200 text-black"
                value={editFormData.value}
                onChange={(e) => handleEditInputChange("value", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Giai đoạn</Label>
              <Select value={editFormData.stage} onValueChange={(v) => handleEditInputChange("stage", v)}>
                <SelectTrigger className="bg-white border-gray-200 text-black">
                  <SelectValue placeholder="Chọn giai đoạn" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {stages.map((stage) => (
                    <SelectItem key={stage.key} value={stage.key}>{stage.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Xác suất (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                className="bg-white border-gray-200 text-black"
                value={editFormData.probability}
                onChange={(e) => handleEditInputChange("probability", e.target.value)}
              />
              {stageProbabilityMap[editFormData.stage] !== undefined && 
               parseInt(editFormData.probability) !== stageProbabilityMap[editFormData.stage] && (
                <p className="text-xs text-orange-500">
                  ⚠️ Đề xuất: {stageProbabilityMap[editFormData.stage]}% cho stage này
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Ngày đóng dự kiến</Label>
              <Input 
                type="date"
                className="bg-white border-gray-200 text-black"
                value={editFormData.expected_close_date}
                onChange={(e) => handleEditInputChange("expected_close_date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Ngày đóng thực tế</Label>
              <Input 
                type="date"
                className="bg-white border-gray-200 text-black"
                value={editFormData.actual_close_date}
                onChange={(e) => handleEditInputChange("actual_close_date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Người phụ trách</Label>
              <Select value={editFormData.owner_id} onValueChange={(v) => handleEditInputChange("owner_id", v)}>
                <SelectTrigger className="bg-white border-gray-200 text-black">
                  <SelectValue placeholder="Chọn người phụ trách" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 max-h-60">
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="text-gray-700">Mô tả</Label>
              <Textarea 
                className="bg-white border-gray-200 text-black"
                value={editFormData.description}
                onChange={(e) => handleEditInputChange("description", e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="bg-white border-gray-200 text-black hover:bg-gray-100"
            >
              Hủy
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleUpdate}
              disabled={submitting}
            >
              {submitting ? "Đang lưu..." : "Cập nhật"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
