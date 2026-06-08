/**
 * Dingsheng Huatang - Main JavaScript
 * Handles all interactive functionality including:
 * - Scroll animations
 * - Header scroll effects
 * - Mobile menu toggle
 * - Counter animations
 * - Cookie banner
 * - Scroll to top button
 * - Form handling
 * - Smooth scroll navigation
 */

(function() {
    'use strict';

    // DOM Ready
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initHeader();
        initMobileMenu();
        initScrollAnimations();
        initCounterAnimations();
        initCookieBanner();
        initScrollTopButton();
        initSmoothScroll();
        initFormValidation();
        initTOCScrollspy();
    }

    /**
     * Header scroll effects
     */
    function initHeader() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScroll = 0;
        const scrollThreshold = 50;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    /**
     * Mobile menu toggle
     */
    function initMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.nav-menu');
        
        if (!toggle || !nav) return;

        toggle.addEventListener('click', () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            
            toggle.setAttribute('aria-expanded', !isExpanded);
            toggle.classList.toggle('active');
            nav.classList.toggle('active');

            // Animate hamburger to X
            const spans = toggle.querySelectorAll('span');
            if (!isExpanded) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // Close menu on link click
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.setAttribute('aria-expanded', 'false');
                toggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !nav.contains(e.target)) {
                toggle.setAttribute('aria-expanded', 'false');
                toggle.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }

    /**
     * Scroll-triggered animations using Intersection Observer
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.scroll-animate');
        
        if (!animatedElements.length) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            animatedElements.forEach(el => {
                el.classList.add('visible');
            });
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Counter animation for statistics
     */
    function initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number[data-counter]');
        
        if (!counters.length) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-counter'), 10);
                    const suffix = counter.getAttribute('data-suffix') || '';
                    const duration = 2000;
                    
                    if (prefersReducedMotion) {
                        counter.textContent = target + suffix;
                        return;
                    }

                    animateCounter(counter, target, suffix, duration);
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    function animateCounter(element, target, suffix, duration) {
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOut);
            
            element.textContent = currentValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * Cookie banner functionality
     */
    function initCookieBanner() {
        const banner = document.querySelector('.cookie-banner');
        const acceptBtn = document.querySelector('.cookie-accept');
        const settingsBtn = document.querySelector('.cookie-settings');
        
        if (!banner) return;

        // Check if already accepted
        if (localStorage.getItem('cookiesAccepted')) {
            return;
        }

        // Show banner with delay for animation
        setTimeout(() => {
            banner.classList.add('show');
        }, 1500);

        // Accept all cookies
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookiesAccepted', 'true');
                localStorage.setItem('cookiesAcceptedDate', new Date().toISOString());
                banner.classList.remove('show');
                
                // Enable all cookies
                enableAllCookies();
            });
        }

        // Settings button
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                // Could open a modal for granular cookie settings
                // For now, just accept all
                localStorage.setItem('cookiesAccepted', 'true');
                banner.classList.remove('show');
                enableAllCookies();
            });
        }
    }

    function enableAllCookies() {
        // Initialize analytics and tracking after consent
        console.log('Cookies enabled');
    }

    /**
     * Scroll to top button
     */
    function initScrollTopButton() {
        const button = document.querySelector('.scroll-top');
        
        if (!button) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                button.classList.add('show');
            } else {
                button.classList.remove('show');
            }
        }, { passive: true });

        // Scroll to top on click
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without scrolling
                    history.pushState(null, '', targetId);
                }
            });
        });
    }

    /**
     * Form validation and handling
     */
    function initFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            form.addEventListener('submit', handleFormSubmit);
            
            // Real-time validation
            form.querySelectorAll('input, select, textarea').forEach(field => {
                field.addEventListener('blur', () => validateField(field));
                field.addEventListener('input', () => {
                    if (field.classList.contains('error')) {
                        validateField(field);
                    }
                });
            });
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required check
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-+()]{7,20}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Update UI
        updateFieldValidation(field, isValid, errorMessage);
        
        return isValid;
    }

    function updateFieldValidation(field, isValid, message) {
        const formGroup = field.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');

        if (!isValid) {
            field.classList.add('error');
            field.classList.remove('valid');
            
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'error-message';
                errorElement.style.cssText = 'color: #c8102e; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
                formGroup.appendChild(errorElement);
            }
            errorElement.textContent = message;
        } else {
            field.classList.remove('error');
            field.classList.add('valid');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const fields = form.querySelectorAll('input, select, textarea');
        let isFormValid = true;

        fields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';

            // Simulate API call
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                // Show success message
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                
                // Reset form
                form.reset();
            }, 1500);
        }
    }

    /**
     * Table of Contents scroll spy for legal pages
     */
    function initTOCScrollspy() {
        const toc = document.querySelector('.toc');
        
        if (!toc) return;

        const sections = document.querySelectorAll('.legal-section[id]');
        
        if (!sections.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const tocLink = toc.querySelector(`a[href="#${id}"]`);
                    
                    if (tocLink) {
                        toc.querySelectorAll('a').forEach(link => {
                            link.classList.remove('active');
                        });
                        tocLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Notification system
     */
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#c8102e' : '#003478'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Add notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100px); }
        }
        .toc a.active {
            background: var(--primary, #003478);
            color: white !important;
        }
        .nav-menu.active {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            padding: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            border-radius: 0 0 16px 16px;
        }
    `;
    document.head.appendChild(style);

    /**
     * Parallax effect for hero section (subtle)
     */
    function initParallax() {
        const hero = document.querySelector('.hero');
        
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            if (scrolled < window.innerHeight) {
                hero.style.backgroundPositionY = rate + 'px';
            }
        }, { passive: true });
    }

    // Initialize parallax on larger screens
    if (window.innerWidth > 768) {
        initParallax();
    }

    /**
     * Lazy loading for images (if any)
     */
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (!lazyImages.length) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    initLazyLoading();

})();
