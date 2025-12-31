import React, { useState } from 'react';
import { AppView, User } from '../../types';

interface LoginProps {
  setView: (view: AppView) => void;
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ setView, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
        const mockUser: User = {
            id: 'mock-user-id',
            email: email,
            nickname: '책방주인',
            isVerified: true
        };
        onLogin(mockUser);
    }
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일"
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

        <div className="mt-6 pt-6 border-t border-gray-100">
            <button 
                onClick={() => setView(AppView.SIGNUP)}
                className="w-full py-3.5 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition text-sm"
            >
                회원가입
            </button>
        </div>
        
        <div className="mt-4 text-center">
             <button onClick={() => setView(AppView.HOME)} className="text-xs text-gray-400 hover:text-gray-600 underline">
                로그인 없이 둘러보기
            </button>
        </div>
      </div>
    </div>
  );
};