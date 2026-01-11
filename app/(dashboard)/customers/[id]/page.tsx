"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CustomerDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/customers/${id}`)
      .then((res) => res.json())
      .then((response) => {
        setCustomer(response.data || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching customer:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  if (!customer) return <div className="p-8 text-center text-red-600">Không tìm thấy khách hàng.</div>;

  const deals = customer.deals || [];
  const activities = customer.activities || [];

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-2">Quay lại</Button>
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">{customer.name}</CardTitle>
          <CardDescription className="text-gray-500">{customer.company}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge>{customer.status}</Badge>
            {customer.tags && customer.tags.split(',').map((tag: string, idx: number) => (
              <Badge key={idx} className="bg-blue-100 text-blue-700 border-blue-200">{tag.trim()}</Badge>
            ))}
          </div>
          <div className="text-gray-700 mb-1">Email: {customer.email}</div>
          <div className="text-gray-700 mb-1">SĐT: {customer.phone}</div>
          <div className="text-gray-700 mb-1">Địa chỉ: {customer.address}</div>
          <div className="text-gray-700 mb-1">Giá trị: {customer.totalValue ? customer.totalValue.toLocaleString('vi-VN') + ' đ' : ''}</div>
          <div className="text-gray-700 mb-1">Liên hệ cuối: {customer.last_contact ? new Date(customer.last_contact).toLocaleDateString('vi-VN') : ''}</div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Giao dịch liên quan ({deals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {deals.length === 0 ? (
            <p className="text-gray-500">Chưa có giao dịch nào</p>
          ) : (
            <ul className="space-y-2">
              {deals.map((deal: any) => (
                <li key={deal.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <span className="font-medium text-gray-800">{deal.title}</span>
                    <Badge className="ml-2">{deal.stage}</Badge>
                  </div>
                  <span className="text-gray-600">{(deal.value || 0).toLocaleString('vi-VN')} VNĐ</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Hoạt động gần đây ({activities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-gray-500">Chưa có hoạt động nào</p>
          ) : (
            <ul className="space-y-2">
              {activities.map((act: any) => (
                <li key={act.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <Badge variant="outline">{act.type}</Badge>
                    <span className="ml-2 text-gray-700">{act.description}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(act.activity_date || act.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 