const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

// Models
const User = require('../models/User');
const ServiceCategory = require('../models/ServiceCategory');
const Service = require('../models/Service');
const Project = require('../models/Project');
const BlogCategory = require('../models/BlogCategory');
const BlogPost = require('../models/BlogPost');
const Testimonial = require('../models/Testimonial');
const Page = require('../models/Page');
const SiteSettings = require('../models/SiteSettings');

const seedData = async () => {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany(),
      ServiceCategory.deleteMany(),
      Service.deleteMany(),
      Project.deleteMany(),
      BlogCategory.deleteMany(),
      BlogPost.deleteMany(),
      Testimonial.deleteMany(),
      Page.deleteMany(),
      SiteSettings.deleteMany(),
    ]);

    // 1. Admin user
    console.log('👤 Creating admin user...');
    await User.create({
      name: 'Admin Hoa Vu',
      email: 'admin@hoavu.vn',
      password: 'Admin@123',
      role: 'admin',
    });

    // 2. Service Categories
    console.log('📂 Creating service categories...');
    const [catLogo, catBrand, catOther] = await ServiceCategory.create([
      { name: 'Thiết kế logo', slug: 'thiet-ke-logo', icon: '🎨', order: 1 },
      { name: 'Nhận diện thương hiệu', slug: 'nhan-dien-thuong-hieu', icon: '📋', order: 2 },
      { name: 'Dịch vụ khác', slug: 'dich-vu-khac', icon: '🔧', order: 3 },
    ]);

    // 3. Services
    console.log('🛠️  Creating services...');
    await Service.create([
      {
        title: 'Thiết kế logo',
        slug: 'thiet-ke-logo',
        category: catLogo._id,
        icon: 'palette',
        description: 'Logo là yếu tố căn bản nhất của hệ thống nhận diện thương hiệu. Logo xuất hiện ở mọi lúc, mọi nơi, từ danh thiếp kinh doanh, tài liệu văn phòng, ấn phẩm quảng cáo, đồng phục, cho đến website.',
        shortDescription: 'Thiết kế logo chuyên nghiệp, sáng tạo, phù hợp với thương hiệu của bạn.',
        features: ['Thiết kế phẳng', 'Logo nghệ thuật', 'Logo tối giản', 'Logo dạng chữ', 'Logo 3D, Chibi'],
        order: 1,
        seo: { title: 'Dịch vụ thiết kế logo chuyên nghiệp | HOA VU', description: 'Dịch vụ thiết kế logo chuyên nghiệp, sáng tạo với hơn 20.000 khách hàng hài lòng.' },
      },
      {
        title: 'Thiết kế nhận diện thương hiệu',
        slug: 'nhan-dien-thuong-hieu',
        category: catBrand._id,
        icon: 'card-checklist',
        description: 'Hệ thống nhận diện thương hiệu giúp doanh nghiệp tạo dựng hình ảnh chuyên nghiệp, nhất quán trên mọi kênh truyền thông.',
        shortDescription: 'Xây dựng bộ nhận diện thương hiệu toàn diện cho doanh nghiệp.',
        features: ['Thiết kế logo', 'Profile, Brochure, Banner', 'Thiết kế bao bì', 'Thiết kế ấn phẩm', 'Thiết kế dụng cụ văn phòng'],
        order: 2,
        seo: { title: 'Thiết kế nhận diện thương hiệu | HOA VU', description: 'Xây dựng bộ nhận diện thương hiệu chuyên nghiệp, toàn diện.' },
      },
      {
        title: 'Dịch vụ khác',
        slug: 'dich-vu-khac',
        category: catOther._id,
        icon: 'grid',
        description: 'Ngoài thiết kế logo và nhận diện, Hoa Vu còn cung cấp nhiều dịch vụ sáng tạo khác.',
        shortDescription: 'Tư vấn thương hiệu, website, digital marketing và nhiều hơn nữa.',
        features: ['Tư vấn thương hiệu', 'Thiết kế website', 'Phần mềm quản lý', 'Không gian nội thất', 'Digital marketing'],
        order: 3,
        seo: { title: 'Dịch vụ thiết kế khác | HOA VU', description: 'Các dịch vụ sáng tạo khác: website, marketing, in ấn.' },
      },
    ]);

    // 4. Projects
    console.log('📁 Creating projects...');
    const projectNames = [
      { title: 'Thiết kế logo dự án Am Mây', client: 'Am Mây', industry: 'F&B' },
      { title: 'Thiết kế logo dự án KN Migration Services', client: 'KN Migration', industry: 'Dịch vụ di trú' },
      { title: 'Thiết kế logo dự án Swee Swee', client: 'Swee Swee', industry: 'F&B' },
      { title: 'Thiết kế logo dự án Ăn Banhmi', client: 'Ăn Banhmi', industry: 'F&B' },
      { title: 'Thiết kế logo dự án Mê Chà', client: 'Mê Chà', industry: 'Trà sữa' },
      { title: 'Thiết kế logo dự án Kitikat', client: 'Kitikat', industry: 'Thú cưng' },
      { title: 'Thiết kế logo dự án Crussh Juice', client: 'Crussh Juice', industry: 'Nước ép' },
      { title: 'Thiết kế logo dự án Bếp Gia', client: 'Bếp Gia', industry: 'F&B' },
      { title: 'Thiết kế logo dự án D\'Moir', client: 'D\'Moir', industry: 'Thời trang' },
      { title: 'Thiết kế logo dự án Nhã Uyên Mart', client: 'Nhã Uyên Mart', industry: 'Bán lẻ' },
      { title: 'Thiết kế logo dự án Mộc An Village', client: 'Mộc An Village', industry: 'Nghỉ dưỡng' },
      { title: 'Thiết kế logo dự án Wai Coffee', client: 'Wai Coffee', industry: 'Cà phê' },
      { title: 'Thiết kế logo dự án V Coffee & Tea', client: 'V Coffee & Tea', industry: 'Cà phê' },
      { title: 'Thiết kế logo dự án Tiger Bao', client: 'Tiger Bao', industry: 'F&B' },
      { title: 'Thiết kế logo dự án Song Thư', client: 'Song Thư', industry: 'Thương mại' },
      { title: 'Thiết kế logo dự án Bán Chà Thái', client: 'Bán Chà Thái', industry: 'F&B' },
    ];

    const slugify = (str) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const projects = projectNames.map((p, i) => ({
      title: p.title,
      slug: slugify(p.title) + '-' + (21800 + i),
      category: catLogo._id,
      description: `Dự án thiết kế logo cho ${p.client} trong lĩnh vực ${p.industry}. Hoa Vu tự hào mang đến giải pháp thiết kế sáng tạo, chuyên nghiệp.`,
      client: { name: p.client, industry: p.industry },
      tags: ['logo', p.industry.toLowerCase()],
      isFeatured: i < 8,
      isActive: true,
      order: i,
    }));
    await Project.create(projects);

    // 5. Blog Categories
    console.log('📝 Creating blog categories...');
    const [catNews, catIdea, catGuide] = await BlogCategory.create([
      { name: 'Tin tức', slug: 'tin-tuc', order: 1 },
      { name: 'Idea', slug: 'idea', order: 2 },
      { name: 'Cẩm nang thiết kế', slug: 'cam-nang-thiet-ke', order: 3 },
    ]);

    // 6. Blog Posts
    console.log('✍️  Creating blog posts...');
    await BlogPost.create([
      {
        title: 'Cận cảnh diện mạo logo Harry Potter mới cho dự án phim TV Series của HBO',
        slug: 'can-canh-dien-mao-logo-harry-potter-moi-cho-du-an-phim-tv-series-cua-hbo',
        category: catNews._id,
        excerpt: 'Logo Harry Potter mới chính thức lộ diện cùng dự án TV Series của HBO, đánh dấu sự trở lại đầy hứa hẹn.',
        htmlContent: '<p>Logo Harry Potter mới chính thức lộ diện cùng dự án TV Series của HBO, đánh dấu sự trở lại đầy hứa hẹn của tựa phim chuyển thể nổi tiếng.</p><p>Thiết kế mới mang phong cách hiện đại hơn nhưng vẫn giữ được tinh thần phép thuật vốn có.</p>',
        tags: ['logo', 'harry potter', 'HBO'],
        isFeatured: true,
        readTime: 5,
      },
      {
        title: 'Thiết kế logo giá bao nhiêu? Những yếu tố ảnh hưởng chi phí',
        slug: 'thiet-ke-logo-gia-bao-nhieu-nhung-yeu-to-anh-huong-chi-phi',
        category: catNews._id,
        excerpt: 'Thiết kế logo giá bao nhiêu? Khám phá chi phí thiết kế logo và những yếu tố ảnh hưởng để lựa chọn giải pháp phù hợp.',
        htmlContent: '<p>Chi phí thiết kế logo phụ thuộc vào nhiều yếu tố: độ phức tạp, kinh nghiệm designer, số lượng concept, và các dịch vụ đi kèm.</p><h3>Các mức giá phổ biến</h3><ul><li>Gói cơ bản: 1.5 - 3 triệu đồng</li><li>Gói chuyên nghiệp: 3 - 8 triệu đồng</li><li>Gói cao cấp: 8 - 15 triệu đồng</li></ul>',
        tags: ['logo', 'giá', 'chi phí'],
        isFeatured: true,
        readTime: 7,
      },
      {
        title: 'AI trong thiết kế đồ họa thay đổi ngành sáng tạo như thế nào?',
        slug: 'ai-trong-thiet-ke-do-hoa-thay-doi-nganh-sang-tao-nhu-the-nao',
        category: catNews._id,
        excerpt: 'AI trong thiết kế đồ họa đã trở thành chủ đề nóng. Liệu AI có thể thay thế designer?',
        htmlContent: '<p>Trong những năm gần đây, AI trong thiết kế đồ họa đã trở thành một trong những chủ đề được bàn luận nhiều nhất.</p><p>AI là công cụ hỗ trợ mạnh mẽ, nhưng tư duy sáng tạo và hiểu biết thương hiệu vẫn là yếu tố không thể thay thế.</p>',
        tags: ['AI', 'thiết kế', 'công nghệ'],
        readTime: 8,
      },
      {
        title: 'Cách bố trí CTA trong thiết kế website để tăng tỷ lệ chốt đơn',
        slug: 'cach-bo-tri-cta-trong-thiet-ke-website-de-tang-ty-le-chot-don',
        category: catGuide._id,
        excerpt: 'Khám phá bí quyết bố trí nút CTA thông minh trong thiết kế website để tối ưu tỷ lệ chuyển đổi.',
        htmlContent: '<p>CTA (Call-to-Action) là yếu tố then chốt quyết định tỷ lệ chuyển đổi của website.</p><h3>Vị trí vàng cho CTA</h3><ul><li>Above the fold (phần đầu trang)</li><li>Cuối mỗi section nội dung</li><li>Floating button</li></ul>',
        tags: ['CTA', 'website', 'chuyển đổi'],
        readTime: 6,
      },
      {
        title: 'Top 10 xu hướng thiết kế logo 2024-2025',
        slug: 'top-10-xu-huong-thiet-ke-logo-2024-2025',
        category: catIdea._id,
        excerpt: 'Khám phá những xu hướng thiết kế logo mới nhất đang định hình ngành sáng tạo.',
        htmlContent: '<p>Năm 2024-2025 chứng kiến nhiều xu hướng thiết kế logo thú vị.</p><ol><li>Logo tối giản (Minimalism)</li><li>Gradient màu sắc</li><li>Logo chuyển động (Motion logo)</li><li>Typography sáng tạo</li><li>Logo 3D</li></ol>',
        tags: ['xu hướng', 'logo', '2024'],
        isFeatured: true,
        readTime: 10,
      },
    ]);

    // 7. Testimonials
    console.log('💬 Creating testimonials...');
    await Testimonial.create([
      { clientName: 'Anh Minh', clientTitle: 'CEO', clientCompany: '', content: 'Mình đã làm việc cùng Hoa Vu trong rất nhiều dự án, mình rất hài lòng với tác phong làm việc chuyên nghiệp của Hoa Vu nắm vững thông tin khách hàng mỗi lần mình có dự án mới!', order: 1 },
      { clientName: 'Anh Đạt', clientTitle: 'Tổng Giám đốc', clientCompany: 'Thời Trang Thành Đạt', content: 'Tôi đặt dịch vụ thiết kế logo và bảo hộ thương hiệu bên Hoa Vu các bạn ấy làm rất ưng ý, thủ tục nhanh chóng, tư vấn, hỗ trợ chỉnh sửa nhiệt tình. Sẽ ủng hộ lần sau!', order: 2 },
      { clientName: 'Chị Hương', clientTitle: 'Giám đốc', clientCompany: 'Hợp Tác Xã Toàn Dân', content: 'Thiết kế logo, nhận diện nhanh chóng, chỉnh sửa nhiệt tình, tôi bận nửa đêm mới phản hồi các bạn sale vẫn nhiệt tình tư vấn cho tôi, rất ưng ý!', order: 3 },
      { clientName: 'Anh Tuấn', clientTitle: 'Giám đốc', clientCompany: 'Alpha Land', content: 'Tôi đã xem những mẫu thiết kế của Hoa Vu trên mạng tôi rất thích nên đã liên hệ để đặt thiết kế và thực sự thành phẩm mà Hoa Vu làm rất ưng ý.', order: 4 },
      { clientName: 'Chị Lan', clientTitle: 'Kinh doanh', clientCompany: '', content: 'Mình cần thiết kế logo gấp nhiều bên đã từ chối nhận đến khi Hoa Vu hỗ trợ, tư vấn mình rất nhiệt tình, làm việc nhanh chóng, khiến mình rất ưng ý.', order: 5 },
      { clientName: 'Anh Phước', clientTitle: 'Giám đốc', clientCompany: 'Khu Nghỉ Dưỡng Lighthills', content: 'Tôi cần thiết kế logo cho khu nghỉ dưỡng của mình nhưng không có ý tưởng gì. Hoa Vu đã giúp tôi tư vấn, lên ý tưởng tạo cho tôi logo rất ưng ý. Cám ơn Hoa Vu!', order: 6 },
      { clientName: 'Mr. James', clientTitle: 'CEO', clientCompany: 'Super League 21', content: 'Excellent logo design makes me very satisfied. Wish the company develop more and more beautiful designs!', order: 7 },
      { clientName: 'Anh Phước', clientTitle: 'Tổng Giám đốc', clientCompany: 'Nhuận Phước Quảng Nam', content: 'Hoa Vu thiết kế logo, hỗ trợ mình trong thực hiện ý tưởng của mình rất nhiệt tình. Giá cả rất hợp ý mình, lần sau mình sẽ ủng hộ Hoa Vu tiếp!', order: 8 },
    ]);

    // 8. Static Pages
    console.log('📄 Creating static pages...');
    await Page.create([
      {
        title: 'Chính sách và quy định',
        slug: 'chinh-sach-va-quy-dinh',
        htmlContent: `<h2>Chính sách và Quy định chung</h2>
<p>Chào mừng Quý khách đến với HOA VU BRANDING. Khi sử dụng dịch vụ thiết kế của chúng tôi, Quý khách đồng ý tuân thủ các điều khoản và quy định dưới đây. Các chính sách này được xây dựng dựa trên sự minh bạch, bảo vệ quyền lợi của cả hai bên và tuân thủ pháp luật Việt Nam (Luật Thương mại 2005, Bộ luật Dân sự 2015, Luật Sở hữu trí tuệ 2005 sửa đổi bổ sung 2022).</p>

<h3>1. Quyền và trách nhiệm của HOA VU</h3>
<ul>
    <li>Tư vấn, thực hiện và bàn giao sản phẩm thiết kế theo đúng yêu cầu và tiến độ đã cam kết trong hợp đồng/thỏa thuận.</li>
    <li>Đảm bảo tính sáng tạo, không sao chép nguyên bản từ các thương hiệu khác, tôn trọng quyền sở hữu trí tuệ.</li>
    <li>Bảo mật các thông tin nội bộ của khách hàng trong quá trình hợp tác.</li>
</ul>

<h3>2. Quyền và trách nhiệm của Khách hàng</h3>
<ul>
    <li>Cung cấp đầy đủ, chính xác các thông tin, tài liệu cần thiết để HOA VU thực hiện dự án.</li>
    <li>Thanh toán đầy đủ và đúng hạn chi phí dịch vụ theo thỏa thuận.</li>
    <li>Tôn trọng chất xám và sản phẩm sáng tạo. Khách hàng chỉ có toàn quyền sử dụng sản phẩm sau khi đã hoàn tất 100% nghĩa vụ thanh toán.</li>
</ul>

<h3>3. Quy định về bản quyền và Sở hữu trí tuệ</h3>
<p>HOA VU giữ quyền tác giả đối với các thiết kế. Khách hàng sở hữu quyền tài sản và quyền sử dụng thương mại (sau khi thanh toán đầy đủ). HOA VU được quyền sử dụng hình ảnh sản phẩm đã hoàn thiện để đưa vào hồ sơ năng lực (portfolio) và quảng bá dịch vụ, trừ khi có thỏa thuận bảo mật NDA riêng.</p>

<h3>4. Chính sách thanh toán và hoàn tiền</h3>
<ul>
    <li><strong>Thanh toán:</strong> Khách hàng cần thanh toán tạm ứng (thường là 50%) trước khi dự án bắt đầu. Phần còn lại được thanh toán sau khi chốt thiết kế cuối cùng và trước khi bàn giao file gốc.</li>
    <li><strong>Hoàn tiền:</strong> Trong trường hợp HOA VU không thể hoàn thành dự án vì lý do chủ quan, chúng tôi sẽ hoàn trả 100% số tiền đã nhận. Nếu khách hàng đơn phương chấm dứt hợp đồng khi dự án đang triển khai, phần tiền tạm ứng sẽ không được hoàn lại để bù đắp chi phí nhân sự.</li>
</ul>

<h3>5. Giải quyết tranh chấp</h3>
<p>Mọi tranh chấp phát sinh trong quá trình hợp tác sẽ được ưu tiên giải quyết thông qua thương lượng, hòa giải. Nếu không thể đạt được thỏa thuận, vụ việc sẽ được đưa ra Tòa án nhân dân có thẩm quyền tại TP. Hồ Chí Minh để giải quyết theo quy định của pháp luật Việt Nam.</p>`,
      },
      {
        title: 'Quy trình đặt thiết kế',
        slug: 'quy-trinh-dat-thiet-ke',
        htmlContent: `<h2>Quy trình cung cấp dịch vụ thiết kế</h2>
<p>Tại HOA VU BRANDING, chúng tôi áp dụng một quy trình làm việc chuẩn hóa, chuyên nghiệp nhằm tối ưu hóa thời gian và đảm bảo chất lượng sản phẩm thiết kế tốt nhất cho doanh nghiệp của bạn.</p>

<h3>Bước 1: Tiếp nhận thông tin & Tư vấn</h3>
<p>Khách hàng liên hệ với HOA VU qua Hotline, Zalo, Fanpage hoặc Form liên hệ. Chuyên viên tư vấn sẽ ghi nhận các yêu cầu cơ bản, mong muốn, phong cách hướng đến và định vị thương hiệu của doanh nghiệp. Sau đó, chúng tôi sẽ gửi bảng khảo sát (Creative Brief) để thu thập thông tin chi tiết.</p>

<h3>Bước 2: Báo giá & Ký kết hợp đồng</h3>
<p>Dựa trên yêu cầu, HOA VU sẽ lập báo giá chi tiết cùng với timeline triển khai dự án. Khi hai bên thống nhất, sẽ tiến hành ký kết hợp đồng dịch vụ. Khách hàng thực hiện thanh toán tạm ứng (thường là 50% giá trị hợp đồng) để dự án chính thức bắt đầu.</p>

<h3>Bước 3: Nghiên cứu & Lên ý tưởng (Concept)</h3>
<p>Đội ngũ sáng tạo của HOA VU sẽ tiến hành nghiên cứu thị trường, đối thủ cạnh tranh và bắt đầu phác thảo các ý tưởng thiết kế. Tùy theo gói dịch vụ, chúng tôi sẽ phác thảo và chọn lọc từ 2-4 concept xuất sắc nhất để thuyết trình cho khách hàng.</p>

<h3>Bước 4: Trình bày, Góp ý & Hiệu chỉnh</h3>
<p>HOA VU gửi file thuyết trình (Presentation) giải thích chi tiết ý nghĩa của từng concept. Khách hàng xem xét và phản hồi. Chúng tôi sẽ tiến hành hiệu chỉnh thiết kế dựa trên góp ý của khách hàng (số lần hiệu chỉnh tùy thuộc vào hợp đồng) cho đến khi đạt được phương án ưng ý nhất.</p>

<h3>Bước 5: Hoàn thiện & Bàn giao</h3>
<p>Sau khi khách hàng chốt phương án thiết kế cuối cùng và hoàn tất thanh toán phần chi phí còn lại, HOA VU sẽ tiến hành đóng gói toàn bộ file gốc (AI, EPS, PDF) và các định dạng sử dụng (PNG, JPG). Bàn giao cùng Cẩm nang hướng dẫn sử dụng thương hiệu (Brand Guidelines) nếu có trong gói dịch vụ.</p>`,
      },
      {
        title: 'Chính sách bảo mật',
        slug: 'chinh-sach-bao-mat-thong-tin',
        htmlContent: `<h2>Chính sách Bảo mật Thông tin & Dữ liệu Cá nhân</h2>
<p>HOA VU BRANDING cam kết bảo vệ sự riêng tư và dữ liệu cá nhân của khách hàng theo đúng quy định tại <strong>Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân</strong>. Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.</p>

<h3>1. Mục đích và Phạm vi thu thập thông tin</h3>
<p>Chúng tôi chỉ thu thập các thông tin cần thiết phục vụ cho việc cung cấp dịch vụ, bao gồm:</p>
<ul>
    <li>Họ tên, Số điện thoại, Địa chỉ Email, Địa chỉ công ty.</li>
    <li>Thông tin về doanh nghiệp, thương hiệu để phục vụ cho việc tư vấn và thiết kế.</li>
</ul>
<p>Thông tin được thu thập thông qua quá trình khách hàng tương tác trên website (điền form, chat) hoặc trao đổi trực tiếp qua Zalo, Email, Hotline.</p>

<h3>2. Mục đích sử dụng thông tin</h3>
<p>HOA VU sử dụng dữ liệu cá nhân của bạn để:</p>
<ul>
    <li>Tư vấn, báo giá và cung cấp các dịch vụ thiết kế thương hiệu.</li>
    <li>Lập hợp đồng, xuất hóa đơn và xử lý các vấn đề thanh toán.</li>
    <li>Gửi thông báo về tiến độ dự án, hỗ trợ kỹ thuật, giải đáp thắc mắc.</li>
    <li>Gửi các thông tin về chương trình khuyến mãi, dịch vụ mới (chỉ khi được sự đồng ý của bạn).</li>
</ul>

<h3>3. Cam kết bảo mật & Chia sẻ thông tin</h3>
<p>Chúng tôi cam kết <strong>KHÔNG</strong> bán, trao đổi hoặc chia sẻ dữ liệu cá nhân của khách hàng cho bất kỳ bên thứ ba nào vì mục đích thương mại. Thông tin chỉ được cung cấp cho cơ quan Nhà nước có thẩm quyền khi có yêu cầu bằng văn bản theo đúng quy định của pháp luật.</p>

<h3>4. Thời gian lưu trữ dữ liệu</h3>
<p>Dữ liệu cá nhân của khách hàng sẽ được lưu trữ an toàn trên hệ thống nội bộ của HOA VU cho đến khi có yêu cầu hủy bỏ từ phía khách hàng hoặc khi dữ liệu không còn cần thiết cho mục đích đã nêu.</p>

<h3>5. Quyền của Chủ thể dữ liệu</h3>
<p>Theo Nghị định 13/2023/NĐ-CP, khách hàng có toàn quyền yêu cầu HOA VU:</p>
<ul>
    <li>Cung cấp, chỉnh sửa hoặc cập nhật thông tin cá nhân.</li>
    <li>Xóa bỏ hoàn toàn dữ liệu cá nhân khỏi hệ thống.</li>
    <li>Rút lại sự đồng ý cho phép xử lý dữ liệu.</li>
</ul>
<p>Để thực hiện các quyền này, Quý khách vui lòng liên hệ với chúng tôi qua Email: <strong>info@hoavu.vn</strong> hoặc Hotline: <strong>0889996399</strong>.</p>`,
      },
    ]);

    // 9. Site Settings
    console.log('⚙️  Creating site settings...');
    await SiteSettings.create({
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
      stats: { clients: '20000', countries: '30+', staff: '50+', support: '24/7' },
      theme: {
        primaryColor: '#D2232A',
        secondaryColor: '#FFFFFF',
        accentColor: '#FF6B35',
        fontFamily: 'Montserrat, sans-serif',
      },
      copyright: '© 2026 HOA VU. All rights reserved.',
      chatbotConfig: {
        greeting: 'Xin chào! Tôi là trợ lý ảo của Hoa Vu. Tôi có thể giúp bạn tìm hiểu về dịch vụ, báo giá, hoặc đặt lịch tư vấn.',
        quickReplies: ['Thiết kế logo', 'Báo giá', 'Xem dự án', 'Liên hệ tư vấn'],
        enabled: true,
      },
    });

    console.log('✅ Seed completed successfully!');
    console.log('📧 Admin login: admin@hoavu.vn / Admin@123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedData();
