import React, { useState, useMemo } from 'react';
import { Book } from '../types';
import { MOCK_BOOKS } from '../constants';
import { MapPin, Heart, ArrowDownUp } from 'lucide-react';

interface HomeProps {
  onBookClick: (book: Book) => void;
  searchQuery: string;
}

export const Home: React.FC<HomeProps> = ({ onBookClick, searchQuery }) => {
  const [sortBy, setSortBy] = useState<'newest' | 'priceAsc' | 'likes'>('newest');

  const filteredBooks = useMemo(() => {
    let result = [...MOCK_BOOKS];
    
    // Search Filter
    if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        result = result.filter(book => 
            book.title.toLowerCase().includes(lowerQuery) || 
            book.author.toLowerCase().includes(lowerQuery)
        );
    }

    // Sort Logic
    switch(sortBy) {
        case 'newest':
            result.sort((a, b) => b.createdAt - a.createdAt);
            break;
        case 'priceAsc':
            result.sort((a, b) => a.price - b.price);
            break;
        case 'likes':
            result.sort((a, b) => b.likes - a.likes);
            break;
    }

    return result;
  }, [searchQuery, sortBy]);

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-500 rounded-lg p-12 flex items-center justify-between relative overflow-hidden shadow-lg text-white">
        <div className="z-10 relative">
          <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block">Shinhan Books OPEN</span>
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            신뢰할 수 있는<br/>
            중고 거래의 시작
          </h1>
          <p className="text-blue-100 text-base mb-8 max-w-md font-medium">
            금융의 안전함을 책 거래에도 담았습니다.<br/>
            안전결제로 사기 걱정 없이 거래하세요.
          </p>
          <button className="bg-white text-primary-700 px-6 py-3 rounded-md font-bold text-sm hover:bg-blue-50 transition shadow-md">
            지금 판매 시작하기
          </button>
        </div>
        {/* Background Graphic Element */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 bg-[url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center [mask-image:linear-gradient(to_left,black,transparent)]"></div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            최근 올라온 상품 
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{filteredBooks.length}개</span>
        </h2>
        <div className="flex gap-4 text-sm text-gray-500 font-medium">
            <button 
                onClick={() => setSortBy('newest')}
                className={`transition-colors ${sortBy === 'newest' ? 'text-gray-900 font-bold' : 'hover:text-gray-700'}`}
            >
                최신순
            </button>
            <span className="text-gray-300">|</span>
            <button 
                onClick={() => setSortBy('priceAsc')}
                className={`transition-colors ${sortBy === 'priceAsc' ? 'text-gray-900 font-bold' : 'hover:text-gray-700'}`}
            >
                낮은가격순
            </button>
            <span className="text-gray-300">|</span>
            <button 
                onClick={() => setSortBy('likes')}
                className={`transition-colors ${sortBy === 'likes' ? 'text-gray-900 font-bold' : 'hover:text-gray-700'}`}
            >
                인기순
            </button>
        </div>
      </div>
      
      {/* Product Grid - 5 Columns */}
      {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-8">
            {filteredBooks.map((book) => (
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
                   <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-white p-1.5 rounded-full text-gray-400 hover:text-red-500 shadow-sm">
                            <Heart className="w-4 h-4" />
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
                      <span className="text-[11px] text-gray-400">
                        {Math.floor((Date.now() - book.createdAt) / (1000 * 60 * 60)) < 24 
                            ? `${Math.floor((Date.now() - book.createdAt) / (1000 * 60 * 60))}시간 전` 
                            : '1일 전'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      ) : (
          <div className="py-20 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
              <p>검색 결과가 없습니다.</p>
          </div>
      )}
    </div>
  );
};