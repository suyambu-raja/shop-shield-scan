import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FloatingChatButtonProps {
  onClick: () => void;
  hasNewMessage?: boolean;
}

export function FloatingChatButton({ onClick, hasNewMessage = false }: FloatingChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-110 z-40"
    >
      <div className="relative">
        <MessageCircle className="h-6 w-6" />
        {hasNewMessage && (
          <Badge className="absolute -top-2 -right-2 h-3 w-3 p-0 bg-red-500 border-2 border-background">
            <span className="sr-only">New message</span>
          </Badge>
        )}
      </div>
    </Button>
  );
}