import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  isVerified: boolean;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ email, onVerified, isVerified }) => {
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendCode = () => {
    if (!email.includes('@')) {
      setError('올바른 이메일 주소를 입력해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setCodeSent(true);
      setTimer(180); // 3 minutes
      setCode('1234'); // Mock code
      alert('인증번호가 전송되었습니다! (테스트용: 1234)');
    }, 1500);
  };

  const handleVerify = () => {
    if (inputCode === '1234') {
      onVerified();
    } else {
      setError('인증번호가 일치하지 않습니다.');
    }
  };

  if (isVerified) {
     return (
        <div className="flex items-center text-primary-600 bg-primary-50 p-3 rounded-md text-xs font-bold mb-4 border border-primary-100">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            이메일 인증이 완료되었습니다.
        </div>
     );
  }

  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-1">
        {!codeSent ? (
            <button
            type="button"
            onClick={handleSendCode}
            disabled={!email || loading}
            className="text-xs bg-gray-800 text-white px-3 py-2.5 rounded-md hover:bg-gray-900 disabled:opacity-50 whitespace-nowrap font-medium transition"
            >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : '인증번호 받기'}
            </button>
        ) : (
             <div className="flex-1 flex gap-2">
                <input 
                    type="text" 
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="인증번호 4자리"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-primary-500 outline-none"
                    maxLength={4}
                />
                <button
                    type="button"
                    onClick={handleVerify}
                    className="text-xs bg-primary-500 text-white px-3 py-2 rounded-md font-bold hover:bg-primary-600 transition"
                >
                    확인
                </button>
             </div>
        )}
      </div>
      
      {codeSent && (
          <div className="flex justify-between text-xs mt-1 px-1">
             <span className="text-red-500 font-medium">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')} 남음</span>
             <button type="button" onClick={handleSendCode} className="text-gray-500 underline hover:text-gray-800">재전송</button>
          </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1.5 px-1">{error}</p>}
    </div>
  );
};