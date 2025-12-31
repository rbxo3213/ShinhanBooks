import React, { useState } from 'react';
import { AppView } from '../../types';

interface FindAccountProps {
    setView: (view: AppView) => void;
}

export const FindAccount: React.FC<FindAccountProps> = ({ setView }) => {
    const [tab, setTab] = useState<'id' | 'pw'>('id');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`${tab === 'id' ? '아이디' : '비밀번호'} 찾기 정보를 전송했습니다.`);
        setView(AppView.LOGIN);
    };

    return (
        <div className="max-w-[400px] mx-auto mt-12">
            <div className="bg-white p-8 rounded-md border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-center text-gray-800">계정 찾기</h2>
                
                <div className="flex border-b border-gray-200 mb-6">
                    <button 
                        onClick={() => setTab('id')}
                        className={`flex-1 py-3 font-bold text-sm transition-colors ${tab === 'id' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        아이디 찾기
                    </button>
                    <button 
                        onClick={() => setTab('pw')}
                        className={`flex-1 py-3 font-bold text-sm transition-colors ${tab === 'pw' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        비밀번호 찾기
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {tab === 'id' ? (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">휴대전화 번호</label>
                            <input 
                                type="tel" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:border-primary-500 outline-none text-sm"
                                placeholder="010-0000-0000"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">가입한 이메일</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:border-primary-500 outline-none text-sm"
                                placeholder="example@email.com"
                            />
                        </div>
                    )}
                    
                    <button className="w-full bg-gray-800 text-white py-3.5 rounded-sm mt-2 font-bold hover:bg-gray-900 transition text-sm">
                        {tab === 'id' ? '아이디 찾기' : '비밀번호 재설정'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button onClick={() => setView(AppView.LOGIN)} className="text-xs text-gray-500 hover:text-gray-800 underline">
                        로그인 화면으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
};