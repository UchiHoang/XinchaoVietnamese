import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Users, 
  User, 
  Calendar,
  Target,
  Mic,
  CreditCard,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";
import { toast } from "sonner";

// Pricing mock data
const pricingPlans = {
  "1on1": {
    sessions: [
      { count: 4, price: 800000, discount: 0 },
      { count: 8, price: 1500000, discount: 6 },
      { count: 12, price: 2100000, discount: 12 },
    ]
  },
  "group": {
    sessions: [
      { count: 4, price: 500000, discount: 0 },
      { count: 8, price: 900000, discount: 12 },
      { count: 12, price: 1200000, discount: 20 },
    ]
  }
};

const TutorRegistration = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    learningGoal: "",
    currentLevel: "beginner",
    tutorType: "1on1",
    sessionCount: 4,
    preferredTime: "",
    accentPreference: "northern",
    notes: ""
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getSelectedPlan = () => {
    const type = formData.tutorType as "1on1" | "group";
    return pricingPlans[type].sessions.find(s => s.count === formData.sessionCount);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success(language === 'vi' ? "Đăng ký thành công!" : "注册成功！");
    navigate("/profile");
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">
            {language === 'vi' ? "Họ và tên" : "姓名"} *
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder={language === 'vi' ? "Nhập họ và tên" : "输入姓名"}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="email@example.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">
          {language === 'vi' ? "Số điện thoại" : "电话号码"} *
        </Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          placeholder="+84 xxx xxx xxx"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentLevel">
          {language === 'vi' ? "Trình độ hiện tại" : "当前水平"}
        </Label>
        <Select
          value={formData.currentLevel}
          onValueChange={(value) => handleInputChange("currentLevel", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">
              {language === 'vi' ? "Mới bắt đầu" : "初学者"}
            </SelectItem>
            <SelectItem value="elementary">
              {language === 'vi' ? "Sơ cấp" : "初级"}
            </SelectItem>
            <SelectItem value="intermediate">
              {language === 'vi' ? "Trung cấp" : "中级"}
            </SelectItem>
            <SelectItem value="advanced">
              {language === 'vi' ? "Cao cấp" : "高级"}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="learningGoal">
          {language === 'vi' ? "Mục tiêu học tập" : "学习目标"} *
        </Label>
        <Textarea
          id="learningGoal"
          value={formData.learningGoal}
          onChange={(e) => handleInputChange("learningGoal", e.target.value)}
          placeholder={language === 'vi' 
            ? "Ví dụ: Giao tiếp công việc, luyện thi chứng chỉ..."
            : "例如：工作交流、备考证书..."}
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>{language === 'vi' ? "Hình thức học" : "学习形式"} *</Label>
        <RadioGroup
          value={formData.tutorType}
          onValueChange={(value) => handleInputChange("tutorType", value)}
          className="grid md:grid-cols-2 gap-4"
        >
          <Label
            htmlFor="1on1"
            className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
              formData.tutorType === "1on1" 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            }`}
          >
            <RadioGroupItem value="1on1" id="1on1" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-5 h-5 text-primary" />
                <span className="font-semibold">
                  {language === 'vi' ? "Học 1:1" : "一对一"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'vi' 
                  ? "Học riêng với gia sư, linh hoạt thời gian và nội dung"
                  : "与家教一对一学习，时间和内容灵活"}
              </p>
            </div>
          </Label>

          <Label
            htmlFor="group"
            className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
              formData.tutorType === "group" 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            }`}
          >
            <RadioGroupItem value="group" id="group" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">
                  {language === 'vi' ? "Học nhóm nhỏ" : "小组学习"}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {language === 'vi' ? "Tiết kiệm 40%" : "节省40%"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'vi' 
                  ? "Học cùng 2-4 bạn khác, tương tác và thực hành nhiều hơn"
                  : "与2-4名同学一起学习，更多互动和练习"}
              </p>
            </div>
          </Label>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label>{language === 'vi' ? "Số buổi học" : "课程数量"} *</Label>
        <RadioGroup
          value={formData.sessionCount.toString()}
          onValueChange={(value) => handleInputChange("sessionCount", parseInt(value))}
          className="grid md:grid-cols-3 gap-4"
        >
          {pricingPlans[formData.tutorType as "1on1" | "group"].sessions.map((plan) => (
            <Label
              key={plan.count}
              htmlFor={`sessions-${plan.count}`}
              className={`relative flex flex-col items-center p-4 border rounded-xl cursor-pointer transition-all ${
                formData.sessionCount === plan.count
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <RadioGroupItem 
                value={plan.count.toString()} 
                id={`sessions-${plan.count}`}
                className="absolute top-3 right-3"
              />
              {plan.discount > 0 && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                  -{plan.discount}%
                </Badge>
              )}
              <span className="text-3xl font-bold text-foreground mb-1">{plan.count}</span>
              <span className="text-sm text-muted-foreground mb-2">
                {language === 'vi' ? "buổi" : "节课"}
              </span>
              <span className="text-lg font-semibold text-primary">
                {plan.price.toLocaleString()}₫
              </span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label>{language === 'vi' ? "Giọng giảng viên" : "教师口音"}</Label>
        <RadioGroup
          value={formData.accentPreference}
          onValueChange={(value) => handleInputChange("accentPreference", value)}
          className="grid md:grid-cols-2 gap-4"
        >
          <Label
            htmlFor="northern"
            className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
              formData.accentPreference === "northern"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <RadioGroupItem value="northern" id="northern" />
            <Mic className="w-5 h-5 text-primary" />
            <span>{language === 'vi' ? "Giọng Bắc" : "北方口音"}</span>
          </Label>

          <Label
            htmlFor="southern"
            className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
              formData.accentPreference === "southern"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <RadioGroupItem value="southern" id="southern" />
            <Mic className="w-5 h-5 text-accent" />
            <span>{language === 'vi' ? "Giọng Nam" : "南方口音"}</span>
          </Label>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredTime">
          {language === 'vi' ? "Thời gian mong muốn" : "期望时间"}
        </Label>
        <Select
          value={formData.preferredTime}
          onValueChange={(value) => handleInputChange("preferredTime", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={language === 'vi' ? "Chọn khung giờ" : "选择时间段"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">
              {language === 'vi' ? "Buổi sáng (8:00 - 12:00)" : "上午 (8:00 - 12:00)"}
            </SelectItem>
            <SelectItem value="afternoon">
              {language === 'vi' ? "Buổi chiều (13:00 - 17:00)" : "下午 (13:00 - 17:00)"}
            </SelectItem>
            <SelectItem value="evening">
              {language === 'vi' ? "Buổi tối (18:00 - 21:00)" : "晚上 (18:00 - 21:00)"}
            </SelectItem>
            <SelectItem value="weekend">
              {language === 'vi' ? "Cuối tuần" : "周末"}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">
          {language === 'vi' ? "Ghi chú thêm" : "其他备注"}
        </Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          placeholder={language === 'vi' 
            ? "Yêu cầu đặc biệt, câu hỏi..."
            : "特殊要求、问题..."}
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep3 = () => {
    const plan = getSelectedPlan();
    
    return (
      <div className="space-y-6">
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              {language === 'vi' ? "Thông tin đăng ký" : "注册信息"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">
                  {language === 'vi' ? "Họ tên" : "姓名"}
                </span>
                <p className="font-medium">{formData.fullName}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Email</span>
                <p className="font-medium">{formData.email}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  {language === 'vi' ? "Hình thức" : "形式"}
                </span>
                <p className="font-medium">
                  {formData.tutorType === "1on1" 
                    ? (language === 'vi' ? "Học 1:1" : "一对一")
                    : (language === 'vi' ? "Học nhóm nhỏ" : "小组学习")}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  {language === 'vi' ? "Số buổi" : "课程数"}
                </span>
                <p className="font-medium">
                  {formData.sessionCount} {language === 'vi' ? "buổi" : "节课"}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  {language === 'vi' ? "Giọng giảng viên" : "教师口音"}
                </span>
                <p className="font-medium">
                  {formData.accentPreference === "northern" 
                    ? (language === 'vi' ? "Giọng Bắc" : "北方口音")
                    : (language === 'vi' ? "Giọng Nam" : "南方口音")}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  {language === 'vi' ? "Thời gian" : "时间"}
                </span>
                <p className="font-medium">{formData.preferredTime || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              {language === 'vi' ? "Chi tiết thanh toán" : "支付详情"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {formData.sessionCount} {language === 'vi' ? "buổi học" : "节课"}
              </span>
              <span className="font-medium">{plan?.price.toLocaleString()}₫</span>
            </div>
            {plan && plan.discount > 0 && (
              <div className="flex justify-between text-primary">
                <span>{language === 'vi' ? "Giảm giá" : "折扣"} ({plan.discount}%)</span>
                <span>-{((plan.price * plan.discount) / 100).toLocaleString()}₫</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>{language === 'vi' ? "Tổng cộng" : "总计"}</span>
              <span className="text-primary">{plan?.price.toLocaleString()}₫</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
          <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">
              {language === 'vi' ? "Cam kết hoàn tiền" : "退款保证"}
            </p>
            <p className="text-muted-foreground">
              {language === 'vi' 
                ? "Hoàn 100% nếu bạn không hài lòng sau buổi học đầu tiên."
                : "如果您对第一节课不满意，可全额退款。"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {language === 'vi' ? "Đăng ký Gia sư Online" : "在线家教注册"}
            </h1>
            <p className="text-muted-foreground">
              {language === 'vi' 
                ? "Học tiếng Việt 1:1 hoặc nhóm nhỏ với gia sư chuyên nghiệp"
                : "与专业家教一对一或小组学习越南语"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 mx-1 rounded ${
                      step > s ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && (language === 'vi' ? "Thông tin học viên" : "学员信息")}
                {step === 2 && (language === 'vi' ? "Chọn gói học" : "选择课程包")}
                {step === 3 && (language === 'vi' ? "Xác nhận đăng ký" : "确认注册")}
              </CardTitle>
              <CardDescription>
                {step === 1 && (language === 'vi' 
                  ? "Vui lòng điền thông tin cá nhân và mục tiêu học tập"
                  : "请填写个人信息和学习目标")}
                {step === 2 && (language === 'vi' 
                  ? "Chọn hình thức học và số buổi phù hợp với bạn"
                  : "选择适合您的学习形式和课程数量")}
                {step === 3 && (language === 'vi' 
                  ? "Kiểm tra lại thông tin và xác nhận đăng ký"
                  : "检查信息并确认注册")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}

              <Separator className="my-6" />

              <div className="flex justify-between">
                {step > 1 ? (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    {language === 'vi' ? "Quay lại" : "返回"}
                  </Button>
                ) : (
                  <div />
                )}
                
                {step < 3 ? (
                  <Button onClick={() => setStep(step + 1)}>
                    {language === 'vi' ? "Tiếp tục" : "继续"}
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        {language === 'vi' ? "Đang xử lý..." : "处理中..."}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        {language === 'vi' ? "Thanh toán & Đăng ký" : "支付并注册"}
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TutorRegistration;
