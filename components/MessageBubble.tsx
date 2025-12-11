import React from 'react';
import { Role, Message } from '../types';
import { User } from 'lucide-react';
import { Logo } from './Logo';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isBot = message.role === Role.Bot;

  return (
    <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} mb-6 group animate-fade-in-up`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] items-end ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mb-1 overflow-hidden ${
          isBot ? 'mr-3 bg-transparent' : 'ml-3 bg-gray-200'
        }`}>
          {isBot ? (
            <Logo className="w-full h-full rounded-full" />
          ) : (
            <User className="w-5 h-5 text-gray-500" />
          )}
        </div>

        {/* Bubble */}
        <div className="flex flex-col relative">
          <div
            className={`px-5 py-3.5 shadow-sm text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap ${
              isBot
                ? 'bg-emerald-700 text-white rounded-2xl rounded-bl-none border border-emerald-700'
                : 'bg-white text-gray-800 rounded-2xl rounded-br-none border border-gray-100'
            }`}
          >
            {message.content}
          </div>
          <span className={`text-[10px] text-gray-400 mt-1 absolute -bottom-5 ${isBot ? 'left-1' : 'right-1'} opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export const LoadingBubble: React.FC = () => {
  return (
    <div className="flex w-full justify-start mb-6">
      <div className="flex max-w-[85%] flex-row items-end">
        <div className="flex-shrink-0 w-8 h-8 rounded-full mr-3 mb-1 shadow-sm overflow-hidden">
          <Logo className="w-full h-full rounded-full" />
        </div>
        <div className="bg-emerald-700 text-white px-5 py-4 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1.5 h-[46px] border border-emerald-700">
          <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};
