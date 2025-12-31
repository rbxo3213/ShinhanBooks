import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY || ''; 
  return new GoogleGenAI({ apiKey });
};

export const generateBookDescription = async (title: string, author: string, condition: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found.");
    return `책 상태는 ${condition}입니다. (API 키가 없어 자동 생성이 불가능합니다)`;
  }

  try {
    const ai = getClient();
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      나는 중고 서적 거래 플랫폼에 책을 판매하려고 합니다. 구매자가 호감을 느낄 수 있는 정중하고 신뢰감 있는 판매글을 작성해 주세요.
      
      책 제목: ${title}
      저자: ${author}
      상태: ${condition}
      
      요구사항:
      1. 한국어로 작성해 주세요.
      2. '당근마켓'이나 '중고나라' 스타일로 친근하면서도 예의 바른 어조를 사용하세요.
      3. 길이는 150자 이내로 핵심만 작성해 주세요.
      4. 상태에 대한 설명을 꼭 포함해 주세요.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "설명 생성에 실패했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "지금은 AI 설명을 생성할 수 없습니다. 직접 작성해 주세요.";
  }
};