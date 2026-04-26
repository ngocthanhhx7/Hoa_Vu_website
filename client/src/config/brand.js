export const BRAND = {
  name: 'HOAVU BRANDING',
  shortName: 'HoaVu',
  adminName: 'HOA VU CMS',
  titleSuffix: 'HOAVU BRANDING',
  description: 'Studio thiết kế thương hiệu và truyền thông thị giác với ngôn ngữ hiện đại, sắc nét và sang trọng.',
  logoMark: '/brand/d88fd228-ccb5-45e9-bfc7-414eda8c4d8a.jpg',
  logoFull: '/brand/d88fd228-ccb5-45e9-bfc7-414eda8c4d8a.jpg',
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
