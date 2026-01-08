
import React, { useState, useMemo } from 'react';
import { User, AdminNotice, LoginLog, Book, ReadingGroup, ResellState } from '../../types';
import { Users, Megaphone, History, ShieldAlert, ShieldCheck, Trash2, Search, Plus, ShoppingBag, BookOpen, MapPin } from 'lucide-react';

interface AdminDashboardProps {
    users: User[];
    onUpdateUser: (userId: string, updates: Partial<User>) => void;
    onDeleteUser: (userId: string) => void;
    notices: AdminNotice[];
    onCreateNotice: (notice: Omit<AdminNotice, 'id' | 'createdAt'>) => void;
    onDeleteNotice: (noticeId: string) => void;
    loginLogs: LoginLog[];
    books: Book[];
    onUpdateBook: (bookId: string, updates: Partial<Book>) => void;
    onDeleteBook: (bookId: string) => void;
    groups: ReadingGroup[];
    onDeleteGroup: (groupId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    users, onUpdateUser, onDeleteUser, 
    notices, onCreateNotice, onDeleteNotice,
    loginLogs,
    books, onUpdateBook, onDeleteBook,
    groups, onDeleteGroup
}) => {
    const [activeTab, setActiveTab] = useState<'users' | 'notices' | 'logs' | 'books' | 'groups'>('users');
    const [searchTerm, setSearchTerm] = useState('');
    const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
    const [newNotice, setNewNotice] = useState({ title: '', content: '', isImportant: false });

    // Filtering Logic based on active tab
    const filteredItems = useMemo(() => {
        const query = searchTerm.toLowerCase();
        if (activeTab === 'users') {
            return users.filter(u => u.nickname.toLowerCase().includes(query) || u.email.toLowerCase().includes(query));
        }
        if (activeTab === 'books') {
            return books.filter(b => b.title.toLowerCase().includes(query) || b.sellerName.toLowerCase().includes(query));
        }
        if (activeTab === 'groups') {
            return groups.filter(g => g.name.toLowerCase().includes(query) || g.ownerName.toLowerCase().includes(query));
        }
        return [];
    }, [activeTab, users, books, groups, searchTerm]);

    const handleNoticeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreateNotice({ ...newNotice, author: '관리자' });
        setNewNotice({ title: '', content: '', isImportant: false });
        setIsNoticeModalOpen(false);
    };

    const formatDate = (ts: number) => new Date(ts).toLocaleString('ko-KR');

    const getResellStateLabel = (state: ResellState) => {
        switch(state) {
            case 'ON_SALE': return { label: '판매중', color: 'bg-green-50 text-green-600 border-green-100' };
            case 'RESERVED': return { label: '예약중', color: 'bg-orange-50 text-orange-600 border-orange-100' };
            case 'SOLD': return { label: '판매완료', color: 'bg-gray-100 text-gray-600 border-gray-200' };
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Console</h1>
                    <p className="text-gray-500 mt-1">플랫폼 통합 운영 및 안전 관리 대시보드</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm text-center">
                        <p className="text-[10px] font-bold text-gray-400 mb-0.5 uppercase">Active Books</p>
                        <p className="text-xl font-black text-primary-600">{books.length}</p>
                    </div>
                    <div className="bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm text-center">
                        <p className="text-[10px] font-bold text-gray-400 mb-0.5 uppercase">Groups</p>
                        <p className="text-xl font-black text-emerald-500">{groups.length}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
                <button onClick={() => { setActiveTab('users'); setSearchTerm(''); }} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Users className="w-4 h-4" /> 유저
                </button>
                <button onClick={() => { setActiveTab('books'); setSearchTerm(''); }} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'books' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <ShoppingBag className="w-4 h-4" /> 상품
                </button>
                <button onClick={() => { setActiveTab('groups'); setSearchTerm(''); }} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'groups' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <BookOpen className="w-4 h-4" /> 모임
                </button>
                <button onClick={() => { setActiveTab('notices'); setSearchTerm(''); }} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'notices' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Megaphone className="w-4 h-4" /> 공지
                </button>
                <button onClick={() => { setActiveTab('logs'); setSearchTerm(''); }} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'logs' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <History className="w-4 h-4" /> 이력
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden min-h-[600px]">
                {/* Search Bar for List-type Tabs */}
                {(activeTab === 'users' || activeTab === 'books' || activeTab === 'groups') && (
                    <div className="p-8 border-b border-gray-50 bg-white sticky top-0 z-10">
                        <div className="flex justify-between items-center">
                            <div className="relative w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text"
                                    placeholder={`${activeTab === 'users' ? '닉네임, 이메일' : activeTab === 'books' ? '상품명, 판매자' : '모임명, 모임장'} 검색...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 outline-none text-sm"
                                />
                            </div>
                            <span className="text-xs text-gray-400 font-bold">Total: {filteredItems.length} items</span>
                        </div>
                    </div>
                )}

                {/* 1. USER MANAGEMENT */}
                {activeTab === 'users' && (
                    <table className="w-full">
                        <thead className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-4 text-left">회원 정보</th>
                                <th className="px-8 py-4 text-left">상태</th>
                                <th className="px-8 py-4 text-left">권한</th>
                                <th className="px-8 py-4 text-left">가입일</th>
                                <th className="px-8 py-4 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {(filteredItems as User[]).map(user => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center font-bold text-primary-600 border border-primary-100">
                                                {user.nickname[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">{user.nickname}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border ${user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                            <div className={`w-1 h-1 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                            {user.status === 'ACTIVE' ? '정상' : '정지됨'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <button onClick={() => onUpdateUser(user.id, { isAdmin: !user.isAdmin })} className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${user.isAdmin ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-400 border-gray-200 hover:border-primary-500'}`}>
                                            {user.isAdmin ? 'ADMIN' : 'USER'}
                                        </button>
                                    </td>
                                    <td className="px-8 py-5 text-xs text-gray-500 font-medium">{formatDate(user.joinedAt)}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => onUpdateUser(user.id, { status: user.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE' })} className={`p-2 rounded-lg transition ${user.status === 'ACTIVE' ? 'text-orange-500 hover:bg-orange-50' : 'text-emerald-500 hover:bg-emerald-50'}`}>
                                                {user.status === 'ACTIVE' ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                            </button>
                                            <button onClick={() => { if(confirm('영구 삭제하시겠습니까?')) onDeleteUser(user.id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* 2. PRODUCT MANAGEMENT (Books) */}
                {activeTab === 'books' && (
                    <table className="w-full">
                        <thead className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-4 text-left">상품 정보</th>
                                <th className="px-8 py-4 text-left">판매자</th>
                                <th className="px-8 py-4 text-left">가격</th>
                                <th className="px-8 py-4 text-left">상태</th>
                                <th className="px-8 py-4 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {(filteredItems as Book[]).map(book => {
                                const state = getResellStateLabel(book.resellState);
                                return (
                                    <tr key={book.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <img src={book.images[0]} className="w-10 h-14 object-cover rounded shadow-sm" alt="" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-gray-900 truncate max-w-[200px]">{book.title}</p>
                                                    <p className="text-xs text-gray-400">{book.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-gray-700">{book.sellerName}</td>
                                        <td className="px-8 py-5 text-sm font-black text-primary-600">{book.price.toLocaleString()}원</td>
                                        <td className="px-8 py-5">
                                            <div className="relative group/state">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black border ${state.color} cursor-pointer`}>
                                                    {state.label}
                                                </span>
                                                <div className="hidden group-hover/state:block absolute top-full left-0 mt-1 bg-white border border-gray-100 shadow-xl rounded-lg py-1 z-20">
                                                    {(['ON_SALE', 'RESERVED', 'SOLD'] as ResellState[]).map(s => (
                                                        <button key={s} onClick={() => onUpdateBook(book.id, { resellState: s })} className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 font-bold whitespace-nowrap">
                                                            {getResellStateLabel(s).label}로 변경
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button onClick={() => { if(confirm('이 게시글을 삭제하시겠습니까?')) onDeleteBook(book.id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {/* 3. GROUP MANAGEMENT */}
                {activeTab === 'groups' && (
                    <table className="w-full">
                        <thead className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-4 text-left">모임 정보</th>
                                <th className="px-8 py-4 text-left">모임장</th>
                                <th className="px-8 py-4 text-left">지역</th>
                                <th className="px-8 py-4 text-left">참여 인원</th>
                                <th className="px-8 py-4 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {(filteredItems as ReadingGroup[]).map(group => (
                                <tr key={group.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <img src={group.image} className="w-12 h-12 object-cover rounded-xl shadow-sm" alt="" />
                                            <div>
                                                <p className="text-sm font-black text-gray-900">{group.name}</p>
                                                <div className="flex gap-1 mt-1">
                                                    {group.tags.slice(0, 2).map(t => <span key={t} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">#{t}</span>)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-gray-700">{group.ownerName}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <MapPin className="w-3 h-3" /> {group.region}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary-500" style={{ width: `${(group.currentMembers / group.maxMembers) * 100}%` }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">{group.currentMembers}/{group.maxMembers}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button onClick={() => { if(confirm('모임을 해산하시겠습니까? 관련 게시글이 모두 삭제됩니다.')) onDeleteGroup(group.id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* 4. NOTICE MANAGEMENT */}
                {activeTab === 'notices' && (
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black text-gray-900">플랫폼 공지사항</h2>
                            <button onClick={() => setIsNoticeModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600 shadow-lg shadow-primary-100 transition">
                                <Plus className="w-4 h-4" /> 신규 공지 등록
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {notices.map(notice => (
                                <div key={notice.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center group">
                                    <div className="flex gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${notice.isImportant ? 'bg-red-500 text-white' : 'bg-primary-50 text-primary-600'}`}>
                                            <Megaphone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                {notice.isImportant && <span className="text-[10px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded">URGENT</span>}
                                                <h3 className="font-bold text-gray-900">{notice.title}</h3>
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium">{notice.author} · {formatDate(notice.createdAt)}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => onDeleteNotice(notice.id)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. LOGIN LOGS */}
                {activeTab === 'logs' && (
                    <div className="p-8">
                        <h2 className="text-xl font-black text-gray-900 mb-8">실시간 접속 로그</h2>
                        <table className="w-full">
                            <thead className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left">사용자</th>
                                    <th className="px-6 py-4 text-left">일시</th>
                                    <th className="px-6 py-4 text-left">IP ADDRESS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loginLogs.map(log => (
                                    <tr key={log.id}>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-gray-900">{log.userNickname}</span>
                                            <span className="text-[10px] text-gray-400 ml-2">({log.username})</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500">{formatDate(log.timestamp)}</td>
                                        <td className="px-6 py-4">
                                            <code className="text-[11px] font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">{log.ip}</code>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Notice Modal */}
            {isNoticeModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-8 border-b border-gray-100">
                            <h3 className="text-2xl font-black text-gray-900">신규 공지 작성</h3>
                        </div>
                        <form onSubmit={handleNoticeSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">공지 제목</label>
                                <input required value={newNotice.title} onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-100" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">내용</label>
                                <textarea required value={newNotice.content} onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-100 min-h-[150px]" />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={newNotice.isImportant} onChange={(e) => setNewNotice({ ...newNotice, isImportant: e.target.checked })} className="w-5 h-5 rounded-md border-gray-300 text-primary-500" />
                                <span className="text-sm font-bold text-red-600">중요 공지 (상단 노출)</span>
                            </label>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setIsNoticeModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold">취소</button>
                                <button type="submit" className="flex-[2] py-4 bg-primary-500 text-white rounded-2xl font-bold">등록</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
