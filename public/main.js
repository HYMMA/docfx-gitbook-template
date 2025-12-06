/*
 * DocFX GitBook Template - JavaScript
 * Handles theme toggling, search, TOC scroll spy, and animations
 */

export default {
    // Default to system preference
    defaultTheme: 'auto',

    // Icon links in the header
    iconLinks: [
        {
            icon: 'github',
            href: 'https://github.com/HYMMA',
            title: 'GitHub'
        }
    ],

    // Startup function
    start: () => {
        initScrollSpy();
        initSmoothScroll();
        initMobileMenu();
        initSearchEnhancements();
        initCodeBlockEnhancements();
        initAnimations();
    },

    // Highlight.js configuration
    configureHljs: (hljs) => {
        // Add language labels to code blocks
        hljs.addPlugin({
            'after:highlightElement': ({ el, result }) => {
                const pre = el.closest('pre');
                if (pre && result.language) {
                    pre.setAttribute('data-lang', result.language);
                }
            }
        });
    }
};

/**
 * Initialize scroll spy for table of contents
 */
function initScrollSpy() {
    const affix = document.querySelector('.affix');
    if (!affix) return;

    const links = affix.querySelectorAll('a[href^="#"]');
    const headings = [];

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const heading = document.getElementById(href.slice(1));
            if (heading) {
                headings.push({ link, heading });
            }
        }
    });

    if (headings.length === 0) return;

    function updateActiveLink() {
        const scrollPos = window.scrollY + 100;
        let activeIndex = 0;

        headings.forEach((item, index) => {
            if (item.heading.offsetTop <= scrollPos) {
                activeIndex = index;
            }
        });

        links.forEach(link => link.classList.remove('active'));
        if (headings[activeIndex]) {
            headings[activeIndex].link.classList.add('active');
        }
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.mobile-menu-toggle');

    if (!sidebar || !toggleBtn) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    overlay.style.cssText = `
        display: none;
        position: fixed;
        inset: 0;
        top: 64px;
        background: rgba(0, 0, 0, 0.5);
        z-index: 899;
        opacity: 0;
        transition: opacity 0.25s ease;
    `;
    document.body.appendChild(overlay);

    function openMenu() {
        sidebar.classList.add('show');
        overlay.style.display = 'block';
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        sidebar.classList.remove('show');
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 250);
        document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', () => {
        if (sidebar.classList.contains('show')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    overlay.addEventListener('click', closeMenu);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('show')) {
            closeMenu();
        }
    });

    // Close when clicking a link (on mobile)
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                closeMenu();
            }
        });
    });
}

/**
 * Initialize search enhancements
 */
function initSearchEnhancements() {
    const searchInput = document.querySelector('#search input');
    if (!searchInput) return;

    // Keyboard shortcut (Ctrl+K or Cmd+K)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });

    // Add placeholder with shortcut hint
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const shortcut = isMac ? '⌘K' : 'Ctrl+K';
    searchInput.placeholder = `Search... (${shortcut})`;
}

/**
 * Initialize code block enhancements
 */
function initCodeBlockEnhancements() {
    document.querySelectorAll('pre code').forEach(block => {
        const pre = block.parentElement;

        // Add copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-copy-btn';
        copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        `;
        copyBtn.title = 'Copy code';
        copyBtn.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            padding: 0.375rem;
            background: var(--gitbook-bg-elevated);
            border: 1px solid var(--gitbook-border);
            border-radius: 4px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.15s ease;
            color: var(--gitbook-text-muted);
        `;

        pre.style.position = 'relative';
        pre.appendChild(copyBtn);

        pre.addEventListener('mouseenter', () => {
            copyBtn.style.opacity = '1';
        });

        pre.addEventListener('mouseleave', () => {
            copyBtn.style.opacity = '0';
        });

        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(block.textContent);
                copyBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;
                copyBtn.style.color = 'var(--gitbook-accent)';

                setTimeout(() => {
                    copyBtn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    `;
                    copyBtn.style.color = 'var(--gitbook-text-muted)';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });
}

/**
 * Initialize page animations
 */
function initAnimations() {
    // Stagger animation for sidebar items
    const sidebarLinks = document.querySelectorAll('.toc .nav > li');
    sidebarLinks.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-10px)';
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.transitionDelay = `${index * 30}ms`;

        requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        });
    });

    // Animate headings on scroll into view
    const headings = document.querySelectorAll('article h2, article h3');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        headings.forEach(heading => {
            heading.style.opacity = '0';
            heading.style.transform = 'translateY(20px)';
            heading.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(heading);
        });
    }
}
