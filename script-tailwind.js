// Soma Ko Landing Pages - Tailwind CSS Clean Script
// Clean, modern JavaScript for enhanced user interactions

(function() {
    'use strict';
    
    // DOM Elements
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // Navigation Scroll Effect
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar?.classList.add('bg-white/95', 'shadow-lg');
            navbar?.classList.remove('bg-white/90');
        } else {
            navbar?.classList.add('bg-white/90');
            navbar?.classList.remove('bg-white/95', 'shadow-lg');
        }
    }
    
    // Mobile Menu Toggle
    function toggleMobileMenu() {
        if (mobileMenu) {
            const isHidden = mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden', !isHidden);
        }
    }
    
    // Smooth Scrolling for Anchor Links
    function smoothScroll(e) {
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                mobileMenu?.classList.add('hidden');
            }
        }
    }
    
    // Counter Animation
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count').replace(/\D/g, ''));
            const suffix = counter.getAttribute('data-count').replace(/\d/g, '');
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current).toLocaleString() + suffix;
            }, 20);
        });
    }
    
    // Intersection Observer for Animations
    function setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                    // Trigger counter animation if it has data-count
                    if (entry.target.hasAttribute('data-count')) {
                        animateCounters();
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements with data-count
        document.querySelectorAll('[data-count]').forEach(el => {
            observer.observe(el);
        });
        
        // Observe feature cards
        document.querySelectorAll('.group').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Initialize App
    function init() {
        // Scroll handler
        window.addEventListener('scroll', handleScroll);
        
        // Mobile menu
        mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
        
        // Smooth scrolling
        document.addEventListener('click', smoothScroll);
        
        // Setup animations
        setupIntersectionObserver();
        
        // Initial scroll check
        handleScroll();
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();