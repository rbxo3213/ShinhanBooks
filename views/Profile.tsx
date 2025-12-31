import React, { useState } from 'react';
import { User, AppView } from '../types';
import { EmailVerification } from './Auth/EmailVerification';
import { LogOut, Trash2, Edit2, Settings, Shield } from 'lucide-react';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onUpdate: (user: Partial<User>) => void;
  setView: (view: AppView) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onLogout, onUpdate, setView }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editNickname, setEditNickname] = useState(user.nickname);
  const [isEmailVerified, setIsEmailVerified] = useState(true);

  const handleSave = () => {
      if (editEmail !== user.email && !isEmailVerified) {
          alert('변경된 이메일 인증이 필요합니다.');
          return;
      }
      onUpdate({ email: editEmail, nickname: editNickname });
      setIsEditing(false);
  };

  const handleDeleteAccount = () => {
      if(window.confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
          alert('탈퇴가 완료되었습니다.');
          onLogout();
      }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditEmail(e.target.value);
      if (e.target.value !== user.email) {
          setIsEmailVerified(false);
      } else {
          setIsEmailVerified(true);
      }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-md border border-gray-200 p-6 text-center shadow-sm">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold mx-auto mb-4 border border-primary-100">
                    {user.nickname[0]}
                </div>
                <h2 className="text-lg font-bold text-gray-900">{user.nickname}</h2>
                <p className="text-xs text-gray-500 mb-3">{user.email}</p>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-700 border border-green-100">
                    <Shield className="w-3 h-3"/> 본인인증 완료
                </div>
            </div>
            
            <div className="mt-4 bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm text-sm">
                <button className="w-full text-left px-5 py-3.5 border-b border-gray-100 hover:bg-gray-50 font-medium text-gray-700 flex items-center gap-2">
                    <Settings className="w-4 h-4" /> 계정 설정
                </button>
                <button 
                    onClick={onLogout}
                    className="w-full text-left px-5 py-3.5 hover:bg-gray-50 font-medium text-gray-700 flex items-center gap-2"
                >
                    <LogOut className="w-4 h-4" /> 로그아웃
                </button>
            </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-8 rounded-md border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h3 className="text-lg font-bold text-gray-900">내 프로필</h3>
                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="text-gray-600 text-xs font-bold flex items-center px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200 transition"
                        >
                        <Edit2 className="w-3.5 h-3.5 mr-1.5"/> 수정하기
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <div className="max-w-lg space-y-5">
                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-1.5">닉네임</label>
                            <input 
                                value={editNickname}
                                onChange={(e) => setEditNickname(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-sm outline-none focus:border-primary-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-1.5">이메일</label>
                            <input 
                                value={editEmail}
                                onChange={handleEmailChange}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-sm outline-none focus:border-primary-500 text-sm"
                            />
                        </div>
                        
                        {!isEmailVerified && (
                             <EmailVerification 
                                email={editEmail} 
                                isVerified={isEmailVerified} 
                                onVerified={() => setIsEmailVerified(true)} 
                             />
                        )}

                        <div className="flex gap-2 pt-4">
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-gray-300 rounded-sm font-medium text-gray-600 hover:bg-gray-50 text-sm"
                            >
                                취소
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-4 py-2 bg-primary-500 text-white rounded-sm font-bold hover:bg-primary-600 text-sm"
                            >
                                저장
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
                         <div>
                            <span className="block text-xs text-gray-400 font-bold mb-1">닉네임</span>
                            <span className="text-base font-medium text-gray-900 block py-2 border-b border-gray-100">{user.nickname}</span>
                         </div>
                         <div>
                            <span className="block text-xs text-gray-400 font-bold mb-1">이메일</span>
                            <span className="text-base font-medium text-gray-900 block py-2 border-b border-gray-100">{user.email}</span>
                         </div>
                    </div>
                )}
            </div>
            
            {/* Danger Zone */}
            <div className="border border-red-100 rounded-md p-6 bg-white">
                <h4 className="text-red-600 font-bold text-sm mb-2">계정 관리</h4>
                <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.</p>
                    <button 
                        onClick={handleDeleteAccount}
                        className="text-red-600 text-xs font-bold flex items-center gap-1.5 border border-red-200 bg-red-50 px-3 py-1.5 rounded hover:bg-red-100 transition"
                    >
                        <Trash2 className="w-3.5 h-3.5"/> 회원 탈퇴
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};