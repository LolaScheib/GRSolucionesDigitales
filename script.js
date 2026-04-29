// ============================================
// AOS Init - Configuración optimizada
// ============================================
AOS.init({
    duration: 800,
    once: true,
    offset: 80,
    easing: 'ease-out-cubic',
    delay: 0,
    anchorPlacement: 'top-bottom'
});

// ============================================
// Intersection Observer para animaciones nativas
// (complementa AOS con animaciones más precisas)
// ============================================
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // Stagger para elementos hijos
            const staggerChildren = entry.target.querySelectorAll('.stagger-item');
            staggerChildren.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('stagger-revealed');
                }, index * 100);
            });
            
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos con clase .reveal-on-scroll
document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    revealObserver.observe(el);
});

// ============================================
// Navbar scroll effect con throttling mejorado
// ============================================
const navbar = document.querySelector('.navbar');
let lastScrollY = 0;
let ticking = false;

function updateNavbar() {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll direction
    if (scrollY > lastScrollY && scrollY > 300) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollY = scrollY;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}, { passive: true });

// ============================================
// Toggle service items con animación mejorada
// ============================================
const serviceHeaders = document.querySelectorAll('.service-header');

serviceHeaders.forEach((header) => {
    header.addEventListener('click', function () {
        const item = this.parentElement;
        const isActive = item.classList.contains('active');
        const content = item.querySelector('.service-content');
        
        // Cerrar todos los demás
        document.querySelectorAll('.service-item').forEach((serviceItem) => {
            if (serviceItem !== item) {
                serviceItem.classList.remove('active');
                const otherContent = serviceItem.querySelector('.service-content');
                if (otherContent) {
                    otherContent.style.maxHeight = null;
                }
            }
        });

        if (!isActive) {
            item.classList.add('active');
            // Calcular altura real para animación suave
            content.style.maxHeight = content.scrollHeight + 'px';
        } else {
            item.classList.remove('active');
            content.style.maxHeight = null;
        }
    });
});

// ============================================
// Smooth scroll para anchor links
// ============================================
const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (!href || href === '#') return;

        const target = document.querySelector(href);

        if (!target) return;

        e.preventDefault();

        const offset = 90;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Cerrar menú mobile si está abierto
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const bsCollapse = navbarCollapse ? bootstrap.Collapse.getInstance(navbarCollapse) : null;

        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            if (bsCollapse) {
                bsCollapse.hide();
            } else {
                new bootstrap.Collapse(navbarCollapse, { toggle: true });
            }
        }
    });
});

// ============================================
// Contact form a WhatsApp con validación y feedback
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre')?.value.trim() || '';
        const empresa = document.getElementById('empresa')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const servicio = document.getElementById('servicio')?.value || '';
        const mensaje = document.getElementById('mensaje')?.value.trim() || '';

        // Validación
        if (!nombre || !email) {
            showNotification('Por favor completá al menos tu nombre y email.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Por favor ingresá un email válido.', 'error');
            return;
        }

        // Construir mensaje
        const texto = `Hola! Vi su web y me interesa mejorar la presencia digital de mi negocio. ¿Podemos hablar para ver cómo me pueden ayudar?

• Nombre: ${nombre}
• Empresa: ${empresa}
• Email: ${email}
• Servicio: ${servicio}

Mensaje:
${mensaje}`;

        const url = `https://wa.me/5493515524067?text=${encodeURIComponent(texto)}`;

        // Feedback visual
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Abriendo WhatsApp...';
        submitBtn.disabled = true;

        setTimeout(() => {
            window.open(url, '_blank');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            contactForm.reset();
            showNotification('¡Mensaje preparado! Se abrió WhatsApp.', 'success');
        }, 600);
    });
}

// Helper: validar email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Helper: notificaciones toast
function showNotification(message, type = 'info') {
    // Remover notificación anterior si existe
    const existing = document.querySelector('.gr-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `gr-notification gr-notification--${type}`;
    notification.innerHTML = `
        <span class="gr-notification__icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
        <span class="gr-notification__text">${message}</span>
    `;

    // Estilos inline para la notificación
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
        font-size: 0.9rem;
        box-shadow: 0 12px 32px rgba(0,0,0,0.15);
        z-index: 9999;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;

    document.body.appendChild(notification);

    // Animar entrada
    requestAnimationFrame(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    });

    // Auto-remover
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// ============================================
// Parallax sutil en hero
// ============================================
const heroLogo = document.querySelector('.hero-logo');
const heroSection = document.querySelector('.hero');

if (heroLogo && heroSection) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.15;
        
        if (scrolled < window.innerHeight) {
            heroLogo.style.transform = `translateY(${rate}px) scale(1.04)`;
        }
    }, { passive: true });
}

// ============================================
// Efecto de contador en estadísticas (si se agregan)
// ============================================
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
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// ============================================
// Lazy loading para imágenes con fade-in
// ============================================
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('img-loaded');
            imageObserver.unobserve(img);
        }
    });
}, { rootMargin: '50px' });

lazyImages.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease';
    imageObserver.observe(img);
});

// Clase para cuando la imagen carga
document.head.insertAdjacentHTML('beforeend', `
    <style>
        img.img-loaded {
            opacity: 1 !important;
        }
    </style>
`);



// ============================================
// Preloader (opcional, si se quiere agregar al HTML)
// ============================================
window.addEventListener('load', () => {
    document.body.classList.add('page-loaded');
    
    // Animación de entrada para el hero
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }
});

// ============================================
// Keyboard navigation mejorada
// ============================================
document.addEventListener('keydown', (e) => {
    // Escape cierra menú mobile
    if (e.key === 'Escape') {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) bsCollapse.hide();
        }
    }
});

// ============================================
// Console easter egg 🚀
// ============================================
console.log('%c GR Soluciones Digitales ', 'background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
console.log('%c ¿Buscás transformar tu negocio? Escribinos: grsolucionesdigitales25@gmail.com', 'color: #3b82f6; font-size: 14px;');