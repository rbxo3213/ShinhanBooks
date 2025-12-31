import React, { useState } from 'react';
import { AppView } from '../types';
import { Send, Image as ImageIcon, MoreVertical, ArrowLeft } from 'lucide-react';

interface ChatProps {
    setView: (view: AppView) => void;
}

export const Chat: React.FC<ChatProps> = ({ setView }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { id: 1, text: '안녕하세요! 상품 아직 판매 중인가요?', sender: 'me', time: '오후 2:30' },
        { id: 2, text: '네, 아직 판매 중입니다. 직거래 원하시나요?', sender: 'other', time: '오후 2:31' },
    ]);

    const handleSend = () => {
        if (!message.trim()) return;
        setChatHistory([...chatHistory, {
            id: Date.now(),
            text: message,
            sender: 'me',
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }]);
        setMessage('');
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] min-h-[600px] flex bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Chat List (Sidebar) */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 font-bold text-gray-800">
                    채팅목록
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 bg-blue-50/50">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" alt="" className="w-full h-full rounded-full"/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="font-bold text-sm text-gray-900">개발왕김코딩</span>
                                    <span className="text-xs text-gray-400">방금 전</span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">네, 아직 판매 중입니다. 직거래...</p>
                            </div>
                        </div>
                    </div>
                    {/* Placeholder for more chats */}
                    <div className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                         <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user5" alt="" className="w-full h-full rounded-full"/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="font-bold text-sm text-gray-900">마법사</span>
                                    <span className="text-xs text-gray-400">어제</span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">네고 가능한가요?</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Room */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setView(AppView.HOME)} className="md:hidden">
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </button>
                        <div>
                            <span className="font-bold text-gray-900">개발왕김코딩</span>
                            <span className="text-xs text-gray-500 ml-2">36.5°C</span>
                        </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Product Info Banner */}
                <div className="p-3 bg-gray-50 border-b border-gray-200 flex gap-3 items-center">
                    <img src="https://picsum.photos/400/600?random=1" className="w-10 h-12 object-cover rounded border border-gray-200" alt="product" />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">클린 코드 (Clean Code)</p>
                        <p className="text-xs font-bold text-gray-900">25,000원 <span className="font-normal text-gray-500">· 판매중</span></p>
                    </div>
                    <button className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100 font-medium">거래 약속 잡기</button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                    <div className="text-center text-xs text-gray-400 my-4">2024년 5월 20일</div>
                    
                    {chatHistory.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'other' && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 self-start">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" alt="" className="w-full h-full rounded-full"/>
                                </div>
                            )}
                            <div className={`max-w-[70%] ${msg.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col`}>
                                <div className={`px-4 py-2.5 rounded-lg text-sm ${msg.sender === 'me' ? 'bg-primary-500 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}>
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1">{msg.time}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex gap-2 items-center">
                        <button className="text-gray-400 hover:text-gray-600 p-2">
                            <ImageIcon className="w-6 h-6" />
                        </button>
                        <div className="flex-1 relative">
                            <input 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="메시지를 입력하세요..."
                                className="w-full pl-4 pr-12 py-3 bg-gray-100 border-none rounded-full focus:ring-1 focus:ring-primary-500 outline-none text-sm"
                            />
                            <button 
                                onClick={handleSend}
                                className={`absolute right-1.5 top-1.5 p-1.5 rounded-full transition-colors ${message.trim() ? 'bg-primary-500 text-white' : 'bg-gray-300 text-white'}`}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};