let lastScrollTop = 0;
const NewNav = document.getElementById('navbar');

window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        // Scroll down
        NewNav.style.top = '-10vh';
    } else {
        // Scroll up
        NewNav.style.top = '0';
    }
    lastScrollTop = scrollTop;
});