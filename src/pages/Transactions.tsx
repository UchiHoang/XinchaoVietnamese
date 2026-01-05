import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/layout/Layout";
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
  Receipt, 
  Search, 
  Download, 
  CheckCircle, 
  Clock, 
  XCircle,
  CreditCard,
  Calendar
} from "lucide-react";

// Mock transaction data
const mockTransactions = [
  {
    id: "TXN001",
    date: "2024-01-15",
    course_vi: "Tiếng Việt Công Sở - Thương Mại",
    course_zh: "商务越南语",
    amount: 299000,
    status: "completed",
    paymentMethod: "Visa ****4242"
  },
  {
    id: "TXN002",
    date: "2024-01-10",
    course_vi: "Luyện Thi Chứng Chỉ KNLTV",
    course_zh: "越南语证书考试准备",
    amount: 499000,
    status: "completed",
    paymentMethod: "Mastercard ****5678"
  },
  {
    id: "TXN003",
    date: "2024-01-05",
    course_vi: "Gói Gia Sư 1:1 - 4 buổi",
    course_zh: "一对一家教套餐 - 4节课",
    amount: 800000,
    status: "pending",
    paymentMethod: "Visa ****4242"
  },
  {
    id: "TXN004",
    date: "2024-01-02",
    course_vi: "Gói Gia Sư Nhóm - 8 buổi",
    course_zh: "小组家教套餐 - 8节课",
    amount: 1200000,
    status: "failed",
    paymentMethod: "JCB ****9012"
  },
];

const Transactions = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = mockTransactions.filter(txn => 
    txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (language === 'vi' ? txn.course_vi : txn.course_zh).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            {language === 'vi' ? "Thành công" : "成功"}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
            <Clock className="w-3 h-3 mr-1" />
            {language === 'vi' ? "Đang xử lý" : "处理中"}
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
            <XCircle className="w-3 h-3 mr-1" />
            {language === 'vi' ? "Thất bại" : "失败"}
          </Badge>
        );
      default:
        return null;
    }
  };

  const totalSpent = mockTransactions
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {language === 'vi' ? "Lịch sử giao dịch" : "交易历史"}
          </h1>
          <p className="text-muted-foreground">
            {language === 'vi' 
              ? "Xem tất cả các giao dịch thanh toán của bạn"
              : "查看您的所有支付交易"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'vi' ? "Tổng giao dịch" : "总交易数"}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {mockTransactions.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'vi' ? "Tổng chi tiêu" : "总支出"}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {totalSpent.toLocaleString()}₫
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'vi' ? "Giao dịch gần nhất" : "最近交易"}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {mockTransactions[0]?.date || "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>
                {language === 'vi' ? "Danh sách giao dịch" : "交易列表"}
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'vi' ? "Tìm kiếm giao dịch..." : "搜索交易..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'vi' ? "Mã GD" : "交易号"}</TableHead>
                    <TableHead>{language === 'vi' ? "Ngày" : "日期"}</TableHead>
                    <TableHead>{language === 'vi' ? "Nội dung" : "内容"}</TableHead>
                    <TableHead>{language === 'vi' ? "Số tiền" : "金额"}</TableHead>
                    <TableHead>{language === 'vi' ? "Trạng thái" : "状态"}</TableHead>
                    <TableHead>{language === 'vi' ? "Phương thức" : "支付方式"}</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                      <TableCell>{txn.date}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {language === 'vi' ? txn.course_vi : txn.course_zh}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {txn.amount.toLocaleString()}₫
                      </TableCell>
                      <TableCell>{getStatusBadge(txn.status)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {txn.paymentMethod}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {language === 'vi' 
                    ? "Không tìm thấy giao dịch nào"
                    : "未找到交易记录"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Transactions;
