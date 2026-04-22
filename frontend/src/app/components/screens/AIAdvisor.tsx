import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Send, Mic } from 'lucide-react';
import { useProfileStore } from '../../../context/profileStore';
import { INITIAL_CHAT } from '../../../data/mockData';
import type { ChatMessage } from '../../../data/mockData';

export default function AIAdvisor() {
  const navigate = useNavigate();
  const { profile } = useProfileStore();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: input };
    const aiReply: ChatMessage = {
      role: 'ai',
      text: 'Analyzing your Wealth DNA to answer that...',
      bullets: [
        'Processing your financial profile',
        'Checking current market conditions',
        'Reviewing your active goals',
      ],
      disclaimer: true,
    };
    setMessages((prev) => [...prev, userMsg, aiReply]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white px-4 pt-12 pb-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <div className="w-9 h-9 bg-[#4338CA] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            S
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">
              SecureWealth Advisor
            </p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-[#16A34A] rounded-full" />
              <span className="text-[10px] text-[#16A34A] font-semibold">Online</span>
            </div>
          </div>
        </div>

        {/* Wealth DNA Context Chips */}
        <div className="flex gap-2 mt-2.5 overflow-x-auto scrollbar-hide pb-1">
          {[
            `${profile.income} income`,
            `${profile.savings} savings`,
            `${profile.goals} goals`,
            `${profile.risk} risk`,
          ].map((chip) => (
            <span
              key={chip}
              className="flex-shrink-0 bg-gray-100 text-gray-600 text-[10px] font-medium px-2.5 py-1 rounded-full"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'user' ? (
              <div className="bg-[#4338CA] text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[75%] text-sm">
                {msg.text}
              </div>
            ) : (
              <div className="bg-white border-l-4 border-[#4338CA] px-4 py-3 rounded-2xl rounded-tl-sm max-w-[88%] shadow-sm">
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{msg.text}</p>
                {msg.bullets && msg.bullets.length > 0 && (
                  <ul className="space-y-1.5 mb-2">
                    {msg.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-[#16A34A] font-bold flex-shrink-0">•</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {msg.disclaimer && (
                  <div className="inline-block px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg">
                    <span className="text-[10px] text-amber-700">
                      ⚠️ Simulation only — not financial advice
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div
        className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-2.5 border border-gray-200 focus-within:border-[#4338CA] transition-colors">
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask anything about your finances..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400"
          />
          <button
            onClick={send}
            className="w-8 h-8 bg-[#4338CA] rounded-xl flex items-center justify-center hover:bg-[#3730A3] transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
