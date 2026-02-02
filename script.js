document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les icônes Lucide
    lucide.createIcons();

    // Enregistrer les plugins GSAP
    gsap.registerPlugin(ScrollTrigger);

    // --- Logique de Navigation & Menu Mobile Créatif ---
    const nav = document.getElementById('main-nav');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const burgerLines = [document.getElementById('burger-line-1'), document.getElementById('burger-line-2')];
    const menuPanels = document.querySelectorAll('.menu-panel');

    let isMenuOpen = false;

    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('bg-background/90', 'backdrop-blur-md', 'border-b', 'border-border', 'py-4');
                nav.classList.remove('bg-transparent', 'py-6');
            } else {
                nav.classList.remove('bg-background/90', 'backdrop-blur-md', 'border-b', 'border-border', 'py-4');
                nav.classList.add('bg-transparent', 'py-6');
            }
        }, { passive: true });
    }

    if (mobileMenuBtn && mobileMenu) {
        // Initialiser l'état visuel du menu avec yPercent (Fix Pixel vs %)
        gsap.set(menuPanels, { yPercent: -100 });
        gsap.set('.mobile-link', { y: 50, autoAlpha: 0 });
        gsap.set('.animate-menu-footer', { autoAlpha: 0, y: 20 });

        const toggleMenu = () => {
            if (!isMenuOpen) {
                // --- OUVERTURE ---
                isMenuOpen = true;
                mobileMenu.classList.remove('hidden');
                mobileMenuBtn.classList.add('is-open');

                mobileMenu.style.pointerEvents = 'auto';
                document.body.style.overflow = 'hidden';

                // FORCE REFLOW
                void mobileMenu.offsetWidth;

                const tl = gsap.timeline();

                tl.to(menuPanels, {
                    yPercent: 0,
                    duration: 0.6,
                    stagger: 0, // Pas de décalage pour éviter le fond blanc sur blanc
                    ease: "expo.out",
                    overwrite: true
                })
                    .fromTo('.mobile-link', // Cible le lien entier
                        { y: 50, autoAlpha: 0 },
                        { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.05, ease: "power2.out", overwrite: true },
                        "-=0.4"
                    )
                    .to('.animate-menu-footer', { autoAlpha: 1, y: 0, duration: 0.5, overwrite: true }, "-=0.3");

            } else {
                // --- FERMETURE ---
                isMenuOpen = false;
                mobileMenuBtn.classList.remove('is-open');
                document.body.style.overflow = '';
                mobileMenu.style.pointerEvents = 'none';
                // Animation Fermeture
                gsap.to('.mobile-link', { y: -20, autoAlpha: 0, duration: 0.3, overwrite: true });
                gsap.to('.animate-menu-footer', { autoAlpha: 0, y: 10, duration: 0.3, overwrite: true });

                gsap.to(menuPanels, {
                    yPercent: -100,
                    duration: 0.6,
                    stagger: { from: "end", amount: 0.1 },
                    ease: "expo.inOut",
                    overwrite: true,
                    onComplete: () => {
                        if (!isMenuOpen) {
                            mobileMenu.classList.add('hidden');
                            gsap.set(menuPanels, { yPercent: -100 });
                            gsap.set('.mobile-link', { y: 50, autoAlpha: 0 });
                        }
                    }
                });
            }
        };

        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // Fermer en cliquant sur le fond (Style React)
        mobileMenu.addEventListener('click', (e) => {
            if (isMenuOpen && e.target === mobileMenu) {
                toggleMenu();
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');

                // Fermer le menu d'abord
                if (isMenuOpen) {
                    toggleMenu();
                }

                // Navigation immédiate (Style React)
                // On laisse le menu se fermer pendant le scroll
                if (href && href.startsWith('#')) {
                    const target = document.querySelector(href);
                    if (target) {
                        // Le body est déverrouillé immédiatement par toggleMenu()
                        // On scrolle tout de suite
                        const offsetTop = target.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });

            // Amélioration visuelle au survol
            link.addEventListener('mouseenter', () => {
                if (!isMenuOpen) return;
                gsap.to(link.querySelector('span'), {
                    x: 10,
                    duration: 0.3,
                    color: 'hsl(var(--primary))'
                });
            });

            link.addEventListener('mouseleave', () => {
                if (!isMenuOpen) return;
                gsap.to(link.querySelector('span'), {
                    x: 0,
                    duration: 0.3,
                    color: ''
                });
            });
        });
    }

    // Gestion active de la navigation avec ScrollTrigger (Plus performant)
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: "top 200px",
            end: "bottom 200px",
            onToggle: self => {
                if (self.isActive) {
                    const id = section.getAttribute('id');
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            }
        });
    });

    // --- Animation Hero GSAP ---
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

    heroTl.fromTo('.animate-hero',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, delay: 0.2 }
    );

    // Animation de flottement initiale pour les éléments de fond parallaxe
    gsap.to('.parallax-el', {
        y: 'random(-20, 20)',
        x: 'random(-20, 20)',
        duration: 'random(3, 5)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    // --- Révélation au Défilement GSAP (Stagger Premium) ---
    const revealElements = document.querySelectorAll('.animate-on-scroll');
    revealElements.forEach((el) => {
        gsap.fromTo(el,
            {
                y: 60,
                opacity: 0,
                scale: 0.98
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // --- Amélioration de l'Effet au Survol des Services ---
    document.querySelectorAll('.service-main-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card.querySelector('.service-gradient'), { opacity: 1, duration: 0.4 });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card.querySelector('.service-gradient'), { opacity: 0, duration: 0.4 });
        });
    });

    // --- Logique d'Expansion des Services avec GSAP ---
    document.querySelectorAll('.service-expand-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.service-main-card');
            const details = card.querySelector('.service-details');
            const arrow = btn.querySelector('.arrow-icon');

            if (details.classList.contains('is-open')) {
                gsap.to(details, {
                    height: 0,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        details.classList.remove('is-open', 'mt-6', 'pt-6', 'border-t');
                        details.style.maxHeight = null;
                        details.style.height = '';
                    }
                });
                gsap.to(arrow, { rotate: 0, duration: 0.3 });
            } else {
                details.classList.add('is-open', 'mt-6', 'pt-6', 'border-t');
                gsap.fromTo(details,
                    { height: 0, opacity: 0 },
                    { height: 'auto', opacity: 1, duration: 0.6, ease: 'power2.out' }
                );
                gsap.to(arrow, { rotate: 90, duration: 0.3 });
            }
        });
    });

    // --- Formulaire de Contact ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalContent = btn.innerHTML;

            gsap.to(btn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });

            btn.disabled = true;
            btn.innerHTML = `<i data-lucide="check" class="w-5 h-5"></i><span>Message envoyé !</span>`;
            lucide.createIcons();

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalContent;
                lucide.createIcons();
                contactForm.reset();
            }, 3000);
        });
    }

    // --- Curseur Personnalisé & Effet Magnétique (Désactivé sur Mobile) ---
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    let mouseX = 0;
    let mouseY = 0;

    if (!isTouchDevice) {
        const cursorOutline = document.querySelector('.cursor-outline');
        const cursorDot = document.querySelector('.cursor-dot');

        if (cursorOutline && cursorDot) {
            const xTo = gsap.quickTo(cursorOutline, "x", { duration: 0.4, ease: "power3" });
            const yTo = gsap.quickTo(cursorOutline, "y", { duration: 0.4, ease: "power3" });
            const dotXTo = gsap.quickTo(cursorDot, "x", { duration: 0.1, ease: "none" });
            const dotYTo = gsap.quickTo(cursorDot, "y", { duration: 0.1, ease: "none" });

            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                dotXTo(mouseX);
                dotYTo(mouseY);
                xTo(mouseX);
                yTo(mouseY);
            }, { passive: true });
        }

        // Logique des Éléments Magnétiques
        document.querySelectorAll('a, button, .service-main-card, .cursor-pointer').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const { left, top, width, height } = el.getBoundingClientRect();

                // Calculer la distance par rapport au centre
                const x = clientX - (left + width / 2);
                const y = clientY - (top + height / 2);

                // Déplacer l'élément légèrement (attraction magnétique)
                gsap.to(el, {
                    x: x * 0.2, // Force de l'attraction
                    y: y * 0.2,
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto"
                });

                // Coller légèrement le contour du curseur à l'élément
                xTo(left + width / 2 + x * 0.5);
                yTo(top + height / 2 + y * 0.5);
            });

            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
                gsap.to(cursorOutline, {
                    scale: 1.5,
                    borderColor: 'hsl(var(--primary))',
                    backgroundColor: 'hsl(var(--primary) / 0.1)',
                    duration: 0.3
                });
            });

            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
                gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
                gsap.to(cursorOutline, {
                    scale: 1,
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'transparent',
                    duration: 0.3
                });
                // Réinitialiser à la position réelle de la souris
                xTo(mouseX);
                yTo(mouseY);
            });
        });

        // Éléments parallaxes optimisés via Ticker pour une mise à jour constante
        gsap.ticker.add(() => {
            const xPos = (mouseX / window.innerWidth) - 0.5;
            const yPos = (mouseY / window.innerHeight) - 0.5;

            document.querySelectorAll('.parallax-el').forEach(el => {
                const speed = parseFloat(el.getAttribute('data-speed')) || 0.1;
                gsap.to(el, {
                    x: xPos * speed * 200,
                    y: yPos * speed * 200,
                    duration: 0.8,
                    ease: 'power1.out',
                    overwrite: 'auto'
                });
            });
        });
    }
});
