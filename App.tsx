import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { MessageBubble, LoadingBubble } from './components/MessageBubble';
import { InputArea } from './components/InputArea';
import { SettingsModal } from './components/SettingsModal';
import { Message, Role } from './types';
import { sendMessageToWebhook } from './services/n8nService';
import { Bot } from 'lucide-react';
import { Logo } from './components/Logo';

const INITIAL_MESSAGE: Message = {
  id: 'init-1',
  role: Role.Bot,
  content: "Hello! I'm your Restore Assistant connected to n8n. How can I help you today?",
  timestamp: new Date(),
};

const DEFAULT_WEBHOOK_URL = 'https://erykrestore.app.n8n.cloud/webhook/7933aa66-9bfa-4162-820a-c500bae95247/chat';

const App: React.FC = () => {
  // State
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem('n8n_webhook_url') || DEFAULT_WEBHOOK_URL;
  });
  const [useProxy, setUseProxy] = useState<boolean>(() => {
    // Resetting key to v2 to force true for existing users experiencing issues
    const saved = localStorage.getItem('n8n_use_proxy_v2');
    return saved !== 'false'; // Defaults to true if null or anything else
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effects
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // If we have the default URL but it's not in local storage yet, save it
    if (!localStorage.getItem('n8n_webhook_url')) {
      localStorage.setItem('n8n_webhook_url', DEFAULT_WEBHOOK_URL);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !webhookUrl) return;

    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.User,
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToWebhook(webhookUrl, text, useProxy);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.Bot,
        content: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.Bot,
        content: `Error: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = (url: string, proxy: boolean) => {
    setWebhookUrl(url);
    setUseProxy(proxy);
    localStorage.setItem('n8n_webhook_url', url);
    localStorage.setItem('n8n_use_proxy_v2', String(proxy));
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 font-sans">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto px-4 pt-6 pb-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
             <div className="w-20 h-20 mb-4 opacity-80">
               <Logo className="w-full h-full rounded-full" />
             </div>
             <p>No messages yet.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {isLoading && <LoadingBubble />}
        
        <div ref={messagesEndRef} className="h-4" />
      </main>

      <InputArea 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
        disabled={!webhookUrl}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUrl={webhookUrl}
        useProxy={useProxy}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default App;