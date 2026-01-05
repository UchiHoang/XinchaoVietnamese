import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  MessageCircle,
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Search,
  Circle,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "support";
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

interface ChatSession {
  id: string;
  supportName: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  isOnline: boolean;
}

// Mock data
const mockSessions: ChatSession[] = [
  {
    id: "1",
    supportName: "Trợ giảng Mai",
    lastMessage: "Bạn cần hỗ trợ gì về bài học hôm nay không?",
    timestamp: new Date(),
    unread: 2,
    isOnline: true,
  },
  {
    id: "2",
    supportName: "Trợ giảng Hùng",
    lastMessage: "Chúc bạn học tốt!",
    timestamp: new Date(Date.now() - 3600000),
    unread: 0,
    isOnline: false,
  },
  {
    id: "3",
    supportName: "Trợ giảng Linh",
    lastMessage: "Đã nhận được bài tập của em.",
    timestamp: new Date(Date.now() - 7200000),
    unread: 0,
    isOnline: true,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "support",
    content: "Xin chào! Tôi là trợ giảng Mai. Bạn cần hỗ trợ gì về bài học hôm nay?",
    timestamp: new Date(Date.now() - 600000),
    status: "read",
  },
  {
    id: "2",
    sender: "user",
    content: "Chào chị, em muốn hỏi về cách phát âm thanh điệu trong tiếng Việt ạ.",
    timestamp: new Date(Date.now() - 500000),
    status: "read",
  },
  {
    id: "3",
    sender: "support",
    content: "Dạ, tiếng Việt có 6 thanh điệu: ngang, huyền, sắc, hỏi, ngã, nặng. Em có thể xem video bài 3 để học chi tiết hơn nhé!",
    timestamp: new Date(Date.now() - 400000),
    status: "read",
  },
  {
    id: "4",
    sender: "support",
    content: "Bạn cần hỗ trợ gì về bài học hôm nay không?",
    timestamp: new Date(),
    status: "delivered",
  },
];

const ChatSupport = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(mockSessions[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // IME safety
  const isComposingRef = useRef(false);
  const ignoreEnterUntilRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: newMessage,
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: "support",
        content:
          language === "vi"
            ? "Cảm ơn bạn đã liên hệ! Tôi sẽ hỗ trợ bạn ngay."
            : "感谢您的联系！我会立即为您提供帮助。",
        timestamp: new Date(),
        status: "delivered",
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const filteredSessions = mockSessions.filter((session) =>
    session.supportName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chat List Component
  const renderChatList = () => (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground mb-3">
          {language === "vi" ? "Tin nhắn hỗ trợ" : "支持消息"}
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={language === "vi" ? "Tìm kiếm..." : "搜索..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50 border-0"
          />
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 rounded-xl cursor-pointer transition-all duration-200 mb-1 ${
                selectedSession?.id === session.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-muted/70"
              }`}
              onClick={() => {
                setSelectedSession(session);
                setShowMobileChat(true);
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <Avatar className="w-12 h-12 border-2 border-background shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-semibold">
                      {session.supportName.split(" ").pop()?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Circle
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${
                      session.isOnline ? "text-success fill-success" : "text-muted-foreground fill-muted-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-foreground text-sm">
                      {session.supportName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(session.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate pr-2">
                    {session.lastMessage}
                  </p>
                </div>
                {session.unread > 0 && (
                  <Badge className="bg-primary text-primary-foreground rounded-full min-w-[22px] h-[22px] flex items-center justify-center p-0 text-xs font-semibold">
                    {session.unread}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  // Chat Window Component
  const renderChatWindow = () => (
    <div className="h-full flex flex-col bg-background">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-border bg-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden -ml-2"
            onClick={() => setShowMobileChat(false)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="relative">
            <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-semibold">
                {selectedSession?.supportName.split(" ").pop()?.[0]}
              </AvatarFallback>
            </Avatar>
            {selectedSession?.isOnline && (
              <Circle className="absolute bottom-0 right-0 w-3 h-3 text-success fill-success" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm leading-tight">
              {selectedSession?.supportName}
            </h3>
            <span className={`text-xs ${selectedSession?.isOnline ? "text-success" : "text-muted-foreground"}`}>
              {selectedSession?.isOnline
                ? language === "vi" ? "Đang trực tuyến" : "在线"
                : language === "vi" ? "Không trực tuyến" : "离线"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-9 h-9 text-muted-foreground hover:text-primary">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 text-muted-foreground hover:text-primary">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 text-muted-foreground hover:text-primary">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 bg-muted/30">
        <div className="p-4 space-y-3">
          {messages.map((message, index) => {
            const isUser = message.sender === "user";
            const showAvatar = !isUser && (index === 0 || messages[index - 1]?.sender !== "support");
            
            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-end gap-2 max-w-[75%] ${isUser ? "flex-row-reverse" : ""}`}>
                  {!isUser && (
                    <div className="w-8 flex-shrink-0">
                      {showAvatar && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary text-xs font-semibold">
                            {selectedSession?.supportName.split(" ").pop()?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                      isUser
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card text-foreground rounded-bl-md border border-border"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className={`flex items-center gap-1.5 mt-1 ${isUser ? "justify-end" : ""}`}>
                      <span className={`text-[11px] ${
                        isUser ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}>
                        {formatTime(message.timestamp)}
                      </span>
                      {isUser && (
                        <CheckCheck className={`w-3.5 h-3.5 ${
                          message.status === "read" ? "text-primary-foreground" : "text-primary-foreground/50"
                        }`} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <Input
            placeholder={language === "vi" ? "Nhập tin nhắn..." : "输入消息..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onCompositionStart={() => {
              isComposingRef.current = true;
            }}
            onCompositionEnd={() => {
              isComposingRef.current = false;
              ignoreEnterUntilRef.current = Date.now() + 500;
            }}
            onKeyDown={(e) => {
              if (e.key !== "Enter" || e.shiftKey) return;

              const native = e.nativeEvent as any;

              // IME safety: prevent Enter used to confirm composition from sending
              if (isComposingRef.current || (e as any).isComposing || native?.isComposing) return;
              if (native?.keyCode === 229) return;

              // Some mobile keyboards can emit an Enter-like event during composition; only accept real Enter
              if (typeof native?.keyCode === "number" && native.keyCode !== 13) return;

              if (Date.now() < ignoreEnterUntilRef.current) return;

              e.preventDefault();
              handleSendMessage();
            }}
            className="flex-1 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon"
            disabled={!newMessage.trim()}
            className="rounded-full w-10 h-10 bg-primary hover:bg-accent transition-colors"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Empty State Component
  const renderEmptyState = () => (
    <div className="h-full flex items-center justify-center bg-muted/20">
      <div className="text-center p-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <MessageCircle className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {language === "vi" ? "Chọn một cuộc trò chuyện" : "选择一个对话"}
        </h3>
        <p className="text-muted-foreground text-sm max-w-[250px]">
          {language === "vi"
            ? "Chọn từ danh sách bên trái để bắt đầu trò chuyện với trợ giảng"
            : "从左侧列表中选择以开始与助教对话"}
        </p>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            {language === "vi" ? "Hỗ trợ trực tuyến" : "在线支持"}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {language === "vi"
              ? "Chat trực tiếp với trợ giảng để được hỗ trợ học tập"
              : "与助教直接聊天，获得学习支持"}
          </p>
        </div>

        <Card className="h-[calc(100vh-220px)] min-h-[500px] overflow-hidden shadow-lg border-border">
          <div className="grid lg:grid-cols-[320px_1fr] h-full">
            {/* Chat List */}
            <div className={`border-r border-border ${showMobileChat ? "hidden lg:block" : ""}`}>
              {renderChatList()}
            </div>

            {/* Chat Window */}
            <div className={`${!showMobileChat ? "hidden lg:block" : ""}`}>
              {selectedSession ? renderChatWindow() : renderEmptyState()}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ChatSupport;
