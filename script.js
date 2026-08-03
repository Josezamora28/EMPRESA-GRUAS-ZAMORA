document.addEventListener('DOMContentLoaded', () => {
    window.setTimeout(() => document.body.classList.add('page-ready'), 40);

    /* Portada: rotación pausada y accesible de las maniobras destacadas. */
    const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
    if (heroSlides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        let currentHeroSlide = 0;
        window.setInterval(() => {
            heroSlides[currentHeroSlide].classList.remove('active');
            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
            heroSlides[currentHeroSlide].classList.add('active');
        }, 5000);
    }

    /* ==========================================================================
       1. HEADER REDUCIDO EN SCROLL
       ========================================================================== */
    const mainHeader = document.getElementById('mainHeader');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       2. MENÚ RESPONSIVO (MÓVIL)
       ========================================================================== */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    /* ==========================================================================
       3. DETECCIÓN DE SECCIÓN ACTIVA EN MENÚ (SCROLL SPY)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    function scrollActive() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }
    window.addEventListener('scroll', scrollActive);

    /* ==========================================================================
       4. ANIMACIÓN AL APARECER SECCIONES (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal, .timeline-item');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Si ya se animó, dejamos de observarlo para optimizar rendimiento
                if (entry.target.classList.contains('reveal')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       5. CONTADORES DE ESTADÍSTICAS ANIMADOS
       ========================================================================== */
    const statsSection = document.getElementById('statsGrid');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 segundos
            const stepTime = Math.abs(Math.floor(duration / target));
            let current = 0;

            const timer = setInterval(() => {
                current += 1;
                
                // Formateadores específicos
                if (target === 20) {
                    stat.textContent = `+${current}`;
                } else if (target === 500) {
                    // Saltar de 5 en 5 para acelerar el de 500
                    current += 4; 
                    if (current >= target) current = target;
                    stat.textContent = `+${current}`;
                } else if (target === 24) {
                    stat.textContent = `${current}/7`;
                } else if (target === 100) {
                    stat.textContent = `${current}%`;
                }

                if (current >= target) {
                    clearInterval(timer);
                    // Asegurar valor final exacto
                    if (target === 20) stat.textContent = `+20`;
                    else if (target === 500) stat.textContent = `+500`;
                    else if (target === 24) stat.textContent = `24/7`;
                    else if (target === 100) stat.textContent = `100%`;
                }
            }, stepTime);
        });
    }

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedStats) {
                    animateStats();
                    animatedStats = true;
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    /* ==========================================================================
       6. CARRUSEL AUTOMÁTICO Y MANUAL DE TESTIMONIOS
       ========================================================================== */
    const testimonialsCarousel = document.getElementById('testimonialsCarousel');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('carouselDots');
    let currentSlide = 0;
    let autoSlideInterval;
    let testimonialSlides = [];

    const updateCarousel = (index) => {
        testimonialSlides = Array.from(document.querySelectorAll('.testimonial-slide'));
        if (!testimonialSlides.length) return;

        const safeIndex = ((index % testimonialSlides.length) + testimonialSlides.length) % testimonialSlides.length;
        testimonialSlides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === safeIndex) slide.classList.add('active');
        });

        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
                dot.classList.remove('active');
                if (i === safeIndex) dot.classList.add('active');
        });

        currentSlide = safeIndex;
    };

    const nextSlide = () => updateCarousel(currentSlide + 1);
    const prevSlide = () => updateCarousel(currentSlide - 1);

    const stopAutoplay = () => clearInterval(autoSlideInterval);
    const startAutoplay = () => {
        stopAutoplay();
        autoSlideInterval = setInterval(nextSlide, 6000);
    };

    const bindDot = (dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoplay();
            updateCarousel(index);
            startAutoplay();
        });
    };

    const addTestimonialToCarousel = (testimonial, showImmediately = false) => {
        if (!testimonialsCarousel || !dotsContainer) return;

        const slide = document.createElement('div');
        slide.className = 'testimonial-slide';
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        const quote = document.createElement('div');
        quote.className = 'testimonial-quote';
        quote.textContent = '“';
        const stars = document.createElement('div');
        stars.className = 'testimonial-stars';
        stars.setAttribute('aria-label', `${testimonial.rating} de 5 estrellas`);
        stars.textContent = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
        const message = document.createElement('p');
        message.className = 'testimonial-text';
        message.textContent = testimonial.message;
        const author = document.createElement('div');
        author.className = 'testimonial-author';
        const avatar = document.createElement('div');
        avatar.className = 'author-avatar-fallback';
        avatar.textContent = testimonial.name.charAt(0).toUpperCase();
        const info = document.createElement('div');
        info.className = 'author-info';
        const name = document.createElement('h4');
        name.className = 'author-name';
        name.textContent = testimonial.name;
        const company = document.createElement('span');
        company.className = 'author-company';
        company.textContent = testimonial.company || 'Cliente de Grúas Zamora';

        info.append(name, company);
        author.append(avatar, info);
        card.append(quote, stars, message, author);
        slide.appendChild(card);
        testimonialsCarousel.appendChild(slide);

        testimonialSlides = Array.from(document.querySelectorAll('.testimonial-slide'));
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.dataset.slide = String(testimonialSlides.length - 1);
        bindDot(dot, testimonialSlides.length - 1);
        dotsContainer.appendChild(dot);

        if (showImmediately) updateCarousel(testimonialSlides.length - 1);
    };

    testimonialSlides = Array.from(document.querySelectorAll('.testimonial-slide'));
    if (testimonialSlides.length > 0) {
        nextBtn.addEventListener('click', () => {
            stopAutoplay();
            nextSlide();
            startAutoplay();
        });

        prevBtn.addEventListener('click', () => {
            stopAutoplay();
            prevSlide();
            startAutoplay();
        });

        dotsContainer.querySelectorAll('.dot').forEach(bindDot);

        const storedTestimonials = JSON.parse(localStorage.getItem('zamoraTestimonials') || '[]');
        storedTestimonials.forEach((testimonial) => addTestimonialToCarousel(testimonial));
        updateCarousel(0);
        startAutoplay();
    }

    /* ==========================================================================
       7. BOTÓN VOLVER ARRIBA (BACK TO TOP)
       ========================================================================== */
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       8. SIMULACIÓN DE FORMULARIO DE CONTACTO/COTIZACIÓN
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Cambiar estado del botón a cargando
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Procesando tu Solicitud...';
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            // Simulación de envío de datos
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;

                // Mensaje exitoso
                formStatus.classList.add('success');
                formStatus.textContent = '¡Solicitud recibida! Un ingeniero de izaje te contactará en breve.';
                
                // Limpiar formulario
                contactForm.reset();

                // Quitar mensaje en 5 segundos
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);

            }, 1500); // 1.5s de delay simulado
        });
    }

    /* ======================================================================
       9. FORMULARIO DE TESTIMONIOS (VISTA LOCAL)
       ====================================================================== */
    const testimonialForm = document.getElementById('testimonialForm');
    const testimonialFormStatus = document.getElementById('testimonialFormStatus');

    if (testimonialForm) {
        testimonialForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const selectedRating = testimonialForm.querySelector('input[name="rating"]:checked');
            if (!selectedRating) {
                testimonialFormStatus.textContent = 'Selecciona una calificación antes de enviar.';
                return;
            }

            const testimonial = {
                name: document.getElementById('testimonialName').value.trim(),
                company: document.getElementById('testimonialCompany').value.trim(),
                rating: Number(selectedRating.value),
                message: document.getElementById('testimonialMessage').value.trim(),
                createdAt: new Date().toISOString(),
                status: 'published'
            };

            const storedTestimonials = JSON.parse(localStorage.getItem('zamoraTestimonials') || '[]');
            storedTestimonials.push(testimonial);
            localStorage.setItem('zamoraTestimonials', JSON.stringify(storedTestimonials));

            stopAutoplay();
            addTestimonialToCarousel(testimonial, true);
            startAutoplay();
            testimonialForm.reset();
            testimonialFormStatus.textContent = '¡Gracias! Tu testimonio ya aparece en el carrusel.';
        });
    }
});
