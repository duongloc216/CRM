"use client"

import { useEffect, useState } from "react"
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
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Eye, Building2, Mail, Phone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

type Customer = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  source: string;
  status: string;
  last_contact: string;
  tags?: string;
};

// Thêm hàm ánh xạ tag sang màu
const tagColors: { [key: string]: string } = {
  VIP: 'bg-purple-100 text-purple-700 border-purple-200',
  New: 'bg-green-100 text-green-700 border-green-200',
  Returning: 'bg-blue-100 text-blue-700 border-blue-200',
  Important: 'bg-red-100 text-red-700 border-red-200',
  Loyal: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Blocked: 'bg-gray-300 text-gray-700 border-gray-400',
  Partner: 'bg-pink-100 text-pink-700 border-pink-200',
  Test: 'bg-orange-100 text-orange-700 border-orange-200',
  Internal: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Premium: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  default: 'bg-gray-100 text-gray-700 border-gray-200',
};

function getTagColor(tag: string) {
  return tagColors[tag] || tagColors.default;
}

// Đảm bảo Tailwind build đủ các class màu cho badge tag
const _tailwindBadgeColors = [
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-green-100 text-green-700 border-green-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-red-100 text-red-700 border-red-200',
  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'bg-gray-300 text-gray-700 border-gray-400',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-cyan-100 text-cyan-700 border-cyan-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-gray-100 text-gray-700 border-gray-200',
];

// Thêm hàm format ngày
function formatDate(dateString: string) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('vi-VN');
}

// Hàm format tiền Việt Nam: bỏ phần thập phân, mỗi 3 số cách 1 khoảng trắng nhỏ
function formatMoney(value: number | string) {
  if (value === null || value === undefined) return '';
  const intValue = Math.floor(Number(value));
  // Chuyển thành chuỗi, tách từng nhóm 3 số từ phải sang trái bằng dấu chấm
  return intValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [deals, setDeals] = useState<any[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  // T1.2.1: Form state cho customer
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    source: "",
    status: "prospect",
    tags: ""
  })

  // Reset form khi đóng dialog
  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      source: "",
      status: "prospect",
      tags: ""
    })
  }

  // T1.2.2: onChange handler
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // T1.3.1: Submit handler - gọi POST API
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên khách hàng")
      return
    }
    if (!formData.email.trim()) {
      alert("Vui lòng nhập email")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const result = await res.json()
      
      if (!res.ok) {
        alert(result.message || "Có lỗi xảy ra")
        return
      }

      // T1.3.4: Refresh data sau khi submit thành công
      const refreshRes = await fetch("/api/customers")
      const refreshData = await refreshRes.json()
      setCustomers(refreshData.data || [])

      // T1.3.5: Đóng dialog và reset form
      setIsAddDialogOpen(false)
      resetForm()
      alert("Tạo khách hàng thành công!")
    } catch (err) {
      alert("Có lỗi xảy ra khi tạo khách hàng")
    } finally {
      setSubmitting(false)
    }
  }

  // T3.5.2: Delete handler
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa khách hàng này?")) return

    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" })
      const result = await res.json()
      
      if (!res.ok) {
        alert(result.message || "Có lỗi xảy ra")
        return
      }

      // Refresh data
      const refreshRes = await fetch("/api/customers")
      const refreshData = await refreshRes.json()
      setCustomers(refreshData.data || [])
      alert("Xóa khách hàng thành công!")
    } catch (err) {
      alert("Có lỗi xảy ra khi xóa khách hàng")
    }
  }

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((response) => {
        setCustomers(response.data || [])
        setLoading(false)
      })
  }, [])

  // Fetch danh sách deals cho dropdown
  useEffect(() => {
    fetch("/api/deals")
      .then((res) => res.json())
      .then((response) => setDeals(response.data || []));
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-500/20 text-green-400 border-green-500/30 px-1.5 py-0.5 text-xs",
      prospect: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-1.5 py-0.5 text-xs",
      inactive: "bg-red-500/20 text-red-400 border-red-500/30 px-1.5 py-0.5 text-xs",
    }
    const labels = {
      active: "Hoạt động",
      prospect: "Tiềm năng",
      inactive: "Không hoạt động",
    }
    return <Badge className={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) return <div>Đang tải dữ liệu...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý khách hàng</h1>
          <p className="text-slate-400">Quản lý thông tin và tương tác với khách hàng</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Thêm khách hàng
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-gray-200 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-black">Thêm khách hàng mới</DialogTitle>
              <DialogDescription className="text-gray-500">Nhập thông tin chi tiết của khách hàng</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Tên khách hàng <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="name" 
                  className="bg-white border-gray-200 text-black"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-gray-700">
                  Công ty
                </Label>
                <Input 
                  id="company" 
                  className="bg-white border-gray-200 text-black"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  className="bg-white border-gray-200 text-black"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">
                  Số điện thoại
                </Label>
                <Input 
                  id="phone" 
                  className="bg-white border-gray-200 text-black"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="address" className="text-gray-700">
                  Địa chỉ
                </Label>
                <Textarea 
                  id="address" 
                  className="bg-white border-gray-200 text-black"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source" className="text-gray-700">
                  Nguồn
                </Label>
                <Select value={formData.source} onValueChange={(v) => handleInputChange("source", v)}>
                  <SelectTrigger className="bg-white border-gray-200 text-black">
                    <SelectValue placeholder="Chọn nguồn" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Giới thiệu</SelectItem>
                    <SelectItem value="cold-call">Cold Call</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-700">
                  Trạng thái
                </Label>
                <Select value={formData.status} onValueChange={(v) => handleInputChange("status", v)}>
                  <SelectTrigger className="bg-white border-gray-200 text-black">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="prospect">Tiềm năng</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-gray-700">
                  Tags (phân cách bằng dấu phẩy)
                </Label>
                <Input 
                  id="tags" 
                  className="bg-white border-gray-200 text-black"
                  placeholder="VIP, Hot Lead, ..."
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
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
                {submitting ? "Đang lưu..." : "Lưu khách hàng"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-white border-gray-200">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200 text-black"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-white border-gray-200 text-black">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="prospect">Tiềm năng</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Danh sách khách hàng</CardTitle>
          <CardDescription className="text-gray-500">
            {filteredCustomers.length} khách hàng được tìm thấy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="text-gray-600">Khách hàng</TableHead>
                <TableHead className="text-gray-600">Liên hệ</TableHead>
                <TableHead className="text-gray-600">Trạng thái</TableHead>
                <TableHead className="text-gray-600">Tags</TableHead>
                <TableHead className="text-gray-600">Giá trị</TableHead>
                <TableHead className="text-gray-600">Liên hệ cuối</TableHead>
                <TableHead className="text-gray-600"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="border-gray-200">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-black">{customer.name}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Building2 className="h-3 w-3 mr-1" />
                        {customer.company}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-3 w-3 mr-1" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-3 w-3 mr-1" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell>
                    {customer.tags && customer.tags.split(',').map((tag, idx) => (
                      <Badge key={idx} className={`mr-1 ${getTagColor(tag.trim())}`}>{tag.trim()}</Badge>
                    ))}
                  </TableCell>
                  <TableCell className="text-gray-600 font-medium">{formatMoney((customer as any).total_value)}</TableCell>
                  <TableCell className="text-gray-500">{formatDate(customer.last_contact)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-black">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-gray-200">
                        <DropdownMenuItem className="text-gray-600 hover:bg-gray-100" onClick={() => router.push(`/customers/${customer.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-600 hover:bg-gray-100">
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 hover:bg-gray-100"
                          onClick={() => handleDelete(customer.id)}
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

      {/* Đoạn JSX ẩn để Tailwind build đủ class màu cho badge tag */}
      {false && (
        <div>
          <span className="bg-purple-100 text-purple-700 border-purple-200" />
          <span className="bg-green-100 text-green-700 border-green-200" />
          <span className="bg-blue-100 text-blue-700 border-blue-200" />
          <span className="bg-red-100 text-red-700 border-red-200" />
          <span className="bg-yellow-100 text-yellow-700 border-yellow-200" />
          <span className="bg-gray-300 text-gray-700 border-gray-400" />
          <span className="bg-pink-100 text-pink-700 border-pink-200" />
          <span className="bg-orange-100 text-orange-700 border-orange-200" />
          <span className="bg-cyan-100 text-cyan-700 border-cyan-200" />
          <span className="bg-indigo-100 text-indigo-700 border-indigo-200" />
          <span className="bg-gray-100 text-gray-700 border-gray-200" />
        </div>
      )}
    </div>
  )
}
