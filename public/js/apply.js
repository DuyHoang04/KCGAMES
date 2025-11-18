function initializeMobileMenu() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');

    if (!mobileToggle || !navbar) {
        console.warn("CẢNH BÁO: Không tìm thấy #navbar hoặc #mobile-toggle. Menu di động không hoạt động.");
        return;
    }

    const menuIcon = mobileToggle.querySelector('i');

    mobileToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');

        if (menuIcon) {
            if (navbar.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        }
    });
}


function setActiveNav() {
    const navLinkEls = document.querySelectorAll('.nav_link');
    const windowPathname = window.location.pathname;

    navLinkEls.forEach(navLinkEl => {
        try {
            const navLinkPathname = new URL(navLinkEl.href).pathname;

            const normalizedWindowPath = (windowPathname === '/index.html' || windowPathname === '') ? '/' : windowPathname;
            const normalizedNavLinkPath = (navLinkPathname === '/index.index' || navLinkPathname === '/index.html') ? '/' : navLinkPathname;

            navLinkEl.classList.remove('active');

            if (normalizedWindowPath === normalizedNavLinkPath) {
                navLinkEl.classList.add('active');
            }
        } catch (e) {
            console.warn("LỖI XỬ LÝ LIÊN KẾT: Một liên kết điều hướng có href không hợp lệ.", navLinkEl);
        }
    });
}

async function loadHTML(url, containerId, callback = null) {
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`LỖI KHÔNG TÌM THẤY: Container với ID '${containerId}' không tồn tại.`);
            return;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url} (Mã: ${response.status} - ${response.statusText})`);
        }

        const htmlContent = await response.text();
        container.innerHTML = htmlContent;

        if (callback) {
            callback();
        }

    } catch (error) {
        console.error(`❌ Error loading HTML từ ${url}:`, error);
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
    loadHTML('./header.html', 'header_apply_form', afterHeaderLoad);
    loadHTML('./footer.html', 'footer_apply_form');

    const form = document.getElementById('form_apply');
    const submitButton = document.querySelector('#btn_send');
    const SERVER_ENDPOINT = "/api/send-application";

    if (!form) {
        console.error("LỖI KHÔNG TÌM THẤY: Form với ID 'form_apply' không tồn tại. Bỏ qua xử lý form.");
        return;
    }

    if (!submitButton) {
        console.error("LỖI KHÔNG TÌM THẤY: Button với ID 'btn_send' không tồn tại. Bỏ qua xử lý form.");
        return;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);

        submitButton.disabled = true;
        submitButton.textContent = 'Đang gửi...';

        fetch(SERVER_ENDPOINT, {
            method: 'POST',
            body: formData
        })
            .then(async response => {
                let data = {};
                try {
                    data = await response.json();
                } catch (e) {
                    console.warn("Phản hồi không phải JSON hợp lệ:", await response.text());
                }

                if (response.ok) {
                    return { status: response.status, ok: response.ok, data: data };
                } else {
                    throw new Error(data.message || `Lỗi không xác định (Mã: ${response.status})`);
                }
            })
            .then(({ data }) => {
                alert('✅ Đơn ứng tuyển đã được gửi thành công! Vui lòng kiểm tra email của bạn để nhận thư xác nhận.');
                form.reset();
            })
            .catch(error => {
                console.error('Lỗi gửi đơn:', error);
                alert(`❌ Gửi đơn không thành công. Chi tiết lỗi: ${error.message}`);
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'GỬI ĐƠN ỨNG TUYỂN';
            });
    });
});
