import React from 'react';

export const Company = () => {
    return (
        <div className="max-w-4xl mx-auto py-10">
            <div className="text-center mb-16">
                <span className="text-primary-600 font-bold tracking-widest text-sm mb-2 block">ABOUT US</span>
                <h1 className="text-4xl font-black text-gray-900 mb-6">금융의 신뢰를<br/>책 거래에도 담았습니다</h1>
                <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    Shinhan Books는 '신한'이라는 브랜드가 가진 신뢰와 안정성을 바탕으로<br/>
                    누구나 안심하고 중고 서적을 거래할 수 있는 세상을 만듭니다.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <div className="bg-white p-8 rounded-lg border border-gray-200 text-center hover:shadow-lg transition">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🔒</div>
                    <h3 className="text-xl font-bold mb-3">안전한 거래</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">에스크로 기반의 안전결제 시스템으로<br/>사기 걱정 없는 거래 환경을 제공합니다.</p>
                </div>
                <div className="bg-white p-8 rounded-lg border border-gray-200 text-center hover:shadow-lg transition">
                     <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">♻️</div>
                    <h3 className="text-xl font-bold mb-3">자원 순환</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">다 읽은 책이 새로운 주인을 만나<br/>가치가 순환되는 친환경 문화를 선도합니다.</p>
                </div>
                <div className="bg-white p-8 rounded-lg border border-gray-200 text-center hover:shadow-lg transition">
                     <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">🤝</div>
                    <h3 className="text-xl font-bold mb-3">지역 커뮤니티</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">같은 관심사를 가진 이웃들과<br/>책을 통해 소통하고 교류합니다.</p>
                </div>
            </div>

            <div className="bg-gray-900 text-white p-12 rounded-2xl text-center">
                <h2 className="text-2xl font-bold mb-4">Shinhan Books와 함께하세요</h2>
                <p className="text-gray-400 mb-8">당신의 책장에 잠들어 있는 이야기가 누군가에게는 새로운 세상이 됩니다.</p>
            </div>
        </div>
    );
};