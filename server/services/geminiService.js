const config = require('../config/config');

function buildSystemInstruction(settings) {
  const companyName = settings?.companyName || 'Hoa Vu';
  const greeting = settings?.chatbotConfig?.greeting
    || 'Xin chào! Tôi là trợ lý ảo của Hoa Vu. Tôi có thể giúp bạn tìm hiểu về dịch vụ, báo giá hoặc đặt lịch tư vấn.';
  const phones = Array.isArray(settings?.phones) && settings.phones.length > 0
    ? settings.phones.map((item) => item.number).filter(Boolean).join(', ')
    : '088 999 6399';
  const email = settings?.email || 'info@hoavu.vn';
  const address = settings?.address || '248 Hoàng Hoa Thám, Quận Bình Thạnh, TP.HCM';

  return [
    `Bạn là chatbot tư vấn khách hàng cho ${companyName}.`,
    'Luôn trả lời bằng tiếng Việt, thân thiện, ngắn gọn, rõ ràng và hữu ích.',
    'Tập trung hỗ trợ về dịch vụ, báo giá, quy trình làm việc, dự án, liên hệ và đặt lịch tư vấn.',
    `Nếu người dùng chỉ chào hỏi, hãy đáp lại theo tinh thần sau: "${greeting}"`,
    'Nếu không chắc thông tin chi tiết hoặc không có dữ liệu chính xác, hãy nói rõ điều đó và hướng người dùng sang bước liên hệ tư vấn thay vì bịa thông tin.',
    `Thông tin liên hệ ưu tiên: hotline ${phones}, email ${email}, địa chỉ ${address}.`,
    'Khi phù hợp, hãy mời khách hàng để lại nhu cầu, ngành nghề, ngân sách hoặc thời gian mong muốn để được tư vấn sâu hơn.',
    'Không tự nhận là Google hay Gemini. Hãy xưng là trợ lý AI của doanh nghiệp.',
  ].join('\n');
}

function toGeminiRole(role) {
  return role === 'bot' ? 'model' : 'user';
}

function buildContents(history) {
  return history
    .filter((item) => item?.message)
    .map((item) => ({
      role: toGeminiRole(item.role),
      parts: [{ text: item.message }],
    }));
}

function extractResponseText(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) {
    return '';
  }

  return parts
    .map((part) => part?.text || '')
    .join('\n')
    .trim();
}

async function generateChatbotReply({ history, settings }) {
  const apiKey = config.geminiApiKey?.trim();

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }

  const url = `${config.geminiApiBaseUrl}/models/${config.geminiModel}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(config.geminiTimeoutMs),
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: buildSystemInstruction(settings) }],
      },
      contents: buildContents(history),
      generationConfig: {
        temperature: 0.6,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 512,
      },
    }),
  });

  const data = await response.json().catch(() => ({}));
  const message = extractResponseText(data);

  if (!response.ok) {
    const errorMessage = data?.error?.message || 'Gemini API request failed';
    throw new Error(errorMessage);
  }

  if (!message) {
    throw new Error('Gemini API returned an empty response');
  }

  return {
    message,
    model: config.geminiModel,
    provider: 'gemini',
  };
}

module.exports = {
  generateChatbotReply,
};
