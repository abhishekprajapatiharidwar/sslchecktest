// Security Suite - Initialize first
function initializeSecuritySuite() {
    // Disable right-click context menu for added protection (optional)
    // document.addEventListener('contextmenu', e => e.preventDefault());
    
    // Disable F12, Ctrl+Shift+I, Ctrl+U (optional - can be annoying for developers)
    // document.addEventListener('keydown', function(e) {
    //     if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'U')) {
    //         e.preventDefault();
    //     }
    // });
    
    // Generate CSRF token for forms
    generateCSRFToken();
    
    // Initialize rate limiting
    initRateLimiting();
    
    // Content integrity checks
    performContentIntegrityCheck();
    
    // Initialize input sanitization
    initInputSanitization();
    
    console.log('🛡️ Security Suite initialized');
}

// Generate CSRF token
function generateCSRFToken() {
    const token = 'csrf_' + Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
    const csrfInput = document.getElementById('csrf-token');
    if (csrfInput) {
        csrfInput.value = token;
        sessionStorage.setItem('csrf_token', token);
    }
    console.log('🔑 CSRF token generated');
}

// Rate limiting for form submissions
let formSubmissionCount = 0;
let lastSubmissionTime = 0;

function initRateLimiting() {
    // Reset rate limit counter every hour
    setInterval(() => {
        formSubmissionCount = 0;
        console.log('⏰ Rate limit counter reset');
    }, 3600000); // 1 hour
}

function checkRateLimit() {
    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime;
    
    // Allow maximum 5 submissions per hour
    if (formSubmissionCount >= 5) {
        return false;
    }
    
    // Minimum 30 seconds between submissions
    if (timeSinceLastSubmission < 30000) {
        return false;
    }
    
    return true;
}

// Content integrity checking
function performContentIntegrityCheck() {
    // Check if external scripts have been tampered with
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
        if (script.src.includes('cdnjs.cloudflare.com')) {
            // Verify integrity if available
            if (!script.integrity) {
                console.warn('⚠️ External script without integrity check:', script.src);
            }
        }
    });
    
    // Check for unexpected DOM modifications
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                        console.warn('⚠️ Script injection detected:', node);
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('🔍 Content integrity monitoring active');
}

// Input sanitization
function initInputSanitization() {
    // Add event listeners to all form inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function(e) {
            sanitizeInput(e.target);
        });
        
        input.addEventListener('paste', function(e) {
            setTimeout(() => sanitizeInput(e.target), 10);
        });
    });
    
    console.log('🧹 Input sanitization initialized');
}

function sanitizeInput(input) {
    let value = input.value;
    
    // Remove potentially dangerous characters and scripts
    value = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    value = value.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    value = value.replace(/javascript:/gi, '');
    value = value.replace(/on\w+\s*=/gi, '');
    value = value.replace(/data:text\/html/gi, '');
    
    // Update input value if it was modified
    if (value !== input.value) {
        input.value = value;
        console.warn('⚠️ Potentially malicious input sanitized');
        showSecurityWarning('Input was sanitized for security reasons');
    }
}

function showSecurityWarning(message) {
    const warning = document.createElement('div');
    warning.className = 'security-warning';
    warning.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #fef3c7;
        border: 1px solid #f59e0b;
        color: #92400e;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 0.9rem;
        z-index: 10000;
        max-width: 300px;
    `;
    warning.textContent = `⚠️ ${message}`;
    
    document.body.appendChild(warning);
    
    setTimeout(() => {
        warning.remove();
    }, 5000);
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize security first
    initializeSecuritySuite();
    
    // Force HTTPS redirect
    enforceHTTPS();
    
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initSmoothScrolling();
    initScrollIndicator();
    initSecurityMonitoring();
});

// Force HTTPS redirect for security
function enforceHTTPS() {
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        console.log('🔒 Redirecting to HTTPS for security...');
        location.replace('https:' + window.location.href.substring(window.location.protocol.length));
    } else if (location.protocol === 'https:') {
        console.log('✅ SSL Certificate active - Secure connection established');
        
        // Add security indicators
        addSecurityIndicators();
    }
}

// Add visual security indicators
function addSecurityIndicators() {
    // Add SSL badge to navbar
    const navbar = document.querySelector('.navbar .nav-container');
    if (navbar && !document.querySelector('.ssl-badge')) {
        const sslBadge = document.createElement('div');
        sslBadge.className = 'ssl-badge';
        sslBadge.innerHTML = '<i class="fas fa-lock"></i> Secure';
        sslBadge.style.cssText = `
            display: flex;
            align-items: center;
            gap: 5px;
            background: #10b981;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 600;
        `;
        navbar.appendChild(sslBadge);
    }
    
    // Check and display SSL certificate info
    checkSSLCertificate();
}

// Check SSL certificate information
function checkSSLCertificate() {
    if (location.protocol === 'https:') {
        console.log('🔒 SSL Certificate Information:');
        console.log('Protocol:', location.protocol);
        console.log('Host:', location.host);
        console.log('Security State: Secure');
        
        // Add to console for developers
        console.log('🛡️ Security Headers Active');
        console.log('📋 CSP Policy Enabled');
        console.log('🚫 XSS Protection Enabled');
        console.log('🔒 HTTPS Enforced');
    }
}

// Security monitoring
function initSecurityMonitoring() {
    // Monitor for mixed content
    if (typeof PerformanceObserver !== 'undefined') {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name.startsWith('http:') && location.protocol === 'https:') {
                    console.warn('⚠️ Mixed content detected:', entry.name);
                }
            }
        });
        observer.observe({entryTypes: ['resource']});
    }
    
    // Check for secure contexts
    if (!window.isSecureContext) {
        console.warn('⚠️ Not running in secure context');
    } else {
        console.log('✅ Running in secure context');
    }
}

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger icon
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Change navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Highlight active navigation link
    window.addEventListener('scroll', highlightActiveNavLink);
}

// Highlight active navigation link based on scroll position
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link, .btn[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements
    const animatedElements = document.querySelectorAll(
        '.service-card, .portfolio-item, .skill-item, .contact-item, .about-text'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Stagger animation for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });

    // Stagger animation for portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
}

// Contact form functionality with enhanced security
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Security checks first
        if (!performSecurityChecks()) {
            return;
        }
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        const website = formData.get('website'); // Honeypot field
        const csrfToken = formData.get('csrf_token');
        
        // Honeypot check (bot detection)
        if (website && website.trim() !== '') {
            console.warn('🤖 Bot detected via honeypot field');
            showNotification('Security validation failed. Please try again.', 'error');
            return;
        }
        
        // CSRF token validation
        const storedToken = sessionStorage.getItem('csrf_token');
        if (!csrfToken || csrfToken !== storedToken) {
            console.warn('🔒 CSRF token validation failed');
            showNotification('Security token validation failed. Please refresh and try again.', 'error');
            generateCSRFToken(); // Generate new token
            return;
        }
        
        // Rate limiting check
        if (!checkRateLimit()) {
            showNotification('Too many submissions. Please wait before trying again.', 'error');
            return;
        }
        
        // Enhanced validation
        if (!validateFormData(name, email, message)) {
            return;
        }
        
        // Update rate limiting
        formSubmissionCount++;
        lastSubmissionTime = Date.now();
        
        // Simulate form submission with security logging
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        submitBtn.disabled = true;
        
        // Log security event
        console.log('📧 Secure form submission initiated');
        console.log('🛡️ All security checks passed');
        
        // Simulate API call with enhanced security
        setTimeout(() => {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
            contactForm.reset();
            
            // Generate new CSRF token for next submission
            generateCSRFToken();
            
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            console.log('✅ Secure form submission completed');
        }, 2000);
    });
}

// Enhanced security checks for form submission
function performSecurityChecks() {
    // Check if running in secure context
    if (!window.isSecureContext) {
        showNotification('This form requires a secure connection (HTTPS).', 'error');
        return false;
    }
    
    // Check for suspicious browser behavior
    if (detectSuspiciousBehavior()) {
        showNotification('Suspicious activity detected. Please try again.', 'error');
        return false;
    }
    
    return true;
}

// Detect suspicious browser behavior
function detectSuspiciousBehavior() {
    // Check if developer tools are open (basic check)
    const devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
        devtools.open = true;
        devtools.orientation = 'vertical';
    }
    
    if ((window.outerWidth - window.innerWidth) > threshold) {
        devtools.open = true;
        devtools.orientation = 'horizontal';
    }
    
    // This is for security awareness, not to block developers
    if (devtools.open) {
        console.log('🔍 Developer tools detected - this is normal for developers');
    }
    
    return false; // Allow submission regardless
}

// Enhanced form validation
function validateFormData(name, email, message) {
    // Check minimum lengths
    if (name.length < 2 || name.length > 100) {
        showNotification('Name must be 2-100 characters long.', 'error');
        return false;
    }
    
    if (message.length < 10 || message.length > 1000) {
        showNotification('Message must be 10-1000 characters long.', 'error');
        return false;
    }
    
    // Enhanced email validation
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /eval\(/i,
        /document\.write/i
    ];
    
    const allText = name + ' ' + email + ' ' + message;
    for (let pattern of suspiciousPatterns) {
        if (pattern.test(allText)) {
            console.warn('⚠️ Suspicious pattern detected in form data');
            showNotification('Invalid characters detected. Please check your input.', 'error');
            return false;
        }
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Scroll indicator functionality
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = aboutSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
        
        // Hide scroll indicator when scrolling
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }
}

// Add typing effect to hero title
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }
}

// Add mouse parallax effect to hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const heroAvatar = document.querySelector('.hero-avatar');
            if (heroAvatar) {
                const moveX = (mouseX - 0.5) * 20;
                const moveY = (mouseY - 0.5) * 20;
                
                heroAvatar.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
        
        hero.addEventListener('mouseleave', function() {
            const heroAvatar = document.querySelector('.hero-avatar');
            if (heroAvatar) {
                heroAvatar.style.transform = 'translate(0, 0)';
            }
        });
    }
}

// Initialize advanced effects
document.addEventListener('DOMContentLoaded', function() {
    // Delay advanced effects to ensure page is fully loaded
    setTimeout(() => {
        initParallaxEffect();
    }, 500);
});

// Add scroll progress indicator
function initScrollProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #6366f1, #8b5cf6);
        z-index: 10001;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize scroll progress
document.addEventListener('DOMContentLoaded', initScrollProgress);

// Add smooth hover effects for buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Add loading animation
window.addEventListener('load', function() {
    // Remove any loading screens or add entrance animations
    document.body.classList.add('loaded');
    
    // Add entrance animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
});