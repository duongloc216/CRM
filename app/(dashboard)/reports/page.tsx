"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileSpreadsheet, FileText, TrendingUp, TrendingDown, DollarSign, Users, Target, Calendar } from "lucide-react"
import * as XLSX from 'xlsx';

function getRevenueData(deals: any[]) {
  // Ví dụ: tổng hợp doanh thu theo tháng
  const result: Record<string, { revenue: number; deals: number; conversion: number }> = {};
  deals.forEach(d => {
    if (!d.expected_close) return;
    const date = new Date(d.expected_close);
    const key = `Tháng ${date.getMonth() + 1}`;
    if (!result[key]) result[key] = { revenue: 0, deals: 0, conversion: 0 };
    result[key].revenue += d.value || 0;
    result[key].deals += 1;
  });
  // Tính conversion rate mẫu (tùy nghiệp vụ)
  Object.values(result).forEach(r => {
    r.conversion = r.deals > 0 ? Math.round((r.deals / 100) * 1000) / 10 : 0;
  });
  return Object.entries(result).map(([period, data]) => ({ period, ...data }));
}

function getSalesPeople(users: any[], deals: any[]) {
  // Tổng hợp doanh thu, số deal, target mẫu cho từng sales
  return users
    .filter(u => u.role === 'sales')
    .map(u => {
      const userDeals = deals.filter(d => d.owner_id === u.id);
      const revenue = userDeals.reduce((sum, d) => sum + (d.value || 0), 0);
      const target = 1000000000; // target mẫu
      return {
        name: u.name,
        revenue,
        deals: userDeals.length,
        target,
        achievement: target ? Math.round((revenue / target) * 100) : 0,
      };
    });
}

function getStageAnalysis(deals: any[]) {
  // Tổng hợp số deal, giá trị, thời gian trung bình theo stage
  const result: Record<string, { count: number; value: number; avgTime: number }> = {};
  deals.forEach(d => {
    if (!result[d.stage]) result[d.stage] = { count: 0, value: 0, avgTime: 0 };
    result[d.stage].count += 1;
    result[d.stage].value += d.value || 0;
    // avgTime mẫu, có thể tính từ ngày tạo đến ngày đóng
    result[d.stage].avgTime += 30;
  });
  return Object.entries(result).map(([stage, data]) => ({ stage, ...data }));
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<any>(null)
  const [reportType, setReportType] = useState("revenue")
  const [groupBy, setGroupBy] = useState("month")
  const [deals, setDeals] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const exportData = (format: string) => {
    try {
      if (format === 'excel') {
        // Export to Excel
        const ws_deals = XLSX.utils.json_to_sheet(deals.map(d => ({
          'ID': d.id,
          'Tiêu đề': d.title,
          'Khách hàng ID': d.customer_id,
          'Giá trị': d.value,
          'Giai đoạn': d.stage,
          'Xác suất (%)': d.probability,
          'Ngày đóng dự kiến': d.expected_close_date,
          'Mô tả': d.description
        })));
        
        const ws_customers = XLSX.utils.json_to_sheet(customers.map(c => ({
          'ID': c.id,
          'Tên': c.name,
          'Công ty': c.company,
          'Email': c.email,
          'Điện thoại': c.phone,
          'Trạng thái': c.status,
          'Nguồn': c.source
        })));

        const ws_revenue = XLSX.utils.json_to_sheet(revenueData.map(r => ({
          'Kỳ': r.period,
          'Doanh thu': r.revenue,
          'Số deals': r.deals,
          'Tỷ lệ chuyển đổi': r.conversion + '%'
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws_deals, "Deals");
        XLSX.utils.book_append_sheet(wb, ws_customers, "Customers");
        XLSX.utils.book_append_sheet(wb, ws_revenue, "Revenue");
        
        XLSX.writeFile(wb, `CRM_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      } else if (format === 'csv') {
        // Export deals to CSV
        const ws = XLSX.utils.json_to_sheet(deals);
        const csv = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CRM_Deals_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Định dạng PDF đang được phát triển');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Lỗi khi xuất dữ liệu');
    }
  }

  useEffect(() => {
    Promise.all([
      fetch("/api/deals").then(res => res.json()),
      fetch("/api/customers").then(res => res.json()),
      fetch("/api/activities").then(res => res.json()),
      fetch("/api/users").then(res => res.json()),
    ]).then(([dealsData, customersData, activitiesData, usersData]) => {
      setDeals(dealsData.data || [])
      setCustomers(customersData.data || [])
      setActivities(activitiesData.data || [])
      setUsers(usersData.data || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div>Đang tải dữ liệu...</div>

  const revenueData = getRevenueData(deals)
  const salesPeople = getSalesPeople(users, deals)
  const stageAnalysis = getStageAnalysis(deals)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Báo cáo & Xuất dữ liệu</h1>
          <p className="text-gray-500">Phân tích hiệu suất và xuất dữ liệu chi tiết</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportData("excel")}
            className="bg-white border-gray-200 text-black hover:bg-gray-100"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
          <Button
            variant="outline"
            onClick={() => exportData("csv")}
            className="bg-white border-gray-200 text-black hover:bg-gray-100"
          >
            <FileText className="h-4 w-4 mr-2" />
            Xuất CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white border-gray-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Loại báo cáo</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="bg-white border-gray-200 text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="revenue">Doanh thu</SelectItem>
                  <SelectItem value="sales">Nhân viên bán hàng</SelectItem>
                  <SelectItem value="pipeline">Pipeline</SelectItem>
                  <SelectItem value="customers">Khách hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nhóm theo</label>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger className="bg-white border-gray-200 text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="day">Ngày</SelectItem>
                  <SelectItem value="week">Tuần</SelectItem>
                  <SelectItem value="month">Tháng</SelectItem>
                  <SelectItem value="quarter">Quý</SelectItem>
                  <SelectItem value="year">Năm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Khoảng thời gian</label>
              <DatePickerWithRange
                date={dateRange}
                setDate={setDateRange}
                className="bg-white border-gray-200 text-black"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Report */}
      {reportType === "revenue" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Tổng doanh thu</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">4.21B VNĐ</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.2% so với kỳ trước
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Số deals đóng</CardTitle>
                <Target className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">111</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.5% so với kỳ trước
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Tỷ lệ chuyển đổi</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">27.8%</div>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -2.1% so với kỳ trước
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Giá trị TB/Deal</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">38M VNĐ</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +6.2% so với kỳ trước
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Doanh thu theo tháng</CardTitle>
              <CardDescription className="text-gray-500">Biểu đồ doanh thu 6 tháng gần đây</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="space-y-1">
                      <div className="font-medium text-black">{item.period}</div>
                      <div className="text-sm text-gray-500">{item.deals} deals</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-semibold text-black">{formatCurrency(item.revenue)}</div>
                      <div className="text-sm text-gray-500">{item.conversion}% conversion</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sales People Report */}
      {reportType === "sales" && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Hiệu suất nhân viên bán hàng</CardTitle>
            <CardDescription className="text-gray-500">
              Thống kê doanh thu và mục tiêu của từng nhân viên
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {salesPeople.map((person, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="font-medium text-black">{person.name}</div>
                      <div className="text-sm text-gray-500">{person.deals} deals đã đóng</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-semibold text-black">{formatCurrency(person.revenue)}</div>
                      <Badge
                        className={
                          person.achievement >= 100
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }
                      >
                        {person.achievement}% mục tiêu
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tiến độ mục tiêu</span>
                      <span className="text-gray-300">{formatCurrency(person.target)}</span>
                    </div>
                    <Progress value={person.achievement} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pipeline Analysis */}
      {reportType === "pipeline" && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Phân tích Pipeline</CardTitle>
            <CardDescription className="text-gray-500">
              Thống kê cơ hội theo giai đoạn và thời gian xử lý
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stageAnalysis.map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="space-y-1">
                      <div className="font-medium text-black">{stage.stage}</div>
                      <div className="text-sm text-gray-500">{stage.count} cơ hội</div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-semibold text-black">{formatCurrency(stage.value)}</div>
                    <div className="text-sm text-gray-500">{stage.avgTime} ngày TB</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Options */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Tùy chọn xuất dữ liệu</CardTitle>
          <CardDescription className="text-gray-500">Chọn loại dữ liệu và định dạng để xuất</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={() => exportData("customers-excel")}
              className="bg-white border-gray-200 text-black hover:bg-gray-100 h-20 flex-col"
            >
              <Users className="h-6 w-6 mb-2" />
              <span>Khách hàng</span>
              <span className="text-xs text-gray-500">Excel/CSV</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => exportData("deals-excel")}
              className="bg-white border-gray-200 text-black hover:bg-gray-100 h-20 flex-col"
            >
              <Target className="h-6 w-6 mb-2" />
              <span>Cơ hội</span>
              <span className="text-xs text-gray-500">Excel/CSV</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => exportData("activities-excel")}
              className="bg-white border-gray-200 text-black hover:bg-gray-100 h-20 flex-col"
            >
              <Calendar className="h-6 w-6 mb-2" />
              <span>Hoạt động</span>
              <span className="text-xs text-gray-500">Excel/CSV</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => exportData("revenue-excel")}
              className="bg-white border-gray-200 text-black hover:bg-gray-100 h-20 flex-col"
            >
              <DollarSign className="h-6 w-6 mb-2" />
              <span>Doanh thu</span>
              <span className="text-xs text-gray-500">Excel/CSV</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
