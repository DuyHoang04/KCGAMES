
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
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".scroll-reveal");

    const reveal = () => {
        const trigger = window.innerHeight * 0.55;

        elements.forEach(el => {
            const rect = el.getBoundingClientRect().top;
            if (rect < trigger) el.classList.add("active");
        });
    };

    window.addEventListener("scroll", reveal);
    reveal();
});

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


loadHTML('./html/client/header.html', 'header_gioi_thieu', afterHeaderLoad);
loadHTML('./html/client/footer.html', 'footer_gioi_thieu');
