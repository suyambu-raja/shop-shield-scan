import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { MessageCircle, Send, X, Bot, User, AlertTriangle, Upload, Camera, Scan, FileText, Shield, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'complaint' | 'scan' | 'ocr' | 'anomaly' | 'cv' | 'legal' | 'barcode' | 'normal';
  data?: any;
}

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatBot({ isOpen, onToggle }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🤖 Hello! I\'m your **AI Compliance Assistant**. I can help you with:\n\n📱 **Product Scanning** - OCR extraction from labels\n⚖️ **Legal Metrology** validation\n🔍 **Anomaly Detection** across marketplaces\n📷 **CV Product Matching**\n📝 **Complaint Filing**\n\nTry: *"scan this product"*, *"check compliance"*, or *"file a complaint"*',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateOCRScan = (): Message => {
    const mockOCRResults = [
      {
        product: "Organic Basmati Rice Premium",
        gtin: "8901030823456",
        mrp: "₹449",
        netQuantity: "5kg",
        manufacturer: "Himalayan Grains Pvt Ltd",
        address: "Plot 45, Industrial Area, Dehradun-248001",
        monthYear: "09/2024",
        consumerCare: "care@himalayangrains.com",
        violations: ["net_quantity_unit_missing"]
      },
      {
        product: "Premium Tea Leaves Assam",
        gtin: "8906012345678", 
        mrp: "₹299",
        netQuantity: "250g",
        manufacturer: "Tea Gardens India Ltd",
        address: "Missing", // Violation
        monthYear: "08/2024",
        consumerCare: "1800-123-4567",
        violations: ["manufacturer_address_missing", "mrp_format_invalid"]
      }
    ];
    
    const result = mockOCRResults[Math.floor(Math.random() * mockOCRResults.length)];
    const complianceScore = ((6 - result.violations.length) / 6) * 100;
    
    return {
      id: Date.now().toString(),
      text: `📱 **OCR Scan Complete**\n\n🏷️ **Product:** ${result.product}\n📊 **GTIN:** ${result.gtin}\n💰 **MRP:** ${result.mrp} ${result.mrp ? '✅' : '❌'}\n⚖️ **Net Qty:** ${result.netQuantity} ${result.netQuantity ? '✅' : '❌'}\n🏭 **Manufacturer:** ${result.manufacturer} ${result.manufacturer ? '✅' : '❌'}\n📍 **Address:** ${result.address} ${result.address !== 'Missing' ? '✅' : '❌'}\n📅 **Mfg Date:** ${result.monthYear} ${result.monthYear ? '✅' : '❌'}\n📞 **Care:** ${result.consumerCare} ${result.consumerCare ? '✅' : '❌'}\n\n${result.violations.length > 0 ? 
        `⚠️ **Violations Found:** ${result.violations.length}\n${result.violations.map(v => `• ${v.replace(/_/g, ' ')}`).join('\n')}` : 
        '✅ **All Legal Metrology Requirements Met**'}\n\n📈 **Compliance Score:** ${Math.round(complianceScore)}%`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'ocr',
      data: result
    };
  };

  const simulateAnomalyDetection = (): Message => {
    const riskScore = Math.random() * 0.9 + 0.1;
    const anomalies = [
      { type: "mrp_inconsistency", sources: ["amazon.in", "flipkart.com"], variance: "15%" },
      { type: "missing_declarations", sources: ["shopify"], count: 2 },
      { type: "net_quantity_deviation", baseline: "500g", found: "450g" },
      { type: "manufacturer_mismatch", expected: "Company A", found: "Company B" }
    ];
    
    const detectedAnomalies = anomalies.slice(0, Math.floor(Math.random() * 3) + 1);
    
    return {
      id: Date.now().toString(),
      text: `🔍 **Cross-Marketplace Anomaly Analysis**\n\n🎯 **Risk Score:** ${(riskScore * 100).toFixed(1)}% ${riskScore > 0.7 ? '🔴 HIGH' : riskScore > 0.4 ? '🟡 MEDIUM' : '🟢 LOW'}\n\n📊 **Sources Analyzed:**\n• Amazon India\n• Flipkart\n• BigBasket\n• Shopify Store\n\n${detectedAnomalies.length > 0 ? 
        `⚠️ **Anomalies Detected:**\n${detectedAnomalies.map(a => `• **${a.type.replace(/_/g, ' ')}**${a.sources ? ` (${a.sources.join(', ')})` : ''}${a.variance ? ` - ${a.variance} variance` : ''}`).join('\n')}` : 
        '✅ **No significant anomalies detected**'}\n\n🤖 **Model:** IsolationForest v1.2.0`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'anomaly'
    };
  };

  const simulateCVMatch = (): Message => {
    const similarity = Math.random() * 0.4 + 0.6;
    const flags = [
      { key: "logo_mismatch", present: Math.random() > 0.7 },
      { key: "packaging_layout_diff", present: Math.random() > 0.6 },
      { key: "color_scheme_variance", present: Math.random() > 0.8 },
      { key: "text_positioning_diff", present: Math.random() > 0.5 }
    ].filter(f => f.present);
    
    return {
      id: Date.now().toString(),
      text: `📷 **Computer Vision Product Match**\n\n🎯 **Similarity Score:** ${(similarity * 100).toFixed(1)}% ${similarity > 0.85 ? '✅ MATCH' : similarity > 0.7 ? '⚠️ LIKELY MATCH' : '❌ MISMATCH'}\n\n🔍 **Analysis:**\n• Listing Image: ✅ Processed\n• User Image: ✅ Processed\n• Feature Extraction: ✅ Complete\n\n${flags.length > 0 ? 
        `⚠️ **Visual Flags:**\n${flags.map(f => `• ${f.key.replace(/_/g, ' ')}`).join('\n')}` : 
        '✅ **No visual discrepancies found**'}\n\n🎯 **Verdict:** ${similarity > 0.85 ? 'Authentic Product Match' : similarity > 0.7 ? 'Likely Match with Minor Variations' : 'Potential Counterfeit Risk'}`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'cv'
    };
  };

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Complaint raising logic
    if (lowerMessage.includes('complaint') || lowerMessage.includes('complain') || lowerMessage.includes('raise') || lowerMessage.includes('file')) {
      const complaintId = 'CPL-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      
      setTimeout(() => {
        toast({
          title: "Complaint Filed Successfully!",
          description: `Complaint ID: ${complaintId} - Your complaint has been registered with regulatory authorities.`,
          duration: 5000,
        });
      }, 1000);
      
      return {
        id: Date.now().toString(),
        text: `📋 **Compliance Complaint Filed Successfully**\n\n🆔 **Complaint ID:** ${complaintId}\n📂 **Type:** Legal Metrology Violation\n⏱️ **Status:** Under Review\n🎯 **Priority:** High\n📅 **Filed:** ${new Date().toLocaleString()}\n\n📧 **Next Steps:**\n• Regulatory review within 48 hours\n• Investigation team assigned\n• Email updates to registered address\n• Expected resolution: 5-7 business days\n\n✅ Your complaint has been registered with the Consumer Affairs Department.`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'complaint'
      };
    }
    
    // OCR and scanning
    if (lowerMessage.includes('scan') || lowerMessage.includes('ocr') || lowerMessage.includes('extract')) {
      return simulateOCRScan();
    }
    
    // Anomaly detection
    if (lowerMessage.includes('anomaly') || lowerMessage.includes('marketplace') || lowerMessage.includes('cross') || lowerMessage.includes('compare')) {
      return simulateAnomalyDetection();
    }
    
    // Computer vision
    if (lowerMessage.includes('cv') || lowerMessage.includes('image') || lowerMessage.includes('similarity') || lowerMessage.includes('match') || lowerMessage.includes('compare images')) {
      return simulateCVMatch();
    }
    
    // Legal metrology help
    if (lowerMessage.includes('legal') || lowerMessage.includes('metrology') || lowerMessage.includes('rules') || lowerMessage.includes('compliance')) {
      return {
        id: Date.now().toString(),
        text: `⚖️ **Legal Metrology (Packaged Commodities) Rules 2011**\n\n📋 **Mandatory Declarations:**\n\n🏭 **Manufacturer/Packer:** Complete name and full address\n🏷️ **Generic Name:** Common name of commodity\n⚖️ **Net Quantity:** Weight/volume excluding packaging\n📅 **Date:** Month and year of manufacture/packing\n💰 **MRP:** Maximum retail price (inclusive of all taxes)\n📞 **Consumer Care:** Contact details for complaints\n\n✅ **Validation Rules:**\n• Address must be complete with PIN code\n• Net quantity units must be standard (g, kg, ml, L)\n• MRP must be prominently displayed\n• Date format: MM/YYYY or Month/Year\n\nWant me to scan a product for these requirements?`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'legal'
      };
    }

    // Barcode lookup
    if (lowerMessage.includes('barcode') || lowerMessage.includes('gtin') || lowerMessage.includes('ean') || lowerMessage.includes('asin')) {
      return {
        id: Date.now().toString(),
        text: `📊 **Barcode/GTIN Product Lookup**\n\n🔍 **Multi-Platform Search:**\n• Amazon India (ASIN resolution)\n• Flipkart (Product ID mapping)\n• BigBasket (SKU matching)\n• Open Food Facts (Global database)\n\n📱 **Supported Formats:**\n• GTIN-13 (EAN-13): 13 digits\n• GTIN-12 (UPC): 12 digits  \n• ASIN: Amazon Standard ID\n• Custom barcodes: QR codes\n\n💡 Enter a barcode number or upload an image with visible barcode for instant product enrichment and compliance checking!`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'barcode'
      };
    }
    
    // Default responses
    const responses = [
      "I can help with OCR scanning, Legal Metrology validation, anomaly detection, CV matching, and complaint filing. What would you like me to analyze?",
      "Upload a product image for instant compliance checking, or ask me about specific Legal Metrology requirements!",
      "Try asking: 'scan this product', 'check for anomalies', 'compare product images', or 'file a complaint'"
    ];
    
    return {
      id: Date.now().toString(),
      text: responses[Math.floor(Math.random() * responses.length)],
      sender: 'bot',
      timestamp: new Date(),
      type: 'normal'
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

    // Simulate AI processing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200 + Math.random() * 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      
      const userMessage: Message = {
        id: Date.now().toString(),
        text: `📷 **Image Uploaded:** ${file.name}\n📏 **Size:** ${(file.size / 1024).toFixed(1)} KB`,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      // Simulate comprehensive processing pipeline
      setTimeout(() => {
        const processingMessage: Message = {
          id: Date.now().toString(),
          text: "🔄 **Processing Pipeline Started**\n\n📷 Image preprocessing...\n🤖 OCR text extraction...\n⚖️ Legal Metrology validation...\n🔍 Cross-marketplace lookup...\n📊 Anomaly detection...",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, processingMessage]);

        // Complete analysis
        setTimeout(() => {
          const ocrResult = simulateOCRScan();
          const anomalyResult = simulateAnomalyDetection();
          
          const finalResult: Message = {
            id: Date.now().toString(),
            text: `✅ **Complete Analysis Finished**\n\n${ocrResult.text}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${anomalyResult.text}\n\n🎯 **Recommendation:** ${ocrResult.data?.violations?.length > 0 ? 'Non-compliant product detected. Consider filing a complaint.' : 'Product appears compliant with Legal Metrology requirements.'}`,
            sender: 'bot',
            timestamp: new Date(),
            type: 'scan'
          };
          
          setMessages(prev => [...prev, finalResult]);
          setIsTyping(false);
          setIsProcessing(false);
        }, 2500);
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 md:w-96 h-96 md:h-[500px] shadow-elegant z-50 flex flex-col">
      <CardHeader className="pb-3 border-b flex-shrink-0 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="relative">
              <Shield className="h-5 w-5 text-primary" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-semibold">AI Compliance Assistant</div>
              <div className="text-xs text-muted-foreground font-normal">Legal Metrology Expert</div>
            </div>
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

      <CardContent className="flex-1 flex flex-col p-3 min-h-0">
        <ScrollArea className="flex-1 overflow-y-auto mb-4">
          <div className="space-y-3">
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
                <div className={`max-w-[85%] ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`rounded-lg px-3 py-2 text-xs shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  } ${
                    message.type === 'complaint' ? 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20' : ''
                  } ${
                    message.type === 'ocr' ? 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                  } ${
                    message.type === 'anomaly' ? 'border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/20' : ''
                  } ${
                    message.type === 'cv' ? 'border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''
                  } ${
                    message.type === 'legal' ? 'border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : ''
                  } ${
                    message.type === 'barcode' ? 'border-l-4 border-l-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' : ''
                  }`}>
                    {message.type === 'complaint' && (
                      <div className="flex items-center gap-1 mb-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-xs font-medium text-green-600">Auto-Complaint</span>
                      </div>
                    )}
                    {message.type === 'ocr' && (
                      <div className="flex items-center gap-1 mb-1">
                        <Scan className="h-3 w-3 text-blue-600" />
                        <span className="text-xs font-medium text-blue-600">OCR Analysis</span>
                      </div>
                    )}
                    {message.type === 'anomaly' && (
                      <div className="flex items-center gap-1 mb-1">
                        <AlertTriangle className="h-3 w-3 text-orange-600" />
                        <span className="text-xs font-medium text-orange-600">Anomaly Detection</span>
                      </div>
                    )}
                    {message.type === 'cv' && (
                      <div className="flex items-center gap-1 mb-1">
                        <Eye className="h-3 w-3 text-purple-600" />
                        <span className="text-xs font-medium text-purple-600">CV Analysis</span>
                      </div>
                    )}
                    {message.type === 'legal' && (
                      <div className="flex items-center gap-1 mb-1">
                        <FileText className="h-3 w-3 text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-600">Legal Guide</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap font-mono leading-relaxed">{message.text}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                    <span>{message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}</span>
                    {message.type && message.type !== 'normal' && (
                      <Badge variant="outline" className="ml-2 text-[9px] px-1">
                        {message.type?.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs">AI analyzing...</span>
                  </div>
                  {isProcessing && (
                    <Progress value={33} className="w-32 h-1 mt-2" />
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2 border-t pt-3">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask: 'scan product', 'check compliance', 'file complaint'..."
            className="flex-1 text-xs"
            disabled={isProcessing || isTyping}
          />
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing || isTyping}
            className="shrink-0 px-2"
          >
            <Upload className="h-3.5 w-3.5" />
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isProcessing || isTyping}
            size="sm"
            className="shrink-0 px-2"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}