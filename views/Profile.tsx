
import React, { useState, useEffect } from 'react';
import { User, AppView, Book, ReadingGroup } from '../types';
import { MOCK_BOOKS, MOCK_READING_GROUPS } from '../constants';
import { EmailVerification } from './Auth/EmailVerification';
import { LogOut, Trash2, Edit2, MapPin, Package, ShoppingBag, Heart, Users, User as UserIcon, Plus, X, MoreVertical, Check, Truck } from 'lucide-react';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onUpdate: (user: Partial<User>) => void;
  setView: (view: AppView) => void;
}

// Internal Types for Profile
type ProfileTab = 'INFO' | 'PURCHASES' | 'SALES' | 'WISHLIST' | 'GROUPS' | 'ADDRESSES';

interface Address {
    id: string;
    name: string; // e.g., 우리집, 회사
    recipient: string;
    phone: string;
    address: string;
    detailAddress: string;
    isDefault: boolean;
}

// Mock Data for Demo
const MOCK_ORDERS = [
    { id: 'ord_1', bookTitle: '트렌드 코리아 2025', price: 20000, date: '2024.05.20', status: '배송중', image: MOCK_BOOKS[10].images[0] },
    { id: 'ord_2', bookTitle: '돈의 속성', price: 17800, date: '2024.04.15', status: '구매확정', image: MOCK_BOOKS[6].images[0] }
];

const MOCK_SALES = [
    { id: 'sale_1', bookTitle: '클린 코드', price: 25000, date: '2024.05.01', status: '판매완료', image: MOCK_BOOKS[0].images[0] },
    { id: 'sale_2', bookTitle: '해리포터와 마법사의 돌', price: 12000, date: '2024.05.18', status: '예약중', image: MOCK_BOOKS[4].images[0] }
];

export const Profile: React.FC<ProfileProps> = ({ user, onLogout, onUpdate, setView }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('INFO');
  
  // --- Tab 1: Info & Edit State ---
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState(user.nickname);
  const [editEmail, setEditEmail] = useState(user.email);
  const [isEmailVerified, setIsEmailVerified] = useState(true);

  // --- Tab 6: Address Book State ---
  const [addresses, setAddresses] = useState<Address[]>([
      { id: '1', name: '우리집', recipient: user.nickname, phone: user.phoneNumber || '010-0000-0000', address: user.address || '서울 중구 세종대로 9길 20', detailAddress: '신한은행 본점', isDefault: true }
  ]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState<Omit<Address, 'id' | 'isDefault'>>({ name: '', recipient: '', phone: '', address: '', detailAddress: '' });

  // Filter Data for Wishlist & Groups
  const wishlistBooks = MOCK_BOOKS.filter(book => user.wishlist?.some(w => w.bookId === book.id));
  
  // My Created Groups
  const myCreatedGroups = MOCK_READING_GROUPS.filter(g => g.ownerId === user.id);
  // Joined Groups (where user is member but not owner)
  const myJoinedGroups = MOCK_READING_GROUPS.filter(g => g.ownerId !== user.id && g.members.some(m => m.id === user.id));
  // Wishlisted Groups
  const myWishlistGroups = MOCK_READING_GROUPS.filter(g => user.groupWishlist?.includes(g.id));

  // --- Handlers: Profile Info ---
  const handleSaveProfile = () => {
    if (editEmail !== user.email && !isEmailVerified) {
        alert('변경된 이메일 인증이 필요합니다.');
        return;
    }
    onUpdate({ nickname: editNickname, email: editEmail });
    setIsEditing(false);
    alert('프로필이 수정되었습니다.');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditEmail(e.target.value);
    setIsEmailVerified(e.target.value === user.email);
  };

  const handleDeleteAccount = () => {
      if(confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
          onLogout();
          alert('탈퇴가 완료되었습니다.');
      }
  };

  // --- Handlers: Address Book ---
  const handleAddressSearch = () => {
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
              setAddrForm(prev => ({ ...prev, address: fullAddress }));
          }
      }).open();
  };

  const handleSaveAddress = () => {
      if (!addrForm.name || !addrForm.recipient || !addrForm.address || !addrForm.phone) {
          alert('필수 정보를 모두 입력해주세요.');
          return;
      }

      if (editingAddressId) {
          setAddresses(prev => prev.map(addr => addr.id === editingAddressId ? { ...addr, ...addrForm } : addr));
      } else {
          const newAddr: Address = {
              id: Date.now().toString(),
              ...addrForm,
              isDefault: addresses.length === 0
          };
          setAddresses(prev => [...prev, newAddr]);
      }
      closeAddressModal();
  };

  const deleteAddress = (address: Address) => {
      if (address.isDefault) {
          alert('기본 배송지는 삭제할 수 없습니다. 다른 배송지를 기본으로 설정한 후 삭제해주세요.');
          return;
      }
      if (confirm('삭제하시겠습니까?')) {
          setAddresses(prev => prev.filter(a => a.id !== address.id));
      }
  };

  const setDefaultAddress = (id: string) => {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const openAddressModal = (address?: Address) => {
      if (address) {
          setEditingAddressId(address.id);
          setAddrForm({
              name: address.name, recipient: address.recipient,
              phone: address.phone, address: address.address, detailAddress: address.detailAddress
          });
      } else {
          setEditingAddressId(null);
          setAddrForm({ name: '', recipient: '', phone: '', address: '', detailAddress: '' });
      }
      setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => {
      setIsAddressModalOpen(false);
      setEditingAddressId(null);
  };

  // --- Render Contents ---
  const renderContent = () => {
      switch (activeTab) {
          case 'INFO':
              return (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
                      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                          <h2 className="text-xl font-bold text-gray-900">내 프로필</h2>
                          {!isEditing && (
                              <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200 transition">
                                  <Edit2 className="w-3.5 h-3.5" /> 수정하기
                              </button>
                          )}
                      </div>

                      {isEditing ? (
                          <div className="max-w-md space-y-5">
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-1.5">닉네임</label>
                                  <input value={editNickname} onChange={(e) => setEditNickname(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-sm outline-none focus:border-primary-500 text-sm" />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-1.5">이메일</label>
                                  <input value={editEmail} onChange={handleEmailChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-sm outline-none focus:border-primary-500 text-sm" />
                              </div>
                              {!isEmailVerified && <EmailVerification email={editEmail} isVerified={isEmailVerified} onVerified={() => setIsEmailVerified(true)} />}
                              
                              <div className="flex gap-2 pt-2">
                                  <button onClick={() => setIsEditing(false)} className="flex-1 py-2.5 border border-gray-300 rounded-sm text-sm font-bold text-gray-600 hover:bg-gray-50">취소</button>
                                  <button onClick={handleSaveProfile} className="flex-1 py-2.5 bg-primary-600 text-white rounded-sm text-sm font-bold hover:bg-primary-700">저장</button>
                              </div>
                          </div>
                      ) : (
                          <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div><span className="text-xs font-bold text-gray-400 block mb-1">닉네임</span><span className="text-gray-900 font-medium">{user.nickname}</span></div>
                                  <div><span className="text-xs font-bold text-gray-400 block mb-1">이메일</span><span className="text-gray-900 font-medium">{user.email}</span></div>
                                  <div><span className="text-xs font-bold text-gray-400 block mb-1">휴대폰 번호</span><span className="text-gray-900 font-medium">{user.phoneNumber || '미등록'}</span></div>
                              </div>
                              
                              <div className="pt-8 mt-8 border-t border-gray-100">
                                  <h3 className="text-sm font-bold text-red-600 mb-2">계정 관리</h3>
                                  <button onClick={handleDeleteAccount} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 hover:underline">
                                      <Trash2 className="w-3.5 h-3.5" /> 회원 탈퇴
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>
              );

          case 'PURCHASES':
              return (
                  <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">구매 내역</h2>
                      {MOCK_ORDERS.map(order => (
                          <div key={order.id} className="bg-white p-5 rounded-lg border border-gray-200 flex gap-4 items-center">
                              <img src={order.image} alt="" className="w-16 h-20 object-cover rounded bg-gray-100 border border-gray-100" />
                              <div className="flex-1">
                                  <div className="flex justify-between mb-1">
                                      <span className="text-xs font-bold text-gray-500">{order.date}</span>
                                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${order.status === '구매확정' ? 'bg-gray-100 text-gray-600' : 'bg-primary-50 text-primary-600'}`}>{order.status}</span>
                                  </div>
                                  <h3 className="font-bold text-gray-900 mb-1">{order.bookTitle}</h3>
                                  <p className="text-sm text-gray-700">{order.price.toLocaleString()}원</p>
                              </div>
                              {order.status === '배송중' && (
                                  <button className="text-xs bg-primary-600 text-white px-3 py-2 rounded font-bold hover:bg-primary-700">구매확정</button>
                              )}
                          </div>
                      ))}
                  </div>
              );

          case 'SALES':
              return (
                  <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">판매 내역</h2>
                      {MOCK_SALES.map(sale => (
                          <div key={sale.id} className="bg-white p-5 rounded-lg border border-gray-200 flex gap-4 items-center">
                              <img src={sale.image} alt="" className="w-16 h-20 object-cover rounded bg-gray-100 border border-gray-100" />
                              <div className="flex-1">
                                  <div className="flex justify-between mb-1">
                                      <span className="text-xs font-bold text-gray-500">{sale.date}</span>
                                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${sale.status === '판매완료' ? 'bg-gray-800 text-white' : 'bg-orange-50 text-orange-600'}`}>{sale.status}</span>
                                  </div>
                                  <h3 className="font-bold text-gray-900 mb-1">{sale.bookTitle}</h3>
                                  <p className="text-sm text-gray-700">{sale.price.toLocaleString()}원</p>
                              </div>
                              <button className="text-xs border border-gray-300 px-3 py-2 rounded font-bold hover:bg-gray-50">상세보기</button>
                          </div>
                      ))}
                  </div>
              );

          case 'WISHLIST':
              return (
                  <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-6">찜한 상품</h2>
                      {wishlistBooks.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {wishlistBooks.map(book => (
                                  <div key={book.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden group cursor-pointer" onClick={() => {}}>
                                      <div className="aspect-[1/1.2] bg-gray-100 relative">
                                          <img src={book.images[0]} alt="" className="w-full h-full object-cover" />
                                          <div className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm text-red-500"><Heart className="w-3 h-3 fill-current"/></div>
                                      </div>
                                      <div className="p-3">
                                          <h3 className="font-bold text-sm text-gray-900 truncate mb-1">{book.title}</h3>
                                          <p className="text-sm text-gray-700">{book.price.toLocaleString()}원</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="text-center py-12 bg-white border border-gray-200 border-dashed rounded-lg text-gray-500 text-sm">찜한 상품이 없습니다.</div>
                      )}
                  </div>
              );

          case 'GROUPS':
              return (
                  <div className="space-y-10">
                      {/* 1. Created Groups */}
                      <div>
                          <h2 className="text-xl font-bold text-gray-900 mb-4">내가 만든 모임</h2>
                          {myCreatedGroups.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {myCreatedGroups.map(group => (
                                    <div key={group.id} className="bg-white border border-primary-200 rounded-lg p-4 flex gap-4 hover:shadow-md transition cursor-pointer relative bg-primary-50/30">
                                        <img src={group.image} alt="" className="w-16 h-16 rounded-md object-cover" />
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm mb-1">{group.name}</h3>
                                            <p className="text-xs text-gray-500 mb-2">{group.region} · 매주 {group.schedule?.split(' ')[1] || '일정 협의'}</p>
                                            <span className="bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded font-bold">모임장</span>
                                        </div>
                                    </div>
                                ))}
                                <div onClick={() => setView(AppView.READING_GROUPS)} className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition cursor-pointer h-24">
                                    <Plus className="w-6 h-6 mb-1" />
                                    <span className="text-xs font-bold">새 모임 만들기</span>
                                </div>
                              </div>
                          ) : (
                              <div className="text-center py-8 bg-gray-50 border border-gray-100 rounded-lg text-gray-400 text-sm mb-4">
                                  만든 모임이 없습니다.
                                  <button onClick={() => setView(AppView.READING_GROUPS)} className="text-primary-600 font-bold ml-2 hover:underline">모임 만들기</button>
                              </div>
                          )}
                      </div>

                      {/* 2. Joined Groups */}
                      <div>
                          <h2 className="text-xl font-bold text-gray-900 mb-4">가입한 모임</h2>
                          {myJoinedGroups.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {myJoinedGroups.map(group => (
                                    <div key={group.id} className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4 hover:shadow-md transition cursor-pointer">
                                        <img src={group.image} alt="" className="w-16 h-16 rounded-md object-cover" />
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm mb-1">{group.name}</h3>
                                            <p className="text-xs text-gray-500 mb-2">{group.region} · 매주 {group.schedule?.split(' ')[1] || '일정 협의'}</p>
                                            <span className="bg-primary-50 text-primary-600 text-[10px] px-2 py-0.5 rounded font-bold">참여중</span>
                                        </div>
                                    </div>
                                ))}
                                <div onClick={() => setView(AppView.READING_GROUPS)} className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition cursor-pointer h-24">
                                    <Plus className="w-6 h-6 mb-1" />
                                    <span className="text-xs font-bold">새 모임 찾기</span>
                                </div>
                              </div>
                          ) : (
                              <div className="text-center py-8 bg-gray-50 border border-gray-100 rounded-lg text-gray-400 text-sm">
                                  가입한 모임이 없습니다.
                              </div>
                          )}
                      </div>

                      {/* 3. Wishlisted Groups */}
                      <div>
                          <h2 className="text-xl font-bold text-gray-900 mb-4">찜한 모임</h2>
                          {myWishlistGroups.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {myWishlistGroups.map(group => (
                                        <div key={group.id} className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4 hover:shadow-md transition cursor-pointer relative">
                                            <img src={group.image} alt="" className="w-16 h-16 rounded-md object-cover" />
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm mb-1">{group.name}</h3>
                                                <p className="text-xs text-gray-500 mb-2">{group.region} · 매주 {group.schedule?.split(' ')[1] || '일정 협의'}</p>
                                            </div>
                                            <div className="absolute top-4 right-4 text-red-500">
                                                <Heart className="w-4 h-4 fill-current"/>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                          ) : (
                                <div className="text-center py-8 bg-gray-50 border border-gray-100 rounded-lg text-gray-400 text-sm">
                                    찜한 모임이 없습니다.
                                </div>
                          )}
                      </div>
                  </div>
              );

          case 'ADDRESSES':
              return (
                  <div>
                      <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-bold text-gray-900">배송지 관리</h2>
                          <button onClick={() => openAddressModal()} className="text-xs bg-gray-900 text-white px-3 py-2 rounded font-bold hover:bg-gray-800 flex items-center gap-1">
                              <Plus className="w-3.5 h-3.5" /> 새 배송지 추가
                          </button>
                      </div>
                      <div className="space-y-4">
                          {addresses.map(addr => (
                              <div key={addr.id} className={`p-5 rounded-lg border ${addr.isDefault ? 'border-primary-500 bg-primary-50/10' : 'border-gray-200 bg-white'}`}>
                                  <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center gap-2">
                                          <span className="font-bold text-gray-900">{addr.name}</span>
                                          {addr.isDefault && <span className="text-[10px] bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded font-bold">기본</span>}
                                      </div>
                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                          <button onClick={() => openAddressModal(addr)} className="hover:text-gray-900 hover:underline">수정</button>
                                          <span className="text-gray-300">|</span>
                                          <button onClick={() => deleteAddress(addr)} className="hover:text-red-600 hover:underline">삭제</button>
                                      </div>
                                  </div>
                                  <p className="text-sm text-gray-800 mb-1">{addr.address} {addr.detailAddress}</p>
                                  <p className="text-xs text-gray-500 mb-3">{addr.recipient} · {addr.phone}</p>
                                  {!addr.isDefault && (
                                      <button onClick={() => setDefaultAddress(addr.id)} className="text-xs border border-gray-300 px-2 py-1 rounded hover:bg-gray-50 transition">
                                          기본 배송지로 설정
                                      </button>
                                  )}
                              </div>
                          ))}
                      </div>

                      {/* Address Modal Overlay */}
                      {isAddressModalOpen && (
                          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                                  <div className="flex justify-between items-center mb-6">
                                      <h3 className="text-lg font-bold">{editingAddressId ? '배송지 수정' : '새 배송지 추가'}</h3>
                                      <button onClick={closeAddressModal}><X className="w-5 h-5 text-gray-400" /></button>
                                  </div>
                                  <div className="space-y-4">
                                      <div>
                                          <label className="block text-xs font-bold text-gray-600 mb-1">배송지명</label>
                                          <input value={addrForm.name} onChange={e => setAddrForm({...addrForm, name: e.target.value})} placeholder="예: 우리집, 회사" className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-primary-500" />
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                          <div>
                                              <label className="block text-xs font-bold text-gray-600 mb-1">받는 사람</label>
                                              <input value={addrForm.recipient} onChange={e => setAddrForm({...addrForm, recipient: e.target.value})} className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-primary-500" />
                                          </div>
                                          <div>
                                              <label className="block text-xs font-bold text-gray-600 mb-1">연락처</label>
                                              <input value={addrForm.phone} onChange={e => setAddrForm({...addrForm, phone: e.target.value})} placeholder="010-0000-0000" className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-primary-500" />
                                          </div>
                                      </div>
                                      <div>
                                          <label className="block text-xs font-bold text-gray-600 mb-1">주소</label>
                                          <div className="flex gap-2 mb-2">
                                              <input 
                                                value={addrForm.address} 
                                                onChange={e => setAddrForm({...addrForm, address: e.target.value})}
                                                placeholder="주소 검색 또는 직접 입력" 
                                                className="flex-1 border border-gray-300 rounded p-2.5 text-sm bg-white outline-none focus:border-primary-500" 
                                              />
                                              <button onClick={handleAddressSearch} className="bg-gray-800 text-white text-xs px-3 rounded font-bold whitespace-nowrap hover:bg-gray-900">검색</button>
                                          </div>
                                          <input value={addrForm.detailAddress} onChange={e => setAddrForm({...addrForm, detailAddress: e.target.value})} placeholder="상세 주소 입력" className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-primary-500" />
                                      </div>
                                      <button onClick={handleSaveAddress} className="w-full bg-primary-600 text-white py-3 rounded font-bold text-sm hover:bg-primary-700 mt-4">저장하기</button>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              );
      }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto py-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden sticky top-24">
                <div className="p-6 text-center border-b border-gray-100 bg-gray-50/50">
                    <div className="w-20 h-20 bg-white border-2 border-primary-100 rounded-full flex items-center justify-center text-3xl font-bold text-primary-600 mx-auto mb-3 shadow-sm">
                        {user.nickname[0]}
                    </div>
                    <h2 className="font-bold text-gray-900 text-lg">{user.nickname}님</h2>
                    <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <nav className="p-2">
                    {[
                        { id: 'INFO', label: '내 프로필', icon: UserIcon },
                        { id: 'PURCHASES', label: '구매 내역', icon: ShoppingBag },
                        { id: 'SALES', label: '판매 내역', icon: Package },
                        { id: 'WISHLIST', label: '찜한 상품', icon: Heart },
                        { id: 'GROUPS', label: '내 모임', icon: Users },
                        { id: 'ADDRESSES', label: '배송지 관리', icon: MapPin },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as ProfileTab)}
                            className={`w-full text-left px-4 py-3 rounded-md text-sm font-bold flex items-center gap-3 transition-all mb-1 ${activeTab === item.id ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-primary-600' : 'text-gray-400'}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-red-600 py-2 transition">
                        <LogOut className="w-3.5 h-3.5" /> 로그아웃
                    </button>
                </div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:flex-1 min-h-[500px]">
            {renderContent()}
        </div>
    </div>
  );
};
