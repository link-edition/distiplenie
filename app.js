// ============================================
// DISTIPLENIE - Landing Page JavaScript
// Modern Interactions & Animations
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initFormHandling();
    initAnimations();

    console.log('🚀 Distiplenie initialized!');
});

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ============================================
// SCROLL EFFECTS
// ============================================

function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.feature-card, .platform-card, .testimonial-card, .pricing-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// ============================================
// FORM HANDLING
// ============================================

function initFormHandling() {
    const ctaForm = document.getElementById('ctaForm');

    if (ctaForm) {
        ctaForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = ctaForm.querySelector('input[type="email"]').value;

            if (validateEmail(email)) {
                showNotification('Rahmat! Tez orada siz bilan bog\'lanamiz.', 'success');
                ctaForm.reset();
            } else {
                showNotification('Iltimos, to\'g\'ri email manzilini kiriting.', 'error');
            }
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
        <span class="notification-message">${message}</span>
    `;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 24px',
        background: type === 'success' ? '#10B981' : '#EF4444',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.3)',
        fontSize: '15px',
        fontWeight: '500',
        zIndex: '9999',
        animation: 'slideInRight 0.3s ease'
    });

    document.body.appendChild(notification);

    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ============================================
// ANIMATIONS
// ============================================

function initAnimations() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .feature-card:nth-child(1) { animation-delay: 0s; }
        .feature-card:nth-child(2) { animation-delay: 0.1s; }
        .feature-card:nth-child(3) { animation-delay: 0.2s; }
        .feature-card:nth-child(4) { animation-delay: 0.3s; }
        .feature-card:nth-child(5) { animation-delay: 0.4s; }
        .feature-card:nth-child(6) { animation-delay: 0.5s; }
        
        .platform-card:nth-child(1) { animation-delay: 0s; }
        .platform-card:nth-child(2) { animation-delay: 0.1s; }
        .platform-card:nth-child(3) { animation-delay: 0.2s; }
        .platform-card:nth-child(4) { animation-delay: 0.3s; }
        
        .testimonial-card:nth-child(1) { animation-delay: 0s; }
        .testimonial-card:nth-child(2) { animation-delay: 0.1s; }
        .testimonial-card:nth-child(3) { animation-delay: 0.2s; }
        
        .pricing-card:nth-child(1) { animation-delay: 0s; }
        .pricing-card:nth-child(2) { animation-delay: 0.1s; }
        .pricing-card:nth-child(3) { animation-delay: 0.2s; }
    `;
    document.head.appendChild(style);

    // Parallax effect on hero background shapes
    document.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.bg-shape');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });

    // Animate task demo in hero mockup
    animateTaskDemo();
}

function animateTaskDemo() {
    const tasks = document.querySelectorAll('.task-demo');
    let currentIndex = 2; // Start with third task (index 2)

    setInterval(() => {
        // Remove active from all
        tasks.forEach(task => task.classList.remove('active'));

        // Check checkbox and mark as done
        const currentTask = tasks[currentIndex];
        if (currentTask) {
            const checkbox = currentTask.querySelector('.task-checkbox');
            const text = currentTask.querySelector('.task-text');

            if (!checkbox.classList.contains('checked')) {
                checkbox.classList.add('checked');
                text.classList.add('done');
            }

            // Move to next unchecked task
            currentIndex++;
            if (currentIndex >= tasks.length) {
                // Reset all tasks
                setTimeout(() => {
                    tasks.forEach(task => {
                        const cb = task.querySelector('.task-checkbox');
                        const txt = task.querySelector('.task-text');
                        if (task !== tasks[0] && task !== tasks[1]) {
                            cb.classList.remove('checked');
                            txt.classList.remove('done');
                        }
                    });
                    currentIndex = 2;
                }, 1000);
            } else {
                // Highlight next task
                const nextTask = tasks[currentIndex];
                if (nextTask) {
                    nextTask.classList.add('active');
                }
            }
        }
    }, 2000);
}

// ============================================
// COUNTER ANIMATION
// ============================================

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// Initialize counters when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const value = stat.textContent;
                if (value.includes('M')) {
                    // Keep formatted text for millions
                } else if (value.includes('.')) {
                    // Keep rating format
                } else {
                    // Animate pure numbers
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats').forEach(el => {
    statsObserver.observe(el);
});
