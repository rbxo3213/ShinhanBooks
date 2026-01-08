
import React, { useState } from 'react';
import { Book, AuthStatus, AppView, User } from '../types';
import { Heart, Share2, MessageCircle, Flag, MapPin, AlertCircle, Info, Truck, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductDetailProps {
  book: Book;
  authStatus: AuthStatus;
  onBuyClick: (book: Book) => void;
  setView: (view: AppView) => void;
  user: User | null;
  onToggleWishlist: (bookId: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ book, authStatus, onBuyClick, setView, user, onToggleWishlist }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const discountRate = Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);
  const isWishlisted = user?.wishlist?.some(w => w.bookId === book.id) || false;
  const isRequest = book.type === 'PURCHASE_REQUEST';

  const handleChat = () => {
      if (authStatus === AuthStatus.LOGGED_IN) {
          setView(AppView.CHAT);
      } else {
          if (confirm('로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?')) {
            setView(AppView.LOGIN);
          }
      }
  };

  const nextImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev + 1) % book.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev - 1 + book.images.length) % book.images.length);
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-4 flex items-center gap-2">
        <span className="cursor-pointer hover:text-gray-900" onClick={() => setView(AppView.HOME)}>홈</span>
        <span>&gt;</span>
        <span className="cursor-pointer hover:text-gray-900">도서</span>
        <span>&gt;</span>
        <span className="cursor-pointer hover:text-gray-900">{book.category || '기타'}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Images */}
        <div className="space-y-4 select-none">
            <div className="aspect-[1/1.2] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
                <img 
                    src={book.images[currentImageIndex]} 
                    alt={book.title} 
                    className="w-full h-full object-contain p-4 bg-white" 
                />
                {isRequest && (
                    <div className="absolute top-4 left-4 bg-teal-600 text-white font-bold px-3 py-1.5 rounded-md shadow-sm z-10">
                        구합니다
                    </div>
                )}
                
                {/* Slider Arrows */}
                {book.images.length > 1 && (
                    <>
                        <button 
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 active:scale-95 z-20"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 active:scale-95 z-20"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                        
                        {/* Page Indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm z-10">
                            {currentImageIndex + 1} / {book.images.length}
                        </div>
                    </>
                )}
            </div>
            
            {/* Thumbnail List */}
            {book.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {book.images.map((img, i) => (
                        <div 
                            key={i} 
                            onClick={() => setCurrentImageIndex(i)}
                            className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 flex-shrink-0 transition-all ${currentImageIndex === i ? 'border-primary-500 ring-2 ring-primary-100 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        >
                            <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover"/>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col h-full">
            <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        {book.postTitle || book.title}
                    </h1>
                    <div className="flex gap-3 text-gray-400 flex-shrink-0 ml-4">
                        <Share2 className="w-6 h-6 cursor-pointer hover:text-gray-600"/>
                        <Flag className="w-6 h-6 cursor-pointer hover:text-gray-600"/>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="font-bold text-gray-800">{book.title}</span>
                    <span className="text-gray-300">|</span>
                    <span>{book.author}</span>
                    <span className="text-gray-300">|</span>
                    <span>{book.publisher}</span>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-4xl font-bold ${isRequest ? 'text-teal-600' : 'text-gray-900'}`}>{book.price.toLocaleString()}</span>
                    <span className="text-xl text-gray-500">원</span>
                    {!isRequest && discountRate > 0 && (
                        <div className="ml-2 flex items-center text-red-500 gap-1">
                            <span className="text-2xl font-bold">{discountRate}%</span>
                            <span className="text-sm text-gray-400 line-through">{book.originalPrice.toLocaleString()}원</span>
                        </div>
                    )}
                </div>
                
                {/* Shipping & Condition */}
                <div className="flex flex-col gap-2 mt-4 text-sm text-gray-600">
                     <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4"/>
                        <span>배송비 {book.shippingFee ? `${book.shippingFee.toLocaleString()}원` : '무료'}</span>
                     </div>
                     <div className="flex items-center gap-2">
                         <Info className="w-4 h-4"/>
                         <span>상태: <span className="font-bold text-primary-600">{book.condition === 'New' ? '새상품' : book.condition === 'Like New' ? '사용감 없음' : book.condition === 'Good' ? '사용감 적음' : '사용감 많음'}</span></span>
                     </div>
                     <div className="flex items-center gap-2">
                         <MapPin className="w-4 h-4"/>
                         <span>거래지역: {book.location}</span>
                     </div>
                </div>
            </div>

            {/* Description */}
            <div className="mb-8 flex-1">
                <h3 className="font-bold text-gray-900 mb-3">상품 설명</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{book.description}</p>
            </div>

            {/* Seller Info (Moved below description) */}
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${book.sellerId}`} alt="seller" className="w-full h-full object-cover"/>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-0.5">판매자</p>
                    <p className="font-bold text-gray-900">{book.sellerName}</p>
                </div>
            </div>

            {!isRequest && (
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-3 rounded mb-6">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>안전결제 시스템을 이용하지 않은 거래로 발생하는 피해에 대해서는 책임지지 않습니다.</span>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 sticky bottom-0 bg-white py-4 border-t border-gray-100 md:static md:border-0 md:py-0">
                <button 
                    onClick={() => onToggleWishlist(book.id)}
                    className={`flex flex-col items-center justify-center w-16 h-14 border rounded-md transition ${isWishlisted ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300 text-gray-400 hover:bg-gray-50'}`}
                >
                    <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`}/>
                    <span className="text-[10px] font-bold mt-0.5">{book.likes}</span>
                </button>
                <button 
                    onClick={handleChat}
                    className="flex-1 bg-primary-600 text-white font-bold rounded-md hover:bg-primary-700 transition flex items-center justify-center gap-2 shadow-sm"
                >
                    <MessageCircle className="w-5 h-5"/> 채팅하기
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
