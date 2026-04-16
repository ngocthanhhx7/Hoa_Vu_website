const ChatMessage = require('../models/ChatMessage');
const SiteSettings = require('../models/SiteSettings');
const { generateChatbotReply } = require('../services/geminiService');

const DEFAULT_GREETING = 'Xin chào! Tôi là trợ lý ảo của Hoa Vu. Tôi có thể giúp bạn tìm hiểu về dịch vụ, báo giá, hoặc đặt lịch tư vấn.';
const DEFAULT_QUICK_REPLIES = ['Dịch vụ', 'Báo giá', 'Xem dự án', 'Liên hệ tư vấn', 'Quy trình'];

const INTENTS = {
  pricing: {
    keywords: ['giá', 'báo giá', 'chi phí', 'bao nhiêu', 'price', 'cost', 'fee'],
    response: 'Chi phí thiết kế logo tại Hoa Vu dao động tùy theo gói dịch vụ và phạm vi công việc. Để nhận báo giá chi tiết, vui lòng liên hệ hotline 088 999 6399 hoặc để lại thông tin, chúng tôi sẽ tư vấn ngay.',
    action: { type: 'link', url: '/lien-he', label: 'Liên hệ báo giá' },
  },
  services: {
    keywords: ['dịch vụ', 'thiết kế', 'logo', 'nhận diện', 'branding', 'website', 'service'],
    response: 'Hoa Vu cung cấp các dịch vụ chính như thiết kế logo, nhận diện thương hiệu, profile, brochure, banner, bao bì, website và các hạng mục truyền thông khác. Bạn đang quan tâm đến dịch vụ nào?',
    action: { type: 'link', url: '/dich-vu', label: 'Xem dịch vụ' },
  },
  portfolio: {
    keywords: ['dự án', 'portfolio', 'mẫu', 'xem', 'project', 'work'],
    response: 'Hoa Vu đã thực hiện nhiều dự án cho khách hàng trong và ngoài nước. Bạn có thể xem các dự án tiêu biểu của chúng tôi tại trang Dự án.',
    action: { type: 'link', url: '/du-an/thiet-ke-logo', label: 'Xem dự án' },
  },
  contact: {
    keywords: ['liên hệ', 'tư vấn', 'gọi', 'contact', 'phone', 'zalo', 'hotline'],
    response: 'Bạn có thể liên hệ Hoa Vu qua hotline 088 999 6399, email info@hoavu.vn hoặc để lại thông tin ở trang liên hệ để được gọi lại nhanh hơn.',
    action: { type: 'link', url: '/lien-he', label: 'Liên hệ ngay' },
  },
  process: {
    keywords: ['quy trình', 'bước', 'thời gian', 'bao lâu', 'process', 'how long'],
    response: 'Quy trình thiết kế tại Hoa Vu thường gồm tiếp nhận thông tin, tư vấn, chốt phạm vi, triển khai dự án, bàn giao và hậu mãi. Thời gian hoàn thành trung bình khoảng 3-7 ngày làm việc tùy hạng mục.',
    action: null,
  },
  greeting: {
    keywords: ['xin chào', 'hello', 'hi', 'chào', 'hey'],
    response: null,
    action: null,
  },
};

function detectIntent(message) {
  const lower = message.toLowerCase().trim();
  for (const [intent, config] of Object.entries(INTENTS)) {
    if (config.keywords.some((kw) => lower.includes(kw))) {
      return intent;
    }
  }
  return 'unknown';
}

function getQuickReplies(settings) {
  const configuredQuickReplies = settings?.chatbotConfig?.quickReplies?.filter(Boolean);
  if (configuredQuickReplies?.length) {
    return configuredQuickReplies;
  }
  return DEFAULT_QUICK_REPLIES;
}

function getFallbackResponse(intent, settings) {
  const greeting = settings?.chatbotConfig?.greeting || DEFAULT_GREETING;

  if (intent === 'greeting') {
    return {
      message: greeting,
      action: null,
    };
  }

  if (intent === 'unknown') {
    return {
      message: 'Cảm ơn bạn! Để được tư vấn chi tiết hơn, vui lòng liên hệ hotline 088 999 6399 hoặc chọn một trong các chủ đề bên dưới.',
      action: { type: 'link', url: '/lien-he', label: 'Liên hệ tư vấn' },
    };
  }

  return {
    message: INTENTS[intent].response,
    action: INTENTS[intent].action,
  };
}

// @desc   Handle chatbot message
// @route  POST /api/chatbot/message
exports.sendMessage = async (req, res, next) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ success: false, message: 'Missing sessionId or message' });
    }

    await ChatMessage.create({ sessionId, role: 'user', message });

    const settings = await SiteSettings.findOne().lean();
    const intent = detectIntent(message);
    const quickReplies = getQuickReplies(settings);
    const history = await ChatMessage.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    let botResponse = '';
    let action = null;
    let provider = 'fallback';
    let model = 'rule-based';

    try {
      const aiResult = await generateChatbotReply({
        history: history.reverse(),
        settings,
      });

      if (aiResult?.message) {
        botResponse = aiResult.message;
        action = INTENTS[intent]?.action || null;
        provider = aiResult.provider;
        model = aiResult.model;
      }
    } catch (error) {
      console.error(`[chatbot] Gemini fallback triggered: ${error.message}`);
    }

    if (!botResponse) {
      const fallback = getFallbackResponse(intent, settings);
      botResponse = fallback.message;
      action = fallback.action;
    }

    await ChatMessage.create({
      sessionId,
      role: 'bot',
      message: botResponse,
      intent,
      metadata: {
        ...(action ? { action } : {}),
        provider,
        model,
      },
    });

    res.json({
      success: true,
      data: {
        message: botResponse,
        intent,
        action,
        quickReplies,
        provider,
        model,
      },
    });
  } catch (err) { next(err); }
};

// Admin: get chat history
exports.getChatHistory = async (req, res, next) => {
  try {
    const { sessionId, page = 1, limit = 50 } = req.query;
    const query = {};
    if (sessionId) query.sessionId = sessionId;

    const messages = await ChatMessage.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10))
      .lean();

    res.json({ success: true, data: messages });
  } catch (err) { next(err); }
};
