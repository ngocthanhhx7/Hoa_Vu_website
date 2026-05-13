export const BRAND = {
  name: 'HOAVU BRANDING',
  shortName: 'HoaVu',
  adminName: 'HOA VU CMS',
  titleSuffix: 'HOAVU BRANDING',
  url: 'https://hoavu.com.vn',
  description: 'Chuyên nghiệp - Sáng tạo - Tận tâm',
  seoDescription: 'HOAVU BRANDING cung cấp dịch vụ thiết kế logo, nhận diện thương hiệu và visual truyền thông cho doanh nghiệp cần hình ảnh chuyên nghiệp, sáng tạo và nhất quán.',
  logoMark: '/brand/d88fd228-ccb5-45e9-bfc7-414eda8c4d8a.jpg',
  logoFull: '/brand/d88fd228-ccb5-45e9-bfc7-414eda8c4d8a.jpg',
  banner: '/brand/hero-banner.jpg',
  defaultImage: '/brand/hero-banner.jpg',
  favicon: '/favicon-48x48.png',
  contact: {
    facebook: 'https://www.facebook.com/hoavubranding',
    messenger: 'https://m.me/hoavubranding',
    address: 'Làm việc theo lịch hẹn, cập nhật địa chỉ chi tiết trực tiếp qua fanpage Hoa Vu Branding.',
    primaryText: '@hoavubranding',
    supportText: 'Nhắn tin fanpage để nhận tư vấn, lịch hẹn và cập nhật địa chỉ làm việc.',
  },
};

export function buildTitle(pageTitle) {
  return pageTitle ? `${pageTitle} | ${BRAND.titleSuffix}` : BRAND.titleSuffix;
}
