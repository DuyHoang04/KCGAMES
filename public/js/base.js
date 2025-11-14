if (window.location.protocol === 'file:') {
    // Tạo thẻ <base>
    const base = document.createElement('base');

    // Thiết lập gốc là thư mục 'public' (tương đối so với file đang mở)
    // Điều này biến đường dẫn /css/header.css thành ./public/css/header.css
    base.href = './public/';

    // Chèn thẻ <base> vào đầu <head> để nó có hiệu lực ngay lập tức
    document.head.prepend(base);
}