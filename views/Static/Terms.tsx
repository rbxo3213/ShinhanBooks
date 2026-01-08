import React from 'react';

export const Terms = () => {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-8 border-b border-gray-200 pb-4">이용약관</h1>
            
            <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-3">제 1 조 (목적)</h2>
                    <p>본 약관은 Shinhan Books(이하 "회사")가 제공하는 중고 서적 거래 플랫폼 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-3">제 2 조 (용어의 정의)</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>"서비스"라 함은 구현되는 단말기(PC, 휴대형단말기 등 각종 유무선 장치를 포함)와 상관없이 회원이 이용할 수 있는 Shinhan Books 관련 제반 서비스를 의미합니다.</li>
                        <li>"회원"이라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-3">제 3 조 (약관의 게시와 개정)</h2>
                    <p>회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다. 회사는 "약관의 규제에 관한 법률", "정보통신망 이용촉진 및 정보보호 등에 관한 법률" 등 관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>
                </section>
                
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-3">제 4 조 (서비스의 제공 등)</h2>
                    <p>회사는 회원에게 아래와 같은 서비스를 제공합니다.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>중고 서적 판매 및 구매 중개 서비스</li>
                        <li>안전 결제 서비스</li>
                        <li>도서 정보 제공 서비스</li>
                        <li>기타 회사가 추가 개발하거나 제휴 등을 통해 회원에게 제공하는 일체의 서비스</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};