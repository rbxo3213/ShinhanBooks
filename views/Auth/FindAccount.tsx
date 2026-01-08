
import React, { useState } from 'react';
import { AppView } from '../../types';
import { EmailVerification } from './EmailVerification';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface FindAccountProps {
    setView: (view: AppView) => void;
}

export const FindAccount: React.FC<FindAccountProps> = ({ setView }) => {
    const [tab, setTab] = useState<'id' | 'pw'>('id');
    
    // Find ID States
    const [findIdEmail, setFindIdEmail] = useState('');
    const [isIdEmailVerified, setIsIdEmailVerified] = useState(false);
    const [foundId, setFoundId] = useState('');

    // Find PW States
    const [findPwId, setFindPwId] = useState('');
    const [findPwEmail, setFindPwEmail] = useState('');
    const [isPwEmailVerified, setIsPwEmailVerified] = useState(false);

    const handleFindId = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock Finding ID
        setFoundId('shinhan_user123');
    };

    const handleFindPw = (e: React.FormEvent) => {
        e.preventDefault();
        alert('비밀번호 재설정 링크를 이메일로 발송했습니다.');
        setView(AppView.LOGIN);
    };

    return (
        <div className="max-w-[400px] mx-auto mt-12 mb-12">
            <div className="bg-white p-8 rounded-md border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <button onClick={() => setView(AppView.LOGIN)} className="text-gray-400 hover:text-gray-600">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">계정 찾기</h2>
                </div>
                
                <div className="flex border-b border-gray-200 mb-6">
                    <button 
                        onClick={() => { setTab('id'); setFoundId(''); setIsIdEmailVerified(false); }}
                        className={`flex-1 py-3 font-bold text-sm transition-colors ${tab === 'id' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        아이디 찾기
                    </button>
                    <button 
                        onClick={() => { setTab('pw'); setIsPwEmailVerified(false); }}
                        className={`flex-1 py-3 font-bold text-sm transition-colors ${tab === 'pw' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        비밀번호 찾기
                    </button>
                </div>

                {tab === 'id' ? (
                    // === FIND ID TAB ===
                    <div>
                        {!foundId ? (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 mb-2">가입 시 등록한 이메일로 인증해주세요.</p>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">이메일</label>
                                    <input 
                                        type="email" 
                                        value={findIdEmail} 
                                        onChange={(e) => setFindIdEmail(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:border-primary-500 outline-none text-sm mb-2"
                                        placeholder="example@email.com"
                                        disabled={isIdEmailVerified}
                                    />
                                    <EmailVerification 
                                        email={findIdEmail} 
                                        isVerified={isIdEmailVerified}
                                        onVerified={() => setIsIdEmailVerified(true)}
                                    />
                                </div>
                                <button 
                                    onClick={handleFindId}
                                    disabled={!isIdEmailVerified}
                                    className="w-full bg-primary-600 text-white py-3.5 rounded-sm mt-2 font-bold hover:bg-primary-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    아이디 찾기
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <p className="text-sm text-gray-500 mb-2">회원님의 아이디는</p>
                                <p className="text-xl font-bold text-gray-900 mb-6">{foundId}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => setTab('pw')} className="flex-1 py-3 border border-gray-300 rounded-sm text-sm font-bold text-gray-600 hover:bg-gray-50">비밀번호 찾기</button>
                                    <button onClick={() => setView(AppView.LOGIN)} className="flex-1 py-3 bg-primary-600 text-white rounded-sm text-sm font-bold hover:bg-primary-700">로그인 하기</button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // === FIND PW TAB ===
                    <form onSubmit={handleFindPw} className="space-y-4">
                         <p className="text-sm text-gray-600 mb-2">아이디와 이메일을 입력해 본인인증을 진행해주세요.</p>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">아이디</label>
                            <input 
                                type="text" 
                                value={findPwId} 
                                onChange={(e) => setFindPwId(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:border-primary-500 outline-none text-sm"
                                placeholder="아이디 입력"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">이메일</label>
                            <input 
                                type="email" 
                                value={findPwEmail} 
                                onChange={(e) => setFindPwEmail(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:border-primary-500 outline-none text-sm mb-2"
                                placeholder="example@email.com"
                                disabled={isPwEmailVerified}
                            />
                             <EmailVerification 
                                email={findPwEmail} 
                                isVerified={isPwEmailVerified}
                                onVerified={() => setIsPwEmailVerified(true)}
                            />
                        </div>
                        
                        <button 
                            disabled={!isPwEmailVerified || !findPwId}
                            className="w-full bg-gray-800 text-white py-3.5 rounded-sm mt-2 font-bold hover:bg-gray-900 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            비밀번호 재설정
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
