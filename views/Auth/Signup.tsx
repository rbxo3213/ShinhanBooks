import React, { useState } from 'react';
import { AppView, User } from '../../types';
import { EmailVerification } from './EmailVerification';

interface SignupProps {
  setView: (view: AppView) => void;
  onSignup: (user: User) => void;
}

export const Signup: React.FC<SignupProps> = ({ setView, onSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailVerified) {
      setError('이메일 인증을 완료해주세요.');
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
      email: formData.email,
      nickname: formData.nickname,
      isVerified: true
    };
    onSignup(newUser);
  };

  return (
    <div className="max-w-[400px] mx-auto mt-12">
      <div className="bg-white p-8 rounded-md border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-gray-900">회원가입</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:border-primary-500 outline-none text-sm transition"
              placeholder="example@naver.com"
              disabled={isEmailVerified}
            />
          </div>

          <EmailVerification 
              email={formData.email} 
              isVerified={isEmailVerified} 
              onVerified={() => setIsEmailVerified(true)} 
          />

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">비밀번호</label>
            <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:border-primary-500 outline-none text-sm transition"
            placeholder="8자 이상 입력"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">비밀번호 확인</label>
            <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:border-primary-500 outline-none text-sm transition"
            placeholder="비밀번호 재입력"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">닉네임</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:border-primary-500 outline-none text-sm transition"
              placeholder="거래에 사용할 별명"
            />
          </div>

          {error && <p className="text-red-500 text-xs bg-red-50 p-2.5 rounded-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary-500 text-white py-3.5 rounded-sm font-bold text-sm hover:bg-primary-600 transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isEmailVerified}
          >
            가입하기
          </button>
        </form>

        <div className="mt-6 text-center text-xs">
          <span className="text-gray-500">이미 아이디가 있으신가요? </span>
          <button onClick={() => setView(AppView.LOGIN)} className="text-primary-600 font-bold hover:underline">로그인</button>
        </div>
      </div>
    </div>
  );
};