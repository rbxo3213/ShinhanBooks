
import React, { useState, useRef, useMemo } from 'react';
import { ReadingGroup, User, AppView, ReadingGroupPost, ReadingGroupComment, AttachedBook, GroupMember } from '../types';
import { MOCK_GROUP_POSTS, MOCK_COMMENTS, MOCK_BOOKS } from '../constants';
import { MapPin, Users, Calendar, Plus, X, Tag, Search, Camera, ChevronLeft, Heart, MessageCircle, MoreVertical, Clock, Bell, Book as BookIcon, Send, Eye, Globe, Settings, LogOut, Lock, UserPlus, Check, Ban } from 'lucide-react';

interface ReadingGroupsProps {
    groups: ReadingGroup[];
    currentUser: User | null;
    onCreateGroup: (group: ReadingGroup) => void;
    onToggleWishlist: (groupId: string) => void;
    setView: (view: AppView) => void;
    onAddNotification: (msg: string) => void;
}

type InternalView = 'LIST' | 'GROUP_DETAIL' | 'POST_CREATE' | 'POST_DETAIL' | 'MANAGE' | 'MEMBER_LIST';
type Relation = 'OWNER' | 'MEMBER' | 'GUEST';

export const ReadingGroups: React.FC<ReadingGroupsProps> = ({ groups, currentUser, onCreateGroup, onToggleWishlist, setView, onAddNotification }) => {
    // Navigation State
    const [internalView, setInternalView] = useState<InternalView>('LIST');
    
    // Data State (List)
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(20);

    // Detail States
    const [selectedGroup, setSelectedGroup] = useState<ReadingGroup | null>(null);
    const [selectedPost, setSelectedPost] = useState<ReadingGroupPost | null>(null);
    const [posts, setPosts] = useState<ReadingGroupPost[]>(MOCK_GROUP_POSTS);
    const [comments, setComments] = useState<ReadingGroupComment[]>(MOCK_COMMENTS);
    const [activeTab, setActiveTab] = useState<'home' | 'board'>('home');

    // Manage State
    const [manageTab, setManageTab] = useState<'info' | 'members' | 'join_requests'>('info');
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editSchedule, setEditSchedule] = useState('');
    const [editImage, setEditImage] = useState<string | null>(null);

    // Create Group Modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    // ... Create Group Form States ...
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupRegionType, setNewGroupRegionType] = useState<'ONLINE' | 'OFFLINE'>('OFFLINE');
    const [newGroupRegion, setNewGroupRegion] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [newGroupSchedule, setNewGroupSchedule] = useState('');
    const [newGroupMax, setNewGroupMax] = useState(10);
    const [newGroupImage, setNewGroupImage] = useState<string | null>(null);
    const groupFileInputRef = useRef<HTMLInputElement>(null);
    const manageFileInputRef = useRef<HTMLInputElement>(null);

    // Join Modal
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [joinReason, setJoinReason] = useState('');
    const [joinStatus, setJoinStatus] = useState<'NONE' | 'PENDING' | 'APPROVED'>('NONE');

    // === Post Create State ===
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postImages, setPostImages] = useState<string[]>([]);
    const [postBook, setPostBook] = useState<AttachedBook | undefined>(undefined);
    const [isBookSearchOpen, setIsBookSearchOpen] = useState(false);
    const [bookSearchQuery, setBookSearchQuery] = useState('');
    const postFileInputRef = useRef<HTMLInputElement>(null);

    // === Comment Create State ===
    const [commentContent, setCommentContent] = useState('');

    // --- Helpers ---
    // In a real app, this should be consistent. For this demo, we assume currentUser is "user-1" 
    // unless passed otherwise, but we use the passed currentUser.id for logic.
    const getRelation = (group: ReadingGroup): Relation => {
        if (!currentUser) return 'GUEST';
        if (group.ownerId === currentUser.id) return 'OWNER';
        if (group.members.some(m => m.id === currentUser.id)) return 'MEMBER';
        return 'GUEST';
    };

    const filteredGroups = useMemo(() => {
        return groups.filter(group => 
            group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            group.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [groups, searchTerm]);

    const groupPosts = useMemo(() => {
        if (!selectedGroup) return [];
        return posts.filter(p => p.groupId === selectedGroup.id).sort((a, b) => b.createdAt - a.createdAt);
    }, [selectedGroup, posts]);

    const postComments = useMemo(() => {
        if (!selectedPost) return [];
        return comments.filter(c => c.postId === selectedPost.id).sort((a, b) => a.createdAt - b.createdAt);
    }, [selectedPost, comments]);

    const formatTime = (timestamp: number) => {
        const minutes = Math.floor((Date.now() - timestamp) / 60000);
        if (minutes < 1) return '방금 전';
        if (minutes < 60) return `${minutes}분 전`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}시간 전`;
        return new Date(timestamp).toLocaleDateString();
    };

    // --- Handlers: Group Creation ---
    const handleGroupImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => { 
                if (e.target?.result) {
                    if (isEdit) setEditImage(e.target.result as string);
                    else setNewGroupImage(e.target.result as string); 
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateGroupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return alert('로그인이 필요합니다.');
        if (newGroupMax > 10) return alert('최대 인원은 10명까지 가능합니다.');

        const ownerMember: GroupMember = {
            id: currentUser.id,
            nickname: currentUser.nickname,
            role: 'OWNER',
            joinedAt: Date.now()
        };

        const newGroup: ReadingGroup = {
            id: Date.now().toString(),
            name: newGroupName,
            region: newGroupRegionType === 'ONLINE' ? '온라인' : newGroupRegion,
            description: newGroupDesc,
            schedule: newGroupSchedule || '일정 미정',
            currentMembers: 1,
            maxMembers: newGroupMax,
            tags: [], // Optional in this simplified form
            image: newGroupImage || `https://picsum.photos/400/300?random=${Date.now()}`,
            ownerId: currentUser.id,
            ownerName: currentUser.nickname,
            members: [ownerMember],
            pendingMembers: []
        };

        onCreateGroup(newGroup);
        setIsCreateModalOpen(false);
        // Reset form...
        setNewGroupName(''); setNewGroupRegion(''); setNewGroupDesc('');
        setNewGroupSchedule(''); setNewGroupImage(null); setNewGroupMax(10);
        alert('모임이 성공적으로 개설되었습니다!');
    };

    // --- Handlers: Join/Leave/Manage ---
    const handleJoinRequest = () => {
        if (!currentUser) return alert('로그인이 필요합니다.');
        if (!joinReason.trim()) return alert('지원 동기를 입력해주세요.');

        setJoinStatus('PENDING');
        // Simulate Approval Process
        setTimeout(() => {
            setJoinStatus('APPROVED');
            setIsJoinModalOpen(false);
            setJoinReason('');
            setJoinStatus('NONE');
            onAddNotification(`'${selectedGroup?.name}' 모임 가입 신청이 전송되었습니다.`);
            alert(`'${selectedGroup?.name}' 가입 신청이 완료되었습니다. 모임장의 승인을 기다려주세요.`);
        }, 1000);
    };

    const handleLeaveGroup = () => {
        if (confirm('정말 모임을 탈퇴하시겠습니까?')) {
            alert('모임에서 탈퇴했습니다.');
            setInternalView('LIST');
            setSelectedGroup(null);
        }
    };

    const handleKickMember = (memberId: string) => {
        if (confirm('해당 멤버를 내보내시겠습니까?')) {
            if (selectedGroup) {
                const updatedMembers = selectedGroup.members.filter(m => m.id !== memberId);
                setSelectedGroup({...selectedGroup, members: updatedMembers, currentMembers: updatedMembers.length});
            }
        }
    };

    const handleAcceptMember = (member: GroupMember) => {
        if (!selectedGroup) return;
        const updatedMembers = [...selectedGroup.members, { ...member, role: 'MEMBER' as const, joinedAt: Date.now() }];
        const updatedPending = selectedGroup.pendingMembers.filter(m => m.id !== member.id);
        
        setSelectedGroup({
            ...selectedGroup, 
            members: updatedMembers, 
            pendingMembers: updatedPending,
            currentMembers: updatedMembers.length
        });
        onAddNotification(`${member.nickname}님의 가입을 승인했습니다.`);
    };

    const handleRejectMember = (memberId: string) => {
        if (!selectedGroup) return;
        const updatedPending = selectedGroup.pendingMembers.filter(m => m.id !== memberId);
        setSelectedGroup({ ...selectedGroup, pendingMembers: updatedPending });
    };

    const handleSaveGroupSettings = () => {
        if (!selectedGroup) return;
        setSelectedGroup({
            ...selectedGroup,
            name: editName,
            description: editDesc,
            schedule: editSchedule,
            image: editImage || selectedGroup.image
        });
        alert('모임 정보가 수정되었습니다.');
    };

    // --- Handlers: Post Creation ---
    const handlePostImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        
        const newImages: string[] = [];
        const readers: Promise<void>[] = [];

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            readers.push(new Promise((resolve) => {
                reader.onload = (e) => {
                    if (e.target?.result) newImages.push(e.target.result as string);
                    resolve();
                };
                reader.readAsDataURL(file as Blob);
            }));
        });

        Promise.all(readers).then(() => setPostImages([...postImages, ...newImages]));
    };

    const handlePostSubmit = () => {
        if (!postTitle.trim() || !postContent.trim()) return alert('제목과 내용을 입력해주세요.');
        if (!currentUser || !selectedGroup) return;

        const newPost: ReadingGroupPost = {
            id: Date.now().toString(),
            groupId: selectedGroup.id,
            title: postTitle,
            authorId: currentUser.id,
            authorName: currentUser.nickname,
            content: postContent,
            images: postImages,
            attachedBook: postBook,
            likes: 0,
            viewCount: 0,
            commentCount: 0,
            createdAt: Date.now()
        };

        setPosts([newPost, ...posts]);
        setInternalView('GROUP_DETAIL');
        setActiveTab('board');
        // Reset
        setPostTitle(''); setPostContent(''); setPostImages([]); setPostBook(undefined);
    };

    // --- Render Functions ---

    // 1. Post Create View
    const renderPostCreate = () => (
        <div className="max-w-3xl mx-auto bg-white min-h-[600px] border border-gray-200 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <button onClick={() => setInternalView('GROUP_DETAIL')} className="p-2 hover:bg-gray-100 rounded-full">
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h2 className="text-xl font-bold text-gray-900">글 쓰기</h2>
            </div>

            <div className="space-y-4">
                <input 
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="제목"
                    className="w-full text-lg font-bold placeholder-gray-400 border-none outline-none focus:ring-0 p-2"
                />
                <div className="h-px bg-gray-200"></div>
                
                {postBook && (
                    <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-lg relative group">
                        <img src={postBook.image} alt={postBook.title} className="w-12 h-16 object-cover rounded shadow-sm" />
                        <div>
                            <p className="text-sm font-bold text-gray-900">{postBook.title}</p>
                            <p className="text-xs text-gray-500">{postBook.author}</p>
                        </div>
                        <button 
                            onClick={() => setPostBook(undefined)}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow border border-gray-200 hover:bg-gray-100"
                        >
                            <X className="w-3 h-3 text-gray-500" />
                        </button>
                    </div>
                )}

                <textarea 
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="내용을 입력하세요."
                    className="w-full min-h-[300px] text-base placeholder-gray-400 border-none outline-none focus:ring-0 p-2 resize-none"
                />

                {postImages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {postImages.map((img, i) => (
                            <div key={i} className="relative w-20 h-20 flex-shrink-0">
                                <img src={img} alt="" className="w-full h-full object-cover rounded-lg border border-gray-200" />
                                <button 
                                    onClick={() => setPostImages(postImages.filter((_, idx) => idx !== i))}
                                    className="absolute -top-1 -right-1 bg-black/50 text-white rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-2">
                    <button 
                        onClick={() => postFileInputRef.current?.click()}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
                        title="사진 첨부"
                    >
                        <Camera className="w-6 h-6" />
                    </button>
                    <input type="file" ref={postFileInputRef} onChange={handlePostImageUpload} className="hidden" multiple accept="image/*" />
                    
                    <button 
                        onClick={() => setIsBookSearchOpen(true)}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
                        title="책 첨부"
                    >
                        <BookIcon className="w-6 h-6" />
                    </button>
                </div>
                <button 
                    onClick={handlePostSubmit}
                    disabled={!postTitle.trim() || !postContent.trim()}
                    className="bg-primary-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                >
                    등록 요청
                </button>
            </div>

            {isBookSearchOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-lg">도서 검색</h3>
                            <button onClick={() => setIsBookSearchOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
                        </div>
                        <div className="p-4 border-b border-gray-200">
                            <input 
                                value={bookSearchQuery}
                                onChange={(e) => setBookSearchQuery(e.target.value)}
                                placeholder="책 제목 또는 저자를 입력하세요"
                                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                                autoFocus
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {MOCK_BOOKS.filter(b => b.title.includes(bookSearchQuery) || b.author.includes(bookSearchQuery)).slice(0, 10).map(book => (
                                <div 
                                    key={book.id} 
                                    onClick={() => {
                                        setPostBook({ title: book.title, author: book.author, image: book.images[0] });
                                        setIsBookSearchOpen(false);
                                    }}
                                    className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                                >
                                    <img src={book.images[0]} alt="" className="w-12 h-16 object-cover rounded bg-gray-100" />
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 line-clamp-1">{book.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">{book.author}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // 2. Group Detail View
    if ((internalView === 'GROUP_DETAIL' || internalView === 'MEMBER_LIST') && selectedGroup) {
        const relation = getRelation(selectedGroup);
        const isOwner = relation === 'OWNER';
        const isMember = relation === 'MEMBER';
        const isGuest = relation === 'GUEST';

        if (internalView === 'MEMBER_LIST') {
            return (
                <div className="max-w-3xl mx-auto bg-white min-h-[600px] border border-gray-200 shadow-sm rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <button onClick={() => setInternalView('GROUP_DETAIL')} className="p-2 hover:bg-gray-100 rounded-full">
                            <ChevronLeft className="w-6 h-6 text-gray-600" />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900">멤버 전체 보기 ({selectedGroup.members.length})</h2>
                    </div>
                    <div className="space-y-4">
                        {selectedGroup.members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${member.role === 'OWNER' ? 'bg-primary-100 text-primary-700 border-primary-200' : 'bg-white text-gray-600 border-gray-200'}`}>
                                        {member.nickname[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                            {member.nickname}
                                            {member.role === 'OWNER' && <span className="text-[10px] bg-primary-600 text-white px-1.5 py-0.5 rounded">모임장</span>}
                                        </p>
                                        <p className="text-xs text-gray-400">{new Date(member.joinedAt).toLocaleDateString()} 가입</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="max-w-4xl mx-auto bg-white min-h-[800px] border border-gray-200 shadow-sm rounded-xl overflow-hidden flex flex-col relative">
                {/* 16. Header: Thumbnail, Name, Info, Like */}
                <div className="relative h-64 bg-gray-200">
                    <img src={selectedGroup.image} alt={selectedGroup.name} className="w-full h-full object-cover" />
                    <button 
                        onClick={() => { setSelectedGroup(null); setInternalView('LIST'); }}
                        className="absolute top-4 left-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition backdrop-blur-sm"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button 
                            onClick={() => onToggleWishlist(selectedGroup.id)}
                            className="bg-white/80 hover:bg-white p-2 rounded-full text-red-500 backdrop-blur-sm transition"
                        >
                            <Heart className={`w-5 h-5 ${currentUser?.groupWishlist?.includes(selectedGroup.id) ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20 text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary-500 text-white px-2 py-0.5 rounded text-xs font-bold">{selectedGroup.region}</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">{selectedGroup.name}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-200">
                            <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {selectedGroup.currentMembers} / {selectedGroup.maxMembers}명</div>
                            <div className="flex items-center gap-1"><Heart className="w-4 h-4" /> 124 찜</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 px-6 sticky top-0 bg-white z-10">
                    <button 
                        onClick={() => setActiveTab('home')}
                        className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'home' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        홈
                    </button>
                    <button 
                        onClick={() => setActiveTab('board')}
                        className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'board' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        게시판
                        {isGuest && <Lock className="w-3 h-3 ml-1 inline text-gray-400" />}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                    {/* HOME TAB */}
                    {activeTab === 'home' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-3 text-lg">모임 소개</h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{selectedGroup.description}</p>
                                
                                {/* Schedule Moved Here */}
                                <div className="mt-6 border-t border-gray-100 pt-4">
                                    <h4 className="font-bold text-gray-900 mb-2 text-sm flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary-600"/> 정기 모임 일정
                                    </h4>
                                    <div className="bg-primary-50 p-3 rounded text-sm text-primary-900 font-medium">
                                        {selectedGroup.schedule || '일정 미정'}
                                    </div>
                                </div>
                            </div>

                            {/* Member List (Preview 3) */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-900 text-lg">함께하는 멤버</h3>
                                    <button onClick={() => setInternalView('MEMBER_LIST')} className="text-xs text-gray-500 hover:text-primary-600 underline">더 보기</button>
                                </div>
                                <div className="space-y-3">
                                    {selectedGroup.members.slice(0, 3).map((member, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${member.role === 'OWNER' ? 'bg-primary-100 text-primary-700 border-primary-200' : 'bg-white text-gray-600 border-gray-200'}`}>
                                                {member.nickname[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{member.nickname}</p>
                                                {member.role === 'OWNER' ? (
                                                    <p className="text-xs text-primary-600 font-bold">모임장</p>
                                                ) : (
                                                    <p className="text-xs text-gray-400">일반 멤버</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BOARD TAB */}
                    {activeTab === 'board' && (
                        <div className="space-y-4 relative">
                            {isGuest && (
                                <div className="absolute inset-0 z-20 backdrop-blur-sm bg-white/30 flex flex-col items-center justify-center text-center p-6 border border-gray-200 rounded-xl">
                                    <Lock className="w-12 h-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">멤버만 볼 수 있는 공간입니다</h3>
                                    <p className="text-sm text-gray-500 mb-6">모임에 가입하고 멤버들과 이야기를 나눠보세요!</p>
                                    <button 
                                        onClick={() => setIsJoinModalOpen(true)}
                                        className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-primary-700 transition"
                                    >
                                        모임 가입하기
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-lg text-gray-900">게시판</h3>
                                <button 
                                    onClick={() => {
                                        if(isGuest) return alert('모임 멤버만 글을 쓸 수 있습니다.');
                                        setInternalView('POST_CREATE');
                                    }}
                                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 shadow-sm flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> 글쓰기
                                </button>
                            </div>

                            {groupPosts.length > 0 ? (
                                groupPosts.map(post => (
                                    <div 
                                        key={post.id} 
                                        onClick={() => { if(!isGuest) { setSelectedPost(post); setInternalView('POST_DETAIL'); } }}
                                        className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-primary-300 transition group"
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 truncate group-hover:text-primary-600 transition mb-1.5">{post.title}</h4>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-3 h-10">{post.content}</p>
                                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                                    <span>{post.authorName}</span>
                                                    <span>·</span>
                                                    <span>{formatTime(post.createdAt)}</span>
                                                    <span>·</span>
                                                    <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {post.viewCount}</span>
                                                    <span className="flex items-center gap-1 text-primary-600 font-bold"><MessageCircle className="w-3 h-3"/> {post.commentCount}</span>
                                                </div>
                                            </div>
                                            {(post.attachedBook || (post.images && post.images.length > 0)) && (
                                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                                                    <img 
                                                        src={post.attachedBook ? post.attachedBook.image : post.images![0]} 
                                                        alt="" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200 border-dashed">
                                    등록된 게시글이 없습니다.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom Action Bar */}
                <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between">
                     <div className="text-sm font-bold text-gray-900">{selectedGroup.currentMembers} / {selectedGroup.maxMembers}명 참여 중</div>
                     
                     {isOwner ? (
                         <button 
                            onClick={() => {
                                setEditName(selectedGroup.name);
                                setEditDesc(selectedGroup.description);
                                setEditSchedule(selectedGroup.schedule);
                                setEditImage(selectedGroup.image);
                                setInternalView('MANAGE');
                            }}
                            className="bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-md flex items-center gap-2"
                         >
                            <Settings className="w-4 h-4"/> 모임 관리하기
                         </button>
                     ) : isMember ? (
                         <button 
                            onClick={handleLeaveGroup}
                            className="border border-red-200 text-red-600 bg-red-50 px-8 py-3 rounded-lg font-bold hover:bg-red-100 transition shadow-sm flex items-center gap-2"
                         >
                            <LogOut className="w-4 h-4"/> 모임 나가기
                         </button>
                     ) : (
                         <button 
                            onClick={() => setIsJoinModalOpen(true)}
                            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 transition shadow-md"
                         >
                            모임 가입하기
                         </button>
                     )}
                </div>

                {/* 15. Join Popup */}
                {isJoinModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
                        <div className="bg-white rounded-t-xl md:rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                             <h3 className="text-xl font-bold mb-2">모임 가입 신청</h3>
                             <p className="text-sm text-gray-500 mb-4">{selectedGroup.name}</p>
                             
                             <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm text-gray-700">
                                 {selectedGroup.description}
                             </div>

                             {joinStatus === 'PENDING' ? (
                                 <div className="text-center py-8">
                                     <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                     <p className="font-bold">가입 승인 대기중...</p>
                                 </div>
                             ) : (
                                 <>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">지원 동기</label>
                                    <textarea 
                                        value={joinReason}
                                        onChange={(e) => setJoinReason(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-primary-500 outline-none mb-4 resize-none"
                                        rows={3}
                                        placeholder="모임장에게 보낼 간단한 인사를 적어주세요."
                                    />
                                    <div className="flex gap-3">
                                        <button onClick={() => setIsJoinModalOpen(false)} className="flex-1 py-3 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50">취소</button>
                                        <button onClick={handleJoinRequest} className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 shadow-sm">가입 신청</button>
                                    </div>
                                 </>
                             )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // 3. Management View (Owner Only)
    if (internalView === 'MANAGE' && selectedGroup) {
        return (
            <div className="max-w-3xl mx-auto bg-white min-h-[800px] border border-gray-200 shadow-sm rounded-xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white sticky top-0 z-10">
                    <button onClick={() => setInternalView('GROUP_DETAIL')} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">모임 관리</h2>
                </div>

                <div className="flex border-b border-gray-200 px-6 bg-gray-50">
                    <button 
                        onClick={() => setManageTab('info')}
                        className={`py-3 mr-6 text-sm font-bold border-b-2 transition-colors ${manageTab === 'info' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}
                    >
                        정보 수정
                    </button>
                    <button 
                        onClick={() => setManageTab('members')}
                        className={`py-3 mr-6 text-sm font-bold border-b-2 transition-colors ${manageTab === 'members' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}
                    >
                        멤버 관리
                    </button>
                    <button 
                        onClick={() => setManageTab('join_requests')}
                        className={`py-3 text-sm font-bold border-b-2 transition-colors ${manageTab === 'join_requests' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}
                    >
                        가입 신청 <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{selectedGroup.pendingMembers.length}</span>
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {manageTab === 'info' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">대표 이미지</label>
                                <div className="flex gap-4 items-center">
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                        <img src={editImage || ''} alt="Group" className="w-full h-full object-cover" />
                                    </div>
                                    <button 
                                        onClick={() => manageFileInputRef.current?.click()}
                                        className="text-xs bg-white border border-gray-300 px-3 py-2 rounded font-bold hover:bg-gray-50"
                                    >
                                        이미지 변경
                                    </button>
                                    <input type="file" ref={manageFileInputRef} className="hidden" accept="image/*" onChange={(e) => handleGroupImageUpload(e, true)} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">모임 이름</label>
                                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">모임 소개</label>
                                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={4} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">정기 일정 (모임장만 수정 가능)</label>
                                <input value={editSchedule} onChange={e => setEditSchedule(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="예: 매주 토요일 오전 10시" />
                            </div>
                            <button onClick={handleSaveGroupSettings} className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 shadow-sm mt-4">
                                변경사항 저장
                            </button>
                        </div>
                    )}

                    {manageTab === 'members' && (
                        <div className="space-y-4">
                            {selectedGroup.members.map(member => (
                                <div key={member.id} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                            {member.nickname[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                {member.nickname}
                                                {member.role === 'OWNER' && <span className="text-[10px] bg-gray-900 text-white px-1.5 py-0.5 rounded">모임장</span>}
                                            </p>
                                            <p className="text-xs text-gray-400">{new Date(member.joinedAt).toLocaleDateString()} 가입</p>
                                        </div>
                                    </div>
                                    {member.role !== 'OWNER' && (
                                        <button onClick={() => handleKickMember(member.id)} className="text-xs text-red-500 border border-red-200 bg-red-50 px-3 py-1.5 rounded hover:bg-red-100 font-bold">
                                            퇴장
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {manageTab === 'join_requests' && (
                        <div className="space-y-4">
                            {selectedGroup.pendingMembers.length === 0 ? (
                                <div className="text-center text-gray-400 py-10">대기 중인 가입 신청이 없습니다.</div>
                            ) : (
                                selectedGroup.pendingMembers.map(member => (
                                    <div key={member.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                                {member.nickname[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{member.nickname}</p>
                                                <p className="text-xs text-gray-400">가입 신청</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 mb-4">
                                            "열심히 참여하겠습니다!" (예시 지원동기)
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleRejectMember(member.id)} className="flex-1 py-2 border border-gray-300 rounded font-bold text-gray-600 hover:bg-gray-50 text-xs">거절</button>
                                            <button onClick={() => handleAcceptMember(member)} className="flex-1 py-2 bg-primary-600 text-white rounded font-bold hover:bg-primary-700 text-xs">수락</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (internalView === 'POST_CREATE') return renderPostCreate();
    if (internalView === 'POST_DETAIL' && selectedPost) {
        // Reuse existing Post Detail logic... (omitted for brevity, assume strictly same logic as before but with selectedGroup context)
        // For simplicity in this demo, let's just return a placeholder or copy the previous renderPostDetail if needed.
        // Copying essential parts:
        return (
            <div className="max-w-3xl mx-auto bg-white min-h-[800px] border border-gray-200 shadow-sm rounded-xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex items-center gap-3 sticky top-0 bg-white z-10">
                    <button onClick={() => setInternalView('GROUP_DETAIL')} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h2 className="text-lg font-bold text-gray-900 truncate flex-1">{selectedGroup?.name}</h2>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedPost.title}</h1>
                    <div className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-6 text-base">{selectedPost.content}</div>
                    {/* ... (Rest of post detail UI) ... */}
                </div>
            </div>
        );
    }
    
    // Default List View (Main)
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">독서모임</h1>
                    <p className="text-gray-500 text-sm">함께 읽고, 나누고, 성장하는 즐거움</p>
                </div>
                <button 
                    onClick={() => {
                        if (!currentUser) {
                            if(confirm('로그인 후 이용 가능합니다. 로그인 하시겠습니까?')) setView(AppView.LOGIN);
                            return;
                        }
                        setIsCreateModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-full font-bold shadow-sm hover:bg-primary-700 transition"
                >
                    <Plus className="w-5 h-5" /> 모임 만들기
                </button>
            </div>

            <div className="relative">
                <input 
                    type="text" 
                    placeholder="지역, 모임명, 태그로 검색해보세요" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredGroups.slice(0, visibleCount).map(group => {
                    const isWishlisted = currentUser?.groupWishlist?.includes(group.id);
                    return (
                        <div 
                            key={group.id} 
                            onClick={() => { setSelectedGroup(group); setInternalView('GROUP_DETAIL'); setActiveTab('home'); }}
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer flex flex-col group relative"
                        >
                            <div className="h-40 overflow-hidden relative">
                                <img src={group.image} alt={group.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                    {group.region === '온라인' ? <Globe className="w-3 h-3"/> : <MapPin className="w-3 h-3" />} 
                                    {group.region}
                                </div>
                                <div className="absolute top-3 right-3 z-10">
                                     <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleWishlist(group.id);
                                        }}
                                        className="bg-white p-1.5 rounded-full text-red-500 hover:bg-gray-50 shadow-sm transition-colors"
                                    >
                                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">{group.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{group.description}</p>
                                <div className="space-y-2 mt-auto">
                                    <div className="flex items-center gap-2 text-xs text-gray-500"><Calendar className="w-3.5 h-3.5" /> <span>{group.schedule || '일정 협의'}</span></div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-1 flex-wrap">{group.tags.slice(0, 1).map((tag, i) => <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-sm">#{tag}</span>)}</div>
                                        <div className="flex items-center gap-1 text-xs font-bold text-gray-700"><Users className="w-3.5 h-3.5" /> <span>{group.currentMembers}/{group.maxMembers}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {visibleCount < filteredGroups.length && (
                <div className="text-center pt-4 pb-12">
                     <button 
                        onClick={() => setVisibleCount(prev => prev + 20)}
                        className="bg-white border border-gray-300 px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-50 transition shadow-sm"
                     >
                         더 보기 ({visibleCount} / {filteredGroups.length})
                     </button>
                </div>
            )}

            {/* Create Group Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">새 독서모임 만들기</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleCreateGroupSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">대표 이미지</label>
                                <input type="file" ref={groupFileInputRef} onChange={handleGroupImageUpload} className="hidden" accept="image/*" />
                                {newGroupImage ? (
                                    <div className="relative w-full h-48 rounded-md overflow-hidden border border-gray-200 group">
                                        <img src={newGroupImage} alt="Preview" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setNewGroupImage(null)} className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"><X className="w-4 h-4" /></button>
                                    </div>
                                ) : (
                                    <div onClick={() => groupFileInputRef.current?.click()} className="w-full h-48 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition text-gray-400"><Camera className="w-8 h-8 mb-2" /><span className="text-sm font-medium">이미지 업로드</span></div>
                                )}
                            </div>
                            
                            <input required value={newGroupName} onChange={e => setNewGroupName(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" placeholder="모임 이름" />
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">활동 지역</label>
                                <div className="flex gap-2 mb-2">
                                    <button type="button" onClick={() => setNewGroupRegionType('OFFLINE')} className={`flex-1 py-2 text-sm border rounded-md font-bold ${newGroupRegionType === 'OFFLINE' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300'}`}>오프라인</button>
                                    <button type="button" onClick={() => setNewGroupRegionType('ONLINE')} className={`flex-1 py-2 text-sm border rounded-md font-bold ${newGroupRegionType === 'ONLINE' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300'}`}>온라인</button>
                                </div>
                                {newGroupRegionType === 'OFFLINE' && (
                                    <input required value={newGroupRegion} onChange={e => setNewGroupRegion(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" placeholder="상세 지역 (예: 서울 강남구)" />
                                )}
                            </div>

                            <textarea required value={newGroupDesc} onChange={e => setNewGroupDesc(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" placeholder="모임 소개" />
                            
                            <input value={newGroupSchedule} onChange={e => setNewGroupSchedule(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" placeholder="정기 모임 일정 (선택)" />
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">최대 인원 (최대 10명)</label>
                                <input type="number" max={10} min={1} value={newGroupMax} onChange={e => setNewGroupMax(Number(e.target.value))} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                            </div>

                            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 rounded-md hover:bg-primary-700 transition">모임 개설하기</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
