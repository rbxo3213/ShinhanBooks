export enum AppView {
  HOME = 'HOME',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  FIND_ACCOUNT = 'FIND_ACCOUNT',
  PROFILE = 'PROFILE',
  UPLOAD = 'UPLOAD',
  GUEST_CHECKOUT = 'GUEST_CHECKOUT',
  MEMBER_CHECKOUT = 'MEMBER_CHECKOUT',
  CHAT = 'CHAT'
}

export enum AuthStatus {
  GUEST = 'GUEST',
  LOGGED_IN = 'LOGGED_IN'
}

export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  isVerified: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  description: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  location: string;
  createdAt: number;
  likes: number;
}

export interface AuthContextType {
  status: AuthStatus;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}