/**
 * Aisha's Beauty Saloon - Luxury Boutique Interactive Engine
 * Strictly Vanilla JavaScript, lightweight and high-performance.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 1. Dynamic Header Shrink & Sticky Behavior
  const header = document.querySelector('.header-luxury');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger on load in case page was refreshed

  // 2. Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', () => {
      const isActive = navLinksContainer.classList.toggle('active');
      // Update toggle icon
      menuToggle.innerHTML = isActive 
        ? '<i data-lucide="x" style="width: 24px; height: 24px;"></i>' 
        : '<i data-lucide="menu" style="width: 24px; height: 24px;"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        menuToggle.innerHTML = '<i data-lucide="menu" style="width: 24px; height: 24px;"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
      });
    });
  }

  // 3. Active Link Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  // 4. Live Open/Closed Status Indicator (Pakistan Standard Time UTC+5)
  const updateSalonStatus = () => {
    const statusBar = document.getElementById('salon-status-bar');
    const statusText = document.getElementById('salon-status-text');
    if (!statusBar || !statusText) return;

    // Get current date/time converted to Pakistan Time (UTC+5)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const pakOffset = 5; // UTC+5
    const pakTime = new Date(utc + (3600000 * pakOffset));

    const day = pakTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hours = pakTime.getHours();
    const minutes = pakTime.getMinutes();
    const currentTimeVal = hours + (minutes / 60);

    // Business Hours: Tue - Sun 11:00 AM to 8:00 PM (11:00 to 20:00). Monday is Closed.
    const openTime = 11.0;
    const closeTime = 20.0;
    const isClosedMonday = (day === 1); // 1 is Monday

    let isOpen = false;
    if (!isClosedMonday && currentTimeVal >= openTime && currentTimeVal < closeTime) {
      isOpen = true;
    }

    if (isOpen) {
      statusBar.className = 'contact-status-bar open';
      statusText.textContent = 'Open Now — Visit Us Today';
    } else {
      statusBar.className = 'contact-status-bar';
      statusText.textContent = isClosedMonday 
        ? 'Closed Today — Reopening Tuesday at 11:00 AM' 
        : 'Closed Now — Reopening at 11:00 AM';
    }
  };
  
  updateSalonStatus();
  // Update status every minute
  setInterval(updateSalonStatus, 60000);

  // 5. Interactive Service Category Tab Filter
  const tabButtons = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all tabs
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Custom smooth transition
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95) translateY(10px)';
        
        setTimeout(() => {
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1) translateY(0)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  // 6. Interactive Bridal Suite Planner & Live Estimation
  const bridalCheckboxes = document.querySelectorAll('.bridal-checkbox');
  const totalBasePriceEl = document.getElementById('planner-base-price');
  const totalDiscountPriceEl = document.getElementById('planner-discount-price');
  const totalSavingsEl = document.getElementById('planner-savings-price');
  const btnBookPlanner = document.getElementById('btn-book-planner');

  const updateBridalPlanner = () => {
    let totalBase = 0;
    const selectedServices = [];

    bridalCheckboxes.forEach(checkbox => {
      const label = checkbox.closest('.service-checkbox-label');
      if (checkbox.checked) {
        label.classList.add('selected');
        const price = parseInt(checkbox.getAttribute('data-price'), 10);
        totalBase += price;
        selectedServices.push(checkbox.getAttribute('data-name'));
      } else {
        label.classList.remove('selected');
      }
    });

    // Apply luxury bundle discounts (15% off if 3 or more services selected!)
    const discountThreshold = 3;
    let finalDiscounted = totalBase;
    let savings = 0;

    if (selectedServices.length >= discountThreshold) {
      savings = Math.round(totalBase * 0.15);
      finalDiscounted = totalBase - savings;
    }

    // Format currency in Pakistani Rupees (PKR)
    if (totalBasePriceEl) totalBasePriceEl.textContent = `Rs. ${totalBase.toLocaleString()}`;
    if (totalDiscountPriceEl) totalDiscountPriceEl.textContent = `Rs. ${finalDiscounted.toLocaleString()}`;
    if (totalSavingsEl) {
      if (savings > 0) {
        totalSavingsEl.closest('.price-breakdown').style.display = 'flex';
        totalSavingsEl.textContent = `Rs. ${savings.toLocaleString()} (15% Bundle Saver)`;
      } else {
        totalSavingsEl.closest('.price-breakdown').style.display = 'none';
      }
    }

    // Update WhatsApp Inquiry URL
    if (btnBookPlanner) {
      if (selectedServices.length === 0) {
        btnBookPlanner.href = "https://wa.me/923414558533?text=Hello%20Aisha's%20Beauty%20Saloon,%20I%20would%20like%20to%20inquire%20about%20your%20custom%20bridal%20packages.";
      } else {
        const servicesString = selectedServices.join(', ');
        const waText = `Hello Aisha's Beauty Saloon! I have customized a Bridal Package with the following services:
- ${servicesString}
Estimated Value: Rs. ${finalDiscounted.toLocaleString()}
I would like to consult and book an appointment.`;
        btnBookPlanner.href = `https://wa.me/923414558533?text=${encodeURIComponent(waText)}`;
      }
    }
  };

  bridalCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateBridalPlanner);
  });
  // Initial Run
  updateBridalPlanner();

  // 7. Interactive Testimonial Slider / Carousel
  const testimonials = document.querySelectorAll('.testimonial-slide');
  const nextBtn = document.querySelector('.carousel-arrow.next');
  const prevBtn = document.querySelector('.carousel-arrow.prev');
  const dotsContainer = document.querySelector('.carousel-dots');
  let currentSlide = 0;

  if (testimonials.length > 0) {
    // Generate indicator dots
    testimonials.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    const updateSlider = () => {
      const slider = document.querySelector('.testimonials-slider');
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((dot, index) => {
        dot.className = `carousel-dot ${index === currentSlide ? 'active' : ''}`;
      });
    };

    const goToSlide = (index) => {
      currentSlide = index;
      updateSlider();
    };

    if (nextBtn && prevBtn) {
      nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        updateSlider();
      });

      prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
        updateSlider();
      });
    }

    // Auto-swipe every 8 seconds
    setInterval(() => {
      currentSlide = (currentSlide + 1) % testimonials.length;
      updateSlider();
    }, 8000);
  }

  // 8. Luxury Lightbox Gallery Modal
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxSvg = document.getElementById('lightbox-svg');
  const lightboxTag = document.getElementById('lightbox-tag');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');

  if (galleryCards.length > 0 && lightbox) {
    galleryCards.forEach(card => {
      card.addEventListener('click', () => {
        const title = card.getAttribute('data-title');
        const tag = card.getAttribute('data-tag');
        const desc = card.getAttribute('data-desc');
        const index = card.getAttribute('data-index');

        // Set content
        if (lightboxTag) lightboxTag.textContent = tag;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc) lightboxDesc.textContent = desc;

        // Clone the card's visual SVG inside lightbox for absolute quality rendering
        const sourceSvg = card.querySelector('svg');
        if (sourceSvg && lightboxSvg) {
          lightboxSvg.innerHTML = sourceSvg.outerHTML;
        }

        // Open
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Unlock scrolling
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // 9. Interactive Contact Form with Auto WhatsApp Booking Formatter
  const contactForm = document.getElementById('saloon-contact-form');
  const toast = document.getElementById('success-toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const service = document.getElementById('form-service').value;
      const date = document.getElementById('form-date').value;
      const message = document.getElementById('form-message').value.trim();

      if (!name || !phone || !service || !date) {
        alert('Please fill out all mandatory fields.');
        return;
      }

      // Format custom message for WhatsApp API
      const waText = `Hello Aisha's Beauty Saloon! I would like to book an appointment with the following details:
- Name: ${name}
- Phone/WhatsApp: ${phone}
- Service Required: ${service}
- Preferred Date: ${date}
- Message/Notes: ${message || 'N/A'}`;

      const whatsappUrl = `https://wa.me/923414558533?text=${encodeURIComponent(waText)}`;

      // Show luxury success toast
      if (toast) {
        toast.classList.add('active');
        setTimeout(() => {
          toast.classList.remove('active');
        }, 5000);
      }

      // Open WhatsApp in a new tab after a brief delay so the user sees the toast success
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        contactForm.reset();
      }, 1000);
    });
  }

  // 10. Scroll Reveal Animation using IntersectionObserver
  const revealItems = document.querySelectorAll('.reveal-item');
  if (revealItems.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target); // Reveal only once
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -100px 0px', // Trigger slightly before element is fully in view
      threshold: 0.1
    });

    revealItems.forEach(item => revealObserver.observe(item));
  }

  // 11. Sticky Back to Top Button Tracking
  const topBtn = document.getElementById('sticky-btn-top');
  if (topBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        topBtn.style.display = 'flex';
        // Force Reflow
        setTimeout(() => {
          topBtn.style.opacity = '1';
          topBtn.style.transform = 'scale(1)';
        }, 10);
      } else {
        topBtn.style.opacity = '0';
        topBtn.style.transform = 'scale(0.8)';
        setTimeout(() => {
          if (window.scrollY <= 500) topBtn.style.display = 'none';
        }, 300);
      }
    });

    topBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
