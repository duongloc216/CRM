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

  const tags = [
    { id: 1, name: "VIP", color: "purple", count: 12 },
    { id: 2, name: "Enterprise", color: "blue", count: 8 },
    { id: 3, name: "SME", color: "green", count: 25 },
    { id: 4, name: "Startup", color: "orange", count: 15 },
    { id: 5, name: "Hot Lead", color: "red", count: 6 },
  ]

  const integrations = [
    {
      name: "Google Calendar",
      description: "Đồng bộ lịch hẹn và nhắc nhở",
      status: "connected",
      icon: Calendar,
    },
    {
      name: "Slack",
      description: "Thông báo và cập nhật qua Slack",
      status: "disconnected",
      icon: MessageSquare,
    },
    {
      name: "Zapier",
      description: "Tự động hóa workflow với 1000+ ứng dụng",
      status: "connected",
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
                      Tên người dùng
                    </Label>
                    <Input id="userName" className="bg-white border-gray-200 text-black" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userEmail" className="text-gray-700">
                      Email
                    </Label>
                    <Input id="userEmail" type="email" className="bg-white border-gray-200 text-black" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userRole" className="text-gray-700">
                      Vai trò
                    </Label>
                    <Select>
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
                      Mật khẩu tạm thời
                    </Label>
                    <Input id="userPassword" type="password" className="bg-white border-gray-200 text-black" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddUserDialogOpen(false)}
                    className="bg-white border-gray-200 text-black hover:bg-gray-100"
                  >
                    Hủy
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">Tạo người dùng</Button>
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
                            <DropdownMenuItem className="text-gray-700 hover:bg-gray-100">
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 hover:bg-gray-100">
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
    </div>
  )
}
