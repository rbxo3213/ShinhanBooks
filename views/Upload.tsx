
import React, { useState, useRef } from 'react';
import { generateBookDescription } from '../services/geminiService';
import { searchBookApi, processBookSelection, ApiBookResult } from '../services/bookSearchService';
import { Wand2, Camera, Loader2, X, Plus, ShoppingBag, Search, BookOpen, ChevronRight, AlertCircle, ChevronLeft, MapPin } from 'lucide-react';
import { Book, User } from '../types';
import { CATEGORIES } from '../constants';

interface UploadProps {
    onCancel: () => void;
    onUpload: (book: Book) => void;
    currentUser: User | null;
}

export const Upload: React.FC<UploadProps> = ({ onCancel, onUpload, currentUser }) => {
    // Form State
    const [title, setTitle] = useState(''); // This is Book Title
    const [postTitle, setPostTitle] = useState(''); // This is User Post Title
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [condition, setCondition] = useState<'New' | 'Like New' | 'Good' | 'Fair'>('Good');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [generating, setGenerating] = useState(false);
    
    // New States for Shipping & Location
    const [shippingFee, setShippingFee] = useState('');
    const [isFreeShipping, setIsFreeShipping] = useState(false);
    const [location, setLocation] = useState(currentUser?.address || '서울 중구');

    // Image Upload State
    const [images, setImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Search Modal State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ApiBookResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Daum Postcode Integration
    const handleAddressSearch = () => {
        // @ts-ignore
        new window.daum.Postcode({
            oncomplete: (data: any) => {
                let fullAddress = data.address;
                let extraAddress = '';

                if (data.addressType === 'R') {
                    if (data.bname !== '') {
                        extraAddress += data.bname;
                    }
                    if (data.buildingName !== '') {
                        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
                    }
                    fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
                }
                setLocation(fullAddress);
            }
        }).open();
    };

    // AI Description Generation
    const handleAiGenerate = async () => {
        if (!title) {
            alert('책 제목을 먼저 입력해주세요.');
            return;
        }
        setGenerating(true);
        const desc = await generateBookDescription(title, author, condition);
        setDescription(desc);
        setGenerating(false);
    };

    // Book Search Handlers
    const handleSearch = async (e?: React.FormEvent) => {
        if(e) e.preventDefault();
        if (!searchQuery.trim()) return;
        
        setIsSearching(true);
        try {
            const results = await searchBookApi(searchQuery);
            setSearchResults(results);
        } catch (error) {
            console.error(error);
            alert('도서 검색 중 오류가 발생했습니다.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectBook = (book: ApiBookResult) => {
        const processed = processBookSelection(book);
        
        setTitle(processed.title);
        setAuthor(processed.author);
        setCategory(processed.category);
        
        // Auto-fill description partially or fully
        setDescription(`[자동 입력 정보]\n출판사: ${processed.publisher}\n정가: ${processed.priceStandard.toLocaleString()}원\n\n책 소개:\n${processed.description}\n\n(판매자가 작성한 내용)\n구매 시기: \n사용감: `);

        // Add Cover Image if no images exist
        if (images.length === 0 && processed.image) {
            setImages([processed.image]);
        }

        // Set default post title
        setPostTitle(`${processed.title} 깨끗한 상태로 팝니다.`);

        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    // Image Handlers
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        // MAX 4 Images (1 Thumbnail + 3 Extras)
        if (images.length + files.length > 4) {
            alert('이미지는 최대 4장까지 등록할 수 있습니다.');
            return;
        }

        const newImages: string[] = [];
        const fileReaders: Promise<void>[] = [];

        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            const promise = new Promise<void>((resolve) => {
                reader.onload = (e) => {
                    if (e.target?.result) {
                        newImages.push(e.target.result as string);
                    }
                    resolve();
                };
            });
            reader.readAsDataURL(file as Blob);
            fileReaders.push(promise);
        });

        Promise.all(fileReaders).then(() => {
            setImages((prev) => [...prev, ...newImages]);
        });
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = () => {
        if (!title || !price || !description || !postTitle) {
            alert('필수 정보를 모두 입력해주세요.');
            return;
        }

        if (images.length === 0) {
            if(!confirm('이미지 없이 등록하시겠습니까?')) return;
        }

        const newBook: Book = {
            id: Date.now().toString(),
            type: 'SALE',
            title,
            postTitle,
            author: author || '작자미상',
            category,
            price: Number(price),
            originalPrice: Number(price) * 1.2, 
            condition,
            description,
            images: images.length > 0 ? images : [`https://picsum.photos/400/600?random=${Date.now()}`],
            sellerId: currentUser?.id || 'guest',
            sellerName: currentUser?.nickname || '익명',
            location: location,
            createdAt: Date.now(),
            likes: 0,
            views: 0,
            resellState: 'ON_SALE',
            shippingFee: isFreeShipping ? 0 : Number(shippingFee)
        };

        onUpload(newBook);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-md border border-gray-200 p-8 shadow-sm relative">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <h2 className="text-xl font-bold text-gray-900">판매글 쓰기</h2>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                </button>
            </div>
            
            {/* Book Search Banner - CTA */}
            <div className="mb-8 bg-primary-50 border border-primary-100 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary-600 shadow-sm">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-gray-900">판매할 책을 검색해보세요!</p>
                        <p className="text-xs text-gray-500">제목, 저자, 카테고리 정보가 자동으로 입력됩니다.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-primary-700 transition"
                >
                    도서 검색하기
                </button>
            </div>

            <div className="space-y-8">
                {/* Photo Upload Area */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                        상품 이미지 <span className="text-gray-400 font-normal">({images.length}/4)</span>
                    </label>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*" 
                        multiple 
                    />
                    
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <div 
                            onClick={triggerFileInput}
                            className="w-24 h-24 flex-shrink-0 border border-gray-300 bg-gray-50 rounded-md flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer transition"
                        >
                            <Camera className="w-6 h-6 mb-1" />
                            <span className="text-xs font-bold">이미지 등록</span>
                        </div>

                        {images.map((img, idx) => (
                            <div key={idx} className="w-24 h-24 flex-shrink-0 relative border border-gray-200 rounded-md overflow-hidden group">
                                <img src={img} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                                {idx === 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-primary-500 text-white text-[10px] text-center py-0.5 font-bold">
                                        대표사진
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Reordered: Post Title First */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-bold text-gray-800">판매글 제목 <span className="text-red-500">*</span></label>
                        </div>
                        <input 
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            placeholder="예: 한번 읽은 깨끗한 책 팝니다 (최대 40자)"
                            maxLength={40}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition text-sm"
                        />
                    </div>

                    {/* Book Title Second */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-bold text-gray-800">책 제목 <span className="text-red-500">*</span></label>
                            <button 
                                onClick={() => setIsSearchOpen(true)}
                                className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                            >
                                <Search className="w-3 h-3" /> 검색으로 입력
                            </button>
                        </div>
                        <input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="도서명을 입력해주세요"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition text-sm bg-gray-50"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">저자 (선택)</label>
                            <input 
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="저자명을 입력해주세요"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition text-sm bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">카테고리</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition text-sm"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">상품 상태</label>
                    <div className="grid grid-cols-4 gap-3">
                        {(['New', 'Like New', 'Good', 'Fair'] as const).map((c) => (
                            <button
                                key={c}
                                className={`py-2.5 rounded-md border text-sm font-medium transition ${condition === c ? 'border-primary-500 bg-primary-50 text-primary-700 font-bold' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                                onClick={() => setCondition(c)}
                            >
                                {c === 'New' ? '새상품' : c === 'Like New' ? '사용감 없음' : c === 'Good' ? '사용감 적음' : '사용감 많음'}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold text-gray-800">상세 설명 <span className="text-red-500">*</span></label>
                        <button 
                            onClick={handleAiGenerate}
                            disabled={generating}
                            className="text-xs flex items-center gap-1.5 text-white bg-primary-500 px-3 py-1.5 rounded-full hover:bg-primary-600 transition disabled:opacity-70 shadow-sm"
                        >
                            {generating ? <Loader2 className="w-3 h-3 animate-spin"/> : <Wand2 className="w-3 h-3"/>}
                            {generating ? '생성 중...' : 'AI 자동 작성'}
                        </button>
                    </div>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        placeholder="구매 시기, 사용 기간, 훼손 여부 등 상품에 대한 자세한 정보를 입력해주세요."
                        className="w-full p-4 border border-gray-300 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition resize-y text-sm leading-relaxed"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Selling Price */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">판매 가격 <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input 
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0"
                                className="w-full px-3 py-2.5 pr-8 border border-gray-300 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition font-bold text-right"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
                        </div>
                    </div>

                    {/* Shipping Fee */}
                    <div>
                         <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-bold text-gray-800">배송비</label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={isFreeShipping}
                                    onChange={(e) => {
                                        setIsFreeShipping(e.target.checked);
                                        if(e.target.checked) setShippingFee('');
                                    }}
                                    className="rounded-sm text-primary-500 focus:ring-primary-500 border-gray-300" 
                                />
                                <span className="text-xs text-gray-600 font-medium">배송비 없음</span>
                            </label>
                        </div>
                        <div className="relative">
                            <input 
                                type="number"
                                value={shippingFee}
                                onChange={(e) => setShippingFee(e.target.value)}
                                disabled={isFreeShipping}
                                placeholder="0"
                                className="w-full px-3 py-2.5 pr-8 border border-gray-300 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition font-medium text-right disabled:bg-gray-50 disabled:text-gray-400"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">원</span>
                        </div>
                    </div>
                </div>

                {/* Location Selection */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">거래 희망 장소</label>
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <input 
                                value={location}
                                readOnly
                                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 outline-none"
                            />
                            <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                        <button 
                            onClick={handleAddressSearch}
                            className="px-4 bg-gray-800 text-white rounded-md text-xs font-bold hover:bg-gray-900 transition"
                        >
                            주소 검색
                        </button>
                    </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-100">
                    <button 
                        onClick={onCancel}
                        className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-md font-bold hover:bg-gray-50 transition text-sm"
                    >
                        취소
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="flex-[2] text-white py-3 rounded-md font-bold text-sm shadow-sm transition bg-primary-500 hover:bg-primary-600"
                    >
                        판매 등록 완료
                    </button>
                </div>
            </div>

            {/* Book Search Modal */}
            {isSearchOpen && (
                <div className="absolute inset-0 z-50 bg-white rounded-md flex flex-col animate-in fade-in duration-200">
                    <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                        <button onClick={() => setIsSearchOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                            <ChevronLeft className="w-6 h-6 text-gray-600" />
                        </button>
                        <h2 className="text-lg font-bold text-gray-900">도서 검색</h2>
                    </div>
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <form onSubmit={handleSearch} className="relative">
                            <input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="책 제목, 저자명으로 검색"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 outline-none text-sm"
                                autoFocus
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <button 
                                type="submit"
                                className="absolute right-2 top-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-md text-xs font-bold"
                            >
                                검색
                            </button>
                        </form>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2">
                        {isSearching ? (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                <span className="text-xs">도서 정보를 불러오는 중...</span>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="space-y-1">
                                {searchResults.map((book, idx) => (
                                    <div 
                                        key={idx}
                                        onClick={() => handleSelectBook(book)}
                                        className="flex gap-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition border-b border-gray-50 last:border-0"
                                    >
                                        <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded shadow-sm border border-gray-200" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">{book.title}</h3>
                                            <p className="text-xs text-gray-500 mb-1">{book.author} | {book.publisher}</p>
                                            <p className="text-[10px] text-primary-600 bg-primary-50 inline-block px-1.5 py-0.5 rounded">{book.categoryName.split('>').pop()}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 self-center" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-sm">
                                {searchQuery ? '검색 결과가 없습니다.' : '책 제목을 검색해보세요.'}
                                <br />
                                <span className="text-xs text-gray-300 mt-2">알라딘 도서 DB 제공</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
