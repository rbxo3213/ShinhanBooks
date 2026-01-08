
import { Book, ReadingGroup, ReadingGroupPost, ReadingGroupComment, ResellState, GroupMember } from './types';

const TITLES = [
    '클린 코드 (Clean Code)', '위대한 개츠비', '알고리즘 개론', '사피엔스', '해리포터와 마법사의 돌',
    '총 균 쇠', '돈의 속성', '파친코', '코스모스', '미움받을 용기',
    '트렌드 코리아 2025', '불편한 편의점', '달러구트 꿈 백화점', '역행자', '세이노의 가르침',
    '도둑맞은 집중력', '물고기는 존재하지 않는다', '아몬드', '인간 실격', '데미안'
];

const AUTHORS = [
    '로버트 C. 마틴', 'F. 스콧 피츠제럴드', 'Thomas H. Cormen', '유발 하라리', 'J.K. 롤링',
    '재레드 다이아몬드', '김승호', '이민진', '칼 세이건', '기시미 이치로',
    '김난도', '김호연', '이미예', '자청', '세이노',
    '요한 하리', '룰루 밀러', '손원평', '다자이 오사무', '헤르만 헤세'
];

const PUBLISHERS = [
    '인사이트', '민음사', '한빛미디어', '김영사', '문학동네',
    '문학사상', '스노우폭스북스', '인플루엔셜', '사이언스북스', '인플루엔셜',
    '미래의창', '나무옆의자', '팩토리나인', '웅진지식하우스', '데이원',
    '어크로스', '곰출판', '창비', '민음사', '민음사'
];

const POST_PREFIXES = [
    '급처합니다', '상태 최상급', '한번 읽은 책', '이사가서 팝니다', '깨끗해요',
    '밑줄 조금 있어요', '택포 가격', '직거래 선호', '선물받은 책', '거의 새것'
];

export const CATEGORIES = [
    '소설/문학',
    '경영/경제',
    '인문/사회',
    '자기계발',
    '과학/IT',
    '예술/대중문화',
    '학습/참고서',
    '만화',
    '기타'
];

const LOCATIONS = ['서울 강남구', '서울 마포구', '부산 해운대구', '대구 수성구', '경기 성남시', '인천 연수구', '대전 유성구', '광주 동구', '서울 서초구', '경기 수원시'];
const SELLERS = ['개발왕김코딩', '책벌레99', '컴공학생', '역사덕후', '마법사', '부자될거야', '드라마광', '우주먼지', '심리학도', '독서왕'];
const CONDITIONS: ('New' | 'Like New' | 'Good' | 'Fair')[] = ['New', 'Like New', 'Good', 'Fair'];

// Function to generate many mock items
const generateMockBooks = (count: number): Book[] => {
    return Array.from({ length: count }).map((_, index) => {
        const titleIndex = index % TITLES.length;
        const randomPrice = Math.floor(Math.random() * 30000) + 5000;
        
        let category = CATEGORIES[8];
        if ([0, 2].includes(titleIndex)) category = '과학/IT';
        else if ([1, 4, 7, 11, 12, 17, 18, 19].includes(titleIndex)) category = '소설/문학';
        else if ([6, 10, 13, 14].includes(titleIndex)) category = '경영/경제';
        else if ([3, 5, 8, 9, 15, 16].includes(titleIndex)) category = '인문/사회';

        let resellState: ResellState = 'ON_SALE';
        if (Math.random() > 0.9) resellState = 'SOLD';
        else if (Math.random() > 0.85) resellState = 'RESERVED';

        const prefix = POST_PREFIXES[index % POST_PREFIXES.length];
        const imageSeed = index + 1;
        const images = [
            `https://picsum.photos/400/600?random=${imageSeed}`,
            `https://picsum.photos/400/600?random=${imageSeed + 1000}`,
            `https://picsum.photos/400/600?random=${imageSeed + 2000}`
        ];

        return {
            id: `mock-${index + 1}`,
            type: 'SALE',
            title: TITLES[titleIndex],
            postTitle: `${prefix} ${TITLES[titleIndex]} 팝니다`,
            author: AUTHORS[titleIndex],
            publisher: PUBLISHERS[titleIndex % PUBLISHERS.length],
            category: category,
            price: randomPrice - (randomPrice % 100),
            originalPrice: randomPrice + 5000 + Math.floor(Math.random() * 10000),
            condition: CONDITIONS[index % CONDITIONS.length],
            description: `구매한지 얼마 안 된 ${TITLES[titleIndex]} 책입니다. 상태 매우 양호하며 직거래, 택배 거래 모두 가능합니다. 쿨거래 시 네고 가능합니다.`,
            images: images,
            sellerId: `user-${index % SELLERS.length}`,
            sellerName: SELLERS[index % SELLERS.length],
            location: LOCATIONS[index % LOCATIONS.length],
            createdAt: Date.now() - Math.floor(Math.random() * 1000000000),
            likes: Math.floor(Math.random() * 50),
            views: Math.floor(Math.random() * 300),
            resellState: resellState,
            isbn: `978-0000000${index}`
        };
    });
};

export const MOCK_BOOKS: Book[] = generateMockBooks(100);

// --- SCENARIO DATA SETUP ---
// User 1 is the logged in user for our demo.
const CURRENT_USER_ID = 'user-1'; 
const CURRENT_USER_NAME = '모닝커피'; // Matches Login mock

// Helper to create members
const createMember = (id: string, name: string, role: 'OWNER' | 'MEMBER' = 'MEMBER'): GroupMember => ({
    id, nickname: name, role, joinedAt: Date.now()
});

const generateMockGroups = (count: number): ReadingGroup[] => {
    const randomGroups = Array.from({ length: count }).map((_, index) => {
        const isOnline = Math.random() > 0.7;
        return {
            id: `group-gen-${index + 6}`,
            name: `랜덤 독서모임 ${index + 1}`,
            description: `함께 책을 읽는 모임입니다.`,
            region: isOnline ? '온라인' : LOCATIONS[index % LOCATIONS.length],
            schedule: `매주 주말`,
            currentMembers: Math.floor(Math.random() * 8) + 1,
            maxMembers: 10,
            tags: ['독서', '친목'],
            image: `https://picsum.photos/400/300?random=${index + 500}`,
            ownerId: `user-${index + 10}`,
            ownerName: `User${index + 10}`,
            members: [createMember(`user-${index + 10}`, `User${index + 10}`, 'OWNER')],
            pendingMembers: []
        };
    });

    // Specific Scenario Groups
    const scenarios: ReadingGroup[] = [
        {   // 1. Owner View (강남구)
            id: 'group-1',
            name: '강남구 주말 아침 독서',
            description: '매주 토요일 아침 9시, 스타벅스에서 각자 읽은 책을 나누는 모임입니다. 부담 없이 참여하세요!',
            region: '서울 강남구',
            schedule: '매주 토요일 오전 9시',
            currentMembers: 5,
            maxMembers: 8,
            tags: ['자기계발', '아침독서', '직장인'],
            image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=400',
            ownerId: CURRENT_USER_ID,
            ownerName: CURRENT_USER_NAME,
            members: [
                createMember(CURRENT_USER_ID, CURRENT_USER_NAME, 'OWNER'),
                createMember('user-99', '책읽는고양이'),
                createMember('user-98', '북마스터'),
                createMember('user-97', '독서왕'),
                createMember('user-96', '아침형인간')
            ],
            pendingMembers: [createMember('user-new1', '가입희망자1'), createMember('user-new2', '가입희망자2')]
        },
        {   // 2. Member View (SF소설)
            id: 'group-2',
            name: 'SF 소설 탐독회',
            description: '공상과학 소설을 사랑하는 사람들의 모임입니다. 이번 달은 테드 창의 작품을 다룹니다.',
            region: '서울 마포구',
            schedule: '격주 수요일 저녁 7시',
            currentMembers: 3,
            maxMembers: 6,
            tags: ['소설', 'SF', '토론'],
            image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400',
            ownerId: 'user-2',
            ownerName: '우주여행자',
            members: [
                createMember('user-2', '우주여행자', 'OWNER'),
                createMember(CURRENT_USER_ID, CURRENT_USER_NAME), // User is member
                createMember('user-88', '외계인')
            ],
            pendingMembers: []
        },
        {   // 3. Owner View (재테크)
            id: 'group-3',
            name: '재테크 경제 서적 뽀개기',
            description: '혼자 읽기 힘든 경제 서적을 같이 읽고 스터디합니다. 부의 추월차선 함께 타요.',
            region: '온라인 (Zoom)',
            schedule: '매주 일요일 밤 9시',
            currentMembers: 4,
            maxMembers: 20,
            tags: ['경제', '재테크', '스터디'],
            image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=400',
            ownerId: CURRENT_USER_ID,
            ownerName: CURRENT_USER_NAME,
            members: [createMember(CURRENT_USER_ID, CURRENT_USER_NAME, 'OWNER'), createMember('user-77', '부자될거야'), createMember('user-76', '주식왕'), createMember('user-75', '부동산고수')],
            pendingMembers: []
        },
        {   // 4. Member View (판교 IT)
            id: 'group-4',
            name: '판교 IT 개발 서적 스터디',
            description: '클린 코드, 리팩토링 등 개발 필독서를 함께 읽고 코드 리뷰도 진행합니다.',
            region: '경기 성남시',
            schedule: '매주 목요일 저녁 8시',
            currentMembers: 4,
            maxMembers: 6,
            tags: ['IT', '개발자', '전공서적'],
            image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=400',
            ownerId: 'user-4',
            ownerName: '코딩왕',
            members: [createMember('user-4', '코딩왕', 'OWNER'), createMember(CURRENT_USER_ID, CURRENT_USER_NAME), createMember('user-66', '버그헌터'), createMember('user-65', '풀스택')],
            pendingMembers: []
        },
        {   // 5. Guest View (홍대 인문학)
            id: 'group-5',
            name: '홍대 인문학 살롱',
            description: '철학, 역사, 예술 분야의 책을 읽고 깊이 있는 대화를 나눕니다. 와인 한 잔과 함께해요.',
            region: '서울 마포구',
            schedule: '월 1회 금요일 저녁',
            currentMembers: 7,
            maxMembers: 10,
            tags: ['인문학', '와인', '사교'],
            image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=400',
            ownerId: 'user-5',
            ownerName: '디오니소스',
            members: [createMember('user-5', '디오니소스', 'OWNER'), ...Array.from({length:6}).map((_,i)=>createMember(`user-5${i}`, `철학자${i}`)) ],
            pendingMembers: []
        }
    ];

    return [...scenarios, ...randomGroups];
};

export const MOCK_READING_GROUPS: ReadingGroup[] = generateMockGroups(100);

export const MOCK_GROUP_POSTS: ReadingGroupPost[] = [
    {
        id: 'post-1',
        groupId: 'group-1',
        title: '이번 주 토요일 모임 공지합니다',
        authorId: 'user-1',
        authorName: '모닝커피',
        content: '이번 주 토요일 모임은 강남역 11번 출구 앞 스타벅스에서 진행합니다. 모두 늦지 않게 와주세요! 이번 주 선정 도서는 "아주 작은 습관의 힘" 입니다. 다들 읽어오셨죠?',
        images: ['https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=400'],
        attachedBook: {
            title: '아주 작은 습관의 힘',
            author: '제임스 클리어',
            image: 'https://picsum.photos/200/300?random=1'
        },
        likes: 4,
        viewCount: 45,
        commentCount: 2,
        createdAt: Date.now() - 10000000
    },
    {
        id: 'post-2',
        groupId: 'group-1',
        title: '안녕하세요 신입 회원입니다',
        authorId: 'user-99',
        authorName: '책읽는고양이',
        content: '안녕하세요! 신입 회원입니다. 앞으로 잘 부탁드립니다. 혹시 준비물 따로 챙겨야 할 게 있을까요?',
        likes: 2,
        viewCount: 23,
        commentCount: 1,
        createdAt: Date.now() - 5000000
    },
    {
        id: 'post-3',
        groupId: 'group-2',
        title: '테드 창 "숨" 토론 발제문',
        authorId: 'user-2',
        authorName: '우주여행자',
        content: '테드 창의 "숨" 단편 중 어느 에피소드가 가장 좋으셨나요? 저는 "상인과 연금술사의 문"이 가장 인상 깊었습니다.',
        attachedBook: {
            title: '숨',
            author: '테드 창',
            image: 'https://picsum.photos/200/300?random=2'
        },
        likes: 5,
        viewCount: 67,
        commentCount: 1,
        createdAt: Date.now() - 20000000
    }
];

export const MOCK_COMMENTS: ReadingGroupComment[] = [
    {
        id: 'comment-1',
        postId: 'post-1',
        authorId: 'user-2',
        authorName: '우주여행자',
        content: '네, 알겠습니다! 토요일에 뵐게요.',
        createdAt: Date.now() - 9000000
    },
    {
        id: 'comment-2',
        postId: 'post-1',
        authorId: 'user-3',
        authorName: '경제적자유',
        content: '혹시 10분 정도 늦을 것 같은데 괜찮을까요?',
        createdAt: Date.now() - 8000000
    },
    {
        id: 'comment-3',
        postId: 'post-2',
        authorId: 'user-1',
        authorName: '모닝커피',
        content: '반갑습니다! 읽으실 책과 열린 마음만 가져오시면 됩니다 ^^',
        createdAt: Date.now() - 4000000
    }
];
