import React from 'react';
import { Phone, Mail, MessageCircle } from 'lucide-react';

export const Support = () => {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-8 text-center">고객센터</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white border border-gray-200 p-6 rounded-lg text-center">
                    <Phone className="w-8 h-8 mx-auto mb-4 text-primary-500"/>
                    <h3 className="font-bold mb-2">전화 상담</h3>
                    <p className="text-xl font-bold text-gray-900 mb-1">1544-0000</p>
                    <p className="text-xs text-gray-500">평일 09:00 - 18:00 (주말/공휴일 휴무)</p>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-lg text-center">
                    <MessageCircle className="w-8 h-8 mx-auto mb-4 text-primary-500"/>
                    <h3 className="font-bold mb-2">1:1 채팅 상담</h3>
                    <p className="text-sm text-gray-600 mb-1">실시간으로 상담원과 대화하세요</p>
                    <p className="text-xs text-gray-500">평일 09:00 - 18:00</p>
                </div>
                 <div className="bg-white border border-gray-200 p-6 rounded-lg text-center">
                    <Mail className="w-8 h-8 mx-auto mb-4 text-primary-500"/>
                    <h3 className="font-bold mb-2">이메일 문의</h3>
                    <p className="text-sm text-gray-600 mb-1">help@shinhanbooks.com</p>
                    <p className="text-xs text-gray-500">24시간 접수 가능</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <h2 className="p-5 border-b border-gray-200 font-bold bg-gray-50">자주 묻는 질문 (FAQ)</h2>
                <div className="divide-y divide-gray-100">
                    <div className="p-5">
                        <h4 className="font-bold text-gray-800 text-sm mb-2">Q. 안전결제는 어떻게 진행되나요?</h4>
                        <p className="text-sm text-gray-600">구매자가 결제한 금액은 Shinhan Books가 보관하며, 구매자가 상품을 수령하고 구매확정을 누르면 판매자에게 정산됩니다.</p>
                    </div>
                    <div className="p-5">
                         <h4 className="font-bold text-gray-800 text-sm mb-2">Q. 판매 수수료가 있나요?</h4>
                        <p className="text-sm text-gray-600">현재 오픈 이벤트 기간으로 모든 판매 수수료는 0원입니다. (추후 변동 가능)</p>
                    </div>
                    <div className="p-5">
                         <h4 className="font-bold text-gray-800 text-sm mb-2">Q. 배송비는 누가 부담하나요?</h4>
                        <p className="text-sm text-gray-600">상품 등록 시 판매자가 '배송비 포함' 또는 '착불' 여부를 설정할 수 있습니다.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};