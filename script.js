// JavaScript for FrameX Portfolio Website

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    
    // Mobile navbar now uses simple Contact Us button - no JavaScript needed
});

// Initialize all website functionality
function initializeWebsite() {
    // Check performance first
    checkPerformance();
    
    setupSmoothScrolling();
    setupScrollAnimations();
    setupContactForm();
    setupNavigation();
    setupFormValidation();
    setupLazyLoading();
    initializeEnhancedAnimations();
    initializeVideo();
    setupPricingModal();
    
    // Mobile menu removed - using simple Contact Us button instead
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active navigation
                updateActiveNavigation(targetId);
            }
        });
    });
}

// Update active navigation based on scroll position
function updateActiveNavigation(targetId) {
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.classList.remove('nav-active');
    });
    
    const activeLink = document.querySelector(`nav a[href="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('nav-active');
    }
}

// Enhanced scroll-based animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for multiple elements
                if (entry.target.parentElement.classList.contains('stagger-animation')) {
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
                
                // Add random animation delays for variety
                if (entry.target.classList.contains('random-delay')) {
                    const randomDelay = Math.random() * 0.5;
                    entry.target.style.animationDelay = `${randomDelay}s`;
                }
            }
        });
    }, observerOptions);

    // Observe all animation elements
    const animationElements = [
        '.fade-in',
        '.slide-in-left',
        '.slide-in-right',
        '.scale-in',
        '.rotate-in',
        '.hover-lift',
        '.hover-lift-strong',
        '.stagger-animation > *'
    ];

    animationElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            observer.observe(el);
        });
    });

    // Setup parallax scrolling
    setupParallaxScrolling();
    
    // Setup magnetic hover effects
    setupMagneticEffects();
    
    // Setup typewriter animations
    setupTypewriterAnimations();
}

// Contact form functionality
function setupContactForm() {
    const modal = document.getElementById('contactModal');
    const form = document.querySelector('#contactModal form');
    
    if (!modal || !form) return;

    // Form submission - let Formspree handle it naturally
    form.addEventListener('submit', function(e) {
        // Don't prevent default - let Formspree handle the submission
        // Just add our enhanced UI feedback
        
        if (!validateEntireForm(form)) {
            e.preventDefault();
            showNotification('Please fix the errors before submitting.', 'error');
            return;
        }
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = `
            <div class="flex items-center justify-center">
                <div class="loading-spinner mr-3"></div>
                <span>Sending your request...</span>
            </div>
        `;
        submitButton.disabled = true;
        
        // Track the submission
        trackFormSubmission(form, new FormData(form));
    });

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeContactForm();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeContactForm();
        }
    });
}

// Open contact form
function openContactForm() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

// Close contact form
function closeContactForm() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Reset form
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            clearFormErrors(form);
        }
    }
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    clearFormErrors(form);
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showFieldError(input, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
}

// Clear form errors
function clearFormErrors(form) {
    const errorFields = form.querySelectorAll('.error');
    const errorMessages = form.querySelectorAll('.error-message');
    
    errorFields.forEach(field => field.classList.remove('error'));
    errorMessages.forEach(message => message.remove());
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced form submission with Formspree integration
function submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Validate all fields before submission
    if (!validateEntireForm(form)) {
        showNotification('Please fix the errors before submitting.', 'error');
        return;
    }
    
    // Show loading state
    showFormLoadingState(submitButton);
    form.classList.add('loading');
    
    // Disable all form inputs
    const inputs = form.querySelectorAll('input, textarea, select, button');
    inputs.forEach(input => input.disabled = true);
    
    // Submit to Formspree
    submitToFormspree(form, submitButton, originalText, data);
}

// Validate entire form
function validateEntireForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateFieldWithFeedback(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Show enhanced loading state
function showFormLoadingState(submitButton) {
    submitButton.innerHTML = `
        <div class="flex items-center justify-center">
            <div class="loading-spinner mr-3"></div>
            <span>Sending your request...</span>
        </div>
    `;
    submitButton.disabled = true;
}

// Submit form to Formspree
function submitToFormspree(form, submitButton, originalText, data) {
    const formData = new FormData(form);
    
    // Add additional metadata
    formData.append('_subject', 'New Contact Form Submission from FrameX Website');
    formData.append('_replyto', data.email || '');
    formData.append('_cc', '');
    formData.append('_next', window.location.href + '?submitted=true');
    
    // Get Formspree endpoint from form action or data attribute
    const formspreeEndpoint = form.action || form.dataset.formspreeEndpoint;
    
    if (!formspreeEndpoint) {
        console.error('Formspree endpoint not found. Please add action attribute or data-formspree-endpoint to your form.');
        handleFormError(form, submitButton, originalText, 'Form configuration error');
        return;
    }
    
    // Update button text
    submitButton.innerHTML = `
        <div class="flex items-center justify-center">
            <div class="loading-spinner mr-3"></div>
            <span>Sending to Formspree...</span>
        </div>
    `;
    
    // Submit to Formspree
    fetch(formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .then(data => {
        // Success
        handleFormSuccess(form, submitButton, originalText, data);
    })
    .catch(error => {
        // Error
        console.error('Formspree submission error:', error);
        handleFormError(form, submitButton, originalText, error.message);
    });
}

// Handle successful Formspree submission
function handleFormSuccess(form, submitButton, originalText, formspreeData) {
    // Show success state
    submitButton.innerHTML = `
        <div class="flex items-center justify-center text-green-600">
            <i class="fas fa-check-circle mr-2"></i>
            <span>Message sent successfully!</span>
        </div>
    `;
    
    // Add success animation
    submitButton.classList.add('success-bounce');
    
    // Show success notification
    showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
    
    // Reset form after delay
    setTimeout(() => {
        resetFormState(form, submitButton, originalText);
        
        // Close modal if it's a modal form
        if (form.closest('#contactModal')) {
            closeContactForm();
        }
        
        // Log successful submission
        console.log('Form submitted successfully to Formspree:', {
            formspreeResponse: formspreeData,
            timestamp: new Date().toISOString(),
            formId: form.id || 'unknown'
        });
        
        // Track form submission
        trackFormSubmission(form, formspreeData);
        
    }, 2000);
}

// Handle Formspree submission error
function handleFormError(form, submitButton, originalText, errorMessage) {
    // Show error state
    submitButton.innerHTML = `
        <div class="flex items-center justify-center text-red-600">
            <i class="fas fa-exclamation-circle mr-2"></i>
            <span>Failed to send message</span>
        </div>
    `;
    
    // Add error animation
    submitButton.classList.add('error-shake');
    
    // Show error notification
    showNotification('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
    
    // Reset form after delay
    setTimeout(() => {
        resetFormState(form, submitButton, originalText);
        
        // Log error
        console.error('Formspree submission failed:', {
            error: errorMessage,
            timestamp: new Date().toISOString(),
            formId: form.id || 'unknown'
        });
        
    }, 3000);
}

// Reset form state
function resetFormState(form, submitButton, originalText) {
    // Reset button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
    submitButton.classList.remove('success-bounce');
    
    // Reset form
    form.reset();
    form.classList.remove('loading');
    
    // Re-enable inputs
    const inputs = form.querySelectorAll('input, textarea, select, button');
    inputs.forEach(input => input.disabled = false);
    
    // Clear all validation states
    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
        field.classList.remove('error', 'success');
        clearFieldError(field);
    });
    
    // Clear success messages
    const successMessages = form.querySelectorAll('.success-message');
    successMessages.forEach(msg => msg.remove());
}

// Track form submission for analytics
function trackFormSubmission(form, data) {
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            'event_category': 'contact',
            'event_label': form.id || 'contact_form',
            'value': 1
        });
    }
    
    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'Contact Form Submission',
            content_category: 'Web Development Inquiry'
        });
    }
    
    // Formspree analytics (if available)
    if (typeof formspree !== 'undefined') {
        formspree.track('form_submit', {
            form_id: form.id,
            timestamp: new Date().toISOString()
        });
    }
}

// Check for Formspree success parameter in URL
function checkFormspreeSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('submitted') === 'true') {
        showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        
        // Clean up URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
}

// Initialize Formspree success check
document.addEventListener('DOMContentLoaded', function() {
    checkFormspreeSuccess();
    setupFormspreeReplyTo();
});

// Setup dynamic reply-to field for Formspree
function setupFormspreeReplyTo() {
    const forms = document.querySelectorAll('form[action*="formspree.io"]');
    
    forms.forEach(form => {
        const emailInput = form.querySelector('input[type="email"]');
        const replyToField = form.querySelector('input[name="_replyto"]');
        
        if (emailInput && replyToField) {
            emailInput.addEventListener('input', function() {
                replyToField.value = this.value;
            });
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Navigation functionality
function setupNavigation() {
    // Update active navigation on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('nav-active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('nav-active');
            }
        });
    });
}

// Mobile menu functionality removed - now using simple Contact Us button

// Pricing Popup Modal Functionality
function setupPricingModal() {
    const modal = document.getElementById('pricingModal');
    const form = document.getElementById('pricingForm');
    const closeBtn = document.getElementById('closePricingModal');
    const closeSuccessBtn = document.getElementById('closePricingSuccess');
    const getStartedBtns = document.querySelectorAll('.get-started-btn');
    const planName = document.getElementById('planName');
    const planPrice = document.getElementById('planPrice');
    const successDiv = document.getElementById('pricingSuccess');
    
    if (!modal || !form) return;
    
    // Open modal when Get Started button is clicked
    getStartedBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const plan = this.getAttribute('data-plan');
            const price = this.getAttribute('data-price');
            
            // Update plan info in modal
            planName.textContent = plan + ' Plan';
            planPrice.textContent = price;
            
            // Show modal with animation
            modal.classList.remove('hidden');
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Focus on first input
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 300);
        });
    });
    
    // Close modal functions
    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Reset form
        form.reset();
        form.classList.remove('hidden');
        successDiv.classList.add('hidden');
        successDiv.classList.remove('show');
        
        // Reset button text
        const submitBtn = form.querySelector('button[type="submit"]');
        const submitText = submitBtn.querySelector('.submit-text');
        const loadingText = submitBtn.querySelector('.loading-text');
        if (submitText) submitText.classList.remove('hidden');
        if (loadingText) loadingText.classList.add('hidden');
        submitBtn.disabled = false;
    }
    
    // Close modal event listeners
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    // Form submission - let Formspree handle it naturally
    form.addEventListener('submit', function(e) {
        // Don't prevent default - let Formspree handle the submission
        // Just add our enhanced UI feedback
        
        if (!validateEntireForm(form)) {
            e.preventDefault();
            showNotification('Please fix the errors before submitting.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const submitText = submitBtn.querySelector('.submit-text');
        const loadingText = submitBtn.querySelector('.loading-text');
        
        if (submitText) submitText.classList.add('hidden');
        if (loadingText) loadingText.classList.remove('hidden');
        submitBtn.disabled = true;
        
        // Track the submission
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        trackFormSubmission(form, {
            ...data,
            selectedPlan: planName.textContent,
            selectedPrice: planPrice.textContent
        });
    });
    
    // Form validation
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('border-red-500');
            } else {
                this.classList.remove('border-red-500');
            }
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('border-red-500');
        });
    });
}

// Enhanced Form validation setup
function setupFormValidation() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Real-time validation with enhanced feedback
        input.addEventListener('blur', function() {
            validateFieldWithFeedback(this);
        });
        
        // Clear error on input with smooth transition
        input.addEventListener('input', function() {
            clearFieldErrorSmooth(this);
            // Add success state for valid fields
            if (this.value.trim() && isValidField(this)) {
                this.classList.add('success');
            }
        });
        
        // Add focus effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

// Enhanced field validation with detailed feedback
function validateFieldWithFeedback(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const isRequired = field.hasAttribute('required');
    
    // Clear previous states
    field.classList.remove('error', 'success');
    clearFieldError(field);
    
    // Required field validation
    if (isRequired && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Skip validation if field is empty and not required
    if (!value && !isRequired) {
        return true;
    }
    
    // Email validation
    if (fieldType === 'email' && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    // Phone validation
    if (fieldType === 'tel' && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }
    
    // Name validation
    if (field.name === 'name' || field.name === 'firstName' || field.name === 'lastName') {
        if (value.length < 2) {
            showFieldError(field, 'Name must be at least 2 characters long');
            return false;
        }
        if (!/^[a-zA-Z\s]+$/.test(value)) {
            showFieldError(field, 'Name can only contain letters and spaces');
            return false;
        }
    }
    
    // Company name validation
    if (field.name === 'company' && value.length > 0 && value.length < 2) {
        showFieldError(field, 'Company name must be at least 2 characters long');
        return false;
    }
    
    // Message validation
    if (field.tagName === 'TEXTAREA' && isRequired && value.length < 10) {
        showFieldError(field, 'Message must be at least 10 characters long');
        return false;
    }
    
    // Success state
    field.classList.add('success');
    showFieldSuccess(field, 'Looks good!');
    return true;
}

// Check if field is valid
function isValidField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    
    if (field.hasAttribute('required') && !value) return false;
    if (!value) return true;
    
    if (fieldType === 'email') return isValidEmail(value);
    if (fieldType === 'tel') return isValidPhone(value);
    
    return true;
}

// Clear field error with smooth animation
function clearFieldErrorSmooth(field) {
    field.classList.remove('error');
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.style.opacity = '0';
        errorMessage.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (errorMessage.parentElement) {
                errorMessage.remove();
            }
        }, 300);
    }
}

// Show field success message
function showFieldSuccess(field, message) {
    // Remove existing success message
    const existingSuccess = field.parentElement.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Add success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message text-green-600 text-sm mt-1 flex items-center';
    successDiv.innerHTML = `<i class="fas fa-check-circle mr-1"></i>${message}`;
    successDiv.style.opacity = '0';
    successDiv.style.transform = 'translateY(-10px)';
    
    field.parentElement.appendChild(successDiv);
    
    // Animate in
    setTimeout(() => {
        successDiv.style.transition = 'all 0.3s ease';
        successDiv.style.opacity = '1';
        successDiv.style.transform = 'translateY(0)';
    }, 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.style.opacity = '0';
            successDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (successDiv.parentElement) {
                    successDiv.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Lazy loading for images (if any are added later)
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
const debouncedScrollHandler = debounce(function() {
    // Any scroll-based performance optimizations can go here
}, 16);

window.addEventListener('scroll', debouncedScrollHandler);

// Performance monitoring
function checkPerformance() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Disable complex animations for users who prefer reduced motion
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    }
    
    // Check device capabilities
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    if (isLowEndDevice) {
        // Reduce animation complexity for low-end devices
        document.documentElement.classList.add('low-end-device');
    }
}

// Initialize performance optimizations
checkPerformance();

// Monitor for changes in user preferences
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', checkPerformance);

// Add loading states to buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('button[type="submit"]')) {
        e.target.classList.add('loading');
    }
});

// Initialize tooltips (if needed)
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'absolute bg-gray-800 text-white px-2 py-1 rounded text-sm z-50';
    tooltip.textContent = e.target.dataset.tooltip;
    tooltip.id = 'tooltip';
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Parallax scrolling effect
function setupParallaxScrolling() {
    const parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-medium, .parallax-fast');
    
    if (parallaxElements.length === 0) return;
    
    const handleScroll = debounce(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            const speed = element.classList.contains('parallax-fast') ? 0.8 : 
                         element.classList.contains('parallax-medium') ? 0.5 : 0.3;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
}

// Magnetic hover effects
function setupMagneticEffects() {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 50;
            
            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                const moveX = x * force * 0.3;
                const moveY = y * force * 0.3;
                
                this.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
            }
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });
}

// Typewriter animation
function setupTypewriterAnimations() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid #5682B1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        // Start typing when element comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
}

// Loading animations
function showLoadingState(element) {
    element.classList.add('loading');
    element.style.pointerEvents = 'none';
    
    // Add loading spinner if it's a button
    if (element.tagName === 'BUTTON') {
        const originalText = element.innerHTML;
        element.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';
        element.dataset.originalText = originalText;
    }
}

function hideLoadingState(element) {
    element.classList.remove('loading');
    element.style.pointerEvents = 'auto';
    
    // Restore original text if it's a button
    if (element.tagName === 'BUTTON' && element.dataset.originalText) {
        element.innerHTML = element.dataset.originalText;
        delete element.dataset.originalText;
    }
}

// Skeleton loading
function showSkeletonLoading(container, count = 3) {
    const skeletonHTML = `
        <div class="skeleton-card">
            <div class="skeleton skeleton-avatar mb-4"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
        </div>
    `;
    
    container.innerHTML = skeletonHTML.repeat(count);
}

// Progress bar animation
function animateProgressBar(progressBar, targetWidth, duration = 2000) {
    progressBar.style.width = '0%';
    progressBar.style.transition = `width ${duration}ms ease-out`;
    
    setTimeout(() => {
        progressBar.style.width = targetWidth + '%';
    }, 100);
}

// Counter animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Wave animation for text
function setupWaveAnimation() {
    const waveElements = document.querySelectorAll('.wave-text');
    
    waveElements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.classList.add('wave');
            span.style.animationDelay = `${index * 0.1}s`;
            element.appendChild(span);
        });
    });
}

// Enhanced button interactions
function setupEnhancedButtons() {
    const buttons = document.querySelectorAll('button, .btn');
    
    buttons.forEach(button => {
        // Ripple effect
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Testimonials Carousel
function setupTestimonialsCarousel() {
    const track = document.querySelector('.testimonials-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    
    if (!track || !slides.length) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function updateCarousel() {
        const slideWidth = slides[0].offsetWidth;
        const translateX = -currentSlide * slideWidth;
        track.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-rotate every 5 seconds
    setInterval(nextSlide, 5000);
    
    // Handle window resize
    window.addEventListener('resize', updateCarousel);
}

// Portfolio Slider
function setupPortfolioSlider() {
    const track = document.querySelector('.portfolio-track');
    const slides = document.querySelectorAll('.portfolio-slide');
    const prevBtn = document.querySelector('.portfolio-prev');
    const nextBtn = document.querySelector('.portfolio-next');
    const dots = document.querySelectorAll('.portfolio-dot');
    
    if (!track || !slides.length) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;
    
    function updateSlider() {
        const slideWidth = slides[0].offsetWidth;
        const translateX = -currentSlide * slideWidth;
        track.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
        resetAutoSlide();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
        resetAutoSlide();
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
        resetAutoSlide();
    }
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 6000); // 6 seconds for portfolio
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Pause auto-slide on hover
    const slider = document.querySelector('.portfolio-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Handle window resize
    window.addEventListener('resize', updateSlider);
    
    // Start auto-slide
    startAutoSlide();
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
}

// Initialize enhanced animations
function initializeEnhancedAnimations() {
    setupWaveAnimation();
    setupEnhancedButtons();
    setupTestimonialsCarousel();
    setupPortfolioSlider();
    setupFormEnhancements();
    
    // Add loading states to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                showLoadingState(submitBtn);
            }
        });
    });
}

// Setup form enhancements
function setupFormEnhancements() {
    setupPhoneFormatting();
    setupAutoSave();
    setupCharacterCounters();
    setupFormProgress();
}

// Phone number formatting
function setupPhoneFormatting() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
            }
            
            e.target.value = value;
        });
        
        // Add country code placeholder
        if (!input.placeholder) {
            input.placeholder = '+1 (555) 123-4567';
        }
    });
}

// Auto-save form data
function setupAutoSave() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const formId = form.id || 'form_' + Math.random().toString(36).substr(2, 9);
        const inputs = form.querySelectorAll('input, textarea, select');
        
        // Load saved data
        inputs.forEach(input => {
            const savedValue = localStorage.getItem(`${formId}_${input.name}`);
            if (savedValue && input.type !== 'password') {
                input.value = savedValue;
            }
        });
        
        // Save data on input
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                localStorage.setItem(`${formId}_${this.name}`, this.value);
            });
        });
        
        // Clear saved data on successful submission
        form.addEventListener('submit', function() {
            setTimeout(() => {
                inputs.forEach(input => {
                    localStorage.removeItem(`${formId}_${input.name}`);
                });
            }, 2000);
        });
    });
}

// Character counters for textareas
function setupCharacterCounters() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
        const maxLength = textarea.getAttribute('maxlength') || 500;
        const counter = document.createElement('div');
        counter.className = 'character-counter text-sm text-gray-500 mt-1 text-right';
        counter.textContent = `0/${maxLength} characters`;
        
        textarea.parentElement.appendChild(counter);
        
        textarea.addEventListener('input', function() {
            const remaining = maxLength - this.value.length;
            counter.textContent = `${this.value.length}/${maxLength} characters`;
            
            if (remaining < 50) {
                counter.classList.add('text-red-500');
                counter.classList.remove('text-gray-500');
            } else if (remaining < 100) {
                counter.classList.add('text-yellow-500');
                counter.classList.remove('text-gray-500', 'text-red-500');
            } else {
                counter.classList.add('text-gray-500');
                counter.classList.remove('text-yellow-500', 'text-red-500');
            }
        });
    });
}

// Form progress indicator
function setupFormProgress() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const requiredFields = form.querySelectorAll('[required]');
        if (requiredFields.length === 0) return;
        
        // Create progress bar
        const progressContainer = document.createElement('div');
        progressContainer.className = 'form-progress mb-4';
        progressContainer.innerHTML = '<div class="form-progress-bar" style="width: 0%"></div>';
        
        form.insertBefore(progressContainer, form.firstChild);
        
        const progressBar = progressContainer.querySelector('.form-progress-bar');
        
        // Update progress
        function updateProgress() {
            let completedFields = 0;
            requiredFields.forEach(field => {
                if (field.value.trim() && isValidField(field)) {
                    completedFields++;
                }
            });
            
            const progress = (completedFields / requiredFields.length) * 100;
            progressBar.style.width = progress + '%';
            
            // Add completion message
            if (progress === 100) {
                progressContainer.innerHTML = '<div class="form-progress-bar" style="width: 100%"></div><div class="text-sm text-green-600 mt-1 text-center">✓ All required fields completed!</div>';
            }
        }
        
        // Update progress on input
        requiredFields.forEach(field => {
            field.addEventListener('input', updateProgress);
            field.addEventListener('blur', updateProgress);
        });
        
        // Initial progress update
        updateProgress();
    });
}

// Video functionality
function setupVideoControls() {
    const video = document.getElementById('heroVideo');
    const playPauseIcon = document.getElementById('playPauseIcon');
    const videoTime = document.getElementById('videoTime');
    const videoDuration = document.getElementById('videoDuration');
    
    if (!video) return;
    
    // Update video duration when metadata is loaded
    video.addEventListener('loadedmetadata', function() {
        videoDuration.textContent = formatTime(video.duration);
    });
    
    // Update current time
    video.addEventListener('timeupdate', function() {
        videoTime.textContent = formatTime(video.currentTime);
    });
    
    // Handle video end
    video.addEventListener('ended', function() {
        playPauseIcon.className = 'fas fa-play text-gray-700';
    });
}

// Toggle video play/pause
function toggleVideo() {
    const video = document.getElementById('heroVideo');
    const playPauseIcon = document.getElementById('playPauseIcon');
    
    if (!video) return;
    
    if (video.paused) {
        video.play();
        playPauseIcon.className = 'fas fa-pause text-gray-700';
    } else {
        video.pause();
        playPauseIcon.className = 'fas fa-play text-gray-700';
    }
}

// Format time in MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Initialize video when page loads
function initializeVideo() {
    const video = document.getElementById('heroVideo');
    
    if (video) {
        // Ensure video is muted for autoplay
        video.muted = true;
        
        // Try to play the video
        video.play().catch(error => {
            console.log('Autoplay prevented:', error);
            // Show play button if autoplay fails
            const playPauseIcon = document.getElementById('playPauseIcon');
            if (playPauseIcon) {
                playPauseIcon.className = 'fas fa-play text-gray-700';
            }
        });
        
        setupVideoControls();
    }
}

// Export functions for global access
window.openContactForm = openContactForm;
window.closeContactForm = closeContactForm;
window.showLoadingState = showLoadingState;
window.hideLoadingState = hideLoadingState;
window.showSkeletonLoading = showSkeletonLoading;
window.animateProgressBar = animateProgressBar;
window.animateCounter = animateCounter;
window.toggleVideo = toggleVideo;
