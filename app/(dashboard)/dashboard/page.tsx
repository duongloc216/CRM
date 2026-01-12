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

function countNewCustomersLastMonth(customers: any[]): number {
  const now = new Date();
  const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  return customers.filter(c => {
    const created = new Date(c.created_at);
    return created.getMonth() === lastMonth && created.getFullYear() === lastMonthYear;
  }).length;
}

// T2.1.1: Chỉ đếm deals có stage NOT IN ('won', 'lost')
function countOpenDeals(deals: any[]): number {
  return deals.filter(d => d.stage !== 'won' && d.stage !== 'lost').length;
}

function countOpenDealsLastMonth(deals: any[]): number {
  const now = new Date();
  const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  return deals.filter(d => {
    const created = new Date(d.created_at);
    return d.stage !== 'won' && d.stage !== 'lost' && 
           created.getMonth() === lastMonth && created.getFullYear() === lastMonthYear;
  }).length;
}

// T2.1.2: Doanh thu dự kiến = weighted = SUM(value * probability / 100), chỉ deals đang mở
function weightedRevenue(deals: any[]): number {
  return deals
    .filter(d => d.stage !== 'won' && d.stage !== 'lost')
    .reduce((sum, d) => sum + ((d.value || 0) * (d.probability || 0) / 100), 0);
}

function weightedRevenueLastMonth(deals: any[]): number {
  const now = new Date();
  const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  return deals
    .filter(d => {
      const created = new Date(d.created_at);
      return d.stage !== 'won' && d.stage !== 'lost' &&
             created.getMonth() === lastMonth && created.getFullYear() === lastMonthYear;
    })
    .reduce((sum, d) => sum + ((d.value || 0) * (d.probability || 0) / 100), 0);
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

// T2.1.3: Tỷ lệ thành công - chỉ dùng 'won', bỏ 'thanhcong'
function successRate(deals: any[]): number {
  const closedDeals = deals.filter(d => d.stage === 'won' || d.stage === 'lost');
  if (closedDeals.length === 0) return 0;
  const wonDeals = deals.filter(d => d.stage === 'won').length;
  return Math.round((wonDeals / closedDeals.length) * 100);
}

function successRateLastMonth(deals: any[]): number {
  const now = new Date();
  const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const lastMonthDeals = deals.filter(d => {
    const closed = d.actual_close_date ? new Date(d.actual_close_date) : null;
    return closed && closed.getMonth() === lastMonth && closed.getFullYear() === lastMonthYear;
  });
  const closedDeals = lastMonthDeals.filter(d => d.stage === 'won' || d.stage === 'lost');
  if (closedDeals.length === 0) return 0;
  const wonDeals = lastMonthDeals.filter(d => d.stage === 'won').length;
  return Math.round((wonDeals / closedDeals.length) * 100);
}

// T2.1.4, T2.1.5: Tính % change thật
function calcPercentChange(current: number, previous: number): { change: string, trend: 'up' | 'down' } {
  if (previous === 0) {
    return current > 0 ? { change: '+100%', trend: 'up' } : { change: '0%', trend: 'up' };
  }
  const pct = Math.round(((current - previous) / previous) * 100);
  return {
    change: (pct >= 0 ? '+' : '') + pct + '%',
    trend: pct >= 0 ? 'up' : 'down'
  };
}

// T2.2.1, T2.2.2, T2.2.3: Doanh thu theo tháng - chỉ deals won với actual_close_date
function getMonthlyRevenue(deals: any[]): Array<{month: string, revenue: number, sortKey: number}> {
  const monthlyData: Record<string, { revenue: number, sortKey: number }> = {};
  
  deals.forEach(d => {
    // Chỉ tính deals đã won và có actual_close_date
    if (d.stage !== 'won' || !d.actual_close_date) return;
    
    const date = new Date(d.actual_close_date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const sortKey = year * 100 + month; // T2.2.3: Sort key số học
    const monthName = `Tháng ${month + 1}/${year}`;
    
    if (!monthlyData[monthName]) {
      monthlyData[monthName] = { revenue: 0, sortKey };
    }
    monthlyData[monthName].revenue += d.value || 0;
  });
  
  // T2.2.3: Sắp xếp bằng sortKey số học, không dùng localeCompare
  return Object.entries(monthlyData)
    .map(([month, data]) => ({ month, revenue: data.revenue, sortKey: data.sortKey }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .slice(-6);
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

  // Pipeline theo stage (T4.1.3: thêm negotiation)
  const pipelineStages = [
    { stage: "Đăng ký", key: "Đăng ký", color: "bg-purple-500" },
    { stage: "Tiềm năng", key: "prospect", color: "bg-blue-500" },
    { stage: "Demo", key: "demo", color: "bg-yellow-500" },
    { stage: "Đề xuất", key: "proposal", color: "bg-orange-500" },
    { stage: "Đàm phán", key: "negotiation", color: "bg-pink-500" },
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

  // KPI với tính toán thật (T2.1.4, T2.1.5)
  const newCustomersThis = countNewCustomersThisMonth(customers);
  const newCustomersLast = countNewCustomersLastMonth(customers);
  const customersChange = calcPercentChange(newCustomersThis, newCustomersLast);

  const openDealsThis = countOpenDeals(deals);
  const openDealsLast = countOpenDealsLastMonth(deals);
  const openDealsChange = calcPercentChange(openDealsThis, openDealsLast);

  const weightedRevThis = weightedRevenue(deals);
  const weightedRevLast = weightedRevenueLastMonth(deals);
  const revenueChange = calcPercentChange(weightedRevThis, weightedRevLast);

  const successRateThis = successRate(deals);
  const successRateLast = successRateLastMonth(deals);
  const successChange = calcPercentChange(successRateThis, successRateLast);

  const kpiData = [
    {
      title: "Khách hàng mới",
      value: newCustomersThis.toString(),
      change: customersChange.change,
      trend: customersChange.trend,
      icon: Users,
      description: "So với tháng trước",
    },
    {
      title: "Cơ hội mở",
      value: openDealsThis.toString(),
      change: openDealsChange.change,
      trend: openDealsChange.trend,
      icon: Target,
      description: "Đang trong pipeline",
    },
    {
      title: "Doanh thu dự kiến",
      value: Math.round(weightedRevThis).toLocaleString() + " VNĐ",
      change: revenueChange.change,
      trend: revenueChange.trend,
      icon: DollarSign,
      description: "Weighted pipeline",
    },
    {
      title: "Tỷ lệ thành công",
      value: successRateThis + "%",
      change: successChange.change,
      trend: successChange.trend,
      icon: TrendingUp,
      description: "Won / (Won + Lost)",
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
