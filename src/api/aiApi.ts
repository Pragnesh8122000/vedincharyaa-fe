import { apiClient } from "./client";

/**
 * AI API service
 */
export const explainShlok = async (shlokId: string) => {
  const response = await apiClient.post("/ai/explain", { shlokId });
  return response.data.data;
};

export const askAiQuestion = async (shlokId: string, question: string) => {
  const response = await apiClient.post("/ai/ask", { shlokId, question });
  return response.data.data;
};
