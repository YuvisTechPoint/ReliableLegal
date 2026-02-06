/**
 * Reliable Legal Solutions
 * Premium Law Firm Website JavaScript
 * ==========================================
 */

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
});

/**
 * Navigation Module
 * Handles mobile menu toggle and active states
 */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
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
    
    if (!header) return;
    
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', throttle(handleScroll, 100));
    
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
            'divorce': 'Divorce & Family Law',
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
                'divorce': 'Divorce & Family Law',
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
        'divorce': 'Divorce & Family Law',
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

// Initialize counter animation
document.addEventListener('DOMContentLoaded', animateCounters);

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
        
        if (navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
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
        'Divorce & Family Law',
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
        'Divorce & Family Law': 'family',
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
 * Console Branding
 */
console.log(
    '%c Reliable Legal Solutions %c Website by Professional Developer ',
    'background: #1a2a4a; color: #c9a961; padding: 10px 20px; font-size: 14px; font-weight: bold;',
    'background: #c9a961; color: #1a2a4a; padding: 10px 20px; font-size: 12px;'
);
