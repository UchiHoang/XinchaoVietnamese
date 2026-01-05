import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  GraduationCap,
  Search,
  Calendar,
  User,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Mic,
  MoreHorizontal,
  Eye
} from "lucide-react";

// Mock data
const mockBookings = [
  {
    id: "TUT001",
    studentName: "王小明",
    email: "wangxm@gmail.com",
    phone: "+86 138 xxxx xxxx",
    tutorType: "1on1",
    sessions: 8,
    accentPreference: "northern",
    preferredTime: "evening",
    status: "confirmed",
    createdAt: "2024-01-15",
    learningGoal: "Giao tiếp công việc tại Việt Nam"
  },
  {
    id: "TUT002",
    studentName: "李华",
    email: "lihua@gmail.com",
    phone: "+86 139 xxxx xxxx",
    tutorType: "group",
    sessions: 12,
    accentPreference: "southern",
    preferredTime: "weekend",
    status: "pending",
    createdAt: "2024-01-14",
    learningGoal: "Luyện thi chứng chỉ KNLTV"
  },
  {
    id: "TUT003",
    studentName: "张伟",
    email: "zhangwei@gmail.com",
    phone: "+86 137 xxxx xxxx",
    tutorType: "1on1",
    sessions: 4,
    accentPreference: "northern",
    preferredTime: "morning",
    status: "completed",
    createdAt: "2024-01-10",
    learningGoal: "Học tiếng Việt cơ bản"
  },
  {
    id: "TUT004",
    studentName: "陈芳",
    email: "chenfang@gmail.com",
    phone: "+86 136 xxxx xxxx",
    tutorType: "group",
    sessions: 8,
    accentPreference: "northern",
    preferredTime: "afternoon",
    status: "cancelled",
    createdAt: "2024-01-08",
    learningGoal: "Giao tiếp hàng ngày"
  },
];

const AdminTutorBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = 
      booking.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesType = typeFilter === "all" || booking.tutorType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã xác nhận
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
            <Clock className="w-3 h-3 mr-1" />
            Chờ xác nhận
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-muted text-muted-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            Hoàn thành
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
            <XCircle className="w-3 h-3 mr-1" />
            Đã hủy
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === "1on1" ? (
      <Badge variant="outline" className="gap-1">
        <User className="w-3 h-3" /> 1:1
      </Badge>
    ) : (
      <Badge variant="outline" className="gap-1 border-accent text-accent">
        <Users className="w-3 h-3" /> Nhóm
      </Badge>
    );
  };

  const getTimeLabel = (time: string) => {
    const labels: Record<string, string> = {
      morning: "Sáng",
      afternoon: "Chiều",
      evening: "Tối",
      weekend: "Cuối tuần"
    };
    return labels[time] || time;
  };

  // Stats
  const totalBookings = mockBookings.length;
  const pendingCount = mockBookings.filter(b => b.status === "pending").length;
  const confirmedCount = mockBookings.filter(b => b.status === "confirmed").length;
  const oneOnOneCount = mockBookings.filter(b => b.tutorType === "1on1").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Đăng ký gia sư</h1>
        <p className="text-muted-foreground">Quản lý các đăng ký học với gia sư</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng đăng ký</p>
                <p className="text-2xl font-bold text-foreground">{totalBookings}</p>
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
                <p className="text-sm text-muted-foreground">Chờ xác nhận</p>
                <p className="text-2xl font-bold text-warning">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đang học</p>
                <p className="text-2xl font-bold text-primary">{confirmedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Học 1:1</p>
                <p className="text-2xl font-bold text-accent">{oneOnOneCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle>Danh sách đăng ký</CardTitle>
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
                  <SelectItem value="pending">Chờ xác nhận</SelectItem>
                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Hình thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="1on1">Học 1:1</SelectItem>
                  <SelectItem value="group">Học nhóm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Học viên</TableHead>
                  <TableHead>Hình thức</TableHead>
                  <TableHead>Số buổi</TableHead>
                  <TableHead>Giọng</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {booking.studentName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{booking.studentName}</p>
                          <p className="text-sm text-muted-foreground">{booking.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(booking.tutorType)}</TableCell>
                    <TableCell>
                      <span className="font-medium">{booking.sessions}</span>
                      <span className="text-muted-foreground text-sm"> buổi</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mic className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">
                          {booking.accentPreference === "northern" ? "Bắc" : "Nam"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{getTimeLabel(booking.preferredTime)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {booking.createdAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Không tìm thấy đăng ký nào</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTutorBookings;
