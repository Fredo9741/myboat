// Gestion du menu hamburger et du scroll
function initializeHeaderEvents() {
    const header = document.querySelector('.header-top');
    if (!header) return;

    // Gestion du scroll pour le header
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll Down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll Up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
}

// Gestion des dropdowns
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            this.classList.add('open');
        });
        
        dropdown.addEventListener('mouseleave', function() {
            this.classList.remove('open');
        });
    });
}

// Initialisation après le chargement du DOM et des composants
document.addEventListener('DOMContentLoaded', function() {
    // Attendre que le header soit chargé
    const checkHeader = setInterval(() => {
        const header = document.querySelector('.header-top');
        if (header) {
            clearInterval(checkHeader);
            initializeHeaderEvents();
            initializeDropdowns();
        }
    }, 100);

    // Gestion du menu mobile
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbar = document.querySelector('#navbar');
    
    if (navbarToggle && navbar) {
        navbarToggle.addEventListener('click', function() {
            navbar.classList.toggle('in');
        });
    }
});

// Fermer les autres menus déroulants lors de l'ouverture d'un nouveau
$(document).ready(function() {
    $('.dropdown-toggle').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Fermer tous les autres menus déroulants
        $('.dropdown').not($(this).parent()).removeClass('open');
        
        // Basculer le menu cliqué
        $(this).parent().toggleClass('open');
    });
    
    // Fermer tous les menus déroulants lors d'un clic en dehors
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.dropdown').length) {
            $('.dropdown').removeClass('open');
        }
    });
}); 