import React, { useState } from 'react';
import { Book, AppView, User } from '../types';
import { ShieldCheck, CreditCard, CheckCircle2 } from 'lucide-react';

interface MemberCheckoutProps {
    book: Book;
    user: User;
    setView: (view: AppView) => void;
}

export const MemberCheckout: React.FC<MemberCheckoutProps> = ({ book, user, setView }) => {
    const [loading, setLoading] = useState(false);
    
    const handlePayment = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert('안전 결제가 완료되었습니다! 판매자가 확인 후 발송할 예정입니다.');
            setView(AppView.HOME);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-8 text-gray-900">주문/결제</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Info */}
                <div className="md:col-span-2 space-y-6">
                    {/* User Info */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-bold mb-4">구매자 정보</h2>
                        <div className="space-y-3 text-sm">
                             <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500">이름</span>
                                <span className="font-medium">{user.nickname}</span>
                             </div>
                             <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500">이메일</span>
                                <span className="font-medium">{user.email}</span>
                             </div>
                             <div className="flex justify-between py-2">
                                <span className="text-gray-500">휴대폰</span>
                                <span className="font-medium text-gray-400">010-****-1234 (인증됨)</span>
                             </div>
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-bold mb-4">배송지 정보</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-blue-50 text-primary-600 text-xs px-2 py-1 rounded font-bold">기본배송지</span>
                                <span className="text-sm font-bold">우리집</span>
                            </div>
                            <p className="text-sm text-gray-800 font-medium">서울 중구 세종대로 9길 20 신한은행 본점</p>
                            <p className="text-sm text-gray-500">010-1234-5678</p>
                            
                            <select className="w-full p-2.5 border border-gray-300 rounded text-sm mt-2 outline-none">
                                <option>배송 시 요청사항을 선택해주세요</option>
                                <option>문 앞에 놓아주세요</option>
                                <option>직접 받겠습니다</option>
                                <option>경비실에 맡겨주세요</option>
                            </select>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-bold mb-4">결제 수단</h2>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button className="border-2 border-primary-500 text-primary-600 bg-blue-50 py-4 rounded-lg font-bold flex flex-col items-center gap-2">
                                <CreditCard className="w-6 h-6"/>
                                신한카드
                            </button>
                            <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 py-4 rounded-lg font-medium flex flex-col items-center gap-2">
                                <span className="font-bold text-lg">SOL</span>
                                신한 SOL Pay
                            </button>
                        </div>
                        <div className="bg-gray-50 p-4 rounded text-xs text-gray-500 leading-relaxed">
                            Shinhan Books는 안전결제 시스템을 통해 결제대금을 보호합니다. 구매확정 시 판매자에게 대금이 지급됩니다.
                        </div>
                    </div>
                </div>

                {/* Right: Summary */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-24">
                        <h3 className="font-bold text-gray-800 mb-4 text-base">결제 상세</h3>
                        
                        <div className="flex gap-3 mb-5 border-b border-gray-100 pb-5">
                            <img src={book.images[0]} className="w-16 h-20 object-cover rounded bg-gray-100 border border-gray-100" alt="" />
                            <div>
                                <p className="font-bold text-gray-800 text-sm line-clamp-2">{book.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{book.condition === 'New' ? '새상품' : '중고'}</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm text-gray-600 mb-6">
                            <div className="flex justify-between">
                                <span>상품 금액</span>
                                <span>{book.price.toLocaleString()} 원</span>
                            </div>
                            <div className="flex justify-between">
                                <span>배송비</span>
                                <span>3,000 원</span>
                            </div>
                            <div className="flex justify-between items-center text-primary-600 font-bold">
                                <span>할인/포인트</span>
                                <span>- 0 원</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-900 text-xl pt-4 border-t border-gray-200">
                                <span>총 결제금액</span>
                                <span>{(book.price + 3000).toLocaleString()} 원</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-md mb-4 text-xs font-medium border border-green-100">
                             <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                             <span>안전결제 수수료 무료 이벤트 중!</span>
                        </div>

                        <button 
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full bg-primary-500 text-white py-4 rounded-lg font-bold text-base hover:bg-primary-600 transition shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? '결제 처리 중...' : '결제하기'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};