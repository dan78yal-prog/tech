import { GoogleGenAI, Type } from "@google/genai";
import { LessonPlan } from "../types";

export const generateLessonPlan = async (
  subject: string,
  topic: string,
  gradeLevel: string,
  details: string
): Promise<LessonPlan | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      قم بإنشاء خطة درس تفصيلية للمعلم.
      المادة: ${subject}
      الموضوع: ${topic}
      الصف الدراسي: ${gradeLevel}
      ملاحظات إضافية: ${details}
      
      يجب أن تكون الخطة منظمة وتحتوي على الأهداف، المواد المطلوبة، المحتوى، والواجب المنزلي.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            objectives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "قائمة بأهداف الدرس"
            },
            materials: {
              type: Type.STRING,
              description: "المواد والأدوات اللازمة"
            },
            content: {
              type: Type.STRING,
              description: "ملخص شرح الدرس والأنشطة الصفية"
            },
            homework: {
              type: Type.STRING,
              description: "الواجب المنزلي المقترح"
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);

    return {
      id: Math.random().toString(36).substring(7),
      subject,
      topic,
      isGenerated: true,
      objectives: data.objectives || [],
      materials: data.materials || '',
      content: data.content || '',
      homework: data.homework || ''
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};