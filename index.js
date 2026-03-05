document.addEventListener('DOMContentLoaded', () => {
    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('ServiceWorker зареєстровано: ', registration.scope);
            }, err => {
                console.log('ServiceWorker помилка реєстрації: ', err);
            });
        });
    }

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-toggle__icon');
    const htmlElement = document.documentElement;

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (systemPrefersDark) {
        htmlElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        // Accessibility: Update label dynamically if needed
        themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему');
    }

    // Mobile Menu Toggle
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav__link');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            const isOpened = nav.classList.contains('header__nav--active');
            
            nav.classList.toggle('header__nav--active');
            burger.classList.toggle('burger--active');
            
            // Accessibility: Update aria-expanded
            burger.setAttribute('aria-expanded', !isOpened);
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('header__nav--active');
                burger.classList.remove('burger--active');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Smooth Scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            // Allow default behavior for Skip Link if it's not smooth scrolled
            if (this.classList.contains('skip-link')) return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Accessibility: Move focus to the target element
                targetElement.focus({preventScroll: true});
            }
        });
    });

    // Form Submission (Demo)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Дякуємо! Ваше повідомлення відправлено. (Це демо-версія)');
            contactForm.reset();
        });
    }

    // Sticky Header Effect on Scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'var(--color-header-bg)';
            header.style.padding = '10px 0';
        } else {
            header.style.backgroundColor = 'var(--color-header-bg)';
            header.style.padding = '0';
        }
    });
});
