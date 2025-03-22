document.addEventListener('DOMContentLoaded', function() {
    console.log("Document chargé, initialisation du script bateaux.js");
    
    // Utilisation des IDs pour plus de fiabilité
    const mobileFiltersBtn = document.getElementById('mobileFilterButton');
    const filtersContainer = document.getElementById('filtersContainer');
    const filtersForm = document.getElementById('filters-form');
    
    // Vérification des éléments
    console.log("Bouton filtres trouvé:", mobileFiltersBtn !== null);
    console.log("Container filtres trouvé:", filtersContainer !== null);
    console.log("Formulaire filtres trouvé:", filtersForm !== null);
    
    // Gestion du bouton Filtres sur mobile
    if (mobileFiltersBtn && filtersContainer) {
        console.log("Configuration du bouton filtres");
        
        // Ajouter un débogage au clic
        mobileFiltersBtn.addEventListener('click', function(event) {
            console.log("Bouton filtres cliqué");
            event.preventDefault(); // Pour s'assurer qu'aucun comportement par défaut ne pose problème
            
            filtersContainer.classList.toggle('is-visible');
            console.log("État du container:", filtersContainer.classList.contains('is-visible') ? "visible" : "caché");
            
            if (filtersContainer.classList.contains('is-visible')) {
                mobileFiltersBtn.innerHTML = '<i class="fas fa-times"></i> Fermer';
            } else {
                mobileFiltersBtn.innerHTML = '<i class="fas fa-filter"></i> Filtres';
            }
        });
        
        // Ajout d'un clic dynamique pour tester le bouton
        console.log("Test de clic automatique sur le bouton filtres");
        setTimeout(function() {
            mobileFiltersBtn.click();
            console.log("Clic automatique effectué");
            
            // On referme après 500ms
            setTimeout(function() {
                mobileFiltersBtn.click();
                console.log("Refermeture automatique effectuée");
            }, 500);
        }, 1000);
    }
    
    // Gestion du formulaire de filtres
    if (filtersForm) {
        filtersForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Formulaire soumis");
            
            // Récupérer les valeurs des filtres
            const formData = new FormData(filtersForm);
            const filters = {
                types: [],
                priceMin: formData.get('price_min'),
                priceMax: formData.get('price_max'),
                lengthMin: formData.get('length_min'),
                lengthMax: formData.get('length_max'),
                yearMin: formData.get('year_min'),
                yearMax: formData.get('year_max'),
                location: formData.get('location')
            };
            
            // Récupérer les types de bateaux cochés
            document.querySelectorAll('input[name="type"]:checked').forEach(checkbox => {
                filters.types.push(checkbox.value);
            });
            
            // Ici, vous pouvez ajouter la logique pour filtrer les bateaux
            console.log('Filtres appliqués:', filters);
            
            // Fermer le panel des filtres sur mobile
            if (window.innerWidth <= 768 && filtersContainer.classList.contains('is-visible')) {
                filtersContainer.classList.remove('is-visible');
                mobileFiltersBtn.innerHTML = '<i class="fas fa-filter"></i> Filtres';
            }
            
            // Pour l'exemple, on simule un chargement
            const boatsGrid = document.querySelector('.boats-grid');
            if (boatsGrid) {
                boatsGrid.style.opacity = '0.5';
                boatsGrid.style.pointerEvents = 'none';
                
                // Simuler un délai de chargement
                setTimeout(() => {
                    boatsGrid.style.opacity = '1';
                    boatsGrid.style.pointerEvents = 'auto';
                }, 1000);
            }
        });
    }
    
    // Validation des champs numériques
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            const min = parseFloat(this.getAttribute('min')) || 0;
            const max = parseFloat(this.getAttribute('max')) || Infinity;
            let value = parseFloat(this.value);
            
            if (value < min) this.value = min;
            if (value > max) this.value = max;
        });
    });
}); 