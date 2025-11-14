const sliderContainer = document.querySelector('.slider-container');
const slides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
let currentSlide = 0;
const totalSlides = slides.length;

// Hàm để chuyển slide
function showSlide(index) {
    // 1. Loại bỏ class 'active' khỏi slide hiện tại
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // 2. Thêm class 'active' vào slide mới
    slides[index].classList.add('active');

    // 3. (Tùy chọn) Cập nhật thanh tiến trình hoặc số slide
    // ...
}

// Xử lý nút Next
nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
});

// Xử lý nút Previous
prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
});

// Khởi tạo slide đầu tiên
showSlide(currentSlide);