import React from 'react';
import { AppView } from '../../types';
import { Sparkles, Camera, Wand2, ArrowRight, Coins } from 'lucide-react';

interface SellingGuideProps {
    setView: (view: AppView) => void;
}

export const SellingGuide: React.FC<SellingGuideProps> = ({ setView }) => {
    return (
        <div className="max-w-5xl mx-auto py-12">
            <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
                <div className="flex-1">
                    <span className="text-emerald-600 font-bold tracking-widest text-sm mb-2 block">SELLER BENEFIT</span>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                        잠자는 책장을 깨우면<br/>
                        <span className="text-emerald-500">수수료가 0원</span>
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed mb-8">
                        다 읽은 책, 자리를 차지하고 있는 전공 서적.<br/>
                        Shinhan Books에서는 판매 수수료 없이<br/>
                        책의 가치를 현금으로 바꿀 수 있습니다.
                    </p>
                    <button 
                        onClick={() => setView(AppView.UPLOAD)}
                        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-200"
                    >
                        내 물건 팔러가기 <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 w-full max-w-md">
                    <div className="aspect-square bg-gradient-to-tr from-emerald-50 to-teal-50 rounded-full relative flex items-center justify-center">
                         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center rounded-full opacity-20 mix-blend-overlay"></div>
                         <Coins className="w-48 h-48 text-emerald-500 drop-shadow-2xl" />
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-16">
                <h2 className="text-2xl font-bold text-center mb-12">이렇게나 쉬운 판매 과정</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-700">
                            <Camera className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">1. 사진 촬영</h3>
                        <p className="text-sm text-gray-500">책의 상태가 잘 보이도록<br/>사진을 찍어주세요.</p>
                    </div>
                    <div className="text-center p-6 relative">
                        <div className="hidden md:block absolute top-8 -left-4 w-8 h-px bg-gray-300"></div>
                        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600">
                            <Wand2 className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">2. AI 설명 생성</h3>
                        <p className="text-sm text-gray-500">제목만 입력하세요.<br/>설명은 AI가 써드립니다.</p>
                    </div>
                    <div className="text-center p-6 relative">
                        <div className="hidden md:block absolute top-8 -left-4 w-8 h-px bg-gray-300"></div>
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                            <Coins className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">3. 판매 완료</h3>
                        <p className="text-sm text-gray-500">구매자가 나타나면<br/>안전하게 거래하세요.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};