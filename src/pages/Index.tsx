import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Headphones, Award, Users, Sparkles, Clock, GraduationCap, Calendar, CheckCircle, Star, Zap, Globe, Play, Trophy, Target, TrendingUp, Mail, Phone, MapPin, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import pandaMascot from '@/assets/panda-vietnamese.png';

// Mock tutor schedule data
const mockTutorSchedule = [
  {
    id: "1",
    date: "2024-01-20",
    time: "19:00 - 20:00",
    tutorName: "Cô Mai",
    type: "1on1",
    status: "upcoming"
  },
  {
    id: "2",
    date: "2024-01-22",
    time: "19:00 - 20:00",
    tutorName: "Cô Mai",
    type: "1on1",
    status: "upcoming"
  },
  {
    id: "3",
    date: "2024-01-18",
    time: "18:00 - 19:00",
    tutorName: "Thầy Hùng",
    type: "group",
    status: "completed"
  },
];

export default function Index() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const features = [
    { icon: BookOpen, title: t('feature.interactive'), desc: t('feature.interactive.desc') },
    { icon: Headphones, title: t('feature.bilingual'), desc: t('feature.bilingual.desc') },
    { icon: Award, title: t('feature.progress'), desc: t('feature.progress.desc') },
    { icon: Users, title: t('feature.certificate'), desc: t('feature.certificate.desc') },
  ];


  const stats = [
    { value: "10K+", label: language === 'vi' ? "Học viên" : "学员", icon: Users },
    { value: "500+", label: language === 'vi' ? "Bài học" : "课程", icon: BookOpen },
    { value: "50+", label: language === 'vi' ? "Giảng viên" : "讲师", icon: GraduationCap },
    { value: "98%", label: language === 'vi' ? "Hài lòng" : "满意度", icon: Trophy },
  ];

  const whyChooseUs = [
    {
      icon: Globe,
      title: language === 'vi' ? "Song ngữ Việt - Trung" : "越中双语教学",
      desc: language === 'vi' 
        ? "Mọi bài học đều có phụ đề và giải thích bằng cả tiếng Việt và tiếng Trung" 
        : "所有课程都配有越南语和中文字幕及解释"
    },
    {
      icon: Play,
      title: language === 'vi' ? "Video HD chất lượng cao" : "高清视频课程",
      desc: language === 'vi' 
        ? "Bài giảng video rõ nét, âm thanh chuẩn, dễ nghe và dễ hiểu" 
        : "清晰的视频讲解，标准发音，易于理解"
    },
    {
      icon: Target,
      title: language === 'vi' ? "Lộ trình học rõ ràng" : "清晰学习路径",
      desc: language === 'vi' 
        ? "Từ cơ bản đến nâng cao, phù hợp với mọi trình độ" 
        : "从基础到高级，适合各个水平"
    },
    {
      icon: TrendingUp,
      title: language === 'vi' ? "Theo dõi tiến độ" : "进度追踪",
      desc: language === 'vi' 
        ? "Xem báo cáo học tập chi tiết và đề xuất bài học phù hợp" 
        : "查看详细学习报告和个性化课程推荐"
    },
  ];

  return (
    <Layout showMascot>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary py-16 md:py-24">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-warning/10 rounded-full blur-lg animate-float" style={{ animationDelay: '0.5s' }} />
        
        <div className="container mx-auto px-4 relative">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="text-center md:text-left">
              <Badge className="mb-4 animate-scale-in bg-accent/10 text-accent border-accent/30 px-4 py-1">
                {language === 'vi' ? '🎓 Nền tảng học tiếng Việt #1 cho người Trung Quốc' : '🎓 专为中国人设计的越南语学习平台'}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 animate-slide-in-left">
                {t('home.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl text-primary font-semibold mb-4 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                {t('home.hero.subtitle')}
              </p>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto md:mx-0 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                {t('home.hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                <Button size="lg" asChild className="shadow-elevated hover:scale-105 transition-all duration-300 animate-pulse-glow">
                  <Link to="/auth?mode=register">
                    {t('home.hero.cta')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="hover:scale-105 transition-transform">
                  <Link to="/courses">{t('home.hero.cta.secondary')}</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center animate-slide-in-right">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl animate-pulse-glow" />
                <img src={pandaMascot} alt="XinChao Panda" className="w-64 md:w-80 relative animate-float drop-shadow-xl" />
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 animate-scale-in hover:scale-105 transition-transform"
                style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner - Premium Courses with enhanced animations */}
      <section className="py-8 bg-gradient-to-r from-primary/80 via-primary/60 to-emerald-400/70 relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNC0yIDQtMiA0LTItMi0yLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent animate-shimmer" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent animate-shimmer" style={{ animationDelay: '1s' }} />
        
        {/* Floating particles */}
        <div className="absolute top-4 left-[10%] w-2 h-2 bg-primary-foreground/20 rounded-full animate-float" />
        <div className="absolute top-8 left-[30%] w-3 h-3 bg-primary-foreground/15 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-4 right-[20%] w-2 h-2 bg-primary-foreground/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-6 right-[40%] w-4 h-4 bg-primary-foreground/10 rounded-full animate-bounce-soft" />
        
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-primary-foreground">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-foreground/30 rounded-full blur-lg animate-pulse-glow" />
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center relative animate-wiggle">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge className="bg-warning text-warning-foreground animate-bounce-soft">
                    {language === 'vi' ? '🔥 Ưu đãi đặc biệt' : '🔥 特别优惠'}
                  </Badge>
                  <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground animate-pulse">
                    {language === 'vi' ? 'Giảm 30%' : '优惠30%'}
                  </Badge>
                  <Badge variant="outline" className="border-warning/50 text-warning bg-warning/10">
                    <Clock className="w-3 h-3 mr-1" />
                    {language === 'vi' ? 'Còn 3 ngày' : '仅剩3天'}
                  </Badge>
                </div>
                <h3 className="text-xl md:text-2xl font-bold">
                  {language === 'vi' 
                    ? 'Mở khóa trọn bộ khóa học Premium' 
                    : '解锁全部高级课程'}
                </h3>
                <p className="text-primary-foreground/80 text-sm md:text-base">
                  {language === 'vi'
                    ? 'Bao gồm: Tiếng Việt Công Sở + Luyện thi KNLTV + 4 buổi học 1:1 với gia sư'
                    : '包括：商务越南语 + KNLTV考试准备 + 4节一对一家教课'}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="text-center sm:text-right text-primary-foreground">
                <p className="text-sm line-through opacity-70">1.598.000₫</p>
                <p className="text-3xl font-bold animate-pulse">999.000₫</p>
              </div>
              <Button 
                size="lg" 
                variant="secondary" 
                asChild 
                className="shadow-lg hover:scale-110 hover:bg-accent hover:text-accent-foreground transition-all duration-300 relative overflow-hidden group"
              >
                <Link to="/checkout/premium">
                  <span className="relative z-10 flex items-center">
                    {language === 'vi' ? 'Đăng ký ngay' : '立即注册'}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - New Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
              {language === 'vi' ? '✨ Tại sao chọn chúng tôi' : '✨ 为什么选择我们'}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'vi' ? 'Học tiếng Việt chưa bao giờ dễ dàng đến thế' : '学越南语从未如此简单'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'vi' 
                ? 'Nền tảng học tập toàn diện với công nghệ hiện đại, phương pháp khoa học và đội ngũ giảng viên chuyên nghiệp'
                : '全面的学习平台，采用现代技术、科学方法和专业教师团队'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, idx) => (
              <Card 
                key={idx} 
                className="border-0 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 group"
              >
                <CardHeader className="pb-2">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{item.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {language === 'vi' ? 'Tính năng nổi bật' : '特色功能'}
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <Card 
                key={idx} 
                className="border-0 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 group"
              >
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tutor Schedule Section - Show for logged in users */}
      {user && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {language === 'vi' ? 'Lịch học gia sư' : '家教课程表'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'vi' ? 'Các buổi học sắp tới của bạn' : '您即将进行的课程'}
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/tutor-registration">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  {language === 'vi' ? 'Đăng ký thêm' : '注册更多'}
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {mockTutorSchedule.map((session) => (
                <Card 
                  key={session.id} 
                  className={`overflow-hidden transition-all hover:shadow-elevated ${
                    session.status === 'completed' ? 'opacity-60' : ''
                  }`}
                >
                  <div className={`h-1 ${session.type === '1on1' ? 'bg-primary' : 'bg-accent'}`} />
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant={session.status === 'upcoming' ? 'default' : 'secondary'}>
                        {session.status === 'upcoming' 
                          ? (language === 'vi' ? 'Sắp diễn ra' : '即将开始')
                          : (language === 'vi' ? 'Đã hoàn thành' : '已完成')}
                      </Badge>
                      <Badge variant="outline">
                        {session.type === '1on1' ? '1:1' : (language === 'vi' ? 'Nhóm' : '小组')}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-foreground">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{session.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground">
                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                        <span>{session.tutorName}</span>
                      </div>
                    </div>

                    {session.status === 'upcoming' && (
                      <Button className="w-full mt-4" size="sm">
                        {language === 'vi' ? 'Vào phòng học' : '进入教室'}
                      </Button>
                    )}
                    {session.status === 'completed' && (
                      <div className="flex items-center gap-1 mt-4 text-primary">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">{language === 'vi' ? 'Đã hoàn thành' : '已完成'}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {mockTutorSchedule.length === 0 && (
              <Card className="p-12 text-center">
                <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {language === 'vi' ? 'Chưa có lịch học' : '暂无课程安排'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === 'vi' 
                    ? 'Đăng ký gia sư để bắt đầu học 1:1 hoặc nhóm nhỏ'
                    : '注册家教开始一对一或小组学习'}
                </p>
                <Button asChild>
                  <Link to="/tutor-registration">
                    {language === 'vi' ? 'Đăng ký ngay' : '立即注册'}
                  </Link>
                </Button>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Contact Form Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
              {language === 'vi' ? '📧 Liên hệ với chúng tôi' : '📧 联系我们'}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'vi' ? 'Bạn cần hỗ trợ?' : '需要帮助？'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'vi' 
                ? 'Để lại thông tin liên hệ, chúng tôi sẽ phản hồi trong vòng 24 giờ'
                : '留下您的联系方式，我们将在24小时内回复'}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  {language === 'vi' ? 'Thông tin liên hệ' : '联系信息'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:shadow-card transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">support@xinchao.edu.vn</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:shadow-card transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Điện thoại' : '电话'}</p>
                      <p className="font-medium text-foreground">+84 123 456 789</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:shadow-card transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{language === 'vi' ? 'Địa chỉ' : '地址'}</p>
                      <p className="font-medium text-foreground">
                        {language === 'vi' ? 'Hà Nội, Việt Nam' : '越南河内'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="p-6 shadow-elevated border-0">
              <CardHeader className="p-0 pb-6">
                <CardTitle className="text-xl">
                  {language === 'vi' ? 'Gửi tin nhắn' : '发送消息'}
                </CardTitle>
                <CardDescription>
                  {language === 'vi' 
                    ? 'Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại ngay'
                    : '填写以下信息，我们会尽快与您联系'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {language === 'vi' ? 'Họ tên' : '姓名'} *
                    </label>
                    <Input 
                      placeholder={language === 'vi' ? 'Nhập họ tên' : '请输入姓名'}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Email *
                    </label>
                    <Input 
                      type="email"
                      placeholder={language === 'vi' ? 'Nhập email' : '请输入邮箱'}
                      className="bg-background"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {language === 'vi' ? 'Số điện thoại' : '电话号码'}
                  </label>
                  <Input 
                    type="tel"
                    placeholder={language === 'vi' ? 'Nhập số điện thoại' : '请输入电话号码'}
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {language === 'vi' ? 'Nội dung' : '内容'} *
                  </label>
                  <Textarea 
                    placeholder={language === 'vi' ? 'Nhập nội dung tin nhắn...' : '请输入消息内容...'}
                    rows={4}
                    className="bg-background resize-none"
                  />
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => toast.success(language === 'vi' ? 'Đã gửi tin nhắn thành công!' : '消息发送成功！')}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {language === 'vi' ? 'Gửi tin nhắn' : '发送消息'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
