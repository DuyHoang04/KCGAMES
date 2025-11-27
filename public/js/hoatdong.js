function initializeMobileMenu() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');

    if (mobileToggle && navbar) {
        const menuIcon = mobileToggle.querySelector('i');

        mobileToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');

            if (navbar.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    }
}


function setActiveNav() {
    const navLinkEls = document.querySelectorAll('.nav_link');
    const windowPathname = window.location.pathname;

    navLinkEls.forEach(navLinkEl => {
        const navLinkPathname = new URL(navLinkEl.href).pathname;
        const normalizedWindowPath = (windowPathname === '/index.html' || windowPathname === '') ? '/' : windowPathname;
        const normalizedNavLinkPath = (navLinkPathname === '/index.index' || navLinkPathname === '/index.html') ? '/' : navLinkPathname;

        navLinkEl.classList.remove('active');
        if (normalizedWindowPath === normalizedNavLinkPath) {
            navLinkEl.classList.add('active');
        }
    });
}

async function loadHTML(url, containerId, callback = () => { }) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const htmlContent = await response.text();

        document.getElementById(containerId).innerHTML = htmlContent;
        callback();

    } catch (error) {
        console.error("Error loading HTML:", error);
    }
}

async function loadActivities() {
    try {
        const res = await fetch("/public/data/hoatdong.json");
        if (!res.ok) throw new Error("Không load được hoatdong.json");
        const data = await res.json();

        // sort: mới nhất lên trước
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        const container = document.getElementById("activity-list");

        container.innerHTML = data.map(item => {
            const dateStr = new Date(item.date).toLocaleDateString("vi-VN");
            return `
                <article class="activity-item scroll-reveal" data-id="${item.id}">
                    <div class="activity-thumb">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="activity-content">
                        <div class="activity-meta">${dateStr}</div>
                        <h2 class="activity-title">${item.title}</h2>
                        <p class="activity-desc">${item.shortDescription}</p>
                        <span class="activity-readmore">
                            Xem chi tiết
                            <i class='bx bx-right-arrow-alt'></i>
                        </span>
                    </div>
                </article>
            `;
        }).join("");

        // click -> sang trang chi tiết
        document.querySelectorAll(".activity-item").forEach(card => {
            card.addEventListener("click", () => {
                const id = card.getAttribute("data-id");
                window.location.href = `/public/activities/detail.html?id=${encodeURIComponent(id)}`;
            });
        });

        initScrollReveal();
    } catch (err) {
        console.error(err);
    }
}

function initScrollReveal() {
    const elements = document.querySelectorAll(".scroll-reveal");
    const reveal = () => {
        const trigger = window.innerHeight * 0.85;
        elements.forEach(el => {
            const rectTop = el.getBoundingClientRect().top;
            if (rectTop < trigger) el.classList.add("active");
        });
    };

    window.addEventListener("scroll", reveal);
    reveal();
}

document.addEventListener("DOMContentLoaded", loadActivities);


function loadGTranslate() {
    window.gtranslateSettings = {
        "default_language": "vi",
        "languages": ["vi", "en"],
        "wrapper_selector": ".gtranslate_wrapper",
        "detect_browser_language": true,
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdn.gtranslate.net/widgets/latest/float.js';
    document.body.appendChild(script);
}

function afterHeaderLoad() {
    setActiveNav();
    initializeMobileMenu();
    loadGTranslate();
}


loadHTML('./html/client/header.html', 'header_hoatdong', afterHeaderLoad);
loadHTML('./html/client/footer.html', 'footer_hoatdong');
