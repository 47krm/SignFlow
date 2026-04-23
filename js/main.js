// hide the loader when page is done
window.addEventListener('load', () => {
    let loader = document.querySelector('.page-loader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 300);
});

// scroll progress bar at the top
let progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

// navbar scroll effect + back to top button + progress bar
window.addEventListener('scroll', () => {
    let nav = document.querySelector('.navbar');
    let topBtn = document.querySelector('.back-to-top');

    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    if (topBtn) topBtn.classList.toggle('visible', window.scrollY > 400);

    // update progress bar width
    let scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
        progressBar.style.width = (window.scrollY / scrollHeight) * 100 + '%';
    }
});

// highlight active page in nav
let currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage || (currentPage === '' && link.getAttribute('href') === 'index.html')) {
        link.classList.add('active');
    }
});

// mobile menu toggle
let menuBtn = document.querySelector('.nav-toggle');
let mobileMenu = document.querySelector('.mobile-nav');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && !e.target.closest('.mobile-nav')) {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

// smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        let target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            if (mobileMenu) mobileMenu.classList.remove('open');
            if (menuBtn) menuBtn.classList.remove('active');
        }
    });
});

// back to top button
let topBtn = document.querySelector('.back-to-top');
if (topBtn) {
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// scroll reveal - shows elements when they come into view
let revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// grid items stagger animation (features, services, blog, demo grids)
let gridObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            Array.from(entry.target.children).forEach((child, i) => {
                child.style.transitionDelay = i * 0.1 + 's';
                child.classList.add('revealed');
            });
            gridObserver.unobserve(entry.target);
        }
    });
});

document.querySelectorAll('.features-grid, .services-grid, .blog-grid, .demo-grid').forEach(grid => {
    Array.from(grid.children).forEach(child => child.classList.add('reveal'));
    gridObserver.observe(grid);
});

// animated number counters
let counterWatcher = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');

            let el = entry.target;
            let endVal = parseFloat(el.dataset.target);
            let suffix = el.dataset.suffix || '';
            let current = 0;

            let timer = setInterval(() => {
                current += endVal / 50;
                if (current >= endVal) {
                    current = endVal;
                    clearInterval(timer);
                }
                el.textContent = Number.isInteger(endVal) ? Math.floor(current) + suffix : current.toFixed(1) + suffix;
            }, 30);
        }
    });
});

document.querySelectorAll('[data-target]').forEach(el => counterWatcher.observe(el));

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
    let question = item.querySelector('.faq-question');
    if (question) {
        question.addEventListener('click', () => {
            let isOpen = item.classList.contains('open');
            // close all others first
            document.querySelectorAll('.faq-item.open').forEach(opened => opened.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    }
});

// testimonials slider
let track = document.querySelector('.testimonials-track');
if (track) {
    let cards = track.querySelectorAll('.testimonial-card');
    let dotsBox = document.querySelector('.slider-dots');
    let slideIndex = 0;

    let getPerView = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

    let updateSlider = () => {
        let perView = getPerView();
        let maxSlides = Math.ceil(cards.length / perView);
        if (slideIndex >= maxSlides) slideIndex = 0;
        if (slideIndex < 0) slideIndex = maxSlides - 1;

        let cardWidth = cards[0].offsetWidth + 24;
        track.style.transform = 'translateX(-' + (slideIndex * cardWidth * perView) + 'px)';

        // update dots
        if (dotsBox) {
            dotsBox.innerHTML = '';
            for (let i = 0; i < maxSlides; i++) {
                let dot = document.createElement('button');
                dot.className = 'slider-dot' + (i === slideIndex ? ' active' : '');
                dot.onclick = () => { slideIndex = i; updateSlider(); };
                dotsBox.appendChild(dot);
            }
        }
    };

    document.querySelector('.slider-btn.next')?.addEventListener('click', () => { slideIndex++; updateSlider(); });
    document.querySelector('.slider-btn.prev')?.addEventListener('click', () => { slideIndex--; updateSlider(); });

    // auto slide every 4 seconds
    setInterval(() => { slideIndex++; updateSlider(); }, 4000);
    window.addEventListener('resize', updateSlider);
    updateSlider();
}

// portfolio filter buttons
let filterBtns = document.querySelectorAll('.filter-btn');
let portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        let cat = btn.dataset.filter;
        portfolioItems.forEach(item => {
            if (cat === 'all' || item.dataset.category === cat) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// contact form validation
let form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let name = form.querySelector('#name').value.trim();
        let email = form.querySelector('#email').value.trim();
        let msg = form.querySelector('#message').value.trim();
        let errorMsg = '';

        if (!name) errorMsg = 'Please enter your name.';
        else if (!email.includes('@')) errorMsg = 'Please enter a valid email.';
        else if (msg.length < 10) errorMsg = 'Message is too short.';

        let btn = form.querySelector('[type="submit"]');
        if (errorMsg) {
            alert(errorMsg);
        } else {
            btn.textContent = 'Sending...';
            btn.disabled = true;
            setTimeout(() => {
                form.reset();
                btn.textContent = 'Send Message';
                btn.disabled = false;
                alert('Message sent successfully!');
            }, 1000);
        }
    });
}

// progress bars animation (for about page skill bars)
let progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.progress-fill').forEach(fill => {
                setTimeout(() => fill.style.width = fill.dataset.width + '%', 100);
            });
        }
    });
});
document.querySelectorAll('.progress-list').forEach(el => progressObserver.observe(el));

// copy to clipboard buttons
document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', () => {
        navigator.clipboard.writeText(el.dataset.copy).then(() => {
            let oldText = el.textContent;
            el.textContent = 'Copied!';
            setTimeout(() => el.textContent = oldText, 2000);
        });
    });
});

// newsletter form
document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let btn = form.querySelector('button');
        let input = form.querySelector('input');
        if (!input.value) return;

        btn.textContent = 'Subscribed!';
        btn.disabled = true;
        input.value = '';
        setTimeout(() => {
            btn.textContent = 'Subscribe';
            btn.disabled = false;
        }, 3000);
    });
});

// hero title fade in animation
let heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(20px)';
    setTimeout(() => {
        heroTitle.style.transition = 'all 0.8s ease';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }, 300);
}
