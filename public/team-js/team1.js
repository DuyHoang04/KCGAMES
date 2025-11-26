// /public/team-js/team1.js - TRUE Infinite Continuous Carousel (No Jump)

document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector(".carousel-wrapper");
    const track = document.querySelector(".member-track");
    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");

    if (!wrapper || !track || !nextBtn || !prevBtn) return;

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const baseCards = Array.from(track.children);
    const baseCount = baseCards.length;

    // Lấy chiều rộng 1 card
    const getCardWidth = () => baseCards[0].offsetWidth + 30;

    // Clone card vào cuối khi gần hết
    const ensureForwardInfinite = () => {
        const cardWidth = getCardWidth();

        // Nếu đã cuộn đến 70% cuối → clone thêm 1 vòng card
        if (wrapper.scrollLeft + wrapper.clientWidth > track.scrollWidth - cardWidth * 2) {
            baseCards.forEach((card) => {
                const clone = card.cloneNode(true);
                clone.classList.add("clone");
                track.appendChild(clone);
            });
        }
    };

    // Clone card vào đầu khi kéo về đầu
    const ensureBackwardInfinite = () => {
        const cardWidth = getCardWidth();

        // Nếu gần đầu → thêm 1 vòng card vào ĐẦU track
        if (wrapper.scrollLeft < cardWidth * 2) {
            const currentScroll = wrapper.scrollLeft;

            baseCards.forEach((card) => {
                const clone = card.cloneNode(true);
                clone.classList.add("clone");
                track.insertBefore(clone, track.firstElementChild);
            });

            // Giữ vị trí scroll để không bị giật
            wrapper.scrollLeft = currentScroll + baseCount * cardWidth;
        }
    };

    // Drag / swipe
    wrapper.addEventListener("mousedown", (e) => {
        isDragging = true;
        wrapper.classList.add("dragging");
        startX = e.pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        wrapper.classList.remove("dragging");
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const x = e.pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 1.3;
        wrapper.scrollLeft = scrollLeft - walk;
    });

    // Touch mobile
    wrapper.addEventListener("touchstart", (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
    });

    document.addEventListener("touchend", () => {
        isDragging = false;
    });

    document.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 1.3;
        wrapper.scrollLeft = scrollLeft - walk;
    });

    // Next / prev
    nextBtn.addEventListener("click", () => {
        wrapper.scrollLeft += getCardWidth();
    });

    prevBtn.addEventListener("click", () => {
        wrapper.scrollLeft -= getCardWidth();
    });

    // Lặp vô hạn thật sự
    wrapper.addEventListener("scroll", () => {
        ensureForwardInfinite();
        ensureBackwardInfinite();
    });

    // Khởi tạo → clone 2 vòng để track dài ngay từ đầu
    baseCards.forEach((c) => track.appendChild(c.cloneNode(true)));
    baseCards.forEach((c) => track.appendChild(c.cloneNode(true)));

});
