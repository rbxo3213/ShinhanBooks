import React from 'react';
import { Book, AuthStatus, AppView } from '../types';
import { Heart, Share2, MessageCircle, ShoppingBag, Flag, MapPin, AlertCircle } from 'lucide-react';

interface ProductDetailProps {
  book: Book;
  authStatus: AuthStatus;
  onBuyClick: (book: Book) => void;
  setView: (view: AppView) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ book, authStatus, onBuyClick, setView }) => {
    
  const handleChat = () => {
      if (authStatus === AuthStatus.LOGGED_IN) {
          setView(AppView.CHAT);
      } else {
          alert('로그인이 필요한 서비스입니다.');
          setView(AppView.LOGIN);
      }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5">
         <span className="cursor-pointer hover:text-gray-800" onClick={() => setView(AppView.HOME)}>홈</span>
         <span className="text-gray-300">&gt;</span>
         <span className="cursor-pointer hover:text-gray-800">도서</span>
         <span className="text-gray-300">&gt;</span>
         <span className="text-gray-900 font-bold">{book.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Images */}
        <div className="space-y-4">
            <div className="aspect-[4/5] bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <img src={book.images[0]} alt={book.title} className="w-full h-full object-contain p-6 hover:scale-105 transition duration-500" />
            </div>
            {/* Thumbnail Placeholders */}
            <div className="grid grid-cols-5 gap-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-50 rounded-md border border-gray-200 cursor-pointer hover:border-primary-500 transition opacity-70 hover:opacity-100"></div>
                ))}
            </div>
        </div>

        {/* Right Column: Info & Actions */}
        <div className="flex flex-col h-full">
            <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex justify-between items-start mb-3">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">{book.title}</h1>
                    <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-gray-600"><Share2 className="w-5 h-5"/></button>
                        <button className="text-gray-400 hover:text-gray-600"><Flag className="w-5 h-5"/></button>
                    </div>
                </div>
                <p className="text-base text-gray-600 mb-4">{book.author}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {book.location}</span>
                    <span className="w-px h-3 bg-gray-300"></span>
                    <span>1분 전 업로드</span>
                    <span className="w-px h-3 bg-gray-300"></span>
                    <span>조회 124</span>
                    <span className="w-px h-3 bg-gray-300"></span>
                    <span>관심 {book.likes}</span>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${book.condition === 'New' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                        상태: {book.condition === 'New' ? '새상품' : book.condition}
                    </span>
                    {book.condition === 'New' && <span className="text-xs text-primary-500 font-medium">선물용으로 추천해요!</span>}
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-gray-900">{book.price.toLocaleString()}</span>
                    <span className="text-xl font-medium text-gray-900">원</span>
                    <span className="text-sm text-gray-400 line-through ml-2">{book.originalPrice.toLocaleString()}원</span>
                </div>
            </div>

            <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900 mb-2">상품 정보</h3>
                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap min-h-[120px] bg-gray-50 p-5 rounded-lg border border-gray-100 mb-6">
                    {book.description}
                </div>
            </div>

            {/* Seller Card */}
            <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gray-200 rounded-full overflow-hidden border border-gray-200">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${book.sellerId}`} alt="Seller" />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-gray-900">{book.sellerName}</p>
                        <p className="text-xs text-gray-500">본인인증 완료</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-primary-600 font-bold text-sm">
                        36.5°C 
                        <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden relative">
                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-primary-600 w-3/4"></div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">매너온도</p>
                </div>
            </div>

            {/* Action Buttons - Flat Shinhan Style */}
            <div className="flex gap-3">
                 <button className="w-16 border border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-red-500 transition hover:border-red-200">
                     <Heart className="w-5 h-5 mb-0.5"/>
                     <span className="text-[10px]">찜</span>
                 </button>
                 <button 
                    onClick={handleChat}
                    className="flex-1 border border-primary-200 text-primary-700 bg-blue-50 py-3.5 rounded-lg font-bold text-base hover:bg-blue-100 transition flex items-center justify-center gap-2"
                 >
                     <MessageCircle className="w-5 h-5"/> 채팅하기
                 </button>
                 <button 
                    onClick={() => onBuyClick(book)}
                    className="flex-1 bg-primary-600 text-white py-3.5 rounded-lg font-bold text-base hover:bg-primary-700 transition flex items-center justify-center gap-2 shadow-sm"
                 >
                     <ShoppingBag className="w-5 h-5"/> 안전결제 구매
                 </button>
            </div>
            <div className="mt-4 flex items-start gap-2 text-xs text-gray-400 bg-gray-50 p-3 rounded">
                <AlertCircle className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                <p>거래 전 상품설명과 실제 상품 상태를 다시 한 번 확인하세요. Shinhan Books는 통신판매중개자이며 통신판매의 당사자가 아닙니다.</p>
            </div>
        </div>
      </div>
    </div>
  );
};