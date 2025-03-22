document.addEventListener('DOMContentLoaded', function() {
    const filtersForm = document.getElementById('filters-form');
    
    if (filtersForm) {
        filtersForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
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
            // Par exemple, faire une requête AJAX vers votre API
            console.log('Filtres appliqués:', filters);
            
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