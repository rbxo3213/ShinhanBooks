
import React, { useState, useRef, useEffect } from 'react';
import { AppView, AuthStatus, User, Notification } from '../types';
import { Home, Search, PlusCircle, User as UserIcon, LogIn, LogOut, ShoppingBag, Menu, MessageSquare, Heart, Bell, TrendingDown, Check, LayoutDashboard } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
  authStatus: AuthStatus;
  user: User | null;
  onSearch: (query: string) => void;
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
    children, 
    currentView, 
    setView, 
    authStatus, 
    user, 
    onSearch,
    notifications = [],
    onNotificationClick,
    onMarkAllRead
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
            setIsNotifOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (timestamp: number) => {
      const minutes = Math.floor((Date.now() - timestamp) / 60000);
      if (minutes < 1) return '방금 전';
      if (minutes < 60) return `${minutes}분 전`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}시간 전`;
      return '하루 전';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-gray-900">
      {/* Desktop Header - Shinhan Books Style */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer mr-10" 
            onClick={() => setView(AppView.HOME)}
          >
            {/* Simple Text Logo for Shinhan Books */}
            <div className="flex flex-col leading-none">
                <span className="text-[10px] font-bold text-primary-500 tracking-widest mb-0.5">PREMIUM</span>
                <span className="text-2xl font-black text-primary-600 tracking-tighter">Shinhan<span className="text-gray-800 font-bold ml-1">Books</span></span>
            </div>
          </div>

          {/* Search Bar - Expanded */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <input 
              type="text" 
              onChange={(e) => onSearch(e.target.value)}
              placeholder="찾고 싶은 도서나 저자를 검색해보세요" 
              className="w-full pl-5 pr-14 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all text-sm placeholder-gray-400 shadow-sm"
            />
            <button className="absolute right-2 top-1.5 h-9 w-9 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Actions */}
          <nav className="flex items-center gap-4 ml-8">
            <button 
              onClick={() => setView(AppView.READING_GROUPS)}
              className={`px-3 py-2 text-sm font-bold hover:text-primary-600 transition-colors ${currentView === AppView.READING_GROUPS ? 'text-primary-600' : 'text-gray-600'}`}
            >
              독서모임
            </button>

            <button 
              onClick={() => setView(AppView.UPLOAD)}
              className={`px-3 py-2 text-sm font-bold hover:text-primary-600 transition-colors ${currentView === AppView.UPLOAD ? 'text-primary-600' : 'text-gray-600'}`}
            >
              판매하기
            </button>
            
            {/* Admin Button */}
            {user?.isAdmin && (
                <button 
                    onClick={() => setView(AppView.ADMIN)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold transition-colors ${currentView === AppView.ADMIN ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    <LayoutDashboard className="w-4 h-4" /> 관리자
                </button>
            )}

            <div className="h-4 w-px bg-gray-300 mx-2"></div>

            {authStatus === AuthStatus.LOGGED_IN ? (
              <div className="flex items-center gap-3">
                 {/* Notification Bell */}
                 <div className="relative" ref={notifRef}>
                    <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className={`relative p-2 transition hover:text-primary-600 ${isNotifOpen ? 'text-primary-600 bg-gray-50 rounded-full' : 'text-gray-600'}`}
                        title="알림"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {isNotifOpen && (
                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-sm text-gray-800">알림</h3>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={onMarkAllRead}
                                        className="text-[10px] text-gray-500 hover:text-primary-600 flex items-center gap-1"
                                    >
                                        <Check className="w-3 h-3" /> 모두 읽음
                                    </button>
                                )}
                            </div>
                            <div className="max-h-[320px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(notif => (
                                        <div 
                                            key={notif.id}
                                            onClick={() => {
                                                if(onNotificationClick) onNotificationClick(notif);
                                                setIsNotifOpen(false);
                                            }}
                                            className={`p-4 border-b border-gray-50 cursor-pointer transition hover:bg-gray-50 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'PRICE_DROP' ? 'bg-red-50 text-red-500' : 'bg-primary-50 text-primary-500'}`}>
                                                    {notif.type === 'PRICE_DROP' ? <TrendingDown className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className={`text-xs leading-snug mb-1 ${!notif.isRead ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                                                        {notif.message}
                                                    </p>
                                                    <span className="text-[10px] text-gray-400">{formatTime(notif.timestamp)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-400 text-xs">
                                        새로운 알림이 없습니다.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                 </div>

                 <button 
                    onClick={() => setView(AppView.WISHLIST)}
                    className={`relative p-2 transition hover:text-primary-600 ${currentView === AppView.WISHLIST ? 'text-primary-600' : 'text-gray-600'}`}
                    title="찜한 상품"
                 >
                    <Heart className="w-5 h-5" />
                    {user?.wishlist && user.wishlist.length > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    )}
                 </button>
                 <button 
                    onClick={() => setView(AppView.CHAT)}
                    className={`relative p-2 transition hover:text-primary-600 ${currentView === AppView.CHAT ? 'text-primary-600' : 'text-gray-600'}`}
                    title="채팅"
                 >
                    <MessageSquare className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                 </button>
                 <button 
                    onClick={() => setView(AppView.PROFILE)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 group ml-1"
                 >
                    <div className="w-9 h-9 bg-primary-50 text-primary-600 rounded-full border border-primary-100 flex items-center justify-center font-bold text-sm overflow-hidden group-hover:bg-primary-100 transition">
                    {user?.nickname[0]}
                    </div>
                    <span className="font-bold hidden lg:block">{user?.nickname}님</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setView(AppView.LOGIN)}
                className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-bold transition-all shadow-sm hover:shadow-md"
              >
                로그인
              </button>
            )}
            
            <button className="p-2 text-gray-500 hover:text-gray-900 md:hidden">
                <Menu className="w-6 h-6"/>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-12 text-gray-500">
        <div className="max-w-7xl mx-auto px-6 text-xs leading-loose">
          <div className="flex gap-6 mb-6 font-bold text-gray-700 text-sm">
            <button onClick={() => setView(AppView.COMPANY)} className="hover:text-primary-600">회사소개</button>
            <button onClick={() => setView(AppView.TERMS)} className="hover:text-primary-600">이용약관</button>
            <button onClick={() => setView(AppView.TERMS)} className="hover:text-primary-600 text-gray-900">개인정보처리방침</button>
            <button onClick={() => setView(AppView.TERMS)} className="hover:text-primary-600">청소년보호정책</button>
            <button onClick={() => setView(AppView.SUPPORT)} className="hover:text-primary-600">고객센터</button>
          </div>
          <div className="border-t border-gray-100 pt-6">
            <p className="font-bold text-gray-800 mb-1">Shinhan Books (주)</p>
            <p>대표이사: 김신한 | 사업자등록번호: 123-45-67890 | 통신판매업신고: 2024-서울중구-0000</p>
            <p>주소: 서울특별시 중구 세종대로 9길 20 | 고객센터: 1544-0000 | 이메일: help@shinhanbooks.com</p>
            <p className="mt-4 text-gray-400">Copyright © Shinhan Books Corp. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
