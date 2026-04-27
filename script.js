// AOS Init
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let ticking = false;

window.addEventListener('scroll', function () {
    if (!ticking) {
        window.requestAnimationFrame(function () {
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Toggle service items
const serviceHeaders = document.querySelectorAll('.service-header');

serviceHeaders.forEach((header) => {
    header.addEventListener('click', function () {
        const item = this.parentElement;
        const isActive = item.classList.contains('active');

        document.querySelectorAll('.service-item').forEach((serviceItem) => {
            serviceItem.classList.remove('active');
        });

        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Smooth scroll for anchor links
const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (!href || href === '#') return;

        const target = document.querySelector(href);

        if (!target) return;

        e.preventDefault();

        const offset = 100;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

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

// Contact form to WhatsApp
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre')?.value.trim() || '';
        const empresa = document.getElementById('empresa')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const servicio = document.getElementById('servicio')?.value || '';
        const mensaje = document.getElementById('mensaje')?.value.trim() || '';

        if (!nombre || !email) {
            alert('Por favor completá al menos tu nombre y email.');
            return;
        }

        const texto = `Hola! Vi tu web y quiero más información:

• Nombre: ${nombre}
• Empresa: ${empresa}
• Email: ${email}
• Servicio: ${servicio}

Mensaje:
${mensaje}`;

        const url = `https://wa.me/5493515524067?text=${encodeURIComponent(texto)}`;

        window.open(url, '_blank');
    });
}