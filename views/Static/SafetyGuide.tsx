import React from 'react';
import { AppView } from '../../types';
import { ShieldCheck, Lock, CreditCard, UserCheck, ArrowRight } from 'lucide-react';

interface SafetyGuideProps {
    setView: (view: AppView) => void;
}

export const SafetyGuide: React.FC<SafetyGuideProps> = ({ setView }) => {
    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-6">
                    <ShieldCheck className="w-10 h-10 text-primary-600" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-6">금융처럼 안전한<br/>중고 서적 거래</h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    Shinhan Books는 에스크로 기반의 안전결제 시스템을 통해<br/>
                    구매자와 판매자 모두를 보호합니다.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-primary-200 transition">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                        <Lock className="w-24 h-24 text-primary-600" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-3 text-gray-900">1. 결제 대금 보관</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            구매자가 결제한 금액은 즉시 판매자에게 전달되지 않고, 
                            Shinhan Books가 안전하게 보관합니다.
                        </p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-primary-200 transition">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                        <UserCheck className="w-24 h-24 text-primary-600" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-3 text-gray-900">2. 물품 수령 및 확인</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            구매자는 상품을 배송받고 상태를 꼼꼼히 확인합니다. 
                            문제가 있다면 구매를 취소할 수 있습니다.
                        </p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-primary-200 transition">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                        <CreditCard className="w-24 h-24 text-primary-600" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-3 text-gray-900">3. 구매 확정 및 정산</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            구매자가 '구매확정'을 누르면 비로소 판매자에게 
                            판매 대금이 정산됩니다.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-2">지금 바로 안전하게 거래하세요</h2>
                    <p className="text-gray-300">허위 매물, 사기 걱정 없는 깨끗한 중고 서적 플랫폼</p>
                </div>
                <button 
                    onClick={() => setView(AppView.HOME)}
                    className="px-8 py-4 bg-primary-600 hover:bg-primary-500 rounded-lg font-bold transition flex items-center gap-2"
                >
                    상품 둘러보기 <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};