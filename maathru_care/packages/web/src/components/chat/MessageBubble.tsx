import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Heart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  content: string;
  sender: 'user' | 'bot';
  timestamp: number;
  mood?: number;
  status?: string;
}

interface MessageBubbleProps {
  message: Message;
  language: 'si' | 'en';
  currentMood: number;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, language, currentMood }) => {
  const isBot = message.sender === 'bot';
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit'
  });

  const fontClass = language === 'si' ? 'font-sinhala' : 'font-sans';
  const isGentleMode = isBot && currentMood === 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 24, stiffness: 150 }}
      className={clsx('flex w-full mb-4', isBot ? 'justify-start' : 'justify-end')}
    >
      <div className={clsx('max-w-[82%] flex flex-col', isBot ? 'items-start' : 'items-end')}>
        <div
          className={clsx(
            'px-[18px] py-[12px] text-[15px] leading-[1.5] shadow-soft',
            fontClass,
            isBot
              ? clsx(
                  isGentleMode ? 'bg-brand-botBubbleGentle' : 'bg-brand-botBubble',
                  'text-brand-textPrimary rounded-tr-[24px] rounded-br-[24px] rounded-bl-[24px] rounded-tl-[8px]'
                )
              : 'bg-brand-userBubble text-brand-textPrimary rounded-tl-[24px] rounded-bl-[24px] rounded-br-[24px] rounded-tr-[8px]'
          )}
        >
          {isBot ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-[1.5]" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 last:mb-0 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="leading-[1.5]" {...props} />,
                h1: ({node, ...props}) => <h1 className="font-bold text-lg mb-2" {...props} />,
                h2: ({node, ...props}) => <h2 className="font-bold text-base mb-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="font-bold text-sm mb-1" {...props} />,
                a: ({node, ...props}) => <a className="text-brand-primary underline hover:text-brand-primary/80 transition-colors" {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <span className="whitespace-pre-wrap">{message.content}</span>
          )}
        </div>
        
        <div className={clsx(
          'flex items-center gap-1.5 mt-1 px-1',
          isBot ? 'justify-start' : 'justify-end'
        )}>
          {isGentleMode && <Heart fill="currentColor" className="w-3 h-3 text-brand-secondary" />}
          <span className="text-[12px] font-medium text-brand-textSecondary">{time}</span>
          {!isBot && message.status === 'queued' && (
            <span className="text-[10px] font-bold text-brand-distressed/80 uppercase tracking-wider ml-1">· Queued</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
