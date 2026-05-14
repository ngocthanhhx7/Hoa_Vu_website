const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Page = require('./models/Page');

const updatePages = async () => {
  try {
    await connectDB();
    console.log('🔄 Đang cập nhật nội dung các trang chính sách...');

    const policies = [
      {
        slug: 'chinh-sach-va-quy-dinh',
        title: 'Chính sách và quy định',
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
        slug: 'quy-trinh-dat-thiet-ke',
        title: 'Quy trình đặt thiết kế',
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
        slug: 'chinh-sach-bao-mat-thong-tin',
        title: 'Chính sách bảo mật',
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
      }
    ];

    for (const p of policies) {
      await Page.findOneAndUpdate(
        { slug: p.slug },
        { 
          $set: { 
            htmlContent: p.htmlContent,
            seo: {
              title: p.title + ' | HOA VU BRANDING',
              description: p.htmlContent.substring(0, 150).replace(/<[^>]*>?/gm, '') + '...',
              keywords: [p.title, 'hoavu branding', 'chính sách', 'quy định']
            }
          } 
        },
        { upsert: true, new: true }
      );
      console.log(`✅ Đã cập nhật trang: ${p.title}`);
    }

    console.log('🎉 Cập nhật hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
};

updatePages();
