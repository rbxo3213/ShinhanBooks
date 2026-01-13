
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Book, User, AppView, ResellState } from '../types';
import { CATEGORIES } from '../constants';
import { MapPin, Heart, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, BookOpen, ChevronDown, Check, Filter, ShoppingBag, LayoutGrid, Search } from 'lucide-react';

interface HomeProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  user: User | null;
  onToggleWishlist: (bookId: string) => void;
  setView: (view: AppView) => void;
}

export const Home: React.FC<HomeProps> = ({ books, onBookClick, searchQuery, onSearch, user, onToggleWishlist, setView }) => {
  const [sortBy, setSortBy] = useState<'newest' | 'priceAsc' | 'likes'>('newest');
  const [selectedCondition, setSelectedCondition] = useState<'All' | 'New' | 'Like New' | 'Good' | 'Fair'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(20);
  const [viewCountOption, setViewCountOption] = useState(20);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Dropdown States
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isConditionOpen, setIsConditionOpen] = useState(false);
  const [isViewCountOpen, setIsViewCountOpen] = useState(false);
  
  const categoryRef = useRef<HTMLDivElement>(null);
  const conditionRef = useRef<HTMLDivElement>(null);
  const viewCountRef = useRef<HTMLDivElement>(null);

  const banners = [
    {
        id: 1,
        title: "신뢰할 수 있는 중고 거래",
        subtitle: "금융의 안전함을 책 거래에도 담았습니다.",
        color: "from-primary-600 to-blue-500",
        icon: <ShieldCheck className="w-12 h-12 text-blue-200 mb-4 opacity-80" />,
        btnText: "안전결제 알아보기",
        target: AppView.SAFETY_GUIDE
    },
    {
        id: 2,
        title: "지금 팔면 수수료 0원",
        subtitle: "잠자는 책장을 깨우는 가장 현명한 방법",
        color: "from-emerald-500 to-teal-600",
        icon: <Sparkles className="w-12 h-12 text-emerald-200 mb-4 opacity-80" />,
        btnText: "내 물건 팔기",
        target: AppView.SELLING_GUIDE
    },
    {
        id: 3,
        title: "Shinhan Books 오픈 이벤트",
        subtitle: "첫 거래 완료 시 스타벅스 쿠폰 증정!",
        color: "from-violet-500 to-purple-600",
        icon: <BookOpen className="w-12 h-12 text-violet-200 mb-4 opacity-80" />,
        btnText: "이벤트 참여하기",
        target: AppView.EVENT
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (conditionRef.current && !conditionRef.current.contains(event.target as Node)) {
        setIsConditionOpen(false);
      }
      if (viewCountRef.current && !viewCountRef.current.contains(event.target as Node)) {
        setIsViewCountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredBooks = useMemo(() => {
    let result = [...books];
    
    // Search Filter
    if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        result = result.filter(book => 
            book.title.toLowerCase().includes(lowerQuery) || 
            book.author.toLowerCase().includes(lowerQuery)
        );
    }

    // Condition Filter
    if (selectedCondition !== 'All') {
        result = result.filter(book => book.condition === selectedCondition);
    }

    // Category Filter
    if (selectedCategory !== 'All') {
        result = result.filter(book => book.category === selectedCategory);
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
  }, [searchQuery, sortBy, selectedCondition, selectedCategory, books]);

  const visibleBooks = filteredBooks.slice(0, visibleCount);

  // Status Badge Helper
  const getStatusBadge = (status: ResellState) => {
      switch(status) {
          case 'SOLD':
              return <div className="bg-gray-800/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">판매완료</div>;
          case 'RESERVED':
              return <div className="bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">예약중</div>;
          case 'ON_SALE':
              return <div className="bg-green-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">판매중</div>;
          default:
              return null;
      }
  };

  return (
    <div className="space-y-8">
      {/* Carousel Hero Banner */}
      <div className="relative overflow-hidden rounded-lg shadow-lg h-[320px]">
         <div 
            className="flex transition-transform duration-500 ease-out h-full"
            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
         >
            {banners.map((banner) => (
                <div key={banner.id} className={`w-full flex-shrink-0 bg-gradient-to-r ${banner.color} p-12 flex items-center relative`}>
                    <div className="z-10 text-white max-w-lg">
                        {banner.icon}
                        <h1 className="text-4xl font-extrabold mb-4 leading-tight">{banner.title}</h1>
                        <p className="text-white/90 text-lg mb-8 font-medium">{banner.subtitle}</p>
                        <button 
                            onClick={() => setView(banner.target)}
                            className="bg-white text-gray-900 px-6 py-3 rounded-md font-bold text-sm hover:bg-gray-100 transition shadow-md"
                        >
                            {banner.btnText}
                        </button>
                    </div>
                    {/* Abstract Decoration */}
                    <div className="absolute right-0 top-0 h-full w-2/3 opacity-10 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center [mask-image:linear-gradient(to_left,black,transparent)]"></div>
                </div>
            ))}
         </div>
         
         {/* Carousel Controls */}
         <div className="absolute bottom-6 left-12 flex gap-2 z-20">
            {banners.map((_, idx) => (
                <button 
                    key={idx}
                    onClick={() => setCurrentBanner(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${currentBanner === idx ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'}`}
                />
            ))}
         </div>
         
         <button 
            onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white backdrop-blur-sm transition"
         >
            <ChevronLeft className="w-6 h-6" />
         </button>
         <button 
            onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white backdrop-blur-sm transition"
         >
            <ChevronRight className="w-6 h-6" />
         </button>
      </div>

      {/* Search Bar - Sticky */}
      <div className="sticky top-[72px] z-40 bg-[#F8F9FA] py-4">
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="찾고 싶은 도서나 저자를 검색해보세요"
              className="w-full pl-6 pr-14 py-4 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all text-base placeholder-gray-400 shadow-md"
            />
            <button className="absolute right-2 top-2 h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition">
              <Search className="w-5 h-5" />
            </button>
          </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 gap-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                전체 상품 
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
        
        {/* Filter Toolbar */}
        <div className="flex gap-3 -mt-2">
            
            {/* Category Filter */}
            <div className="relative" ref={categoryRef}>
                <button 
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 border ${
                        selectedCategory !== 'All' || isCategoryOpen
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <BookOpen className="w-4 h-4" />
                    <span>{selectedCategory === 'All' ? '카테고리' : selectedCategory}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCategoryOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-30 py-1 max-h-[300px] overflow-y-auto">
                        <button 
                            onClick={() => { setSelectedCategory('All'); setIsCategoryOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between ${selectedCategory === 'All' ? 'font-bold text-primary-600 bg-primary-50/50' : 'text-gray-700'}`}
                        >
                            전체
                            {selectedCategory === 'All' && <Check className="w-4 h-4" />}
                        </button>
                        {CATEGORIES.map(category => (
                            <button 
                                key={category}
                                onClick={() => { setSelectedCategory(category); setIsCategoryOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between ${selectedCategory === category ? 'font-bold text-primary-600 bg-primary-50/50' : 'text-gray-700'}`}
                            >
                                {category}
                                {selectedCategory === category && <Check className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Condition Filter */}
            <div className="relative" ref={conditionRef}>
                <button 
                    onClick={() => setIsConditionOpen(!isConditionOpen)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 border ${
                        selectedCondition !== 'All' || isConditionOpen
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <Filter className="w-4 h-4" />
                    <span>
                        {selectedCondition === 'All' ? '상품 상태' : 
                         selectedCondition === 'New' ? '새상품' : 
                         selectedCondition === 'Like New' ? '사용감 없음' : 
                         selectedCondition === 'Good' ? '사용감 적음' : '사용감 많음'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isConditionOpen ? 'rotate-180' : ''}`} />
                </button>

                {isConditionOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-30 py-1">
                        <button 
                            onClick={() => { setSelectedCondition('All'); setIsConditionOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between ${selectedCondition === 'All' ? 'font-bold text-primary-600 bg-primary-50/50' : 'text-gray-700'}`}
                        >
                            전체보기
                            {selectedCondition === 'All' && <Check className="w-4 h-4" />}
                        </button>
                        {[
                            { val: 'New', label: '✨ 새상품' },
                            { val: 'Like New', label: '💎 사용감 없음' },
                            { val: 'Good', label: '👍 사용감 적음' },
                            { val: 'Fair', label: '🌿 사용감 많음' }
                        ].map(cond => (
                             <button 
                                key={cond.val}
                                onClick={() => { setSelectedCondition(cond.val as any); setIsConditionOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between ${selectedCondition === cond.val ? 'font-bold text-primary-600 bg-primary-50/50' : 'text-gray-700'}`}
                            >
                                {cond.label}
                                {selectedCondition === cond.val && <Check className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* View Count Selection */}
            <div className="relative" ref={viewCountRef}>
                <button 
                    onClick={() => setIsViewCountOpen(!isViewCountOpen)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 border ${
                        isViewCountOpen
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <LayoutGrid className="w-4 h-4" />
                    <span>{viewCountOption}개씩 보기</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isViewCountOpen ? 'rotate-180' : ''}`} />
                </button>

                {isViewCountOpen && (
                    <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-30 py-1">
                        {[20, 40, 60, 100].map(count => (
                            <button 
                                key={count}
                                onClick={() => { 
                                    setViewCountOption(count); 
                                    setVisibleCount(count); 
                                    setIsViewCountOpen(false); 
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between ${viewCountOption === count ? 'font-bold text-primary-600 bg-primary-50/50' : 'text-gray-700'}`}
                            >
                                {count}개씩
                                {viewCountOption === count && <Check className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Reset Filter Button (Optional: Only shows if filters are applied) */}
            {(selectedCategory !== 'All' || selectedCondition !== 'All') && (
                <button 
                    onClick={() => { setSelectedCategory('All'); setSelectedCondition('All'); }}
                    className="px-3 py-2 text-xs text-gray-500 hover:text-gray-800 underline decoration-gray-400"
                >
                    필터 초기화
                </button>
            )}

        </div>
      </div>
      
      {/* Product Grid - 5 Columns */}
      {visibleBooks.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-8">
                {visibleBooks.map((book) => {
                    const isWishlisted = user?.wishlist?.some(w => w.bookId === book.id) || false;
                    
                    return (
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
                                <div className="absolute top-2 left-2 flex gap-1">
                                    {getStatusBadge(book.resellState)}
                                    {book.condition === 'New' && (
                                        <div className="bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                                            새상품
                                        </div>
                                    )}
                                </div>
                                <div className={`absolute bottom-2 right-2 transition-opacity ${isWishlisted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleWishlist(book.id);
                                            }}
                                            className="bg-white p-1.5 rounded-full text-gray-400 hover:bg-gray-50 shadow-sm"
                                        >
                                            <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
                                        </button>
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 flex flex-col">
                                <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1 leading-snug group-hover:text-primary-600 transition-colors">
                                    {book.title}
                                </h3>
                                <div className="text-xs text-gray-500 mb-2 truncate">
                                    {book.author} {book.publisher && <span className="mx-1 text-gray-300">|</span>} {book.publisher}
                                </div>
                                
                                {book.postTitle && (
                                    <p className="text-sm text-gray-700 font-medium mb-2 truncate">
                                        {book.postTitle}
                                    </p>
                                )}
                                
                                <div className="mt-auto">
                                    <div className="flex items-baseline gap-1.5 mb-2">
                                        <span className={`font-bold text-lg text-gray-900`}>{book.price.toLocaleString()}</span>
                                        <span className="text-xs text-gray-500">원</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-[11px] text-gray-400">
                                        <div className="flex items-center">
                                            <MapPin className="w-3 h-3 mr-0.5" />
                                            <span className="truncate max-w-[60px]">{book.location}</span>
                                        </div>
                                        <span className="truncate">
                                            {Math.floor((Date.now() - book.createdAt) / (1000 * 60 * 60)) < 24 
                                                ? `${Math.floor((Date.now() - book.createdAt) / (1000 * 60 * 60))}시간 전` 
                                                : '1일 전'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Load More Button */}
            {visibleCount < filteredBooks.length && (
                <div className="text-center pt-8">
                    <button 
                        onClick={() => setVisibleCount(prev => prev + viewCountOption)}
                        className="bg-white border border-gray-300 text-gray-700 font-bold py-3 px-12 rounded-full hover:bg-gray-50 hover:border-gray-400 transition shadow-sm"
                    >
                        더 많은 상품 보기 (+{viewCountOption}개)
                    </button>
                </div>
            )}
          </>
      ) : (
          <div className="py-20 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
              <p>검색 결과가 없습니다.</p>
          </div>
      )}
    </div>
  );
};
