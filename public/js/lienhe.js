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

        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = htmlContent;
            callback();
        } else {
            console.error(`LỖI: Không tìm thấy container ID '${containerId}'`);
        }
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

document.addEventListener('DOMContentLoaded', () => {
    loadHTML('./html/client/header.html', 'header_lienhe', afterHeaderLoad);
    loadHTML('./html/client/footer.html', 'footer_lienhe');

    const form = document.getElementById('section-content');

    if (!form) {
        console.error("LỖI KHÔNG TÌM THẤY: Form với ID 'section-content' không tồn tại.");
        return;
    }

    const submitButton = document.querySelector('#btn_send');

    if (!submitButton) {
        console.error("LỖI KHÔNG TÌM THẤY: Button với ID 'btn_send' không tồn tại.");
        return;
    }

    const SERVER_ENDPOINT = "/api/send-contact";

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const urlSearchParams = new URLSearchParams(formData);
        const bodyEncoded = urlSearchParams.toString();

        submitButton.disabled = true;
        submitButton.textContent = 'Đang gửi...';

        fetch(SERVER_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: bodyEncoded
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => { throw new Error(data.message || `Lỗi không xác định (Mã: ${response.status})`); });
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    alert('✅ Gửi thông tin thành công');
                    form.reset();
                } else {
                    throw new Error(data.message);
                }
            })
            .catch(error => {
                console.error('Lỗi gửi đơn:', error);
                alert(`❌ Gửi đơn không thành công. Chi tiết lỗi: ${error.message}`);
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'GỬI ĐƠN LIÊN HỆ';
            });
    });
});
