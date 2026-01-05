import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'vi' | 'zh';

interface Translations {
  [key: string]: {
    vi: string;
    zh: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { vi: 'Trang chủ', zh: '首页' },
  'nav.courses': { vi: 'Khóa học', zh: '课程' },
  'nav.exercises': { vi: 'Bài tập', zh: '练习' },
  'nav.library': { vi: 'Thư viện', zh: '资料库' },
  'nav.profile': { vi: 'Tài khoản', zh: '账户' },
  'nav.login': { vi: 'Đăng nhập', zh: '登录' },
  'nav.register': { vi: 'Đăng ký', zh: '注册' },
  'nav.logout': { vi: 'Đăng xuất', zh: '退出' },
  
  // Homepage
  'home.hero.title': { vi: 'Học Tiếng Việt', zh: '学习越南语' },
  'home.hero.subtitle': { vi: 'Dễ dàng - Hiệu quả - Thú vị', zh: '轻松 - 高效 - 有趣' },
  'home.hero.description': { 
    vi: 'Nền tảng học tiếng Việt trực tuyến dành cho người Trung Quốc. Từ giao tiếp cơ bản đến tiếng Việt công sở và luyện thi chứng chỉ.', 
    zh: '专为中国人设计的越南语在线学习平台。从基础会话到商务越南语，再到证书考试准备。' 
  },
  'home.hero.cta': { vi: 'Bắt đầu học miễn phí', zh: '开始免费学习' },
  'home.hero.cta.secondary': { vi: 'Xem khóa học', zh: '查看课程' },
  
  // Course Types
  'course.free': { vi: 'Miễn phí', zh: '免费' },
  'course.paid': { vi: 'Trả phí', zh: '付费' },
  'course.exam': { vi: 'Luyện thi', zh: '考试准备' },
  'course.free.title': { vi: 'Tiếng Việt Giao Tiếp Cơ Bản', zh: '基础越南语会话' },
  'course.free.desc': { vi: 'Học các câu giao tiếp hàng ngày, chào hỏi, giới thiệu bản thân', zh: '学习日常对话、问候、自我介绍' },
  'course.paid.title': { vi: 'Tiếng Việt Công Sở - Thương Mại', zh: '商务越南语' },
  'course.paid.desc': { vi: 'Tiếng Việt chuyên ngành cho môi trường công việc và kinh doanh', zh: '专业越南语，适用于工作和商务环境' },
  'course.exam.title': { vi: 'Luyện Thi Chứng Chỉ KNLTV', zh: '越南语证书考试准备' },
  'course.exam.desc': { vi: 'Ôn tập và luyện đề thi chứng chỉ năng lực tiếng Việt', zh: '复习并练习越南语能力证书考试' },
  
  // Lessons
  'lesson.video': { vi: 'Video bài giảng', zh: '教学视频' },
  'lesson.audio': { vi: 'Audio phát âm', zh: '发音音频' },
  'lesson.vocabulary': { vi: 'Từ vựng', zh: '词汇' },
  'lesson.content': { vi: 'Nội dung bài học', zh: '课程内容' },
  'lesson.notes': { vi: 'Ghi chú của tôi', zh: '我的笔记' },
  'lesson.quiz': { vi: 'Làm bài kiểm tra', zh: '开始测验' },
  'lesson.complete': { vi: 'Hoàn thành bài học', zh: '完成课程' },
  'lesson.next': { vi: 'Bài tiếp theo', zh: '下一课' },
  'lesson.prev': { vi: 'Bài trước', zh: '上一课' },
  
  // Quiz
  'quiz.title': { vi: 'Bài kiểm tra', zh: '测验' },
  'quiz.question': { vi: 'Câu hỏi', zh: '题目' },
  'quiz.submit': { vi: 'Nộp bài', zh: '提交' },
  'quiz.result': { vi: 'Kết quả', zh: '结果' },
  'quiz.score': { vi: 'Điểm số', zh: '分数' },
  'quiz.passed': { vi: 'Đạt', zh: '通过' },
  'quiz.failed': { vi: 'Chưa đạt', zh: '未通过' },
  'quiz.retry': { vi: 'Làm lại', zh: '重新测验' },
  
  // Notes
  'notes.placeholder': { vi: 'Nhập ghi chú của bạn...', zh: '输入您的笔记...' },
  'notes.save': { vi: 'Lưu ghi chú', zh: '保存笔记' },
  'notes.saved': { vi: 'Đã lưu', zh: '已保存' },
  'notes.empty': { vi: 'Chưa có ghi chú nào', zh: '暂无笔记' },
  
  // Profile
  'profile.title': { vi: 'Hồ sơ học tập', zh: '学习档案' },
  'profile.info': { vi: 'Thông tin cá nhân', zh: '个人信息' },
  'profile.progress': { vi: 'Tiến độ học tập', zh: '学习进度' },
  'profile.courses': { vi: 'Khóa học của tôi', zh: '我的课程' },
  'profile.notes': { vi: 'Ghi chú của tôi', zh: '我的笔记' },
  'profile.results': { vi: 'Kết quả kiểm tra', zh: '测验结果' },
  
  // Library
  'library.title': { vi: 'Thư viện tài liệu', zh: '资料库' },
  'library.search': { vi: 'Tìm kiếm tài liệu...', zh: '搜索资料...' },
  'library.download': { vi: 'Tải xuống', zh: '下载' },
  'library.category.all': { vi: 'Tất cả', zh: '全部' },
  'library.category.vocabulary': { vi: 'Từ vựng', zh: '词汇' },
  'library.category.grammar': { vi: 'Ngữ pháp', zh: '语法' },
  'library.category.conversation': { vi: 'Hội thoại', zh: '会话' },
  'library.category.business': { vi: 'Công sở', zh: '商务' },
  'library.category.exam': { vi: 'Luyện thi', zh: '考试' },
  
  // Auth
  'auth.login': { vi: 'Đăng nhập', zh: '登录' },
  'auth.register': { vi: 'Đăng ký', zh: '注册' },
  'auth.email': { vi: 'Email', zh: '邮箱' },
  'auth.password': { vi: 'Mật khẩu', zh: '密码' },
  'auth.confirmPassword': { vi: 'Xác nhận mật khẩu', zh: '确认密码' },
  'auth.fullName': { vi: 'Họ và tên', zh: '姓名' },
  'auth.forgotPassword': { vi: 'Quên mật khẩu?', zh: '忘记密码？' },
  'auth.noAccount': { vi: 'Chưa có tài khoản?', zh: '没有账户？' },
  'auth.hasAccount': { vi: 'Đã có tài khoản?', zh: '已有账户？' },
  'auth.loginSuccess': { vi: 'Đăng nhập thành công!', zh: '登录成功！' },
  'auth.registerSuccess': { vi: 'Đăng ký thành công!', zh: '注册成功！' },
  'auth.logoutSuccess': { vi: 'Đăng xuất thành công!', zh: '退出成功！' },
  
  // Common
  'common.loading': { vi: 'Đang tải...', zh: '加载中...' },
  'common.error': { vi: 'Có lỗi xảy ra', zh: '发生错误' },
  'common.success': { vi: 'Thành công', zh: '成功' },
  'common.cancel': { vi: 'Hủy', zh: '取消' },
  'common.save': { vi: 'Lưu', zh: '保存' },
  'common.edit': { vi: 'Sửa', zh: '编辑' },
  'common.delete': { vi: 'Xóa', zh: '删除' },
  'common.search': { vi: 'Tìm kiếm', zh: '搜索' },
  'common.filter': { vi: 'Lọc', zh: '筛选' },
  'common.viewAll': { vi: 'Xem tất cả', zh: '查看全部' },
  'common.learnMore': { vi: 'Tìm hiểu thêm', zh: '了解更多' },
  
  // Footer
  'footer.about': { vi: 'Về chúng tôi', zh: '关于我们' },
  'footer.contact': { vi: 'Liên hệ', zh: '联系我们' },
  'footer.terms': { vi: 'Điều khoản sử dụng', zh: '使用条款' },
  'footer.privacy': { vi: 'Chính sách bảo mật', zh: '隐私政策' },
  'footer.copyright': { 
    vi: '© 2024 XinChao Vietnamese. Bản quyền thuộc về XinChao.', 
    zh: '© 2024 XinChao Vietnamese. 版权所有。' 
  },
  
  // Features
  'feature.interactive': { vi: 'Bài học tương tác', zh: '互动课程' },
  'feature.interactive.desc': { vi: 'Video, audio và bài tập thực hành', zh: '视频、音频和练习' },
  'feature.bilingual': { vi: 'Song ngữ Việt - Trung', zh: '越中双语' },
  'feature.bilingual.desc': { vi: 'Phụ đề và giải thích bằng tiếng Trung', zh: '中文字幕和解释' },
  'feature.progress': { vi: 'Theo dõi tiến độ', zh: '进度跟踪' },
  'feature.progress.desc': { vi: 'Xem tiến độ học tập chi tiết', zh: '查看详细学习进度' },
  'feature.certificate': { vi: 'Chứng chỉ', zh: '证书' },
  'feature.certificate.desc': { vi: 'Nhận chứng chỉ sau khi hoàn thành', zh: '完成后获得证书' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('xinchao-language') as Language) || 'vi';
    }
    return 'vi';
  });

  useEffect(() => {
    localStorage.setItem('xinchao-language', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
