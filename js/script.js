/* =============================================
   NAASO TRAVELS AND TOURS - JAVASCRIPT
   Interactive Functionality
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    /* =========================================
       NAVIGATION
       ========================================= */
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    /* =========================================
       SCROLL TO TOP BUTTON
       ========================================= */
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    /* =========================================
       SMOOTH SCROLL FOR ANCHOR LINKS
       ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    /* =========================================
       SCROLL ANIMATIONS (Intersection Observer)
       ========================================= */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    animatedElements.forEach(el => observer.observe(el));
    
    /* =========================================
       COUNTER ANIMATION
       ========================================= */
    const counters = document.querySelectorAll('.counter-number');
    let countersStarted = false;
    
    function startCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = function() {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };
            
            updateCounter();
        });
    }
    
    const counterSection = document.querySelector('.counters');
    if (counterSection) {
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    startCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        counterObserver.observe(counterSection);
    }
    
    /* =========================================
       FAQ ACCORDION
       ========================================= */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    /* =========================================
       CONTACT FORM VALIDATION
       ========================================= */
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const service = document.getElementById('service');
            const message = document.getElementById('message');
            const formMessage = document.getElementById('formMessage');
            
            // Reset errors
            clearErrors([name, email, phone, service, message]);
            
            // Validation flags
            let isValid = true;
            
            // Name validation
            if (!name.value.trim()) {
                showError(name, 'Please enter your name');
                isValid = false;
            }
            
            // Email validation
            if (!email.value.trim()) {
                showError(email, 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email');
                isValid = false;
            }
            
            // Phone validation
            if (!phone.value.trim()) {
                showError(phone, 'Please enter your phone number');
                isValid = false;
            }
            
            // Service validation
            if (!service.value) {
                showError(service, 'Please select a service');
                isValid = false;
            }
            
            // Message validation
            if (!message.value.trim()) {
                showError(message, 'Please enter your message');
                isValid = false;
            }
            
            if (isValid) {
                // Show success message
                formMessage.className = 'form-message success';
                formMessage.textContent = 'Thank you! Your message has been sent. We will contact you shortly.';
                formMessage.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Hide message after 5 seconds
                setTimeout(function() {
                    formMessage.style.display = 'none';
                }, 5000);
            } else {
                // Show error message
                formMessage.className = 'form-message error';
                formMessage.textContent = 'Please fill in all required fields correctly.';
                formMessage.style.display = 'block';
            }
        });
    }
    
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.style.color = '#dc2626';
        errorSpan.style.fontSize = '0.875rem';
        errorSpan.style.marginTop = '5px';
        errorSpan.style.display = 'block';
        errorSpan.textContent = message;
        
        // Remove existing error
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        formGroup.appendChild(errorSpan);
        input.style.borderColor = '#dc2626';
    }
    
    function clearErrors(inputs) {
        inputs.forEach(input => {
            input.style.borderColor = '';
            const formGroup = input.closest('.form-group');
            const errorSpan = formGroup.querySelector('.error-message');
            if (errorSpan) {
                errorSpan.remove();
            }
        });
        
        const formMessage = document.getElementById('formMessage');
        if (formMessage) {
            formMessage.style.display = 'none';
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /* =========================================
       SERVICE FILTER (Services Page)
       ========================================= */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card-item');
    
    if (filterButtons.length > 0 && serviceCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                serviceCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        card.classList.add('fade-in');
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('fade-in');
                    }
                });
            });
        });
    }
    
    /* =========================================
       LAZY LOADING IMAGES
       ========================================= */
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
    
    /* =========================================
       PARALLAX EFFECT (Subtle)
       ========================================= */
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                el.style.transform = `translateY(${scrollY * speed}px)`;
            });
        });
    }
    
    /* =========================================
       MOBILE DROPDOWN MENU
       ========================================= */
    const hasDropdown = document.querySelector('.has-dropdown');
    
    if (hasDropdown && window.innerWidth <= 768) {
        hasDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.querySelector('.dropdown-menu');
            dropdown.classList.toggle('active');
        });
    }
    
    /* =========================================
       SCROLL REVEAL FOR SECTIONS
       ========================================= */
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });
    
    /* =========================================
       TESTIMONIALS SLIDER (Optional Enhancement)
       ========================================= */
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    
    if (testimonialCards.length > 1 && window.innerWidth > 768) {
        // Auto-rotate testimonials every 5 seconds
        setInterval(function() {
            testimonialCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateX(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            });
            
            setTimeout(function() {
                testimonialCards.forEach((card, index) => {
                    if (index === currentTestimonial) {
                        card.style.opacity = '1';
                        card.style.transform = 'translateX(0)';
                    }
                });
                
                currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            }, 500);
        }, 5000);
    }
    
    /* =========================================
       PREVENT SCROLL WHEN MODAL IS OPEN
       ========================================= */
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function() {
            document.body.style.overflow = 'hidden';
        });
        
        modal.addEventListener('hide.bs.modal', function() {
            document.body.style.overflow = 'auto';
        });
    });
    
    /* =========================================
       PHONE NUMBER FORMATTING
       ========================================= */
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Allow only numbers, spaces, dashes, and plus sign
            this.value = this.value.replace(/[^0-9\s\-\+\(\)]/g, '');
        });
    });
    
    /* =========================================
       ANIMATE LINKS ON HOVER
       ========================================= */
    const animatedLinks = document.querySelectorAll('.service-link, .footer-links a');
    
    animatedLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
    
    /* =========================================
       STICKY HEADER HEIGHT ADJUSTMENT
       ========================================= */
    const header = document.querySelector('.page-header');
    const navbarHeight = navbar.offsetHeight;
    
    if (header) {
        header.style.marginTop = navbarHeight + 'px';
    }
    
    /* =========================================
       LOAD MORE FUNCTIONALITY (Gallery)
       ========================================= */
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const initialShow = 4;
    let currentShow = initialShow;
    
    if (loadMoreBtn && galleryItems.length > initialShow) {
        // Hide items beyond initial show
        galleryItems.forEach((item, index) => {
            if (index >= initialShow) {
                item.style.display = 'none';
            }
        });
        
        loadMoreBtn.addEventListener('click', function() {
            const nextShow = currentShow + 4;
            
            galleryItems.forEach((item, index) => {
                if (index < nextShow) {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                }
            });
            
            currentShow = nextShow;
            
            if (currentShow >= galleryItems.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }
    
    /* =========================================
       SEARCH FUNCTIONALITY (Optional)
       ========================================= */
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            
            if (query.length < 2) {
                if (searchResults) {
                    searchResults.style.display = 'none';
                }
                return;
            }
            
            // Search through services
            const serviceCards = document.querySelectorAll('.service-card');
            let hasResults = false;
            
            serviceCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(query) || description.includes(query)) {
                    card.style.display = 'block';
                    hasResults = true;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    /* =========================================
       DATE PICKER FOR SERVICE DATES
       ========================================= */
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach(input => {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        input.setAttribute('min', today);
    });
    
    /* =========================================
       COPY TO CLIPBOARD
       ========================================= */
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(function() {
                // Show copied feedback
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.style.background = '#10b981';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                }, 2000);
            }.bind(this));
        });
    });
    
    /* =========================================
       WHATSAPP CLICK TRACKING
       ========================================= */
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track click event (for analytics if needed)
            console.log('WhatsApp click tracked');
        });
    });
    
    /* =========================================
       SMOOTH SCROLL FOR NAV LINKS
       ========================================= */
    const navAnchorLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navAnchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    /* =========================================
       ACCESSIBILITY - KEYBOARD NAVIGATION
       ========================================= */
    document.addEventListener('keydown', function(e) {
        // Close mobile menu with Escape
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Focus trap in modals
        const modal = document.querySelector('.modal.show');
        if (modal && e.key === 'Tab') {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
    
    /* =========================================
       PAGE LOAD ANIMATION
       ========================================= */
    document.body.classList.add('page-loaded');
    
    /* =========================================
       HANDLE BROWSER BACK BUTTON
       ========================================= */
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            // Page was loaded from cache
            window.location.reload();
        }
    });
    
});

/* =========================================
   ADDITIONAL UTILITY FUNCTIONS
   ========================================= */

// Format phone number for display
function formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if it's a Ghana number
    if (cleaned.startsWith('233')) {
        return '+' + cleaned.substring(0, 3) + ' ' + 
               cleaned.substring(3, 5) + ' ' + 
               cleaned.substring(5, 8) + ' ' + 
               cleaned.substring(8);
    }
    
    return phone;
}

// Get query parameters
function getQueryParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    
    for (const [key, value] of searchParams) {
        params[key] = value;
    }
    
    return params;
}

// Set active nav based on URL
function setActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (currentPath.endsWith(href) || 
            (currentPath === '/' && href === 'index.html') ||
            (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', setActiveNav);

// ===== NAASO FLIER POPUP SYSTEM =====
(function () {
  var fliers = [
    'assets/naaso/naasoflier1.jpg',
    'assets/naaso/naasoflier2.jpg',
    'assets/naaso/naasoflier3.jpg',
    'assets/naaso/naasoflier4.jpg'
  ];

  var currentIndex = 0;
  var countdownTimer = null;
  var overlay    = document.getElementById('flier-overlay');
  var modal      = document.getElementById('flier-modal');
  var closeBtn   = document.getElementById('flier-close-btn');
  var flierImg   = document.getElementById('flier-img');
  var nextBar    = document.getElementById('flier-next-bar');
  var countdown  = document.getElementById('flier-countdown');

  function showFlier(index) {
    if (index >= fliers.length) return;
    currentIndex = index;
    flierImg.src = fliers[index];
    overlay.style.display = 'flex';
    // Reset modal animation
    modal.style.animation = 'none';
    modal.offsetHeight; // reflow
    modal.style.animation = 'flierPop 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    // Show 'next' bar only if there is a next flier
    if (index < fliers.length - 1) {
      nextBar.style.display = 'block';
      countdown.textContent = '10';
    } else {
      nextBar.style.display = 'none';
    }
  }

  function closeFlier() {
    overlay.style.display = 'none';
    flierImg.src = '';
    if (countdownTimer) { clearTimeout(countdownTimer); countdownTimer = null; }
    // Schedule next flier 10 seconds after this one is closed
    var next = currentIndex + 1;
    if (next < fliers.length) {
      countdownTimer = setTimeout(function () {
        showFlier(next);
      }, 10000);
    }
  }

  // Close button
  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    closeFlier();
  });

  // Click outside modal image also closes
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) { closeFlier(); }
  });

  // ESC key closes
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.style.display === 'flex') { closeFlier(); }
  });

  // Start: show first flier 10 seconds after page load
  setTimeout(function () {
    showFlier(0);
  }, 10000);

})();
// ===== END FLIER POPUP SYSTEM =====
