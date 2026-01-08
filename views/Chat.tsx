
import React, { useState, useRef, useEffect } from 'react';
import { AppView, ResellState, Book } from '../types';
import { Send, Image as ImageIcon, MoreVertical, ArrowLeft, ShieldCheck, AlertTriangle, Check, ChevronDown, CreditCard, ChevronRight } from 'lucide-react';

interface ChatProps {
    setView: (view: AppView) => void;
    onCheckout: (book: Book) => void;
}

interface Message {
    id: number;
    text: string;
    sender: 'me' | 'other' | 'system';
    time: string;
    type: 'text' | 'image' | 'payment_request' | 'payment_link' | 'system';
    isAccepted?: boolean;
}

// Mock Data for the book in chat context
const targetBook: Book = {
    id: 'mock-chat-book',
    type: 'SALE',
    title: '클린 코드 (Clean Code)',
    author: '로버트 C. 마틴',
    category: '과학/IT',
    price: 25000,
    originalPrice: 33000,
    condition: 'Like New',
    description: '상태 아주 좋습니다.',
    images: ['https://picsum.photos/400/600?random=1'],
    sellerId: 'other-user',
    sellerName: '개발왕김코딩',
    location: '서울 강남구',
    createdAt: Date.now(),
    likes: 10,
    views: 100,
    resellState: 'ON_SALE',
    shippingFee: 3000 // Added shipping fee for checkout test
};

export const Chat: React.FC<ChatProps> = ({ setView, onCheckout }) => {
    const [message, setMessage] = useState('');
    const [bookStatus, setBookStatus] = useState<ResellState>('ON_SALE');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Mock Chat History: User is the Buyer ('me'), Seller is 'other'
    const [chatHistory, setChatHistory] = useState<Message[]>([
        { id: 1, text: '안녕하세요! 상품 아직 판매 중인가요?', sender: 'me', time: '오후 2:30', type: 'text' },
        { id: 2, text: '네, 아직 판매 중입니다. 직거래 원하시나요?', sender: 'other', time: '오후 2:31', type: 'text' },
        // Incoming Payment Request from Seller
        { id: 3, text: '', sender: 'other', time: '오후 2:32', type: 'payment_request', isAccepted: false },
    ]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
            if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
                setIsStatusDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSend = () => {
        if (!message.trim()) return;
        const newMessage: Message = {
            id: Date.now(),
            text: message,
            sender: 'me',
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
        };
        setChatHistory(prev => [...prev, newMessage]);
        setMessage('');
    };

    const handleRequestSafetyPayment = () => {
        const newMessage: Message = {
            id: Date.now(),
            text: '',
            sender: 'me',
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            type: 'payment_request',
            isAccepted: false
        };
        setChatHistory(prev => [...prev, newMessage]);
    };

    const handleAcceptPayment = (msgId: number) => {
        // 1. 즉시 해당 메시지를 수락됨 처리 (UI 반응성 향상)
        setChatHistory(prev => prev.map(msg => 
            msg.id === msgId ? { ...msg, isAccepted: true } : msg
        ));

        // 2. 잠시 후 시스템 메시지와 결제 폼 전송 (서버 처리 시뮬레이션)
        setTimeout(() => {
            setBookStatus('RESERVED');
            const now = Date.now();
            
            setChatHistory(prev => [
                ...prev,
                {
                    id: now,
                    text: '안전결제 요청이 수락되었습니다.',
                    sender: 'system',
                    time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
                    type: 'system'
                },
                {
                    id: now + 10, // Ensure unique ID
                    text: '',
                    sender: 'other', // Sent by Seller (conceptually) as a "Bill"
                    time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
                    type: 'payment_link'
                }
            ]);
        }, 600);
    };

    const handleReport = () => {
        setIsMenuOpen(false);
        alert('신고가 접수되었습니다. 관리자가 검토 후 조치하겠습니다.');
    };

    const handleManualStatusChange = (status: ResellState) => {
        setBookStatus(status);
        setIsStatusDropdownOpen(false);
        setChatHistory(prev => [...prev, {
            id: Date.now(),
            text: `판매자가 상품 상태를 '${getStatusText(status)}'으로 변경했습니다.`,
            sender: 'system',
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            type: 'system'
        }]);
    };

    const getStatusText = (status: ResellState) => {
        switch(status) {
            case 'ON_SALE': return '판매중';
            case 'RESERVED': return '예약중';
            case 'SOLD': return '판매완료';
        }
    };

    const getStatusColor = (status: ResellState) => {
        switch(status) {
            case 'ON_SALE': return 'bg-green-500';
            case 'RESERVED': return 'bg-orange-500';
            case 'SOLD': return 'bg-gray-800';
        }
    };

    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] min-h-[600px] flex bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* 1. Chat List (Sidebar) */}
            <div className="w-1/3 min-w-[300px] border-r border-gray-200 flex flex-col bg-white">
                <div className="p-5 border-b border-gray-100 font-bold text-gray-900 flex justify-between items-center">
                    <span>채팅목록</span>
                    <span className="text-xs text-gray-400 font-normal">전체 2개</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {/* Active Chat Item */}
                    <div className="p-4 hover:bg-gray-50 cursor-pointer border-l-4 border-l-primary-500 bg-blue-50/30 transition-colors">
                        <div className="flex gap-3">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 border border-gray-200 overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" alt="" className="w-full h-full"/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="font-bold text-sm text-gray-900">개발왕김코딩</span>
                                    <span className="text-xs text-gray-400">방금 전</span>
                                </div>
                                <p className="text-sm text-gray-600 truncate font-medium">안전결제 요청을 보냈습니다.</p>
                            </div>
                            <div className="w-12 h-12 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                                <img src={targetBook.images[0]} className="w-full h-full object-cover" alt="book"/>
                            </div>
                        </div>
                    </div>
                    
                    {/* Other Chat Item */}
                    <div className="p-4 hover:bg-gray-50 cursor-pointer border-l-4 border-l-transparent transition-colors">
                         <div className="flex gap-3">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 border border-gray-200 overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user5" alt="" className="w-full h-full"/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="font-bold text-sm text-gray-900">마법사</span>
                                    <span className="text-xs text-gray-400">어제</span>
                                </div>
                                <p className="text-sm text-gray-400 truncate">네고 가능한가요?</p>
                            </div>
                            <div className="w-12 h-12 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                                <img src="https://picsum.photos/400/600?random=2" className="w-full h-full object-cover" alt="book"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Chat Room */}
            <div className="flex-1 flex flex-col bg-[#F8F9FA]">
                {/* 2-1. Chat Header & Product Info */}
                <div className="bg-white border-b border-gray-200">
                    <div className="p-4 flex justify-between items-center border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setView(AppView.HOME)} className="md:hidden">
                                <ArrowLeft className="w-6 h-6 text-gray-600" />
                            </button>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900">개발왕김코딩</span>
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">36.5°C</span>
                                </div>
                                <span className="text-xs text-gray-400">보통 10분 내 응답</span>
                            </div>
                        </div>
                        <div className="relative" ref={menuRef}>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                            {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1">
                                    <button 
                                        onClick={handleReport}
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <AlertTriangle className="w-4 h-4" /> 신고하기
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* 2-1-1. Product Banner */}
                    <div className="p-4 flex gap-4 items-center bg-white">
                        <img src={targetBook.images[0]} className="w-12 h-16 object-cover rounded border border-gray-100 shadow-sm" alt="product" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-bold text-gray-900 truncate">{targetBook.title}</h3>
                            </div>
                            <p className="text-sm font-bold text-gray-900">{targetBook.price.toLocaleString()}원</p>
                        </div>
                        
                        {/* 1-1. Status Dropdown (Manual Change) */}
                        <div className="relative" ref={statusRef}>
                            <button 
                                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                className={`flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs font-bold text-white transition hover:opacity-90 ${getStatusColor(bookStatus)}`}
                            >
                                {getStatusText(bookStatus)}
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            
                            {isStatusDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
                                    <div className="p-2 text-[10px] text-gray-400 bg-gray-50 border-b border-gray-100">판매 상태 변경</div>
                                    {(['ON_SALE', 'RESERVED', 'SOLD'] as ResellState[]).map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleManualStatusChange(status)}
                                            className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            {getStatusText(status)}
                                            {bookStatus === status && <Check className="w-3 h-3 text-primary-600" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2-2. Chat Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
                    <div className="text-center text-xs text-gray-400 my-4 bg-gray-200/50 inline-block px-3 py-1 rounded-full mx-auto">
                        2024년 5월 20일
                    </div>
                    
                    {chatHistory.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.type === 'system' ? 'justify-center' : msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            
                            {msg.type === 'system' ? (
                                <div className="bg-gray-200/70 text-gray-600 text-xs px-4 py-2 rounded-full my-2">
                                    {msg.text}
                                </div>
                            ) : (
                                <>
                                    {/* Avatar for 'other' */}
                                    {msg.sender === 'other' && (
                                        <div className="w-9 h-9 rounded-full bg-gray-200 mr-2 self-start border border-gray-200 overflow-hidden flex-shrink-0">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" alt="" className="w-full h-full"/>
                                        </div>
                                    )}
                                    
                                    <div className={`max-w-[80%] flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                        
                                        {msg.type === 'payment_request' ? (
                                            /* Payment Request Message Style */
                                            <div className={`p-0 rounded-lg overflow-hidden border shadow-sm w-[280px] ${msg.sender === 'me' ? 'bg-white border-primary-200' : 'bg-white border-gray-200'}`}>
                                                <div className="bg-primary-50 p-3 flex items-center gap-2 border-b border-primary-100">
                                                    <ShieldCheck className="w-5 h-5 text-primary-600" />
                                                    <span className="font-bold text-primary-900 text-sm">안전결제 요청</span>
                                                </div>
                                                <div className="p-4 bg-white">
                                                    <p className="text-sm text-gray-700 mb-3">
                                                        {msg.sender === 'me' 
                                                            ? '상대방에게 안전결제를 요청했습니다.' 
                                                            : '상대방이 안전결제를 요청했습니다.'}
                                                        <br/>
                                                        <span className="text-xs text-gray-500 mt-1 block">수락 시 결제 주문서가 전송됩니다.</span>
                                                    </p>
                                                    
                                                    {msg.sender === 'me' ? (
                                                        <button disabled className="w-full py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded cursor-not-allowed">
                                                            {msg.isAccepted ? '수락됨' : '요청 보냄'}
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleAcceptPayment(msg.id)}
                                                            disabled={msg.isAccepted}
                                                            className={`w-full py-2.5 rounded text-sm font-bold transition ${
                                                                msg.isAccepted 
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                                                            }`}
                                                        >
                                                            {msg.isAccepted ? '결제 수락됨' : '안전결제 수락하기'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ) : msg.type === 'payment_link' ? (
                                            /* Payment Link (Order Form) Message Style */
                                            <div className="bg-white border border-primary-200 rounded-lg shadow-md w-[280px] overflow-hidden">
                                                 <div className="bg-gray-900 text-white p-3 flex items-center justify-between">
                                                     <span className="font-bold text-sm">안전결제 주문서</span>
                                                     <CreditCard className="w-4 h-4 text-white/80" />
                                                 </div>
                                                 <div className="p-4">
                                                     <div className="flex gap-3 mb-4">
                                                         <img src={targetBook.images[0]} className="w-16 h-20 object-cover rounded bg-gray-100 border border-gray-100" alt="" />
                                                         <div className="flex-1 min-w-0">
                                                             <p className="font-bold text-sm text-gray-900 line-clamp-2">{targetBook.title}</p>
                                                             <p className="text-lg font-bold text-primary-600 mt-1">{targetBook.price.toLocaleString()}원</p>
                                                         </div>
                                                     </div>
                                                     <p className="text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded">
                                                         구매자가 결제를 완료하면<br/>판매자에게 알림이 전송됩니다.
                                                     </p>
                                                     <button 
                                                        onClick={() => onCheckout(targetBook)}
                                                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded font-bold text-sm flex items-center justify-center gap-2 transition"
                                                     >
                                                         결제하기 <ChevronRight className="w-4 h-4" />
                                                     </button>
                                                 </div>
                                            </div>
                                        ) : (
                                            /* Normal Text Message */
                                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                                msg.sender === 'me' 
                                                ? 'bg-primary-600 text-white rounded-tr-none' 
                                                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                                            }`}>
                                                {msg.text}
                                            </div>
                                        )}
                                        <span className="text-[10px] text-gray-400 mt-1.5 px-1 font-medium">{msg.time}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* 2-2-2. Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex gap-2 items-center">
                        <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition">
                            <ImageIcon className="w-6 h-6" />
                        </button>
                        
                        {/* Safety Payment Request Button */}
                        <div className="relative group">
                             <button 
                                onClick={handleRequestSafetyPayment}
                                className="text-primary-600 hover:text-primary-700 p-2 rounded-full hover:bg-primary-50 transition"
                                title="안전결제 요청"
                             >
                                <ShieldCheck className="w-6 h-6" />
                            </button>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                                안전결제 요청
                            </span>
                        </div>

                        <div className="flex-1 relative">
                            <input 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="메시지를 입력하세요..."
                                className="w-full pl-5 pr-12 py-3 bg-gray-100 border-none rounded-full focus:ring-2 focus:ring-primary-100 focus:bg-white transition outline-none text-sm"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={!message.trim()}
                                className={`absolute right-1.5 top-1.5 p-1.5 rounded-full transition-all ${
                                    message.trim() 
                                    ? 'bg-primary-600 text-white shadow-md hover:bg-primary-700' 
                                    : 'bg-gray-300 text-white cursor-not-allowed'
                                }`}
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
