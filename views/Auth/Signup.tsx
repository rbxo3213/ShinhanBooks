
import React, { useState } from 'react';
import { AppView, User } from '../../types';
import { EmailVerification } from './EmailVerification';
import { Loader2, Check } from 'lucide-react';

interface SignupProps {
  setView: (view: AppView) => void;
  onSignup: (user: User) => void;
}

export const Signup: React.FC<SignupProps> = ({ setView, onSignup }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    phoneNumber: ''
  });
  
  // Status States
  const [isUsernameChecking, setIsUsernameChecking] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'username') {
        setIsUsernameAvailable(null); // Reset availability if typing
    }
  };

  const handleCheckUsername = () => {
      if (formData.username.length < 4) {
          setError('아이디는 4글자 이상이어야 합니다.');
          return;
      }
      setError('');
      setIsUsernameChecking(true);
      
      // Simulate Async API Call
      setTimeout(() => {
          setIsUsernameChecking(false);
          // Mock logic: 'admin' is taken
          if (formData.username === 'admin') {
              setIsUsernameAvailable(false);
              setError('이미 사용 중인 아이디입니다.');
          } else {
              setIsUsernameAvailable(true);
          }
      }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isUsernameAvailable !== true) {
        setError('아이디 중복 확인을 해주세요.');
        return;
    }
    if (!isEmailVerified) {
      setError('이메일 인증을 완료해주세요.');
      return;
    }
    if (formData.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (formData.nickname.length < 2) {
      setError('닉네임은 2글자 이상이어야 합니다.');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: formData.username,
      email: formData.email,
      nickname: formData.nickname,
      isVerified: true,
      wishlist: [],
      groupWishlist: [],
      // ERD Default Values
      points: 0,
      temperature: 36.5,
      phoneNumber: formData.phoneNumber || undefined,
      // Admin / Status Defaults
      isAdmin: false,
      status: 'ACTIVE',
      joinedAt: Date.now()
    };
    onSignup(newUser);
  };

  return (
    <div className="max-w-[400px] mx-auto mt-12 mb-12">
      <div className="bg-white p-8 rounded-md border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-gray-900">회원가입</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. ID Input & Duplicate Check */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">아이디 <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`flex-1 px-3 py-2.5 border rounded-sm outline-none text-sm transition ${isUsernameAvailable === true ? 'border-green-500 bg-green-50' : 'border-gray-300 focus:border-primary-500'}`}
                    placeholder="영문 소문자/숫자 4자 이상"
                    disabled={isUsernameAvailable === true}
                />
                <button
                    type="button"
                    onClick={handleCheckUsername}
                    disabled={!formData.username || isUsernameChecking || isUsernameAvailable === true}
                    className={`text-xs px-3 py-2.5 rounded-sm font-bold whitespace-nowrap border transition ${isUsernameAvailable === true ? 'border-green-500 text-green-600 bg-white' : 'bg-gray-800 text-white border-gray-800 hover:bg-gray-900'}`}
                >
                    {isUsernameChecking ? <Loader2 className="w-3 h-3 animate-spin"/> : isUsernameAvailable === true ? <Check className="w-4 h-4"/> : '중복확인'}
                </button>
            </div>
            {isUsernameAvailable === true && <p className="text-xs text-green-600 mt-1">사용 가능한 아이디입니다.</p>}
          </div>

          {/* 2. Email Input & Verification */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">이메일 <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:border-primary-500 outline-none text-sm transition mb-2"
              placeholder="example@email.com"
              disabled={isEmailVerified}
            />
            <EmailVerification 
                email={formData.email} 
                isVerified={isEmailVerified} 
                onVerified={() => setIsEmailVerified(true)} 
            />
          </div>

          {/* 3. Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">비밀번호 <span className="text-red-500">*</span></label>
            <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:border-primary-500 outline-none text-sm transition"
            placeholder="8자 이상 입력"
            />
          </div>

          {/* 4. Confirm Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">비밀번호 확인 <span className="text-red-500">*</span></label>
            <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:border-primary-500 outline-none text-sm transition"
            placeholder="비밀번호 재입력"
            />
          </div>

          {/* 5. Nickname */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">닉네임 <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:border-primary-500 outline-none text-sm transition"
              placeholder="거래에 사용할 별명"
            />
          </div>

          {/* 6. Phone (Optional) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">휴대폰 번호 (선택)</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:border-primary-500 outline-none text-sm transition"
              placeholder="010-0000-0000"
            />
          </div>

          {error && <p className="text-red-500 text-xs bg-red-50 p-2.5 rounded-sm font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary-500 text-white py-3.5 rounded-sm font-bold text-sm hover:bg-primary-600 transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            가입하기
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs border-t border-gray-100 pt-6">
          <span className="text-gray-500">이미 아이디가 있으신가요? </span>
          <button onClick={() => setView(AppView.LOGIN)} className="text-primary-600 font-bold hover:underline">로그인</button>
        </div>
      </div>
    </div>
  );
};
