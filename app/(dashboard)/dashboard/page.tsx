"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, DollarSign, Target, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useEffect, useState } from "react"

function countNewCustomersThisMonth(customers: any[]): number {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  return customers.filter(c => {
    const created = new Date(c.created_at);
    return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
  }).length;
}

function totalDealValue(deals: any[]): number {
  return deals.reduce((sum, d) => sum + (d.value || 0), 0);
}

function countDealsByStage(deals: any[]) {
  const result: Record<string, number> = {};
  deals.forEach(d => {
    result[d.stage] = (result[d.stage] || 0) + 1;
  });
  return result;
}

function totalDealValueByStage(deals: any[]) {
  const result: Record<string, number> = {};
  deals.forEach(d => {
    result[d.stage] = (result[d.stage] || 0) + (d.value || 0);
  });
  return result;
}

function getRecentActivities(activities: any[], limit = 5) {
  return [...activities]
    .sort((a, b) => new Date(b.activity_date || b.created_at).getTime() - new Date(a.activity_date || a.created_at).getTime())
    .slice(0, limit);
}

function successRate(deals: any[]): number {
  const total = deals.length;
  if (total === 0) return 0;
  // Tính tỷ lệ thành công dựa trên stage 'won' hoặc 'thanhcong'
  const success = deals.filter(d => d.stage === 'won' || d.stage === 'thanhcong').length;
  return Math.round((success / total) * 100);
}

function getMonthlyRevenue(deals: any[]): Array<{month: string, revenue: number}> {
  const monthlyData: Record<string, number> = {};
  
  deals.forEach(d => {
    if (!d.expected_close_date) return;
    const date = new Date(d.expected_close_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!monthlyData[monthName]) {
      monthlyData[monthName] = 0;
    }
    monthlyData[monthName] += d.value || 0;
  });
  
  // Sắp xếp theo thời gian và lấy 6 tháng gần nhất
  return Object.entries(monthlyData)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([month, revenue]) => ({ month, revenue }));
}

export default function DashboardPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/deals").then(res => res.json()),
      fetch("/api/customers").then(res => res.json()),
      fetch("/api/activities").then(res => res.json()),
      fetch("/api/users").then(res => res.json()),
    ]).then(([dealsData, customersData, activitiesData, usersData]) => {
      console.log('Dashboard API Response - Deals:', dealsData);
      console.log('Total deals received:', dealsData?.data?.length);
      const dealsArray = dealsData.data || [];
      console.log('First deal sample:', JSON.stringify(dealsArray[0], null, 2));
      console.log('Deals stage distribution:', JSON.stringify(dealsArray.reduce((acc: any, d: any) => {
        acc[d.stage] = (acc[d.stage] || 0) + 1;
        return acc;
      }, {}), null, 2));
      
      setDeals(dealsArray)
      setCustomers(customersData.data || [])
      setActivities(activitiesData.data || [])
      setUsers(usersData.data || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div>Đang tải dữ liệu...</div>

  // Pipeline theo stage
  const pipelineStages = [
    { stage: "Đăng ký", key: "Đăng ký", color: "bg-purple-500" },
    { stage: "Tiềm năng", key: "prospect", color: "bg-blue-500" },
    { stage: "Demo", key: "demo", color: "bg-yellow-500" },
    { stage: "Đề xuất", key: "proposal", color: "bg-orange-500" },
    { stage: "Thành công", key: "won", color: "bg-green-500" },
    { stage: "Thất bại", key: "lost", color: "bg-red-500" },
  ];
  const dealsByStage = countDealsByStage(deals);
  const valueByStage = totalDealValueByStage(deals);
  
  console.log('Pipeline Calculation:');
  console.log('- Total deals:', deals.length);
  console.log('- Deals by stage:', JSON.stringify(dealsByStage, null, 2));
  console.log('- Value by stage:', JSON.stringify(valueByStage, null, 2));
  console.log('- Pipeline stages keys:', pipelineStages.map(s => `"${s.key}"`).join(', '));
  
  const pipelineData = pipelineStages.map(item => ({
    ...item,
    count: dealsByStage[item.key] || 0,
    value: (valueByStage[item.key] || 0).toLocaleString() + " VNĐ"
  }));

  // KPI
  const kpiData = [
    {
      title: "Khách hàng mới",
      value: countNewCustomersThisMonth(customers).toString(),
      change: "+12%", // TODO: tính toán động nếu muốn
      trend: "up",
      icon: Users,
      description: "So với tháng trước",
    },
    {
      title: "Cơ hội mở",
      value: deals.length.toString(),
      change: "+8%",
      trend: "up",
      icon: Target,
      description: "Đang trong pipeline",
    },
    {
      title: "Doanh thu dự kiến",
      value: totalDealValue(deals).toLocaleString() + " VNĐ",
      change: "-3%",
      trend: "down",
      icon: DollarSign,
      description: "Quý này",
    },
    {
      title: "Tỷ lệ thành công",
      value: successRate(deals) + "%",
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
      description: "Lead to customer",
    },
  ];

  // Hoạt động gần đây
  const recentActivities = getRecentActivities(activities, 5).map(act => ({
    customer: act.customer_name || customers.find(c => c.id === act.customer_id)?.name || "Khách hàng #" + act.customer_id,
    action: act.type,
    value: act.deal_id ? (deals.find(d => d.id === act.deal_id)?.value?.toLocaleString() + " VNĐ" || "") : "",
    time: new Date(act.activity_date || act.created_at).toLocaleString("vi-VN"),
  }));

  // Doanh thu theo tháng
  const monthlyRevenue = getMonthlyRevenue(deals);
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Dashboard</h1>
        <p className="text-gray-500">Tổng quan hiệu suất kinh doanh</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{kpi.value}</div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className={`flex items-center ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {kpi.change}
                </span>
                <span>{kpi.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Pipeline */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">	Quy trình bán hàng</CardTitle>
            <CardDescription className="text-gray-500">Phân bố cơ hội theo giai đoạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pipelineData.map((stage, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <span className="text-gray-700 font-medium">{stage.stage}</span>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                      {stage.count}
                    </Badge>
                  </div>
                  <span className="text-gray-600 font-semibold">{stage.value}</span>
                </div>
                <Progress value={(stage.count / 103) * 100} className="h-2 bg-gray-100" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Hoạt động gần đây</CardTitle>
            <CardDescription className="text-gray-500">Cập nhật mới nhất từ team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="space-y-1">
                    <p className="text-gray-700 font-medium">{activity.customer}</p>
                    <p className="text-sm text-gray-500">{activity.action}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-gray-700 font-semibold">{activity.value}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Doanh thu theo tháng</CardTitle>
          <CardDescription className="text-gray-500">Biểu đồ doanh thu 6 tháng gần đây</CardDescription>
        </CardHeader>
        <CardContent>
          {monthlyRevenue.length > 0 ? (
            <div className="space-y-4">
              {monthlyRevenue.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{item.month}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {item.revenue.toLocaleString()} VNĐ
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all"
                      style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Chưa có dữ liệu doanh thu</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
