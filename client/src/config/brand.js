export const BRAND = {
  name: 'HOA VU BRANDING',
  shortName: 'Hoa Vu',
  adminName: 'HOA VU CMS',
  titleSuffix: 'HOA VU BRANDING',
  description: 'Studio thiết kế thương hiệu và truyền thông thị giác với ngôn ngữ hiện đại, sắc nét và sang trọng.',
  logoMark: '/brand/hoa-vu-mark.jpg',
  logoFull: '/brand/hoa-vu-mark.jpg',
  banner: '/brand/hero-banner.jpg',
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
