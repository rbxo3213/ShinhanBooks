import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AppView, AuthStatus, User, Book } from './types';
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

const App = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.GUEST);
  const [user, setUser] = useState<User | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize auth from local storage (Simulated)
  useEffect(() => {
    const storedUser = localStorage.getItem('bookMarketUser');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
        setAuthStatus(AuthStatus.LOGGED_IN);
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
      setUser(loggedInUser);
      setAuthStatus(AuthStatus.LOGGED_IN);
      localStorage.setItem('bookMarketUser', JSON.stringify(loggedInUser));
      setView(AppView.HOME);
  };

  const handleLogout = () => {
      setUser(null);
      setAuthStatus(AuthStatus.GUEST);
      localStorage.removeItem('bookMarketUser');
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
          // Ask user choice
          if (confirm('로그인 하시겠습니까? 취소 누르면 비회원으로 진행됩니다.')) {
              setView(AppView.LOGIN);
          } else {
              setView(AppView.GUEST_CHECKOUT);
          }
      }
  };

  return (
    <Layout 
        currentView={view} 
        setView={setView} 
        authStatus={authStatus} 
        user={user}
        onSearch={setSearchQuery}
    >
      {view === AppView.HOME && <Home onBookClick={handleBookClick} searchQuery={searchQuery} />}
      
      {view === AppView.PRODUCT_DETAIL && selectedBook && (
        <ProductDetail 
            book={selectedBook} 
            authStatus={authStatus}
            onBuyClick={handleBuyClick}
            setView={setView}
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
            }}
          />
      )}

      {view === AppView.UPLOAD && <Upload onCancel={() => setView(AppView.HOME)} />}

      {view === AppView.GUEST_CHECKOUT && selectedBook && <GuestCheckout book={selectedBook} setView={setView} />}

      {view === AppView.MEMBER_CHECKOUT && selectedBook && user && <MemberCheckout book={selectedBook} user={user} setView={setView} />}

      {view === AppView.CHAT && <Chat setView={setView} />}
    </Layout>
  );
};

export default App;