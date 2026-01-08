
import React, { useState } from 'react';
import { AppView, User } from '../../types';

interface LoginProps {
  setView: (view: AppView) => void;
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ setView, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
        // Mock Login Logic
        let mockUser: User;
        
        if (username === 'admin') {
             mockUser = {
                id: 'admin-1',
                username: 'admin',
                email: 'admin@admin.com',
                nickname: '관리자',
                isVerified: true,
                wishlist: [],
                groupWishlist: [],
                temperature: 99.9,
                phoneNumber: '010-0000-0000',
                address: '서울 중구 세종대로 9길 20',
                points: 999999,
                isAdmin: true,
                status: 'ACTIVE',
                joinedAt: Date.now() - 50000000
            };
        } else {
             mockUser = {
                id: 'user-1', // Fixed ID for demo consistency
                username: username,
                email: 'user@shinhan.com', // Mock Email
                nickname: '모닝커피', // Matches mock data
                isVerified: true,
                wishlist: [],
                groupWishlist: [],
                temperature: 36.5,
                phoneNumber: '010-1234-5678',
                address: '서울 중구 세종대로 9길 20',
                points: 0,
                isAdmin: false,
                status: 'ACTIVE',
                joinedAt: Date.now() - 10000000
            };
        }
        
        onLogin(mockUser);
    }
  };

  const handleSocialLogin = (provider: 'kakao' | 'naver') => {
      alert(`${provider === 'kakao' ? '카카오' : '네이버'} 로그인은 준비 중입니다.`);
  };

  return (
    <div className="max-w-[400px] mx-auto mt-12">
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-primary-600 tracking-tighter mb-2 cursor-pointer leading-none" onClick={() => setView(AppView.HOME)}>
                Shinhan<span className="text-gray-900">Books</span>
            </h1>
            <p className="text-gray-500 text-sm mt-3">금융처럼 안전한 중고 서적 거래</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
            <div>
                <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디"
                className="w-full px-4 py-3.5 border border-gray-300 rounded-md focus:border-primary-500 outline-none transition text-sm focus:ring-1 focus:ring-primary-500"
                />
            </div>
            <div>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full px-4 py-3.5 border border-gray-300 rounded-md focus:border-primary-500 outline-none transition text-sm focus:ring-1 focus:ring-primary-500"
                />
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-500 pt-1 pb-2">
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-gray-800">
                    <input type="checkbox" className="rounded-sm text-primary-500 focus:ring-primary-500 border-gray-300"/>
                    <span>로그인 상태 유지</span>
                </label>
                <div className="flex gap-2">
                    <button type="button" onClick={() => setView(AppView.FIND_ACCOUNT)} className="hover:underline">아이디 찾기</button>
                    <span className="text-gray-300">|</span>
                    <button type="button" onClick={() => setView(AppView.FIND_ACCOUNT)} className="hover:underline">비밀번호 찾기</button>
                </div>
            </div>

            <button
            type="submit"
            className="w-full bg-primary-500 text-white py-4 rounded-md font-bold text-sm hover:bg-primary-600 transition shadow-sm"
            >
            로그인
            </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
            <button 
                onClick={() => handleSocialLogin('kakao')}
                className="w-full py-3.5 bg-[#FEE500] text-[#3c1e1e] rounded-md font-bold text-sm hover:bg-[#fdd835] transition flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C7.58 3 4 5.28 4 8.1c0 1.77 1.43 3.34 3.73 4.25-.16.59-.57 2.06-.66 2.4-.1.38.14.38.29.28.2.13 2.82-1.92 3.96-2.7.22.03.45.04.68.04 4.42 0 8-2.28 8-5.1S16.42 3 12 3z"/>
                </svg>
                카카오로 시작하기
            </button>
            <button 
                onClick={() => handleSocialLogin('naver')}
                className="w-full py-3.5 bg-[#03C75A] text-white rounded-md font-bold text-sm hover:bg-[#02b351] transition flex items-center justify-center gap-2"
            >
                <span className="font-black">N</span>
                네이버로 시작하기
            </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
            <button 
                onClick={() => setView(AppView.SIGNUP)}
                className="w-full py-3.5 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition text-sm"
            >
                회원가입
            </button>
        </div>
      </div>
    </div>
  );
};
