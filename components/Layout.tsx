import React from 'react';
import { AppView, AuthStatus, User } from '../types';
import { Home, Search, PlusCircle, User as UserIcon, LogIn, LogOut, ShoppingBag, Menu, MessageSquare } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
  authStatus: AuthStatus;
  user: User | null;
  onSearch: (query: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, authStatus, user, onSearch }) => {
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
              onClick={() => setView(AppView.HOME)}
              className={`px-3 py-2 text-sm font-bold hover:text-primary-600 transition-colors ${currentView === AppView.HOME ? 'text-primary-600' : 'text-gray-600'}`}
            >
              홈
            </button>

            <button 
              onClick={() => setView(AppView.UPLOAD)}
              className={`px-3 py-2 text-sm font-bold hover:text-primary-600 transition-colors ${currentView === AppView.UPLOAD ? 'text-primary-600' : 'text-gray-600'}`}
            >
              판매하기
            </button>

            <div className="h-4 w-px bg-gray-300 mx-2"></div>

            {authStatus === AuthStatus.LOGGED_IN ? (
              <div className="flex items-center gap-4">
                 <button 
                    onClick={() => setView(AppView.CHAT)}
                    className="relative p-2 text-gray-600 hover:text-primary-600 transition"
                 >
                    <MessageSquare className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                 </button>
                 <button 
                    onClick={() => setView(AppView.PROFILE)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 group"
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
            <a href="#" className="hover:text-primary-600">회사소개</a>
            <a href="#" className="hover:text-primary-600">이용약관</a>
            <a href="#" className="hover:text-primary-600 text-gray-900">개인정보처리방침</a>
            <a href="#" className="hover:text-primary-600">청소년보호정책</a>
            <a href="#" className="hover:text-primary-600">고객센터</a>
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