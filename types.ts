
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
  CHAT = 'CHAT',
  READING_GROUPS = 'READING_GROUPS',
  WISHLIST = 'WISHLIST',
  ADMIN = 'ADMIN', // Added
  // Static Pages
  COMPANY = 'COMPANY',
  TERMS = 'TERMS',
  SUPPORT = 'SUPPORT',
  // Banner Pages
  SAFETY_GUIDE = 'SAFETY_GUIDE',
  SELLING_GUIDE = 'SELLING_GUIDE',
  EVENT = 'EVENT'
}

export enum AuthStatus {
  GUEST = 'GUEST',
  LOGGED_IN = 'LOGGED_IN'
}

// ERD: RESELL_STATE (SmallInt) -> Enum Mapping
export type ResellState = 'ON_SALE' | 'RESERVED' | 'SOLD';

// ERD: BOOK + RESELL_BOARD Combined for Frontend Display
export interface Book {
  id: string; // RESELL_BOARD_ID
  type: 'SALE' | 'PURCHASE_REQUEST';
  
  // From TABLE BOOK (Metadata)
  isbn?: string;
  title: string; // Book Title (Original)
  postTitle?: string; // User's Post Title
  author: string;
  publisher?: string;
  pubDate?: string;
  coverImgUrl?: string; // COVER_IMG_URL
  
  // From TABLE RESELL_BOARD
  price: number;
  originalPrice: number;
  condition: 'New' | 'Like New' | 'Good' | 'Fair'; // CONDITION ENUM
  description: string; // CONTENT
  images: string[]; // Usually linked via separate table, using array here
  shippingFee?: number; // 배송비 (0이면 무료배송)
  
  sellerId: string; // MEMBER_ID
  sellerName: string; // NICKNAME (Joined)
  location: string; // Derived from Member Address
  
  views: number; // VIEWS
  resellState: ResellState; // RESELL_STATE
  
  category: string; // CATEGORY_NAME
  createdAt: number; // CREATED_AT
  likes: number; // Count from WISHLIST
}

export interface WishlistItem {
  bookId: string;
  wishPrice: number; 
  isAlertOn: boolean;
}

// ERD: MEMBER Table
export interface User {
  id: string; // MEMBER_ID (Internal UUID)
  username: string; // LOGIN ID
  email: string; // EMAIL
  nickname: string; // NICKNAME
  profileImage?: string; // PROFILE_IMG_URL
  
  // Added fields from ERD
  phoneNumber?: string; // PHONE_NUMBER
  address?: string; // ADDRESS
  zipcode?: string; // ZIPCODE
  birth?: string; // BIRTH
  temperature: number; // TEMPERATURE (매너온도, Default 36.5)
  points: number; // POINT
  
  isVerified: boolean;
  wishlist: WishlistItem[]; 
  groupWishlist: string[]; // Added: List of Reading Group IDs

  // Admin Features
  isAdmin: boolean;
  status: 'ACTIVE' | 'BANNED';
  joinedAt: number;
}

export interface GroupMember {
    id: string;
    nickname: string;
    role: 'OWNER' | 'MEMBER';
    joinedAt: number;
}

// ERD: BOOKCLUB related tables combined
export interface ReadingGroup {
  id: string; // BOOKCLUB_GROUP_ID
  name: string;
  description: string;
  region: string;
  schedule: string;
  currentMembers: number;
  maxMembers: number;
  tags: string[];
  image: string;
  ownerId: string; // LEADER_ID
  ownerName: string;
  members: GroupMember[]; // 가입된 멤버 리스트
  pendingMembers: GroupMember[]; // 가입 대기중인 멤버 리스트
}

export interface AttachedBook {
    title: string;
    author: string;
    image: string;
}

export interface ReadingGroupPost {
  id: string;
  groupId: string;
  title: string; 
  authorId: string;
  authorName: string;
  content: string;
  images?: string[];
  attachedBook?: AttachedBook; 
  likes: number;
  viewCount: number; 
  commentCount: number;
  createdAt: number;
}

export interface ReadingGroupComment {
    id: string;
    postId: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: number;
}

// ERD: ALARM Table
export interface Notification {
  id: string; // ALARM_ID
  type: 'PRICE_DROP' | 'SYSTEM' | 'CHAT' | 'ORDER';
  message: string;
  bookId?: string;
  isRead: boolean;
  timestamp: number;
  discountAmount?: number;
}

// ERD: TOSS_ORDERS & TOSS_ORDERS_PRODUCT
export interface Order {
  orderId: string; // ORDER_ID
  memberId: string; // MEMBER_ID (Buyer)
  bookId: string; // BOOK_ID
  bookTitle: string;
  totalAmount: number;
  status: 'READY' | 'PAID' | 'SHIPPING' | 'COMPLETED' | 'CANCELED';
  createdAt: number;
}

// ERD: CHAT Table
export interface ChatMessage {
  uniqueId: string; // UniqueID
  senderId: string; // SENDER_ID
  receiverId: string; // RECEIVER_ID
  content: string; // CONTENT
  isRead: boolean; // IS_READ
  sendTime: number; // SEND_TIME
}

export interface AuthContextType {
  status: AuthStatus;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// Admin Interfaces
export interface AdminNotice {
    id: string;
    title: string;
    content: string;
    author: string;
    isImportant: boolean;
    createdAt: number;
}

export interface LoginLog {
    id: string;
    userId: string;
    username: string;
    userNickname: string;
    ip: string;
    timestamp: number;
}
