"use client"

import { useState, useEffect } from "react"
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
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Users,
  Workflow,
  Tag,
  Zap,
  Calendar,
  MessageSquare,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  last_login: string;
};

export default function SettingsPage() {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isAddTagDialogOpen, setIsAddTagDialogOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // T1.2.5: Form state cho user
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    status: "active"
  })

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "",
      password: "",
      status: "active"
    })
  }

  // T1.2.6: onChange handler
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // T1.3.3: Submit handler
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên người dùng")
      return
    }
    if (!formData.email.trim()) {
      alert("Vui lòng nhập email")
      return
    }
    if (!formData.role) {
      alert("Vui lòng chọn vai trò")
      return
    }
    if (!formData.password || formData.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const result = await res.json()
      
      if (!res.ok) {
        alert(result.message || "Có lỗi xảy ra")
        return
      }

      // Refresh data
      const refreshRes = await fetch("/api/users")
      const refreshData = await refreshRes.json()
      setUsers(refreshData.data || [])

      setIsAddUserDialogOpen(false)
      resetForm()
      alert("Tạo người dùng thành công!")
    } catch (err) {
      alert("Có lỗi xảy ra khi tạo người dùng")
    } finally {
      setSubmitting(false)
    }
  }

  // T3.5.4: Delete handler
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" })
      const result = await res.json()
      
      if (!res.ok) {
        alert(result.message || "Có lỗi xảy ra")
        return
      }

      const refreshRes = await fetch("/api/users")
      const refreshData = await refreshRes.json()
      setUsers(refreshData.data || [])
      alert("Xóa người dùng thành công!")
    } catch (err) {
      alert("Có lỗi xảy ra khi xóa người dùng")
    }
  }

  // T3.5.1: Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    status: "active"
  })

  // T3.5.2: Open edit dialog handler
  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "", // Password để trống, chỉ cập nhật nếu nhập
      status: user.status
    })
    setIsEditDialogOpen(true)
  }

  // T3.5.3: Edit form onChange
  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({ ...prev, [field]: value }))
  }

  // T3.5.4: Update handler
  const handleUpdate = async () => {
    if (!editingUser) return

    if (!editFormData.name.trim()) {
      alert("Vui lòng nhập tên người dùng")
      return
    }
    if (!editFormData.email.trim()) {
      alert("Vui lòng nhập email")
      return
    }
    if (!editFormData.role) {
      alert("Vui lòng chọn vai trò")
      return
    }
    // Password optional when updating

    setSubmitting(true)
    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData)
      })
      const result = await res.json()
      
      if (!res.ok) {
        alert(result.message || "Có lỗi xảy ra")
        return
      }

      const refreshRes = await fetch("/api/users")
      const refreshData = await refreshRes.json()
      setUsers(refreshData.data || [])

      setIsEditDialogOpen(false)
      setEditingUser(null)
      alert("Cập nhật người dùng thành công!")
    } catch (err) {
      alert("Có lỗi xảy ra khi cập nhật")
    } finally {
      setSubmitting(false)
    }
  }

  // T4.1.1: Hard-coded tags (chưa có table tags trong DB, giữ làm demo)
  const tags = [
    { id: 1, name: "VIP", color: "purple", count: 12 },
    { id: 2, name: "Enterprise", color: "blue", count: 8 },
    { id: 3, name: "SME", color: "green", count: 25 },
    { id: 4, name: "Startup", color: "orange", count: 15 },
    { id: 5, name: "Hot Lead", color: "red", count: 6 },
  ]

  // T4.1.2: Demo stub integrations - NOT IMPLEMENTED
  const integrations = [
    {
      name: "Google Calendar (Demo)",
      description: "[Demo stub] Đồng bộ lịch hẹn và nhắc nhở",
      status: "demo",
      icon: Calendar,
    },
    {
      name: "Slack (Demo)",
      description: "[Demo stub] Thông báo và cập nhật qua Slack",
      status: "demo",
      icon: MessageSquare,
    },
    {
      name: "Zapier (Demo)",
      description: "[Demo stub] Tự động hóa workflow với 1000+ ứng dụng",
      status: "demo",
      icon: Zap,
    },
  ]

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-red-500/20 text-red-400 border-red-500/30",
      sales: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      marketing: "bg-green-500/20 text-green-400 border-green-500/30",
    }
    const labels = {
      admin: "Admin",
      sales: "Sales",
      marketing: "Marketing",
    }
    return <Badge className={variants[role as keyof typeof variants]}>{labels[role as keyof typeof labels]}</Badge>
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Hoạt động</Badge>
    ) : (
      <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Không hoạt động</Badge>
    )
  }

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((response) => {
        setUsers(response.data || [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Cấu hình & Quản trị hệ thống</h1>
        <p className="text-gray-500">Quản lý người dùng, phân quyền và tích hợp hệ thống</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-white border-gray-200">
          <TabsTrigger value="users" className="data-[state=active]:bg-gray-100">
            <Users className="h-4 w-4 mr-2" />
            Người dùng
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-gray-100">
            <Shield className="h-4 w-4 mr-2" />
            Phân quyền
          </TabsTrigger>
        </TabsList>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-black">Quản lý người dùng</h2>
              <p className="text-gray-500">Thêm, sửa, xóa tài khoản người dùng</p>
            </div>
            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm người dùng
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-gray-200">
                <DialogHeader>
                  <DialogTitle className="text-black">Thêm người dùng mới</DialogTitle>
                  <DialogDescription className="text-gray-500">Tạo tài khoản mới cho hệ thống</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="userName" className="text-gray-700">
                      Tên người dùng <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="userName" 
                      className="bg-white border-gray-200 text-black"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userEmail" className="text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="userEmail" 
                      type="email" 
                      className="bg-white border-gray-200 text-black"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userRole" className="text-gray-700">
                      Vai trò <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.role} onValueChange={(v) => handleInputChange("role", v)}>
                      <SelectTrigger className="bg-white border-gray-200 text-black">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userPassword" className="text-gray-700">
                      Mật khẩu <span className="text-red-500">*</span> <span className="text-xs text-gray-400">(tối thiểu 6 ký tự)</span>
                    </Label>
                    <Input 
                      id="userPassword" 
                      type="password" 
                      className="bg-white border-gray-200 text-black"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => { setIsAddUserDialogOpen(false); resetForm(); }}
                    className="bg-white border-gray-200 text-black hover:bg-gray-100"
                  >
                    Hủy
                  </Button>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? "Đang tạo..." : "Tạo người dùng"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="text-gray-700">Người dùng</TableHead>
                    <TableHead className="text-gray-700">Vai trò</TableHead>
                    <TableHead className="text-gray-700">Trạng thái</TableHead>
                    <TableHead className="text-gray-700">Đăng nhập cuối</TableHead>
                    <TableHead className="text-gray-700"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Đang tải dữ liệu...
                      </TableCell>
                    </TableRow>
                  ) : users.map((user) => (
                    <TableRow key={user.id} className="border-gray-200">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-black">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-gray-500">{user.last_login}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-black">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white border-gray-200">
                            <DropdownMenuItem 
                              className="text-gray-700 hover:bg-gray-100"
                              onClick={() => openEditDialog(user)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-400 hover:bg-gray-100"
                              onClick={() => handleDelete(user.id)}
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
        </TabsContent>

        {/* Permissions */}
        <TabsContent value="permissions" className="space-y-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Ma trận phân quyền</CardTitle>
              <CardDescription className="text-gray-500">Cấu hình quyền truy cập cho từng vai trò</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
                  <div>Chức năng</div>
                  <div className="text-center">Admin</div>
                  <div className="text-center">Sales</div>
                  <div className="text-center">Marketing</div>
                </div>

                {[
                  { name: "Dashboard", admin: true, sales: true, marketing: true },
                  { name: "Quản lý khách hàng", admin: true, sales: true, marketing: true },
                  { name: "Quản lý cơ hội", admin: true, sales: true, marketing: false },
                  { name: "Báo cáo", admin: true, sales: true, marketing: true },
                  { name: "Cấu hình hệ thống", admin: true, sales: false, marketing: false },
                  { name: "Quản lý người dùng", admin: true, sales: false, marketing: false },
                ].map((permission, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 items-center py-3 border-b border-gray-200">
                    <div className="text-gray-700">{permission.name}</div>
                    <div className="flex justify-center">
                      <Switch checked={permission.admin} className="data-[state=checked]:bg-purple-600" />
                    </div>
                    <div className="flex justify-center">
                      <Switch checked={permission.sales} className="data-[state=checked]:bg-purple-600" />
                    </div>
                    <div className="flex justify-center">
                      <Switch checked={permission.marketing} className="data-[state=checked]:bg-purple-600" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* T3.5.5: Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-black">Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription className="text-gray-500">Cập nhật thông tin người dùng</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editUserName" className="text-gray-700">
                Tên người dùng <span className="text-red-500">*</span>
              </Label>
              <Input
                id="editUserName"
                placeholder="Nhập tên người dùng"
                className="bg-white border-gray-300"
                value={editFormData.name}
                onChange={(e) => handleEditInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editUserEmail" className="text-gray-700">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="editUserEmail"
                type="email"
                placeholder="Nhập email"
                className="bg-white border-gray-300"
                value={editFormData.email}
                onChange={(e) => handleEditInputChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editUserRole" className="text-gray-700">
                Vai trò <span className="text-red-500">*</span>
              </Label>
              <Select value={editFormData.role} onValueChange={(value) => handleEditInputChange("role", value)}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editUserPassword" className="text-gray-700">
                Mật khẩu mới (để trống nếu không đổi)
              </Label>
              <Input
                id="editUserPassword"
                type="password"
                placeholder="Nhập mật khẩu mới"
                className="bg-white border-gray-300"
                value={editFormData.password}
                onChange={(e) => handleEditInputChange("password", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editUserStatus" className="text-gray-700">Trạng thái</Label>
              <Select value={editFormData.status} onValueChange={(value) => handleEditInputChange("status", value)}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={handleUpdate}
              disabled={submitting}
            >
              {submitting ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
