import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { ChatBot } from "./ChatBot";
import { FloatingChatButton } from "./FloatingChatButton";

export function Layout() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      
      {/* Chat Components */}
      {!isChatOpen && <FloatingChatButton onClick={toggleChat} />}
      <ChatBot isOpen={isChatOpen} onToggle={toggleChat} />
    </div>
  );
}