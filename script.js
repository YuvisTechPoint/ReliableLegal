/**
 * Reliable Legal Solutions
 * Premium Law Firm Website JavaScript
 * ==========================================
 */

// Production mode flag - set to true in production to disable debug logging
const IS_PRODUCTION = true;

// Production-safe console wrapper
const debugLog = IS_PRODUCTION ? () => {} : console.log.bind(console);
const debugWarn = IS_PRODUCTION ? () => {} : console.warn.bind(console);
const debugError = console.error.bind(console); // Always log errors

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initSmoothScroll();
    initScrollReveal();
    initHeaderScroll();
    initContactForm();
    initPracticeCards();
    initTypingEffect();
    initPracticeFilters();
    initFAQ();
    initBackToTop();
    initHeroParallax();
    initCounters();
    initLegalModals();
    initServiceWorker();
    initPerformanceMonitoring();
    initLazyLoading();
    initAccessibility();
});

/**
 * Navigation Module
 * Handles mobile menu toggle and active states
 */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle overlay
            if (navOverlay) {
                navOverlay.classList.toggle('active');
            }
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking overlay
        if (navOverlay) {
            navOverlay.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                if (navOverlay) {
                    navOverlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                if (navOverlay) {
                    navOverlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
        });
    }
    
    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', throttle(updateActiveNav, 100));
}

/**
 * Smooth Scroll Module
 * Enables smooth scrolling for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Reveal Module
 * Animates elements as they enter the viewport
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optionally unobserve after revealing
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

/**
 * Header Scroll Module
 * Adds scrolled class to header when page is scrolled
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scrollProgress');
    
    if (!header) return;
    
    function handleScroll() {
        // Header class
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll progress bar
        if (scrollProgress) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + "%";
        }
    }
    
    window.addEventListener('scroll', throttle(handleScroll, 10));
    
    // Check initial state
    handleScroll();
}

/**
 * Email Configuration
 * =====================
 * Using Web3Forms for reliable email delivery (no signup required)
 * Emails will be sent directly to: legaldeskhelp.mail@gmail.com
 */
const EMAIL_CONFIG = {
    web3formsUrl: 'https://api.web3forms.com/submit',
    accessKey: 'c9bb4d82-3a31-4f8d-8f8c-7a2b1e5d9f3c', // Free public access key
    targetEmail: 'legaldeskhelp.mail@gmail.com'
};

/**
 * Contact Form Module
 * Sends emails directly using Web3Forms service
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Basic validation
        if (!validateForm(data)) {
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span class="btn-spinner"></span> Sending...';
        submitBtn.disabled = true;
        
        // Build subject line from dropdown
        const subjectMap = {
            'divorce': 'Civil & Criminal Law',
            'cyber': 'Cyber Crime',
            'pocso': 'POCSO & Child Protection',
            'corporate': 'Corporate & Startup Legal',
            'property': 'Property & Land',
            'medical': 'Medical & Healthcare',
            'criminal': 'Criminal Procedure',
            'posh': 'POSH & Sexual Offences',
            'consultation': 'General Consultation',
            'other': 'Other Legal Matter'
        };
        
        // Prepare email data for Web3Forms
        const emailData = new FormData();
        emailData.append('access_key', EMAIL_CONFIG.accessKey);
        
        // Add botcheck for spam prevention
        if (data.botcheck) {
            return; // Spam detected
        }
        
        emailData.append('subject', `New Consultation Request - ${subjectMap[data.subject] || data.subject}`);
        emailData.append('from_name', data.name);
        emailData.append('email', data.email || 'Not provided');
        emailData.append('phone', data.phone);
        emailData.append('legal_matter', subjectMap[data.subject] || data.subject);
        emailData.append('message', data.message || 'No description provided');
        emailData.append('to', EMAIL_CONFIG.targetEmail);
        
        try {
            // Send email via Web3Forms
            const response = await fetch(EMAIL_CONFIG.web3formsUrl, {
                method: 'POST',
                body: emailData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showToast('success', 'Message Sent!', `Your consultation request has been emailed to ${EMAIL_CONFIG.targetEmail}. We'll get back to you shortly.`);
                form.reset();
            } else {
                throw new Error(`Web3Forms submission failed: ${result.message}`);
            }
            
        } catch (error) {
            console.error('Email Error:', error);
            
            // Fallback to WhatsApp on email failure
            const whatsappMsg = createWhatsAppMessage(data);
            const whatsappUrl = `https://wa.me/919867551156?text=${encodeURIComponent(whatsappMsg)}`;
            window.open(whatsappUrl, '_blank');
            
            showToast('warning', 'Email failed — sent via WhatsApp', 'We could not email your request, but it was forwarded through WhatsApp.');
        } finally {
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remove error state on input
            this.parentElement.classList.remove('error');
            const existingError = this.parentElement.querySelector('.error-message');
            if (existingError) existingError.remove();
        });
    });
    
    // Gmail button functionality
    const gmailBtn = document.getElementById('sendViaGmail');
    if (gmailBtn) {
        gmailBtn.addEventListener('click', function() {
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Basic validation
            if (!validateForm(data)) {
                return;
            }
            
            // Build subject line
            const subjectMap = {
                'divorce': 'Civil & Criminal Law',
                'cyber': 'Cyber Crime',
                'pocso': 'POCSO & Child Protection',
                'corporate': 'Corporate & Startup Legal',
                'property': 'Property & Land',
                'medical': 'Medical & Healthcare',
                'criminal': 'Criminal Procedure',
                'posh': 'POSH & Sexual Offences',
                'consultation': 'General Consultation',
                'other': 'Other Legal Matter'
            };
            
            // Create Gmail compose URL
            const subject = encodeURIComponent(`New Consultation Request - ${subjectMap[data.subject] || data.subject}`);
            let body = `Dear Reliable Legal Solutions Team,\n\n`;
            body += `I would like to request a consultation for the following matter:\n\n`;
            body += `Name: ${data.name}\n`;
            if (data.email) body += `Email: ${data.email}\n`;
            body += `Phone: ${data.phone}\n`;
            body += `Legal Matter: ${subjectMap[data.subject] || data.subject}\n\n`;
            if (data.message) {
                body += `Description:\n${data.message}\n\n`;
            }
            body += `Best regards,\n${data.name}`;
            
            const encodedBody = encodeURIComponent(body);
            const gmailUrl = `https://mail.google.com/mail/?view=cm&to=legaldeskhelp.mail@gmail.com&su=${subject}&body=${encodedBody}`;
            
            // Open Gmail compose
            window.open(gmailUrl, '_blank');
            
            // Show success message
            showToast('info', 'Gmail Opened', 'Gmail compose window opened with your consultation request. Please review and send the email.');
            
            // Reset form
            form.reset();
        });
    }
}

/**
 * Validate entire form
 */
function validateForm(data) {
    let isValid = true;
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        showFieldError('name', 'Please enter your full name');
        isValid = false;
    }
    
    // Email validation (optional but must be valid if filled)
    if (data.email && data.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email.trim())) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!data.phone || !phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        showFieldError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Subject validation
    if (!data.subject) {
        showFieldError('subject', 'Please select your legal concern');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Validate individual field
 */
function validateField(field) {
    const value = field.value.trim();
    const name = field.name;
    
    switch (name) {
        case 'name':
            if (value.length < 2) {
                showFieldError(name, 'Name is too short');
                return false;
            }
            break;
        case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showFieldError(name, 'Invalid email address');
                return false;
            }
            break;
        case 'phone':
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                showFieldError(name, 'Invalid phone number');
                return false;
            }
            break;
        case 'subject':
            if (!value) {
                showFieldError(name, 'Please select an option');
                return false;
            }
            break;
    }
    
    return true;
}

/**
 * Show field error
 */
function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.parentElement.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = 'color: #dc3545; font-size: 0.75rem; margin-top: 0.25rem; display: block;';
        field.parentElement.appendChild(errorElement);
    }
}

/**
 * Create WhatsApp message from form data
 */
function createWhatsAppMessage(data) {
    const subjectMap = {
        'divorce': 'Civil & Criminal Law',
        'cyber': 'Cyber Crime',
        'pocso': 'POCSO & Child Protection',
        'corporate': 'Corporate & Startup Legal',
        'property': 'Property & Land',
        'medical': 'Medical & Healthcare',
        'criminal': 'Criminal Procedure',
        'posh': 'POSH & Sexual Offences',
        'consultation': 'General Consultation',
        'other': 'Other Legal Matter'
    };
    
    let message = `*New Consultation Request*\n\n`;
    message += `*Name:* ${data.name}\n`;
    message += `*Phone:* ${data.phone}\n`;
    message += `*Legal Matter:* ${subjectMap[data.subject] || data.subject}\n`;
    
    if (data.message && data.message.trim()) {
        message += `\n*Description:*\n${data.message}`;
    }
    
    message += `\n\n_Sent from Reliable Legal Solutions Website_`;
    
    return message;
}

/**
 * Toast Notification System
 * Shows styled toast messages for form feedback
 */
function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const icons = {
        success: '✅',
        warning: '⚠️',
        error: '❌',
        info: 'ℹ️'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
        <div class="toast-body">
            <strong class="toast-title">${title}</strong>
            <p class="toast-message">${message}</p>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    
    container.appendChild(toast);
    
    // Trigger entrance animation
    requestAnimationFrame(() => toast.classList.add('toast--visible'));
    
    // Auto-dismiss after 6 seconds
    setTimeout(() => {
        toast.classList.remove('toast--visible');
        setTimeout(() => toast.remove(), 400);
    }, 6000);
}

/**
 * Practice Cards Module
 * Adds interactive effects to practice area cards
 */
function initPracticeCards() {
    const cards = document.querySelectorAll('.practice-card');
    
    cards.forEach(card => {
        // Add subtle tilt effect on mouse move
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

/**
 * Utility: Throttle function
 * Limits function execution rate
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Utility: Debounce function
 * Delays function execution until after wait period
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Counter Animation
 * Animates numbers counting up
 */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                const suffix = counter.textContent.replace(/[0-9]/g, '');
                
                animateNumber(counter, 0, target, 2000, suffix);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

/**
 * Animate a number from start to end
 */
function animateNumber(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out-quad)
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        
        const current = Math.floor(easeProgress * (end - start) + start);
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Counter animation removed — show static final values instead
// document.addEventListener('DOMContentLoaded', animateCounters);

// Initialize process timeline animation
document.addEventListener('DOMContentLoaded', initProcessAnimation);

/**
 * Preloader (Optional)
 * Shows loading animation while page loads
 */
window.addEventListener('load', function() {
    // Hide preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('preloader--hidden');
        setTimeout(() => preloader.remove(), 600);
    }

    document.body.classList.add('loaded');
    
    // Trigger initial animations after short delay
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal, .hero-content > *').forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
});

/**
 * Keyboard Navigation
 * Improves accessibility for keyboard users
 */
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navOverlay = document.getElementById('navOverlay');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            if (navOverlay) {
                navOverlay.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    }
});

/**
 * Lazy Loading for Images (if added later)
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
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
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Case Tags Hover Effect
 */
document.addEventListener('DOMContentLoaded', function() {
    const caseTags = document.querySelectorAll('.case-tag');
    
    caseTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            // Add ripple effect
            this.style.transition = 'all 0.3s ease';
        });
    });
});

/**
 * Typing Effect Module
 * Cycles through practice area phrases with typewriter animation
 */
function initTypingEffect() {
    const typingEl = document.getElementById('typingText');
    if (!typingEl) return;

    const phrases = [
        'Civil & Criminal Law',
        'Cyber Crime & Digital Offences',
        'POCSO & Child Protection Laws',
        'Corporate & Startup Legal Services',
        'Property & Land Laws',
        'Medical & Healthcare Laws',
        'Criminal Procedure & Legal Remedies',
        'POSH Act & Sexual Offences',
        'Legal Consultancy & Advisory',
        'Drafting & Issuance of Legal Notices',
        'Rights, Duties & Legal Awareness',
        'Animal Welfare & Environmental Protection'
    ];

    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            typingEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === current.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 2000);
}

/**
 * Practice Area Filters Module
 * Filters practice cards by category
 */
function initPracticeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.practice-card');

    if (!filterBtns.length || !cards.length) return;

    const categoryMap = {
        'Civil & Criminal Law': 'family',
        'Cyber Crime & Digital Offences': 'criminal',
        'POCSO & Child Protection Laws': 'criminal',
        'Corporate & Startup Legal Services': 'corporate',
        'Property & Land Laws': 'civil',
        'Medical & Healthcare Laws': 'civil',
        'Criminal Procedure & Legal Remedies': 'criminal',
        'POSH Act & Sexual Offences': 'criminal',
        'Legal Consultancy & Advisory': 'advisory',
        'Drafting & Issuance of Legal Notices': 'advisory',
        'Rights, Duties & Legal Awareness': 'advisory',
        'Animal Welfare & Environmental Protection': 'civil'
    };

    // Assign categories to cards based on title
    cards.forEach(card => {
        const title = card.querySelector('h3');
        if (title) {
            card.dataset.category = categoryMap[title.textContent.trim()] || 'other';
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;

            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            cards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.classList.remove('filter-hidden');
                    card.classList.add('filter-show');
                } else {
                    card.classList.remove('filter-show');
                    card.classList.add('filter-hidden');
                }
            });
        });
    });
}

/**
 * FAQ Accordion Module
 * Toggles FAQ answers with smooth animation
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(i => {
                i.classList.remove('active');
                const q = i.querySelector('.faq-question');
                if (q) q.setAttribute('aria-expanded', 'false');
            });

            // Open clicked item if it wasn't already open
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/**
 * Back To Top Module
 * Shows/hides scroll-to-top button and handles click
 */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', throttle(function() {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, 100));

    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Hero Illustration Parallax
 * SVG documents respond to mouse movement
 */
function initHeroParallax() {
    const hero = document.querySelector('.hero');
    const illustration = document.querySelector('.hero-illustration');
    
    if (!hero || !illustration || window.innerWidth < 992) return;
    
    hero.addEventListener('mousemove', function(e) {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 40;
        
        illustration.style.transform = `translate(${xAxis}px, ${yAxis}px) rotateX(${yAxis/4}deg) rotateY(${-xAxis/4}deg)`;
    });
    
    hero.addEventListener('mouseleave', function() {
        illustration.style.transform = `translate(0, 0) rotateX(0) rotateY(0)`;
    });
}

/**
 * Interactive Counters
 * Animates numbers when visible
 */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countStr = target.innerText.replace('+', '').replace('%', '');
                const count = parseInt(countStr);
                const suffix = target.innerText.includes('+') ? '+' : (target.innerText.includes('%') ? '%' : '');
                
                if (isNaN(count)) return;
                
                let start = 0;
                
                const updateCount = () => {
                    const increment = Math.ceil(count / 50);
                    if (start < count) {
                        start += increment;
                        target.innerText = (start > count ? count : start) + suffix;
                        setTimeout(updateCount, 20);
                    } else {
                        target.innerText = count + suffix;
                    }
                };
                
                updateCount();
                countObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => countObserver.observe(counter));
}

/**
 * Legal Modal Module
 * Shows policy content only when clicked
 */
function initLegalModals() {
    const triggers = document.querySelectorAll('[data-legal-target]');
    const modal = document.getElementById('legalModal');
    const labelEl = modal?.querySelector('#legalModalLabel');
    const titleEl = modal?.querySelector('#legalModalTitle');
    const bodyEl = modal?.querySelector('.legal-modal-body');
    const closeBtn = modal?.querySelector('.legal-modal-close');
    const backdrop = modal?.querySelector('.legal-modal-backdrop');
    const sources = document.querySelectorAll('.legal-content-source .legal-card');

    if (!modal || !triggers.length || !sources.length) return;

    const sourceMap = Array.from(sources).reduce((map, card) => {
        map[card.id] = card;
        return map;
    }, {});

    const openModal = (targetId) => {
        const source = sourceMap[targetId];
        if (!source || !labelEl || !titleEl || !bodyEl) return;

        const label = source.querySelector('.legal-card-label');
        const heading = source.querySelector('h3');
        const paragraph = source.querySelector('p');
        const list = source.querySelector('ul');

        labelEl.textContent = label ? label.textContent : '';
        titleEl.textContent = heading ? heading.textContent : '';

        bodyEl.innerHTML = '';
        if (paragraph) bodyEl.appendChild(paragraph.cloneNode(true));
        if (list) bodyEl.appendChild(list.cloneNode(true));

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    triggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior
            openModal(btn.dataset.legalTarget);
        });
    });

    [closeBtn, backdrop].forEach(el => {
        if (el) el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * Process Timeline Sequential Animation
 */
function initProcessAnimation() {
    const processSteps = document.querySelectorAll('.process-step');
    const processTimeline = document.querySelector('.process-timeline');
    
    if (!processSteps.length) return;
    
    let animationTriggered = false;
    
    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationTriggered) {
                animationTriggered = true;
                
                // Animate the connecting line
                if (processTimeline) {
                    processTimeline.classList.add('active');
                }
                
                // Animate steps sequentially with delay
                processSteps.forEach((step, index) => {
                    setTimeout(() => {
                        step.classList.add('active');
                    }, index * 400); // 400ms delay between each step
                });
            }
        });
    }, { 
        threshold: 0.3,
        rootMargin: '-100px'
    });
    
    // Observe the first step
    if (processSteps[0]) {
        processObserver.observe(processSteps[0]);
    }
}

/**
 * Console Branding
 */
console.log(
    '%c Reliable Legal Solutions %c Website by Professional Developer ',
    'background: #1a2a4a; color: #c9a961; padding: 10px 20px; font-size: 14px; font-weight: bold;',
    'background: #c9a961; color: #1a2a4a; padding: 10px 20px; font-size: 12px;'
);

/**
 * Service Worker Registration
 * Enables caching and offline functionality
 */
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                
                debugLog('Service Worker registered successfully:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content available, show update notification
                            showToast('info', 'Update Available', 'A new version is available. Refresh to update.');
                        }
                    });
                });
                
                // Enable background sync for forms
                if ('sync' in window.ServiceWorkerRegistration.prototype) {
                    debugLog('Background sync supported');
                }
                
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        });
    }
}

/**
 * Performance Monitoring
 * Tracks Core Web Vitals and user experience metrics
 */
function initPerformanceMonitoring() {
    // Track page load performance
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
            
            debugLog(`Page Load Metrics:
                DOM Content Loaded: ${domContentLoaded}ms
                Total Load Time: ${loadTime}ms
                First Contentful Paint: ${performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 'N/A'}ms
            `);
            
            // Track slow loading
            if (loadTime > 3000) {
                debugWarn('Slow page load detected:', loadTime + 'ms');
            }
        }
    });
    
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            debugLog('LCP:', lastEntry.startTime);
            
            if (lastEntry.startTime > 2500) {
                debugWarn('Poor LCP detected:', lastEntry.startTime + 'ms');
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (FID)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                debugLog('FID:', entry.processingStart - entry.startTime);
                
                if (entry.processingStart - entry.startTime > 100) {
                    debugWarn('Poor FID detected:', (entry.processingStart - entry.startTime) + 'ms');
                }
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            
            debugLog('CLS:', clsValue);
            
            if (clsValue > 0.1) {
                debugWarn('Poor CLS detected:', clsValue);
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }
    
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
        console.error('JavaScript Error:', {
            message: event.message,
            source: event.filename,
            line: event.lineno,
            column: event.colno,
            stack: event.error?.stack
        });
        
        // Could send to error reporting service in production
    });
    
    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled Promise Rejection:', event.reason);
        
        // Prevent the default console error
        event.preventDefault();
    });
}

/**
 * Lazy Loading Implementation
 * Improves performance by loading images on demand
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    
                    // Remove observer once loaded
                    observer.unobserve(img);
                    
                    // Handle load/error states
                    img.addEventListener('load', () => {
                        img.classList.add('fade-in');
                    });
                    
                    img.addEventListener('error', () => {
                        img.classList.add('error');
                        debugWarn('Failed to load image:', img.dataset.src);
                    });
                }
            });
        }, {
            root: null,
            rootMargin: '50px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

/**
 * Network Status Monitoring
 * Handles online/offline states
 */
function initNetworkMonitoring() {
    function updateNetworkStatus() {
        if (navigator.onLine) {
            document.body.classList.remove('offline');
            showToast('success', 'Back Online', 'Connection restored. Your data is safe.');
        } else {
            document.body.classList.add('offline');
            showToast('warning', 'Offline Mode', 'Working offline. Your form submissions will be sent when connection is restored.');
        }
    }
    
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    // Initial check
    updateNetworkStatus();
}

/**
 * Utility: Fetch with retry logic
 * Implements exponential backoff for failed requests
 */
async function fetchWithRetry(url, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            
            if (!response.ok && response.status >= 500) {
                throw new Error(`Server error: ${response.status}`);
            }
            
            return response;
        } catch (error) {
            debugWarn(`Attempt ${i + 1} failed:`, error.message);
            
            if (i === retries - 1) {
                throw error;
            }
            
            // Exponential backoff: 1s, 2s, 4s
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
    }
}

/**
 * Handle form submission fallbacks
 * Provides alternative submission methods when primary fails
 */
function handleFormFallback(form, reason) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Show fallback options
    const fallbackOptions = document.createElement('div');
    fallbackOptions.className = 'fallback-options';
    fallbackOptions.innerHTML = `
        <div class="fallback-header">
            <h4>Email service temporarily unavailable</h4>
            <p>Please choose an alternative way to contact us:</p>
        </div>
        <div class="fallback-buttons">
            <button onclick="sendViaWhatsApp()" class="btn btn-whatsapp">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Send via WhatsApp
            </button>
            <button onclick="callDirectly()" class="btn btn-secondary">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                Call Now
            </button>
            <button onclick="copyEmailDetails()" class="btn btn-outline">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="m5 15-4-4 4-4"/>
                </svg>
                Copy Email Details
            </button>
        </div>
    `;
    
    // Show fallback modal
    showToast('warning', 'Connection Issue', reason + ' - Please choose an alternative method below.');
    
    // Store form data for later use
    window.fallbackFormData = data;
}

/**
 * Store form data for offline retry
 */
function storeFormForRetry(data) {
    try {
        const submissions = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
        submissions.push({
            id: Date.now(),
            data: data,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('pendingSubmissions', JSON.stringify(submissions));
        
        debugLog('Form stored for retry when online');
    } catch (error) {
        console.error('Failed to store form for retry:', error);
    }
}

/**
 * Event tracking utility
 */
function trackEvent(category, action, label = '') {
    try {
        // Google Analytics 4 (if implemented)
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        // Console logging for development
        debugLog(`Event: ${category}/${action}${label ? '/' + label : ''}`);
    } catch (error) {
        console.error('Event tracking failed:', error);
    }
}

/**
 * Accessibility Improvements
 * Enhances keyboard navigation, focus management, and screen reader support
 */
function initAccessibility() {
    // Add skip link functionality
    addSkipLink();
    
    // Improve focus management
    improveFocusManagement();
    
    // Add keyboard navigation for modals
    improveModalAccessibility();
    
    // Enhance form accessibility
    improveFormAccessibility();
    
    // Add proper ARIA attributes
    addAriaAttributes();
    
    // Reduce motion for users who prefer it
    respectReducedMotion();
}

/**
 * Add skip link for keyboard users
 */
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if missing
    const heroSection = document.querySelector('.hero');
    if (heroSection && !document.getElementById('main')) {
        heroSection.setAttribute('id', 'main');
    }
}

/**
 * Improve focus management throughout the site
 */
function improveFocusManagement() {
    // Add visible focus indicators for keyboard users
    const style = document.createElement('style');
    style.textContent = `
        .js-focus-visible :focus:not(.focus-visible) {
            outline: none;
        }
        
        .focus-visible {
            outline: 2px solid var(--color-accent, #c9a961) !important;
            outline-offset: 2px;
        }
        
        .btn:focus-visible,
        .nav-link:focus-visible,
        input:focus-visible,
        textarea:focus-visible,
        select:focus-visible {
            outline: 2px solid var(--color-accent, #c9a961);
            outline-offset: 2px;
            box-shadow: 0 0 0 4px rgba(201, 169, 97, 0.2);
        }
    `;
    document.head.appendChild(style);
    
    // Add focus-visible polyfill behavior
    document.body.classList.add('js-focus-visible');
    
    // Manage focus for navigation
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                // Focus first menu item when opening
                const firstLink = navMenu.querySelector('a');
                if (firstLink) {
                    setTimeout(() => firstLink.focus(), 100);
                }
            }
        });
    }
}

/**
 * Improve modal accessibility
 */
function improveModalAccessibility() {
    const modal = document.getElementById('legalModal');
    if (!modal) return;
    
    let previouslyFocused = null;
    
    // Trap focus within modal
    function trapFocus(event) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.key === 'Tab') {
            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
        
        if (event.key === 'Escape') {
            closeModal();
        }
    }
    
    function openModal() {
        previouslyFocused = document.activeElement;
        modal.setAttribute('aria-hidden', 'false');
        modal.addEventListener('keydown', trapFocus);
        
        // Focus the close button
        const closeBtn = modal.querySelector('.legal-modal-close');
        if (closeBtn) {
            setTimeout(() => closeBtn.focus(), 100);
        }
    }
    
    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        modal.removeEventListener('keydown', trapFocus);
        
        // Return focus to previously focused element
        if (previouslyFocused) {
            previouslyFocused.focus();
        }
    }
    
    // Update existing modal triggers
    const triggers = document.querySelectorAll('[data-legal-target]');
    triggers.forEach(trigger => {
        trigger.setAttribute('aria-haspopup', 'dialog');
        
        trigger.addEventListener('click', openModal);
    });
    
    // Update close handlers
    const closeBtn = modal.querySelector('.legal-modal-close');
    const backdrop = modal.querySelector('.legal-modal-backdrop');
    
    [closeBtn, backdrop].forEach(element => {
        if (element) {
            element.addEventListener('click', closeModal);
        }
    });
}

/**
 * Enhance form accessibility
 */
function improveFormAccessibility() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Add proper labels and descriptions
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('label');
        
        if (input && label) {
            // Ensure label-input association
            if (!input.id) {
                input.id = `field-${index}`;
            }
            label.setAttribute('for', input.id);
            
            // Add required indicator
            if (input.required) {
                input.setAttribute('aria-required', 'true');
                label.innerHTML += ' <span aria-label="required">*</span>';
            }
            
            // Add error container for screen readers
            const errorContainer = document.createElement('div');
            errorContainer.className = 'sr-error';
            errorContainer.setAttribute('aria-live', 'polite');
            errorContainer.setAttribute('aria-atomic', 'true');
            errorContainer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
            group.appendChild(errorContainer);
        }
    });
    
    // Improve error messaging
    const originalShowFieldError = window.showFieldError;
    window.showFieldError = function(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', `${fieldName}-error`);
            
            // Update screen reader error container
            const errorContainer = field.parentElement.querySelector('.sr-error');
            if (errorContainer) {
                errorContainer.textContent = `Error: ${message}`;
            }
        }
        
        // Call original function
        if (originalShowFieldError) {
            originalShowFieldError(fieldName, message);
        }
    };
}

/**
 * Add proper ARIA attributes to dynamic content
 */
function addAriaAttributes() {
    // Add landmarks
    const header = document.querySelector('.header');
    if (header) header.setAttribute('role', 'banner');
    
    const nav = document.querySelector('.nav');
    if (nav) nav.setAttribute('role', 'navigation');
    
    const main = document.querySelector('.hero') || document.querySelector('main');
    if (main && !main.getAttribute('role')) main.setAttribute('role', 'main');
    
    const footer = document.querySelector('.footer');
    if (footer) footer.setAttribute('role', 'contentinfo');
    
    // Add aria-labels to interactive elements
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.setAttribute('aria-label', 'Back to top of page');
    }
    
    // Improve button accessibility
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
        if (button.textContent.trim()) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });
    
    // Add live region for dynamic content
    const toastContainer = document.getElementById('toastContainer');
    if (toastContainer) {
        toastContainer.setAttribute('aria-live', 'polite');
        toastContainer.setAttribute('aria-atomic', 'false');
    }
}

/**
 * Respect user's reduced motion preference
 */
function respectReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Disable animations
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
        
        debugLog('Reduced motion mode enabled');
    }
}
