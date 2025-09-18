import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, X, Bot, User, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'complaint' | 'normal';
}

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatBot({ isOpen, onToggle }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Compliance Assistant. I can help you with product compliance queries and raise complaints automatically. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mockResponses = {
    compliance: [
      "I can help you check product compliance. Please provide the product details or scan the barcode for automatic verification.",
      "Compliance issues detected. Common problems include missing MRP, manufacturer details, or net quantity information.",
      "All products must comply with legal metrology requirements including proper labeling and packaging declarations."
    ],
    complaint: [
      "I understand you want to raise a complaint. Let me automatically create a compliance complaint for you.",
      "Complaint registered successfully! Reference ID: CMP-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      "Your complaint has been logged and will be reviewed within 24-48 hours."
    ],
    general: [
      "I can help you with product compliance checks, complaint registration, and general queries about our platform.",
      "Our system monitors e-commerce platforms for compliance violations and helps consumers report issues.",
      "You can scan product barcodes, check compliance status, and register complaints through our platform."
    ]
  };

  const detectIntent = (message: string): 'compliance' | 'complaint' | 'general' => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('complaint') || lowerMessage.includes('complain') || 
        lowerMessage.includes('raise') || lowerMessage.includes('report') ||
        lowerMessage.includes('fake') || lowerMessage.includes('defective')) {
      return 'complaint';
    }
    
    if (lowerMessage.includes('compliance') || lowerMessage.includes('comply') || 
        lowerMessage.includes('legal') || lowerMessage.includes('mrp') ||
        lowerMessage.includes('packaging') || lowerMessage.includes('label')) {
      return 'compliance';
    }
    
    return 'general';
  };

  const generateBotResponse = (userMessage: string): Message => {
    const intent = detectIntent(userMessage);
    const responses = mockResponses[intent];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const isComplaint = intent === 'complaint';
    
    if (isComplaint) {
      // Simulate automatic complaint raising
      setTimeout(() => {
        toast({
          title: "Complaint Raised Successfully!",
          description: "Your complaint has been automatically registered and assigned a tracking ID.",
          duration: 5000,
        });
      }, 1000);
    }
    
    return {
      id: Date.now().toString(),
      text: randomResponse,
      sender: 'bot',
      timestamp: new Date(),
      type: isComplaint ? 'complaint' : 'normal'
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 md:w-96 h-96 md:h-[500px] shadow-elegant z-50 flex flex-col">
      <CardHeader className="pb-3 border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Compliance Assistant
            <Badge variant="secondary" className="text-xs">Online</Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 min-h-0">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                {message.sender === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div className={`max-w-[80%] ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}>
                <div className={`rounded-lg px-3 py-2 text-sm ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {message.type === 'complaint' && (
                    <div className="flex items-center gap-1 mb-1">
                      <AlertTriangle className="h-3 w-3 text-orange-500" />
                      <span className="text-xs font-medium text-orange-500">Auto-Complaint</span>
                    </div>
                  )}
                  {message.text}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 border-t pt-4">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about compliance or raise a complaint..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            size="sm"
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}