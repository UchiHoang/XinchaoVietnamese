import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Search,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Filter,
  MoreHorizontal
} from "lucide-react";

// Mock data
const mockPayments = [
  {
    id: "PAY001",
    user: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    type: "course",
    item: "Tiếng Việt Công Sở",
    amount: 299000,
    status: "completed",
    date: "2024-01-15 14:30",
    method: "Visa ****4242"
  },
  {
    id: "PAY002",
    user: "Trần Thị B",
    email: "tranthib@gmail.com",
    type: "tutor",
    item: "Gia sư 1:1 - 8 buổi",
    amount: 1500000,
    status: "completed",
    date: "2024-01-15 10:15",
    method: "Mastercard ****5678"
  },
  {
    id: "PAY003",
    user: "Lê Văn C",
    email: "levanc@gmail.com",
    type: "course",
    item: "Luyện Thi KNLTV",
    amount: 499000,
    status: "pending",
    date: "2024-01-14 16:45",
    method: "JCB ****9012"
  },
  {
    id: "PAY004",
    user: "Phạm Thị D",
    email: "phamthid@gmail.com",
    type: "tutor",
    item: "Gia sư nhóm - 12 buổi",
    amount: 1200000,
    status: "failed",
    date: "2024-01-14 09:20",
    method: "Visa ****3456"
  },
  {
    id: "PAY005",
    user: "Hoàng Văn E",
    email: "hoangvane@gmail.com",
    type: "course",
    item: "Tiếng Việt Công Sở",
    amount: 299000,
    status: "completed",
    date: "2024-01-13 11:00",
    method: "Mastercard ****7890"
  },
];

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = 
      payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesType = typeFilter === "all" || payment.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Thành công
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
            <Clock className="w-3 h-3 mr-1" />
            Đang xử lý
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
            <XCircle className="w-3 h-3 mr-1" />
            Thất bại
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === "course" ? (
      <Badge variant="outline">Khóa học</Badge>
    ) : (
      <Badge variant="outline" className="border-accent text-accent">Gia sư</Badge>
    );
  };

  // Calculate stats
  const totalRevenue = mockPayments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const todayRevenue = mockPayments
    .filter(p => p.status === "completed" && p.date.includes("2024-01-15"))
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = mockPayments.filter(p => p.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản lý thanh toán</h1>
        <p className="text-muted-foreground">Theo dõi và quản lý các giao dịch thanh toán</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalRevenue.toLocaleString()}₫
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hôm nay</p>
                <p className="text-2xl font-bold text-accent">
                  {todayRevenue.toLocaleString()}₫
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đang xử lý</p>
                <p className="text-2xl font-bold text-warning">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Khách hàng</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(mockPayments.map(p => p.email)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle>Danh sách giao dịch</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="completed">Thành công</SelectItem>
                  <SelectItem value="pending">Đang xử lý</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="course">Khóa học</SelectItem>
                  <SelectItem value="tutor">Gia sư</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã GD</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.user}</p>
                        <p className="text-sm text-muted-foreground">{payment.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(payment.type)}</TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {payment.item}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {payment.amount.toLocaleString()}₫
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {payment.date}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Không tìm thấy giao dịch nào</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;
