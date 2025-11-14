// /public/team-js/team1.js

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.member-track');
    const wrapper = document.querySelector('.carousel-wrapper');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (!track || !wrapper || !nextBtn || !prevBtn) return;

    let isDragging = false;
    let startX;
    let scrollLeft;
    let autoSlideInterval;

    // --- LOGIC TRƯỢT TỰ ĐỘNG ---

    const startAutoSlide = () => {
        // Xóa interval cũ nếu có
        clearInterval(autoSlideInterval);

        // Đặt interval mới (ví dụ: trượt sau mỗi 3 giây)
        autoSlideInterval = setInterval(() => {
            const scrollMax = track.scrollWidth - wrapper.clientWidth;

            // Nếu đã trượt đến cuối, quay lại đầu
            if (wrapper.scrollLeft >= scrollMax) {
                // Quay lại đầu mượt mà
                wrapper.scroll({ left: 0, behavior: 'smooth' });
            } else {
                // Trượt một đơn vị bằng chiều rộng thẻ
                const card = document.querySelector('.member-card');
                const cardWidth = card ? card.offsetWidth + 30 : 300; // Ước tính 30px margin
                wrapper.scroll({ left: wrapper.scrollLeft + cardWidth, behavior: 'smooth' });
            }
        }, 3000);
    };

    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };

    // --- LOGIC KÉO CHUỘT (DRAG/SWIPE) ---

    // 1. Chuột nhấn xuống
    wrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        stopAutoSlide(); // Dừng trượt tự động khi người dùng bắt đầu kéo
        wrapper.classList.add('active-drag');
        startX = e.pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;

        // Ngăn chặn trình duyệt xử lý sự kiện mặc định (ví dụ: chọn văn bản)
        e.preventDefault();
    });

    // 2. Chuột nhả ra
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        wrapper.classList.remove('active-drag');
        startAutoSlide(); // Tiếp tục trượt tự động sau khi nhả chuột
    });

    // 3. Chuột di chuyển
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 1.5; // Tăng tốc độ kéo (1.5x)
        wrapper.scrollLeft = scrollLeft - walk;
        updateButtons();
    });

    // Thêm hỗ trợ Touch cho thiết bị di động
    wrapper.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        isDragging = true;
        stopAutoSlide();
        startX = touch.pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
    });

    document.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        startAutoSlide();
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const x = touch.pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 1.5;
        wrapper.scrollLeft = scrollLeft - walk;
        updateButtons();
    });


    // --- LOGIC NÚT ĐIỀU KHIỂN (PREV/NEXT) ---
    const updateButtons = () => {
        const scrollPosition = wrapper.scrollLeft;
        const scrollMax = wrapper.scrollWidth - wrapper.clientWidth;

        prevBtn.disabled = scrollPosition <= 5; // Vị trí đầu
        nextBtn.disabled = scrollPosition >= scrollMax - 5; // Vị trí cuối
    };

    nextBtn.addEventListener('click', () => {
        // Dừng và bắt đầu lại trượt tự động khi nhấn nút
        stopAutoSlide();

        const card = document.querySelector('.member-card');
        const cardWidth = card ? card.offsetWidth + 30 : 300;

        // Trượt sang phải một đơn vị thẻ
        wrapper.scroll({ left: wrapper.scrollLeft + cardWidth, behavior: 'smooth' });

        // Cập nhật trạng thái nút sau khi trượt xong
        setTimeout(updateButtons, 400);
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoSlide();

        const card = document.querySelector('.member-card');
        const cardWidth = card ? card.offsetWidth + 30 : 300;

        // Trượt sang trái một đơn vị thẻ
        wrapper.scroll({ left: wrapper.scrollLeft - cardWidth, behavior: 'smooth' });

        setTimeout(updateButtons, 400);
        startAutoSlide();
    });

    // Khởi tạo trạng thái ban đầu và bắt đầu trượt tự động
    updateButtons();
    startAutoSlide();

    // Cập nhật nút khi cuộn bằng thanh cuộn (nếu có)
    wrapper.addEventListener('scroll', updateButtons);
});