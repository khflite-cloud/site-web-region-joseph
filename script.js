(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        initMobileNavigation();
        initSmoothScroll(prefersReducedMotion);
        initScrollState();
        initActiveNavigation();
        initRevealAnimations(prefersReducedMotion);
        initCounters(prefersReducedMotion);
        initDistrictFilter();
        initGroupFilters();
        initEventFilters();
        initGallery(prefersReducedMotion);
        initContactForm();
        initBackToTop(prefersReducedMotion);
    });

    function initMobileNavigation() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.getElementById('primary-menu');

        if (!toggle || !menu) return;

        const menuLinks = menu.querySelectorAll('a[href^="#"]');

        const setMenuState = (isOpen) => {
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
            menu.classList.toggle('open', isOpen);
        };

        toggle.addEventListener('click', () => {
            const isOpen = toggle.getAttribute('aria-expanded') === 'true';
            setMenuState(!isOpen);
            if (!isOpen) {
                const firstLink = menu.querySelector('a');
                firstLink?.focus();
            }
        });

        menuLinks.forEach((link) => {
            link.addEventListener('click', () => setMenuState(false));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menu.classList.contains('open')) {
                setMenuState(false);
                toggle.focus();
            }
        });

        document.addEventListener('click', (event) => {
            if (!menu.classList.contains('open')) return;
            if (!menu.contains(event.target) && !toggle.contains(event.target)) {
                setMenuState(false);
            }
        });
    }

    function initSmoothScroll(prefersReducedMotion) {
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="#"]');
            if (!link) return;

            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });

            if (window.history.pushState) {
                window.history.pushState(null, '', targetId);
            }
        });
    }

    function initScrollState() {
        const navigation = document.querySelector('.site-nav');
        if (!navigation) return;

        let ticking = false;
        const updateNavigation = () => {
            navigation.classList.toggle('is-scrolled', window.scrollY > 24);
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateNavigation);
                ticking = true;
            }
        }, { passive: true });

        updateNavigation();
    }

    function initActiveNavigation() {
        const links = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
        const sections = links
            .map((link) => document.querySelector(link.getAttribute('href')))
            .filter(Boolean);

        if (!links.length || !sections.length) return;

        const updateActiveLink = () => {
            const offset = window.scrollY + (document.querySelector('.site-nav')?.offsetHeight || 0) + 120;
            let currentSection = sections[0];

            sections.forEach((section) => {
                if (section.offsetTop <= offset) currentSection = section;
            });

            links.forEach((link) => {
                const isCurrent = link.getAttribute('href') === `#${currentSection.id}`;
                if (isCurrent) link.setAttribute('aria-current', 'page');
                else link.removeAttribute('aria-current');
            });
        };

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateActiveLink();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        updateActiveLink();
    }

    function initRevealAnimations(prefersReducedMotion) {
        const revealElements = document.querySelectorAll('.district-card, .groupe-card, .timeline-item, .engagement-card');
        if (!revealElements.length || prefersReducedMotion || !('IntersectionObserver' in window)) return;

        revealElements.forEach((element) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(1.25rem)';
            element.style.transition = 'opacity 500ms ease, transform 500ms cubic-bezier(0.22, 1, 0.36, 1)';
        });

        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                currentObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        revealElements.forEach((element) => observer.observe(element));
    }

    function initCounters(prefersReducedMotion) {
        const counters = document.querySelectorAll('[data-counter]');
        if (!counters.length) return;

        const animateCounter = (element) => {
            const target = Number(element.dataset.counter);
            if (!Number.isFinite(target)) return;

            if (prefersReducedMotion || !('requestAnimationFrame' in window)) {
                element.textContent = target === 150 ? '150+' : String(target);
                return;
            }

            const duration = 1200;
            const start = performance.now();

            const update = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.floor(target * eased);
                element.textContent = target === 150 ? `${value}+` : String(value);
                if (progress < 1) window.requestAnimationFrame(update);
            };

            window.requestAnimationFrame(update);
        };

        if (!('IntersectionObserver' in window) || prefersReducedMotion) {
            counters.forEach(animateCounter);
            return;
        }

        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                currentObserver.unobserve(entry.target);
            });
        }, { threshold: 0.7 });

        counters.forEach((counter) => observer.observe(counter));
    }

    function initDistrictFilter() {
        const filter = document.getElementById('district-filter');
        const cards = [...document.querySelectorAll('.district-card')];
        if (!filter || !cards.length) return;

        filter.addEventListener('change', () => {
            const selectedDistrict = filter.value;
            cards.forEach((card) => {
                const isVisible = selectedDistrict === 'all' || card.dataset.district === selectedDistrict;
                card.hidden = !isVisible;
            });
        });
    }

    function initGroupFilters() {
        const search = document.getElementById('group-search');
        const districtFilter = document.getElementById('group-district-filter');
        const cards = [...document.querySelectorAll('.groupe-card')];
        const emptyState = document.getElementById('groupes-empty');

        if (!cards.length || (!search && !districtFilter)) return;

        const filterGroups = () => {
            const query = search?.value.trim().toLocaleLowerCase('fr-FR') || '';
            const district = districtFilter?.value || 'all';
            let visibleCount = 0;

            cards.forEach((card) => {
                const searchableText = card.textContent.toLocaleLowerCase('fr-FR');
                const matchesQuery = !query || searchableText.includes(query);
                const matchesDistrict = district === 'all' || card.dataset.district === district;
                const isVisible = matchesQuery && matchesDistrict;
                card.hidden = !isVisible;
                if (isVisible) visibleCount += 1;
            });

            if (emptyState) emptyState.hidden = visibleCount !== 0;
        };

        search?.addEventListener('input', filterGroups);
        districtFilter?.addEventListener('change', filterGroups);
    }

    function initEventFilters() {
        const buttons = [...document.querySelectorAll('.filter-button[data-filter]')];
        const events = [...document.querySelectorAll('.timeline-item[data-category]')];
        if (!buttons.length || !events.length) return;

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const selectedCategory = button.dataset.filter;
                buttons.forEach((item) => item.classList.toggle('is-active', item === button));
                events.forEach((event) => {
                    event.hidden = selectedCategory !== 'all' && event.dataset.category !== selectedCategory;
                });
            });
        });
    }

    function initGallery(prefersReducedMotion) {
        const gallery = document.querySelector('[data-gallery]');
        const modal = document.getElementById('gallery-modal');
        if (!gallery || !modal) return;

        const items = [...gallery.querySelectorAll('[data-gallery-item], .gallery-item')];
        if (!items.length) return;

        const content = modal.querySelector('[data-modal-content]');
        const closeButton = modal.querySelector('[data-modal-close]');
        if (!content || !closeButton) return;

        let currentIndex = 0;
        let previousFocus = null;

        const getImage = (item) => item.querySelector('img') || item;

        const renderItem = (index) => {
            currentIndex = (index + items.length) % items.length;
            const image = getImage(items[currentIndex]);
            const source = image?.currentSrc || image?.src;
            if (!source) return;

            content.replaceChildren();
            const largeImage = document.createElement('img');
            largeImage.src = source;
            largeImage.alt = image.alt || 'Image de la Région Joseph';
            largeImage.loading = 'eager';
            content.appendChild(largeImage);

            const counter = modal.querySelector('[data-gallery-counter]');
            if (counter) counter.textContent = `${currentIndex + 1} / ${items.length}`;
        };

        const closeModal = () => {
            if (typeof modal.close === 'function') modal.close();
            else modal.removeAttribute('open');
            previousFocus?.focus();
        };

        const openModal = (index, trigger) => {
            previousFocus = trigger;
            renderItem(index);
            if (typeof modal.showModal === 'function') modal.showModal();
            else modal.setAttribute('open', '');
            closeButton.focus();
        };

        let previousButton = modal.querySelector('[data-gallery-previous]');
        let nextButton = modal.querySelector('[data-gallery-next]');
        if (!previousButton || !nextButton) {
            const controls = document.createElement('div');
            controls.className = 'gallery-controls';
            previousButton = document.createElement('button');
            nextButton = document.createElement('button');
            previousButton.type = 'button';
            nextButton.type = 'button';
            previousButton.dataset.galleryPrevious = '';
            nextButton.dataset.galleryNext = '';
            previousButton.textContent = 'Précédent';
            nextButton.textContent = 'Suivant';
            controls.append(previousButton, nextButton);
            modal.appendChild(controls);
        }

        items.forEach((item, index) => {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.addEventListener('click', () => openModal(index, item));
            item.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openModal(index, item);
                }
            });
        });

        closeButton.addEventListener('click', closeModal);
        previousButton.addEventListener('click', () => renderItem(currentIndex - 1));
        nextButton.addEventListener('click', () => renderItem(currentIndex + 1));

        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });

        modal.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') renderItem(currentIndex - 1);
            if (event.key === 'ArrowRight') renderItem(currentIndex + 1);
            if (event.key === 'Escape') closeModal();
        });

        if (prefersReducedMotion) modal.style.scrollBehavior = 'auto';
    }

    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const successMessage = document.getElementById('form-success');
        const status = document.getElementById('form-status');
        if (!nameInput || !emailInput || !messageInput) return;

        const showError = (input, message) => {
            input.setCustomValidity(message);
            input.setAttribute('aria-invalid', 'true');
            input.reportValidity();
        };

        const clearError = (input) => {
            input.setCustomValidity('');
            input.removeAttribute('aria-invalid');
        };

        [nameInput, emailInput, messageInput].forEach((input) => {
            input.addEventListener('input', () => clearError(input));
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            [nameInput, emailInput, messageInput].forEach(clearError);

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            if (name.length < 2) {
                showError(nameInput, 'Indiquez votre nom complet.');
                return;
            }
            if (!emailInput.checkValidity()) {
                showError(emailInput, 'Indiquez une adresse e-mail valide.');
                return;
            }
            if (message.length < 10) {
                showError(messageInput, 'Votre message doit contenir au moins 10 caractères.');
                return;
            }

            const subject = `Contact site - ${name}`;
            const body = `Nom : ${name}\nE-mail : ${email}\n\n${message}`;
            const mailto = `mailto:contact@region-joseph.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            if (status) status.textContent = 'Votre logiciel de messagerie va s’ouvrir.';
            if (successMessage) successMessage.hidden = false;
            window.location.href = mailto;
            form.reset();
        });
    }

    function initBackToTop(prefersReducedMotion) {
        let button = document.getElementById('back-to-top');
        if (!button) {
            button = document.createElement('button');
            button.id = 'back-to-top';
            button.type = 'button';
            button.className = 'back-to-top';
            button.setAttribute('aria-label', 'Retour en haut de la page');
            button.innerHTML = '<span aria-hidden="true">↑</span>';
            document.body.appendChild(button);
        }

        const updateVisibility = () => {
            button.classList.toggle('is-visible', window.scrollY > 500);
        };

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
        window.addEventListener('scroll', updateVisibility, { passive: true });
        updateVisibility();
    }
})();
