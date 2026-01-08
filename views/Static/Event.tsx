import React from 'react';
import { AppView } from '../../types';
import { Gift, Coffee, Calendar, PartyPopper } from 'lucide-react';

interface EventProps {
    setView: (view: AppView) => void;
}

export const Event: React.FC<EventProps> = ({ setView }) => {
    return (
        <div className="max-w-4xl mx-auto">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-12 text-center text-white overflow-hidden mb-12 shadow-xl">
                <div className="relative z-10">
                    <span className="inline-block py-1 px-3 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold mb-4 border border-white/30">
                        OPEN EVENT
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight">
                        Shinhan Books<br/>오픈 기념 이벤트
                    </h1>
                    <p className="text-purple-100 text-lg font-medium">
                        첫 거래의 설렘을 스타벅스 커피와 함께하세요!
                    </p>
                </div>
                {/* Decorative Elements */}
                <PartyPopper className="absolute top-10 left-10 w-24 h-24 text-white opacity-10 -rotate-12" />
                <Gift className="absolute bottom-10 right-10 w-32 h-32 text-white opacity-10 rotate-12" />
            </div>

            {/* Event Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-full md:w-1/3 bg-green-50 rounded-lg aspect-square flex items-center justify-center border border-green-100">
                        <Coffee className="w-32 h-32 text-green-600 drop-shadow-md" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">첫 거래 완료 시 스타벅스 쿠폰 100% 증정!</h2>
                        <div className="space-y-4 text-sm text-gray-600">
                            <p>
                                Shinhan Books에서 <strong>판매</strong> 또는 <strong>구매</strong>를 1회 이상 완료하신<br/>
                                모든 회원님께 스타벅스 아메리카노 기프티콘을 드립니다.
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="font-bold text-gray-700">이벤트 기간</span>
                                    <span>2024.05.01 ~ 2024.06.30</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Gift className="w-4 h-4 text-gray-500" />
                                    <span className="font-bold text-gray-700">지급 일자</span>
                                    <span>거래 완료일 다음 주 수요일 일괄 발송</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center">
                <button 
                    onClick={() => setView(AppView.HOME)}
                    className="w-full md:w-auto px-12 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition shadow-lg"
                >
                    거래 시작하러 가기
                </button>
                <p className="mt-4 text-xs text-gray-400">
                    * 본 이벤트는 당사 사정에 의해 조기 종료될 수 있습니다.<br/>
                    * 회원가입 시 등록한 휴대폰 번호로 쿠폰이 발송됩니다.
                </p>
            </div>
        </div>
    );
};