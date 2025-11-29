import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateSqlExplanation = async (sql: string, context: string): Promise<string> => {
  if (!ai) return "AI 服务不可用 (缺少 API Key)。";

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      你是一位专业的 SQL 数据库管理员和讲师。
      请结合“健身俱乐部管理系统”的上下文，解释以下 SQL 查询语句。
      
      上下文: ${context}
      SQL语句: ${sql}
      
      请用中文解释它做了什么，为什么要这样写，以及潜在的性能考虑。保持简洁。
    `;
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    
    return response.text || "未生成响应。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "与 AI 服务通信时出错。";
  }
};

export const chatWithAi = async (message: string, history: string[]): Promise<string> => {
   if (!ai) return "AI 服务不可用 (缺少 API Key)。";

   try {
     const model = "gemini-2.5-flash";
     const systemInstruction = "你是一个乐于助人的 SQL 助手，正在帮助学生构建一个基于 SQL Server 的健身俱乐部管理系统数据库。请用中文回答所有问题。";
     
     // Construct chat history context for simple stateless call (or use chats.create if persistent)
     // For this simple demo, we'll just append context to a single prompt to ensure robustness without maintaining complex state
     const prompt = `
      ${systemInstruction}
      
      最近的对话上下文:
      ${history.join('\n')}
      
      用户: ${message}
     `;

     const response = await ai.models.generateContent({
        model,
        contents: prompt
     });

     return response.text || "我无法理解您的意思。";
   } catch (error) {
     console.error("Gemini Chat Error", error);
     return "抱歉，处理您的请求时出现错误。";
   }
};