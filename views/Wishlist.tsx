
import React from 'react';
import { Book, AppView, User } from '../types';
import { MapPin, Heart, ShoppingBag } from 'lucide-react';

interface WishlistProps {
  books: Book[];
  user: User;
  onBookClick: (book: Book) => void;
  onToggleWishlist: (bookId: string) => void;
  setView: (view: AppView) => void;
}

export const Wishlist: React.FC<WishlistProps> = ({ books, user, onBookClick, onToggleWishlist, setView }) => {
  // Updated filtering logic for object array
  const wishlistBooks = books.filter(book => user.wishlist.some(w => w.bookId === book.id));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">찜한 상품</h1>
            <p className="text-gray-500 text-sm">마음에 드는 상품을 모아보세요.</p>
        </div>
        <div className="text-sm font-bold text-gray-700 bg-gray-50 px-4 py-2 rounded-full">
            총 <span className="text-primary-600">{wishlistBooks.length}</span>개
        </div>
      </div>

      {wishlistBooks.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-8">
          {wishlistBooks.map((book) => (
            <div 
              key={book.id} 
              onClick={() => onBookClick(book)}
              className="group flex flex-col cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[1/1.2] overflow-hidden bg-gray-100 rounded-lg border border-gray-200 mb-3 hover:shadow-md transition-all">
                <img 
                  src={book.images[0]} 
                  alt={book.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                    {book.condition === 'New' ? '새상품' : book.condition}
                </div>
                <div className="absolute bottom-2 right-2">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(book.id);
                        }}
                        className="bg-white p-1.5 rounded-full text-red-500 hover:bg-gray-50 shadow-sm transition-colors"
                    >
                        <Heart className="w-4 h-4 fill-current" />
                    </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 flex flex-col">
                <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors h-10">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2 truncate">{book.author}</p>
                
                <div className="mt-auto">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-bold text-lg text-gray-900">{book.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">원</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                    <div className="flex items-center text-[11px] text-gray-400">
                      <MapPin className="w-3 h-3 mr-0.5" />
                      <span className="truncate max-w-[80px]">{book.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200 border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">찜한 상품이 없습니다.</h3>
            <p className="text-gray-500 text-sm mb-6">마음에 드는 상품을 찾아 '하트'를 눌러보세요!</p>
            <button 
                onClick={() => setView(AppView.HOME)}
                className="bg-primary-600 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-primary-700 transition flex items-center gap-2"
            >
                <ShoppingBag className="w-4 h-4" />
                상품 구경하러 가기
            </button>
        </div>
      )}
    </div>
  );
};
