import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  Search,
  Send,
  Clock,
  CheckCircle,
  Users,
  TrendingUp,
  ArrowLeft
} from "lucide-react";

// Mock data
const mockConversations = [
  {
    id: "1",
    studentName: "王小明",
    lastMessage: "Cảm ơn chị đã giải đáp!",
    timestamp: "10:30",
    unread: 0,
    status: "resolved"
  },
  {
    id: "2",
    studentName: "李华",
    lastMessage: "Em muốn hỏi về cách phát âm thanh 'ư'",
    timestamp: "09:45",
    unread: 2,
    status: "active"
  },
  {
    id: "3",
    studentName: "张伟",
    lastMessage: "Bài tập số 5 em chưa hiểu",
    timestamp: "08:20",
    unread: 1,
    status: "active"
  },
  {
    id: "4",
    studentName: "陈芳",
    lastMessage: "Dạ em cảm ơn ạ",
    timestamp: "Hôm qua",
    unread: 0,
    status: "resolved"
  },
];

const mockMessages = [
  {
    id: "1",
    sender: "student",
    content: "Chào trợ giảng, em muốn hỏi về cách phát âm thanh 'ư' ạ",
    timestamp: "09:30"
  },
  {
    id: "2",
    sender: "support",
    content: "Chào em! Thanh 'ư' là một nguyên âm đặc biệt trong tiếng Việt. Em hãy để miệng như đang nói 'u' nhưng đưa lưỡi về phía trước nhé.",
    timestamp: "09:35"
  },
  {
    id: "3",
    sender: "student",
    content: "Em đã thử nhưng vẫn chưa được ạ 😅",
    timestamp: "09:40"
  },
  {
    id: "4",
    sender: "support",
    content: "Không sao em, em có thể xem video hướng dẫn trong bài học số 3, phần phát âm nguyên âm nhé. Video có hình miệng chi tiết sẽ giúp em dễ hình dung hơn!",
    timestamp: "09:42"
  },
  {
    id: "5",
    sender: "student",
    content: "Em muốn hỏi về cách phát âm thanh 'ư'",
    timestamp: "09:45"
  },
];

const AdminChatSupport = () => {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[1]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);

  const filteredConversations = mockConversations.filter(conv =>
    conv.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // Mock send
    setNewMessage("");
  };

  // Stats
  const activeChats = mockConversations.filter(c => c.status === "active").length;
  const totalUnread = mockConversations.reduce((sum, c) => sum + c.unread, 0);

  const ConversationList = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {filteredConversations.map((conv) => (
          <div
            key={conv.id}
            className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
              selectedConversation?.id === conv.id ? "bg-muted" : ""
            }`}
            onClick={() => {
              setSelectedConversation(conv);
              setShowMobileChat(true);
            }}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {conv.studentName[0]}
                  </AvatarFallback>
                </Avatar>
                {conv.status === "active" && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{conv.studentName}</span>
                  <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <Badge className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center p-0 text-xs">
                  {conv.unread}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );

  const ChatWindow = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setShowMobileChat(false)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary">
              {selectedConversation?.studentName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">{selectedConversation?.studentName}</h3>
            <span className="text-xs text-muted-foreground">
              {selectedConversation?.status === "active" ? "Đang hoạt động" : "Đã kết thúc"}
            </span>
          </div>
        </div>
        <Badge variant={selectedConversation?.status === "active" ? "default" : "secondary"}>
          {selectedConversation?.status === "active" ? "Đang hỗ trợ" : "Đã giải quyết"}
        </Badge>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "support" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-2xl ${
                  message.sender === "support"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className={`text-xs mt-1 block ${
                  message.sender === "support" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}>
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Hỗ trợ học viên</h1>
        <p className="text-muted-foreground">Quản lý và trả lời tin nhắn từ học viên</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng cuộc trò chuyện</p>
                <p className="text-2xl font-bold text-foreground">{mockConversations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đang hỗ trợ</p>
                <p className="text-2xl font-bold text-accent">{activeChats}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chưa đọc</p>
                <p className="text-2xl font-bold text-warning">{totalUnread}</p>
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
                <p className="text-sm text-muted-foreground">Đã giải quyết</p>
                <p className="text-2xl font-bold text-primary">
                  {mockConversations.filter(c => c.status === "resolved").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <Card className="h-[60vh] overflow-hidden">
        <div className="grid lg:grid-cols-[350px_1fr] h-full">
          <div className={`border-r border-border ${showMobileChat ? "hidden lg:block" : ""}`}>
            <ConversationList />
          </div>
          <div className={`${!showMobileChat ? "hidden lg:block" : ""}`}>
            {selectedConversation ? <ChatWindow /> : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Chọn một cuộc trò chuyện</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminChatSupport;
