import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Paperclip } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  useEffect(() => {
    if (!isLoading && !disabled) {
      textareaRef.current?.focus();
    }
  }, [isLoading, disabled]);

  return (
    <div className="w-full bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pt-6 pb-6 px-4 flex-shrink-0 z-10">
      <div className="max-w-4xl mx-auto relative flex items-end bg-white border border-gray-200 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] focus-within:ring-2 focus-within:ring-emerald-600/20 focus-within:border-emerald-600/50 transition-all duration-300">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Configure settings to start chat..." : "Ask Restore Assistant..."}
          disabled={disabled || isLoading}
          className="w-full py-4 pl-5 pr-14 bg-transparent resize-none outline-none text-gray-700 placeholder-gray-400 min-h-[56px] max-h-[150px] rounded-2xl disabled:bg-gray-50 disabled:cursor-not-allowed"
          rows={1}
        />
        
        <div className="absolute right-2 bottom-2">
            <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isLoading || disabled}
            className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center
                ${!input.trim() || isLoading || disabled
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                }`}
            >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Send className="w-5 h-5 ml-0.5" />
            )}
            </button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto text-center mt-3">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
          Protected by Restore Security
        </p>
      </div>
    </div>
  );
};
