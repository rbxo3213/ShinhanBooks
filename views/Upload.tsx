import React, { useState } from 'react';
import { generateBookDescription } from '../services/geminiService';
import { Wand2, Camera, Loader2, X } from 'lucide-react';

interface UploadProps {
    onCancel: () => void;
}

export const Upload: React.FC<UploadProps> = ({ onCancel }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [condition, setCondition] = useState('Good');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [generating, setGenerating] = useState(false);

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

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-md border border-gray-200 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                <h2 className="text-xl font-bold text-gray-900">내 물건 팔기</h2>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                </button>
            </div>
            
            <div className="space-y-8">
                {/* Photo Upload Area */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">상품 이미지 <span className="text-gray-400 font-normal">(0/10)</span></label>
                    <div className="flex gap-3">
                        <div className="w-24 h-24 border border-gray-300 bg-gray-50 rounded-md flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer transition">
                            <Camera className="w-6 h-6 mb-1" />
                            <span className="text-xs">이미지 등록</span>
                        </div>
                        {/* Preview placeholder */}
                        <div className="w-24 h-24 bg-gray-100 rounded-md border border-gray-200"></div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">제목</label>
                        <input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="도서명을 입력해주세요"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">저자 (선택)</label>
                        <input 
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="저자명을 입력해주세요"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">상품 상태</label>
                    <div className="grid grid-cols-4 gap-3">
                        {[{val:'New', label:'새상품'}, {val:'Like New', label:'사용감 없음'}, {val:'Good', label:'사용감 적음'}, {val:'Fair', label:'사용감 많음'}].map((c) => (
                            <button
                                key={c.val}
                                className={`py-2.5 rounded-md border text-sm font-medium transition ${condition === c.val ? 'border-primary-500 bg-primary-50 text-primary-700 font-bold' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                                onClick={() => setCondition(c.val)}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold text-gray-800">상세 설명</label>
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

                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">판매 가격</label>
                    <div className="relative max-w-xs">
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

                <div className="flex gap-3 pt-6 border-t border-gray-100">
                    <button 
                        onClick={onCancel}
                        className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-md font-bold hover:bg-gray-50 transition text-sm"
                    >
                        취소
                    </button>
                    <button className="flex-[2] bg-primary-500 text-white py-3 rounded-md font-bold text-sm shadow-sm hover:bg-primary-600 transition">
                        등록 완료
                    </button>
                </div>
            </div>
        </div>
    );
};