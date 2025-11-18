
function initializeMobileMenu() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');

    if (mobileToggle && navbar) {

        const menuIcon = mobileToggle.querySelector('i');

        mobileToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');

            if (menuIcon) {
                if (navbar.classList.contains('active')) {
                    menuIcon.classList.remove('bx-menu');
                    menuIcon.classList.add('bx-x');
                } else {
                    menuIcon.classList.remove('bx-x');
                    menuIcon.classList.add('bx-menu');
                }
            }
        });
    }
}


function setActiveNav() {
    const navLinkEls = document.querySelectorAll('#navbar li a'); // Lấy tất cả thẻ <a> trong navbar
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


loadHTML('/public/html/client/header.html', 'header_home', afterHeaderLoad);
loadHTML('/public/html/client/footer.html', 'footer_home');
