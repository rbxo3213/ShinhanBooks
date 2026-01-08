
import React, { useState } from 'react';
import { Book, AppView, User } from '../types';
import { ShieldCheck, CreditCard, CheckCircle2, AlertCircle, MapPin, ChevronRight, X, Plus, Loader2 } from 'lucide-react';

interface MemberCheckoutProps {
    book: Book;
    user: User;
    setView: (view: AppView) => void;
}

interface Address {
    id: string;
    name: string;
    recipient: string;
    phone: string;
    address: string;
    detailAddress: string;
}

export const MemberCheckout: React.FC<MemberCheckoutProps> = ({ book, user, setView }) => {
    // Payment Method State
    const [paymentMethod, setPaymentMethod] = useState<'TOSS' | 'CARD'>('TOSS');
    
    // Address State
    const [addresses, setAddresses] = useState<Address[]>([
        { 
            id: 'addr_1', 
            name: '우리집', 
            recipient: user.nickname, 
            phone: user.phoneNumber || '010-1234-5678', 
            address: user.address || '서울 중구 세종대로 9길 20', 
            detailAddress: '' 
        },
        { 
            id: 'addr_2', 
            name: '회사', 
            recipient: user.nickname, 
            phone: user.phoneNumber || '010-1234-5678', 
            address: '서울 강남구 테헤란로 152', 
            detailAddress: '강남파이낸스센터 10층' 
        }
    ]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('addr_1');
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    
    // New Address Form State
    const [newAddrForm, setNewAddrForm] = useState<Omit<Address, 'id'>>({
        name: '', recipient: '', phone: '', address: '', detailAddress: ''
    });

    // Payment Simulation State
    const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'OPEN' | 'PROCESSING' | 'SUCCESS'>('IDLE');
    
    const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];
    const shippingCost = book.shippingFee || 0;
    const totalPrice = book.price + shippingCost;

    // --- Address Handlers ---
    const handleAddressSearch = () => {
        // @ts-ignore
        if (window.daum && window.daum.Postcode) {
             // @ts-ignore
             new window.daum.Postcode({
                oncomplete: (data: any) => {
                    let fullAddress = data.address;
                    let extraAddress = '';
                    if (data.addressType === 'R') {
                        if (data.bname !== '') extraAddress += data.bname;
                        if (data.buildingName !== '') extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
                        fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
                    }
                    setNewAddrForm(prev => ({ ...prev, address: fullAddress }));
                }
            }).open();
        } else {
            alert('주소 검색 서비스를 불러올 수 없습니다.');
        }
    };

    const handleAddAddress = () => {
        if (!newAddrForm.name || !newAddrForm.recipient || !newAddrForm.address || !newAddrForm.phone) {
            alert('필수 정보를 모두 입력해주세요.');
            return;
        }
        const newId = `addr_${Date.now()}`;
        const newAddress = { ...newAddrForm, id: newId };
        setAddresses([...addresses, newAddress]);
        setSelectedAddressId(newId);
        setIsAddingAddress(false);
        setNewAddrForm({ name: '', recipient: '', phone: '', address: '', detailAddress: '' });
        // Don't close modal immediately, let user see it in list or auto-select? 
        // Let's go back to list view in modal
    };

    // --- Payment Handlers ---
    const handlePaymentStart = () => {
        setPaymentStatus('OPEN');
    };

    const handleProcessPayment = () => {
        setPaymentStatus('PROCESSING');
        // Simulate PG processing time
        setTimeout(() => {
            setPaymentStatus('SUCCESS');
            // Auto close after success
            setTimeout(() => {
                setPaymentStatus('IDLE');
                setView(AppView.HOME);
            }, 2000);
        }, 2000);
    };

    return (
        <div className="max-w-5xl mx-auto py-10 relative">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">주문/결제</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Information */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* 1. Buyer Info */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs">1</span>
                            구매자 정보
                        </h2>
                        <div className="space-y-4 text-sm">
                             <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-500 font-medium">이름</span>
                                <span className="font-bold text-gray-900">{user.nickname}</span>
                             </div>
                             <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-500 font-medium">이메일</span>
                                <span className="font-bold text-gray-900">{user.email}</span>
                             </div>
                             <div className="flex justify-between items-center py-2">
                                <span className="text-gray-500 font-medium">휴대폰</span>
                                <span className="font-bold text-gray-900">{user.phoneNumber || '010-****-1234'}</span>
                             </div>
                        </div>
                    </div>

                    {/* 2. Shipping Info */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs">2</span>
                                배송지 정보
                            </h2>
                            <button 
                                onClick={() => setIsAddressModalOpen(true)} 
                                className="text-xs border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 font-medium transition"
                            >
                                배송지 변경
                            </button>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-lg mb-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-bold text-gray-900">{selectedAddress.name}</span>
                                <span className="bg-white text-gray-500 text-[10px] px-1.5 py-0.5 rounded border border-gray-200">도로명</span>
                            </div>
                            <p className="text-sm text-gray-800 mb-1">
                                {selectedAddress.address} {selectedAddress.detailAddress}
                            </p>
                            <p className="text-sm text-gray-500">
                                {selectedAddress.recipient} · {selectedAddress.phone}
                            </p>
                        </div>
                        
                        <select className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500 transition cursor-pointer bg-white">
                            <option value="">배송 시 요청사항을 선택해주세요</option>
                            <option value="door">문 앞에 놓아주세요</option>
                            <option value="direct">직접 받겠습니다</option>
                            <option value="security">경비실에 맡겨주세요</option>
                            <option value="box">택배함에 넣어주세요</option>
                        </select>
                    </div>

                    {/* 3. Payment Method */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs">3</span>
                            결제 수단
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button 
                                onClick={() => setPaymentMethod('TOSS')}
                                className={`relative py-6 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${
                                    paymentMethod === 'TOSS' 
                                    ? 'border-blue-500 bg-blue-50/50' 
                                    : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {paymentMethod === 'TOSS' && (
                                    <div className="absolute top-3 right-3 text-blue-500">
                                        <CheckCircle2 className="w-5 h-5 fill-current text-white" />
                                    </div>
                                )}
                                <div className="text-2xl font-black text-gray-900 tracking-tighter">
                                    toss<span className="text-blue-500">pay</span>
                                </div>
                                <span className={`text-sm font-bold ${paymentMethod === 'TOSS' ? 'text-blue-600' : 'text-gray-500'}`}>토스페이</span>
                            </button>

                            <button 
                                onClick={() => setPaymentMethod('CARD')}
                                className={`relative py-6 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${
                                    paymentMethod === 'CARD' 
                                    ? 'border-gray-900 bg-gray-50' 
                                    : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {paymentMethod === 'CARD' && (
                                    <div className="absolute top-3 right-3 text-gray-900">
                                        <CheckCircle2 className="w-5 h-5 fill-current text-white" />
                                    </div>
                                )}
                                <CreditCard className="w-8 h-8 text-gray-700" />
                                <span className={`text-sm font-bold ${paymentMethod === 'CARD' ? 'text-gray-900' : 'text-gray-500'}`}>일반결제</span>
                            </button>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3 border border-green-100">
                            <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-green-800 mb-1">안전결제 시스템 적용 중</h4>
                                <p className="text-xs text-green-700 leading-relaxed">
                                    구매확정 전까지 결제대금은 Shinhan Books가 안전하게 보관합니다.<br/>
                                    사기 피해 걱정 없이 안심하고 거래하세요.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary (Sticky) */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg sticky top-24">
                        <h3 className="text-lg font-bold text-gray-900 mb-5 pb-4 border-b border-gray-100">
                            4. 결제 상세
                        </h3>
                        
                        {/* Book Info */}
                        <div className="flex gap-4 mb-6">
                            <img src={book.images[0]} className="w-20 h-28 object-cover rounded-md border border-gray-200 bg-gray-50" alt="" />
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <p className="text-xs text-gray-500 mb-1">{book.category}</p>
                                <p className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug mb-1">{book.title}</p>
                                <p className="text-xs text-gray-400">{book.condition === 'New' ? '새상품' : '중고'} · {book.sellerName}</p>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>상품 금액</span>
                                <span className="font-medium">{book.price.toLocaleString()}원</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>배송비</span>
                                <span className="font-medium">{shippingCost > 0 ? `+${shippingCost.toLocaleString()}원` : '무료'}</span>
                            </div>
                            <div className="flex justify-between text-blue-600 font-bold">
                                <span>토스페이 할인</span>
                                <span>- 0원</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-900">총 결제금액</span>
                                <span className="text-2xl font-black text-primary-600">{totalPrice.toLocaleString()}원</span>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <label className="flex items-start gap-2 mb-6 cursor-pointer select-none">
                            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                            <span className="text-xs text-gray-500 leading-snug">
                                주문 내용을 확인하였으며, 정보 제공 등에 동의합니다. (필수)
                            </span>
                        </label>

                        {/* Submit Button */}
                        <button 
                            onClick={handlePaymentStart}
                            className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition shadow-md flex items-center justify-center gap-2"
                        >
                            {totalPrice.toLocaleString()}원 결제하기
                        </button>
                    </div>
                </div>
            </div>

            {/* Address Management Modal */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-lg">{isAddingAddress ? '새 배송지 추가' : '배송지 선택'}</h3>
                            <button onClick={() => { setIsAddressModalOpen(false); setIsAddingAddress(false); }} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5"/>
                            </button>
                        </div>
                        
                        <div className="p-4 overflow-y-auto flex-1">
                            {!isAddingAddress ? (
                                <div className="space-y-4">
                                    {addresses.map(addr => (
                                        <div 
                                            key={addr.id} 
                                            onClick={() => { setSelectedAddressId(addr.id); setIsAddressModalOpen(false); }}
                                            className={`p-4 rounded-lg border cursor-pointer transition flex items-start gap-3 ${selectedAddressId === addr.id ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${selectedAddressId === addr.id ? 'border-primary-600' : 'border-gray-300'}`}>
                                                {selectedAddressId === addr.id && <div className="w-2 h-2 rounded-full bg-primary-600" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-sm text-gray-900">{addr.name}</span>
                                                    {addr.id === 'addr_1' && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">기본</span>}
                                                </div>
                                                <p className="text-sm text-gray-800">{addr.address} {addr.detailAddress}</p>
                                                <p className="text-xs text-gray-500 mt-1">{addr.recipient} / {addr.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <button 
                                        onClick={() => setIsAddingAddress(true)}
                                        className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-gray-500 text-sm font-bold hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center gap-1 transition"
                                    >
                                        <Plus className="w-4 h-4" /> 새 배송지 추가
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">배송지명</label>
                                        <input 
                                            value={newAddrForm.name}
                                            onChange={(e) => setNewAddrForm({...newAddrForm, name: e.target.value})}
                                            placeholder="예: 집, 회사"
                                            className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-primary-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1">받는 분</label>
                                            <input 
                                                value={newAddrForm.recipient}
                                                onChange={(e) => setNewAddrForm({...newAddrForm, recipient: e.target.value})}
                                                className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-primary-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1">연락처</label>
                                            <input 
                                                value={newAddrForm.phone}
                                                onChange={(e) => setNewAddrForm({...newAddrForm, phone: e.target.value})}
                                                placeholder="010-0000-0000"
                                                className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-primary-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">주소</label>
                                        <div className="flex gap-2 mb-2">
                                            <input 
                                                readOnly
                                                value={newAddrForm.address}
                                                placeholder="주소 검색 버튼을 눌러주세요"
                                                className="flex-1 border border-gray-300 rounded p-2 text-sm bg-gray-50 outline-none"
                                            />
                                            <button 
                                                onClick={handleAddressSearch}
                                                className="bg-gray-800 text-white text-xs px-3 rounded font-bold hover:bg-gray-900"
                                            >
                                                검색
                                            </button>
                                        </div>
                                        <input 
                                            value={newAddrForm.detailAddress}
                                            onChange={(e) => setNewAddrForm({...newAddrForm, detailAddress: e.target.value})}
                                            placeholder="상세주소 입력"
                                            className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-primary-500"
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-4">
                                        <button 
                                            onClick={() => setIsAddingAddress(false)}
                                            className="flex-1 py-3 border border-gray-300 rounded font-bold text-sm text-gray-600 hover:bg-gray-50"
                                        >
                                            취소
                                        </button>
                                        <button 
                                            onClick={handleAddAddress}
                                            className="flex-1 py-3 bg-primary-600 text-white rounded font-bold text-sm hover:bg-primary-700"
                                        >
                                            저장
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Toss Pay Mock Modal */}
            {paymentStatus !== 'IDLE' && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-[400px] overflow-hidden relative">
                        {paymentStatus === 'PROCESSING' || paymentStatus === 'SUCCESS' ? (
                            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                                {paymentStatus === 'PROCESSING' ? (
                                    <>
                                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">결제 진행 중...</h3>
                                        <p className="text-gray-500 text-sm">잠시만 기다려주세요.</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                            <CheckCircle2 className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">결제 성공!</h3>
                                        <p className="text-gray-500 text-sm">주문이 정상적으로 완료되었습니다.</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            /* Gateway Interface */
                            <>
                                <div className="bg-blue-500 p-6 text-white flex justify-between items-center">
                                    <div className="font-bold text-lg flex items-center gap-1">
                                        toss <span className="font-light">pay</span>
                                    </div>
                                    <button onClick={() => setPaymentStatus('IDLE')} className="text-white/80 hover:text-white">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="p-8">
                                    <div className="text-center mb-8">
                                        <p className="text-gray-500 text-sm mb-2">Shinhan Books 주문</p>
                                        <h2 className="text-3xl font-bold text-gray-900">{totalPrice.toLocaleString()}원</h2>
                                    </div>
                                    
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">상품명</span>
                                            <span className="font-medium text-gray-900 text-right w-40 truncate">{book.title}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">결제 수단</span>
                                            <span className="font-medium text-gray-900">토스머니</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleProcessPayment}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-200"
                                    >
                                        결제하기
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
