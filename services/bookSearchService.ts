import { CATEGORIES } from '../constants';

export interface ApiBookResult {
  title: string;
  author: string;
  pubDate: string;
  description: string;
  isbn: string;
  cover: string;
  categoryName: string; // e.g., "국내도서>소설/시/희곡>한국소설"
  publisher: string;
  priceStandard: number;
}

// Helper to map external API categories to internal App categories
const mapCategoryToInternal = (apiCategory: string): string => {
  if (apiCategory.includes('소설') || apiCategory.includes('에세이') || apiCategory.includes('시')) return '소설/문학';
  if (apiCategory.includes('경제') || apiCategory.includes('경영')) return '경영/경제';
  if (apiCategory.includes('인문') || apiCategory.includes('사회') || apiCategory.includes('역사')) return '인문/사회';
  if (apiCategory.includes('자기계발')) return '자기계발';
  if (apiCategory.includes('과학') || apiCategory.includes('컴퓨터') || apiCategory.includes('공학')) return '과학/IT';
  if (apiCategory.includes('예술') || apiCategory.includes('대중문화')) return '예술/대중문화';
  if (apiCategory.includes('학습') || apiCategory.includes('참고서') || apiCategory.includes('수험서')) return '학습/참고서';
  if (apiCategory.includes('만화')) return '만화';
  
  return '기타';
};

// Mock Data representing Aladin API response
const MOCK_API_RESULTS: ApiBookResult[] = [
  {
    title: "클린 코드 (Clean Code)",
    author: "로버트 C. 마틴",
    pubDate: "2013-12-24",
    description: "애자일 소프트웨어 장인 정신. 소프트웨어 장인 정신의 가치를 심어 주며, 프로그래밍 실력을 높여 줄 안내서다.",
    isbn: "9788966260959",
    cover: "https://image.aladin.co.kr/product/3408/36/cover500/8966260959_1.jpg",
    categoryName: "국내도서>컴퓨터/모바일>프로그래밍 개발",
    publisher: "인사이트",
    priceStandard: 33000
  },
  {
    title: "트렌드 코리아 2025",
    author: "김난도, 전미영, 최지혜",
    pubDate: "2024-10-05",
    description: "청년지향, 옴니보어, 아보하... 2025년 뱀띠 해를 이끌 10대 소비트렌드 키워드.",
    isbn: "9791191891234",
    cover: "https://image.aladin.co.kr/product/34750/50/cover500/k562933842_1.jpg",
    categoryName: "국내도서>경제경영>트렌드/미래전망",
    publisher: "미래의창",
    priceStandard: 20000
  },
  {
    title: "소년이 온다",
    author: "한강",
    pubDate: "2014-05-19",
    description: "1980년 5월 18일부터 열흘간 있었던 광주민주화운동 당시의 상황과 그 이후를 남겨진 사람들의 이야기를 들려주는 소설.",
    isbn: "9788936434120",
    cover: "https://image.aladin.co.kr/product/4086/97/cover500/8936434128_1.jpg",
    categoryName: "국내도서>소설/시/희곡>한국소설",
    publisher: "창비",
    priceStandard: 15000
  },
  {
    title: "채식주의자",
    author: "한강",
    pubDate: "2007-10-30",
    description: "2016년 맨부커 인터내셔널상 수상작. 욕망과 식물성, 죽음과 존재에 대한 강렬하고 매혹적인 탐구.",
    isbn: "9788936433598",
    cover: "https://image.aladin.co.kr/product/122/4/cover500/8936433598_2.jpg",
    categoryName: "국내도서>소설/시/희곡>한국소설",
    publisher: "창비",
    priceStandard: 15000
  },
  {
    title: "돈의 속성",
    author: "김승호",
    pubDate: "2020-06-15",
    description: "최상위 부자가 말하는 돈에 대한 모든 것. 맨손에서 종잣돈을 만들고 돈을 불리는 75가지 방법.",
    isbn: "9791188331796",
    cover: "https://image.aladin.co.kr/product/24166/38/cover500/k062630560_1.jpg",
    categoryName: "국내도서>경제경영>재테크/투자",
    publisher: "스노우폭스북스",
    priceStandard: 17800
  }
];

export const searchBookApi = async (query: string): Promise<ApiBookResult[]> => {
  // NOTE: In a real application, you would make a fetch call here.
  // Example for Aladin:
  // const response = await fetch(`http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=[YOUR_KEY]&Query=${query}&Output=JS...`);
  // const data = await response.json();
  
  // Simulating API latency
  await new Promise(resolve => setTimeout(resolve, 600));

  if (!query) return [];

  // Simple Mock Filter
  return MOCK_API_RESULTS.filter(book => 
    book.title.includes(query) || 
    book.author.includes(query)
  );
};

export const processBookSelection = (apiBook: ApiBookResult) => {
  return {
    title: apiBook.title,
    author: apiBook.author,
    category: mapCategoryToInternal(apiBook.categoryName),
    description: apiBook.description,
    image: apiBook.cover,
    priceStandard: apiBook.priceStandard,
    publisher: apiBook.publisher
  };
};