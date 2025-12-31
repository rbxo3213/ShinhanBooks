import React, { useState } from 'react';
import { Book, AppView } from '../types';

interface GuestCheckoutProps {
    book: Book;
    setView: (view: AppView) => void;
}

export const GuestCheckout: React.FC<GuestCheckoutProps> = ({ book, setView }) => {
    
    const handlePayment = () => {
        alert('비회원 주문이 완료되었습니다!');
        setView(AppView.HOME);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-8 text-gray-900">주문서 작성 <span className="text-gray-400 font-normal text-lg">(비회원)</span></h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                            배송지 정보
                        </h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">받는 사람</label>
                                    <input className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:border-primary-500 outline-none text-sm" placeholder="이름" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">연락처</label>
                                    <input className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:border-primary-500 outline-none text-sm" placeholder="010-0000-0000" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">주소</label>
                                <input className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:border-primary-500 outline-none text-sm" placeholder="주소 검색" />
                                <input className="w-full px-3 py-2.5 border border-gray-300 rounded-sm mt-2 focus:border-primary-500 outline-none text-sm" placeholder="상세 주소 입력" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                             <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                             결제 수단
                        </h2>
                         <div className="p-8 border border-dashed border-gray-300 rounded-sm bg-gray-50 text-center text-gray-500 text-sm">
                             결제 모듈 연동 영역 (PG사)
                         </div>
                    </div>
                </div>

                {/* Right: Order Summary */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm sticky top-24">
                        <h3 className="font-bold text-gray-800 mb-4 text-base">결제 상세</h3>
                        
                        <div className="flex gap-3 mb-5 border-b border-gray-100 pb-5">
                            <img src={book.images[0]} className="w-16 h-20 object-cover rounded-sm bg-gray-100 border border-gray-100" alt="" />
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
                            <div className="flex justify-between font-bold text-gray-900 text-lg pt-4 border-t border-gray-200">
                                <span>총 결제금액</span>
                                <span className="text-primary-600">{(book.price + 3000).toLocaleString()} 원</span>
                            </div>
                        </div>

                        <label className="flex items-start gap-2 mb-6 cursor-pointer bg-gray-50 p-3 rounded-sm">
                            <input type="checkbox" className="mt-0.5 rounded-sm text-primary-500 focus:ring-primary-500 border-gray-300" />
                            <span className="text-xs text-gray-500 leading-snug">비회원 구매 약관 및 개인정보 수집 이용에 동의합니다.</span>
                        </label>

                        <button 
                            onClick={handlePayment}
                            className="w-full bg-primary-500 text-white py-3.5 rounded-sm font-bold text-base hover:bg-primary-600 transition"
                        >
                            결제하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};