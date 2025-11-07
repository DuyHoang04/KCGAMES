const navLinkEls = document.querySelectorAll('.nav_link');
const windowPathname = window.location.pathname;

navLinkEls.forEach(navLinkEl => {
    const navLinkPathname = new URL(navLinkEl.href).pathname;
    const normalizedWindowPath = windowPathname === '/' || windowPathname === '/index.html' ? '/' : windowPathname;
    const normalizedNavLinkPath = navLinkPathname === '/index.html' ? '/' : navLinkPathname;
    if (normalizedWindowPath === normalizedNavLinkPath) {
        navLinkEl.classList.add('active');
    }
});