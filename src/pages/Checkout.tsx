import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Lock, CheckCircle, ArrowLeft, Shield, Zap } from "lucide-react";
import { toast } from "sonner";

// Mock course data
const mockCourses: Record<string, { title_vi: string; title_zh: string; price: number; originalPrice?: number; description_vi: string; description_zh: string; isPremium?: boolean; includes?: { vi: string; zh: string }[] }> = {
  "1": { 
    title_vi: "Tiếng Việt Công Sở - Thương Mại", 
    title_zh: "商务越南语", 
    price: 299000,
    description_vi: "Khóa học tiếng Việt chuyên ngành cho môi trường công việc",
    description_zh: "专业商务越南语课程"
  },
  "2": { 
    title_vi: "Luyện Thi Chứng Chỉ KNLTV", 
    title_zh: "越南语证书考试准备", 
    price: 499000,
    description_vi: "Ôn tập và luyện đề thi chứng chỉ năng lực tiếng Việt",
    description_zh: "复习并练习越南语能力证书考试"
  },
  "premium": { 
    title_vi: "Gói Premium - Trọn bộ khóa học", 
    title_zh: "高级套餐 - 全部课程", 
    price: 999000,
    originalPrice: 1598000,
    description_vi: "Mở khóa tất cả khóa học Premium + 4 buổi học 1:1 với gia sư",
    description_zh: "解锁所有高级课程 + 4节一对一家教课",
    isPremium: true,
    includes: [
      { vi: "Tiếng Việt Công Sở - Thương Mại", zh: "商务越南语" },
      { vi: "Luyện Thi Chứng Chỉ KNLTV", zh: "越南语证书考试准备" },
      { vi: "4 buổi học 1:1 với gia sư", zh: "4节一对一家教课" },
      { vi: "Truy cập vĩnh viễn", zh: "永久访问" },
      { vi: "Hỗ trợ ưu tiên 24/7", zh: "24/7优先支持" },
    ]
  },
};

const Checkout = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");

  const course = courseId ? mockCourses[courseId] : null;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsComplete(true);
    toast.success(language === 'vi' ? "Thanh toán thành công!" : "支付成功！");
  };

  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'vi' ? "Không tìm thấy khóa học" : "课程未找到"}
          </h1>
          <Button onClick={() => navigate("/courses")} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'vi' ? "Quay lại khóa học" : "返回课程"}
          </Button>
        </div>
      </Layout>
    );
  }

  if (isComplete) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-lg mx-auto text-center">
            <CardContent className="pt-12 pb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {language === 'vi' ? "Thanh toán thành công!" : "支付成功！"}
              </h1>
              <p className="text-muted-foreground mb-6">
                {language === 'vi' 
                  ? "Bạn đã mở khóa thành công khóa học này. Hãy bắt đầu học ngay!"
                  : "您已成功解锁此课程。立即开始学习吧！"}
              </p>
              <div className="space-y-3">
                <Button onClick={() => navigate("/courses")} className="w-full">
                  {language === 'vi' ? "Bắt đầu học ngay" : "立即开始学习"}
                </Button>
                <Button variant="outline" onClick={() => navigate("/profile")} className="w-full">
                  {language === 'vi' ? "Xem lịch sử giao dịch" : "查看交易历史"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'vi' ? "Quay lại" : "返回"}
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Order Summary */}
          <Card className="order-2 lg:order-1 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                {language === 'vi' ? "Thông tin thanh toán" : "支付信息"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {language === 'vi' ? "Tên chủ thẻ" : "持卡人姓名"}
                  </Label>
                  <Input
                    id="name"
                    placeholder="NGUYEN VAN A"
                    value={name}
                    onChange={(e) => setName(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">
                    {language === 'vi' ? "Số thẻ" : "卡号"}
                  </Label>
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">
                      {language === 'vi' ? "Ngày hết hạn" : "有效期"}
                    </Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      maxLength={3}
                      required
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      {language === 'vi' ? "Đang xử lý..." : "处理中..."}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      {language === 'vi' 
                        ? `Thanh toán ${course.price.toLocaleString()}₫`
                        : `支付 ${course.price.toLocaleString()}₫`}
                    </span>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  {language === 'vi' 
                    ? "Thanh toán được bảo mật bởi SSL"
                    : "SSL安全支付"}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Course Info */}
          <div className="order-1 lg:order-2 space-y-4">
            <Card className={course.isPremium ? "border-2 border-primary bg-gradient-to-br from-primary/5 to-accent/5" : ""}>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={course.isPremium ? "bg-gradient-to-r from-primary to-accent text-white" : "w-fit"}>
                    {course.isPremium 
                      ? (language === 'vi' ? "🔥 Gói Premium" : "🔥 高级套餐")
                      : (language === 'vi' ? "Trả phí" : "付费")}
                  </Badge>
                  {course.isPremium && course.originalPrice && (
                    <Badge variant="secondary" className="bg-warning/10 text-warning">
                      {language === 'vi' ? "Giảm 30%" : "优惠30%"}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{language === 'vi' ? course.title_vi : course.title_zh}</CardTitle>
                <CardDescription>
                  {language === 'vi' ? course.description_vi : course.description_zh}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Premium Package Includes */}
                {course.isPremium && course.includes && (
                  <div className="mb-4 p-4 bg-background rounded-lg border border-border">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      {language === 'vi' ? "Bao gồm:" : "包括："}
                    </h4>
                    <ul className="space-y-2">
                      {course.includes.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                          {language === 'vi' ? item.vi : item.zh}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Separator className="mb-4" />
                <div className="space-y-3">
                  {course.originalPrice && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {language === 'vi' ? "Giá gốc" : "原价"}
                      </span>
                      <span className="font-medium line-through text-muted-foreground">
                        {course.originalPrice.toLocaleString()}₫
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {language === 'vi' ? "Giá ưu đãi" : "优惠价"}
                    </span>
                    <span className="font-medium">{course.price.toLocaleString()}₫</span>
                  </div>
                  {course.originalPrice && (
                    <div className="flex justify-between text-primary">
                      <span>{language === 'vi' ? "Tiết kiệm" : "节省"}</span>
                      <span className="font-medium">
                        -{(course.originalPrice - course.price).toLocaleString()}₫
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>{language === 'vi' ? "Tổng cộng" : "总计"}</span>
                    <span className="text-primary">{course.price.toLocaleString()}₫</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {language === 'vi' ? "Truy cập vĩnh viễn" : "永久访问"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'vi' 
                        ? "Mua một lần, học mãi mãi. Bao gồm tất cả bản cập nhật trong tương lai."
                        : "一次购买，终身学习。包括所有未来更新。"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {course.isPremium && (
              <Card className="bg-warning/5 border-warning/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-warning mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {language === 'vi' ? "Hoàn tiền 100%" : "100%退款"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'vi' 
                          ? "Không hài lòng trong 7 ngày đầu? Hoàn tiền 100%, không cần lý do."
                          : "7天内不满意？100%退款，无需理由。"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
