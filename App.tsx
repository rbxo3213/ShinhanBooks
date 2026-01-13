
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AppView, AuthStatus, User, Book, ReadingGroup, Notification, WishlistItem, AdminNotice, LoginLog } from './types';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { ProductDetail } from './views/ProductDetail';
import { Login } from './views/Auth/Login';
import { Signup } from './views/Auth/Signup';
import { FindAccount } from './views/Auth/FindAccount';
import { Profile } from './views/Profile';
import { Upload } from './views/Upload';
import { GuestCheckout } from './views/GuestCheckout';
import { MemberCheckout } from './views/MemberCheckout';
import { Chat } from './views/Chat';
import { ReadingGroups } from './views/ReadingGroups';
import { Wishlist } from './views/Wishlist';
import { AdminDashboard } from './views/Admin/AdminDashboard';
import { Company } from './views/Static/Company';
import { Terms } from './views/Static/Terms';
import { Support } from './views/Static/Support';
import { SafetyGuide } from './views/Static/SafetyGuide';
import { SellingGuide } from './views/Static/SellingGuide';
import { Event } from './views/Static/Event';
import { MOCK_BOOKS, MOCK_READING_GROUPS } from './constants';

const App = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.GUEST);
  const [user, setUser] = useState<User | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [readingGroups, setReadingGroups] = useState<ReadingGroup[]>(MOCK_READING_GROUPS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Admin Data State
  const [adminUsers, setAdminUsers] = useState<User[]>([
      {
        id: 'user-1',
        username: 'user1',
        email: 'user@shinhan.com',
        nickname: '모닝커피',
        isVerified: true,
        wishlist: [],
        groupWishlist: [],
        temperature: 36.5,
        points: 0,
        joinedAt: Date.now() - 10000000,
        status: 'ACTIVE',
        isAdmin: false
    },
    {
        id: 'admin-1',
        username: 'admin',
        email: 'admin@admin.com',
        nickname: '관리자',
        isVerified: true,
        wishlist: [],
        groupWishlist: [],
        temperature: 99.9,
        points: 999999,
        joinedAt: Date.now() - 50000000,
        status: 'ACTIVE',
        isAdmin: true
    }
  ]);
  const [adminNotices, setAdminNotices] = useState<AdminNotice[]>([]);
  const [adminLogs, setAdminLogs] = useState<LoginLog[]>([]);

  // Initialize auth from local storage (Simulated)
  useEffect(() => {
    const storedUser = localStorage.getItem('bookMarketUser');
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Migration support for old data format
        if (parsedUser.wishlist && parsedUser.wishlist.length > 0 && typeof parsedUser.wishlist[0] === 'string') {
            parsedUser.wishlist = []; 
        }
        // Ensure groupWishlist exists
        if (!parsedUser.groupWishlist) {
            parsedUser.groupWishlist = [];
        }
        // Ensure new fields exist
        if (parsedUser.joinedAt === undefined) parsedUser.joinedAt = Date.now();
        if (parsedUser.status === undefined) parsedUser.status = 'ACTIVE';
        if (parsedUser.isAdmin === undefined) parsedUser.isAdmin = false;

        setUser(parsedUser);
        setAuthStatus(AuthStatus.LOGGED_IN);
    }
  }, []);

  // Simulate Price Drops based on Smart Notification Logic
  useEffect(() => {
    if (!user || user.wishlist.length === 0) return;

    // This interval simulates the "Server Event" where a seller updates a price
    const interval = setInterval(() => {
        // 30% chance to trigger a price drop event
        if (Math.random() > 0.7) {
            // Pick a random item from user's wishlist to simulate activity
            const randomWishItemIndex = Math.floor(Math.random() * user.wishlist.length);
            const wishItem = user.wishlist[randomWishItemIndex];
            
            setBooks(prevBooks => {
                const targetBookIndex = prevBooks.findIndex(b => b.id === wishItem.bookId);
                if (targetBookIndex === -1) return prevBooks;

                const targetBook = prevBooks[targetBookIndex];
                
                // Drop price by 5% to 20%
                const discountPercent = Math.floor(Math.random() * 15) + 5; 
                const priceDrop = Math.floor(targetBook.price * (discountPercent / 100));
                const newPrice = targetBook.price - priceDrop;

                // CRITICAL LOGIC: Only notify if new price is LOWER than the price when user wishlisted it (wishPrice)
                if (newPrice < wishItem.wishPrice && wishItem.isAlertOn) {
                    // Create Notification
                    const newNotification: Notification = {
                        id: Date.now().toString(),
                        type: 'PRICE_DROP',
                        message: `'${targetBook.title}' 가격이 찜했을 때보다 ${wishItem.wishPrice - newPrice}원 더 저렴해졌어요!`,
                        bookId: targetBook.id,
                        isRead: false,
                        timestamp: Date.now(),
                        discountAmount: priceDrop
                    };
                    setNotifications(prev => [newNotification, ...prev]);

                    // Update User's Wishlist Price to avoid duplicate alerts for the same drop
                    // (In real backend, this happens in DB)
                    setUser(currentUser => {
                        if (!currentUser) return null;
                        const updatedWishlist = currentUser.wishlist.map((item, idx) => 
                            idx === randomWishItemIndex ? { ...item, wishPrice: newPrice } : item
                        );
                        const updatedUser = { ...currentUser, wishlist: updatedWishlist };
                        localStorage.setItem('bookMarketUser', JSON.stringify(updatedUser));
                        return updatedUser;
                    });
                }

                // Update Book Data
                const newBooks = [...prevBooks];
                newBooks[targetBookIndex] = {
                    ...targetBook,
                    price: newPrice
                };
                return newBooks;
            });
        }
    }, 10000); // Check every 10 seconds for demo

    return () => clearInterval(interval);
  }, [user]);

  const handleLogin = (loggedInUser: User) => {
      // Ensure defaults
      if (!loggedInUser.wishlist) loggedInUser.wishlist = [];
      if (!loggedInUser.groupWishlist) loggedInUser.groupWishlist = [];
      if (loggedInUser.isAdmin === undefined) loggedInUser.isAdmin = false;
      if (loggedInUser.status === undefined) loggedInUser.status = 'ACTIVE';
      if (loggedInUser.joinedAt === undefined) loggedInUser.joinedAt = Date.now();

      setUser(loggedInUser);
      setAuthStatus(AuthStatus.LOGGED_IN);
      localStorage.setItem('bookMarketUser', JSON.stringify(loggedInUser));
      setView(AppView.HOME);
      
      // Add Login Log for Admin
      setAdminLogs(prev => [{
          id: Date.now().toString(),
          userId: loggedInUser.id,
          username: loggedInUser.username,
          userNickname: loggedInUser.nickname,
          ip: '192.168.1.' + Math.floor(Math.random() * 255),
          timestamp: Date.now()
      }, ...prev]);

      // If user is not in adminUsers list, add them (Mock DB Sync)
      setAdminUsers(prev => {
          if (prev.some(u => u.id === loggedInUser.id)) return prev;
          return [...prev, loggedInUser];
      });

      setNotifications(prev => [{
          id: 'welcome-' + Date.now(),
          type: 'SYSTEM',
          message: 'Shinhan Books에 오신 것을 환영합니다!',
          isRead: false,
          timestamp: Date.now()
      }, ...prev]);
  };

  const handleLogout = () => {
      setUser(null);
      setAuthStatus(AuthStatus.GUEST);
      localStorage.removeItem('bookMarketUser');
      setNotifications([]);
      setView(AppView.LOGIN);
  };

  const handleBookClick = (book: Book) => {
      setSelectedBook(book);
      setView(AppView.PRODUCT_DETAIL);
  };

  const handleBuyClick = (book: Book) => {
      setSelectedBook(book);
      if (authStatus === AuthStatus.LOGGED_IN) {
          setView(AppView.MEMBER_CHECKOUT);
      } else {
          if (confirm('로그인 하시겠습니까? 취소 누르면 비회원으로 진행됩니다.')) {
              setView(AppView.LOGIN);
          } else {
              setView(AppView.GUEST_CHECKOUT);
          }
      }
  };

  const handleUpload = (newBook: Book) => {
      setBooks(prev => [newBook, ...prev]);
      alert('상품이 성공적으로 등록되었습니다!');
      setView(AppView.HOME);
  };

  const handleCreateGroup = (newGroup: ReadingGroup) => {
      setReadingGroups(prev => [newGroup, ...prev]);
  };

  const handleToggleWishlist = (bookId: string) => {
      if (!user) {
          if (confirm('찜하기 기능은 로그인이 필요합니다. 로그인 하시겠습니까?')) {
              setView(AppView.LOGIN);
          }
          return;
      }

      const book = books.find(b => b.id === bookId);
      if (!book) return;

      const isWishlisted = user.wishlist.some(w => w.bookId === bookId);
      let updatedWishlist: WishlistItem[];
      
      if (isWishlisted) {
          updatedWishlist = user.wishlist.filter(w => w.bookId !== bookId);
      } else {
          updatedWishlist = [...user.wishlist, { bookId: bookId, wishPrice: book.price, isAlertOn: true }];
      }
      
      const updatedUser = { ...user, wishlist: updatedWishlist };
      setUser(updatedUser);
      localStorage.setItem('bookMarketUser', JSON.stringify(updatedUser));
  };

  const handleToggleGroupWishlist = (groupId: string) => {
      if (!user) {
          if (confirm('로그인이 필요합니다. 로그인 하시겠습니까?')) setView(AppView.LOGIN);
          return;
      }

      const isWishlisted = user.groupWishlist?.includes(groupId);
      let newGroupWishlist = user.groupWishlist || [];

      if (isWishlisted) {
          newGroupWishlist = newGroupWishlist.filter(id => id !== groupId);
      } else {
          newGroupWishlist = [...newGroupWishlist, groupId];
      }

      const updatedUser = { ...user, groupWishlist: newGroupWishlist };
      setUser(updatedUser);
      localStorage.setItem('bookMarketUser', JSON.stringify(updatedUser));
  };

  const handleNotificationClick = (notification: Notification) => {
      setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
      
      if (notification.bookId) {
          const book = books.find(b => b.id === notification.bookId);
          if (book) {
              setSelectedBook(book);
              setView(AppView.PRODUCT_DETAIL);
          }
      }
  };

  const handleMarkAllRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleAddNotification = (msg: string) => {
      setNotifications(prev => [{
          id: 'sys-' + Date.now(),
          type: 'SYSTEM',
          message: msg,
          isRead: false,
          timestamp: Date.now()
      }, ...prev]);
  };
  
  // Admin Handlers
  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
      setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
      // Update current user if matches
      if (user && user.id === userId) {
          const updatedUser = { ...user, ...updates };
          setUser(updatedUser);
          localStorage.setItem('bookMarketUser', JSON.stringify(updatedUser));
      }
  };

  const handleDeleteUser = (userId: string) => {
      setAdminUsers(prev => prev.filter(u => u.id !== userId));
      if (user && user.id === userId) handleLogout();
  };

  const handleCreateNotice = (notice: Omit<AdminNotice, 'id' | 'createdAt'>) => {
      setAdminNotices(prev => [{ ...notice, id: Date.now().toString(), createdAt: Date.now() }, ...prev]);
  };

  const handleDeleteNotice = (noticeId: string) => {
      setAdminNotices(prev => prev.filter(n => n.id !== noticeId));
  };

  const handleUpdateBook = (bookId: string, updates: Partial<Book>) => {
      setBooks(prev => prev.map(b => b.id === bookId ? { ...b, ...updates } : b));
  };

  const handleDeleteBook = (bookId: string) => {
      setBooks(prev => prev.filter(b => b.id !== bookId));
  };

  const handleDeleteGroup = (groupId: string) => {
      setReadingGroups(prev => prev.filter(g => g.id !== groupId));
  };

  return (
    <Layout 
        currentView={view} 
        setView={setView} 
        authStatus={authStatus} 
        user={user}
        onSearch={setSearchQuery}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onMarkAllRead={handleMarkAllRead}
    >
      {view === AppView.HOME && (
        <Home 
            books={books} 
            onBookClick={handleBookClick} 
            searchQuery={searchQuery} 
            onSearch={setSearchQuery}
            user={user}
            onToggleWishlist={handleToggleWishlist}
            setView={setView}
        />
      )}
      
      {view === AppView.PRODUCT_DETAIL && selectedBook && (
        <ProductDetail 
            book={selectedBook} 
            authStatus={authStatus}
            onBuyClick={handleBuyClick}
            setView={setView}
            user={user}
            onToggleWishlist={handleToggleWishlist}
        />
      )}

      {view === AppView.LOGIN && <Login setView={setView} onLogin={handleLogin} />}
      
      {view === AppView.SIGNUP && <Signup setView={setView} onSignup={handleLogin} />}
      
      {view === AppView.FIND_ACCOUNT && <FindAccount setView={setView} />}
      
      {view === AppView.PROFILE && user && (
          <Profile 
            user={user} 
            onLogout={handleLogout} 
            setView={setView}
            onUpdate={(updated) => {
                const newUser = { ...user, ...updated };
                setUser(newUser);
                localStorage.setItem('bookMarketUser', JSON.stringify(newUser));
                // Sync with admin list
                setAdminUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...updated } : u));
            }}
          />
      )}

      {view === AppView.UPLOAD && (
          <Upload 
            onCancel={() => setView(AppView.HOME)} 
            onUpload={handleUpload}
            currentUser={user}
          />
      )}

      {view === AppView.READING_GROUPS && (
          <ReadingGroups 
            groups={readingGroups}
            currentUser={user}
            onCreateGroup={handleCreateGroup}
            onToggleWishlist={handleToggleGroupWishlist}
            setView={setView}
            onAddNotification={handleAddNotification}
          />
      )}

      {view === AppView.WISHLIST && user && (
          <Wishlist 
            books={books}
            user={user}
            onBookClick={handleBookClick}
            onToggleWishlist={handleToggleWishlist}
            setView={setView}
          />
      )}
      
      {view === AppView.ADMIN && user?.isAdmin && (
          <AdminDashboard 
              users={adminUsers}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              notices={adminNotices}
              onCreateNotice={handleCreateNotice}
              onDeleteNotice={handleDeleteNotice}
              loginLogs={adminLogs}
              books={books}
              onUpdateBook={handleUpdateBook}
              onDeleteBook={handleDeleteBook}
              groups={readingGroups}
              onDeleteGroup={handleDeleteGroup}
          />
      )}

      {view === AppView.GUEST_CHECKOUT && selectedBook && <GuestCheckout book={selectedBook} setView={setView} />}

      {view === AppView.MEMBER_CHECKOUT && selectedBook && user && <MemberCheckout book={selectedBook} user={user} setView={setView} />}

      {view === AppView.CHAT && (
          <Chat 
            setView={setView} 
            onCheckout={(book) => {
                setSelectedBook(book);
                setView(AppView.MEMBER_CHECKOUT);
            }}
          />
      )}

      {/* Static Pages */}
      {view === AppView.COMPANY && <Company />}
      {view === AppView.TERMS && <Terms />}
      {view === AppView.SUPPORT && <Support />}
      
      {/* Banner Pages */}
      {view === AppView.SAFETY_GUIDE && <SafetyGuide setView={setView} />}
      {view === AppView.SELLING_GUIDE && <SellingGuide setView={setView} />}
      {view === AppView.EVENT && <Event setView={setView} />}
    </Layout>
  );
};

export default App;
