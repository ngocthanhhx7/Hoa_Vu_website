const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Page = require('./models/Page');
const SiteSettings = require('./models/SiteSettings');

const updateEverything = async () => {
  try {
    await connectDB();
    console.log('🔄 Đang cập nhật SiteSettings và SEO Schema...');

    // 1. Update SiteSettings based on the new seed.js
    const updatedSettings = await SiteSettings.findOneAndUpdate(
      {}, // Match the first document
      {
        $set: {
          companyName: 'HOAVU BRANDING',
          tagline: 'Nâng tầm thương hiệu',
          address: 'Tu Vũ, Phú Thọ',
          email: 'hoavudesigns@gmail.com',
          phones: [
            { label: 'Liên hệ tư vấn dịch vụ', number: '0927969123' },
            { label: 'Liên hệ thiết kế', number: '0927969123' },
            { label: 'Liên hệ content', number: '0927969123' },
            { label: 'Liên hệ CSKH', number: '0927969123' },
          ],
          socialLinks: {
            facebook: 'https://www.facebook.com/hoavubranding',
            instagram: 'https://instagram.com/hoavu.vn',
            youtube: 'https://youtube.com/@hoavu',
            zalo: 'https://zalo.me/0868373454',
          },
          copyright: '© 2026 HOA VU. All rights reserved.'
        }
      },
      { new: true, upsert: true }
    );
    console.log('✅ Đã cập nhật SiteSettings');

    // 2. Refine SEO metadata for policy pages
    const policies = [
      {
        slug: 'chinh-sach-va-quy-dinh',
        title: 'Chính sách và quy định',
        description: 'Chào mừng Quý khách đến với HOA VU BRANDING. Khi sử dụng dịch vụ thiết kế của chúng tôi, Quý khách đồng ý tuân thủ các điều khoản và quy định nhằm bảo vệ quyền lợi hai bên.',
      },
      {
        slug: 'quy-trinh-dat-thiet-ke',
        title: 'Quy trình đặt thiết kế',
        description: 'Tại HOA VU BRANDING, chúng tôi áp dụng một quy trình làm việc chuẩn hóa, chuyên nghiệp qua 5 bước nhằm tối ưu hóa thời gian và đảm bảo chất lượng sản phẩm thiết kế.',
      },
      {
        slug: 'chinh-sach-bao-mat-thong-tin',
        title: 'Chính sách bảo mật',
        description: 'HOA VU BRANDING cam kết bảo vệ sự riêng tư và dữ liệu cá nhân của khách hàng theo đúng quy định tại Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân.',
      }
    ];

    for (const p of policies) {
      await Page.findOneAndUpdate(
        { slug: p.slug },
        { 
          $set: { 
            'seo.description': p.description
          } 
        }
      );
      console.log(`✅ Đã tối ưu SEO description cho: ${p.title}`);
    }

    console.log('🎉 Cập nhật hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
};

updateEverything();
