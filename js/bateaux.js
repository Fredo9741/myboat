document.addEventListener('DOMContentLoaded', function() {
    console.log("Document chargé, initialisation du script bateaux.js");
    
    // Utilisation des IDs pour plus de fiabilité
    const mobileFiltersBtn = document.getElementById('mobileFilterButton');
    const filtersContainer = document.getElementById('filtersContainer');
    const filtersForm = document.getElementById('filters-form');
    const boatsContainer = document.querySelector('.col-md-9');
    const boatsGrid = document.querySelector('.boats-grid');
    
    // Vérification des éléments
    console.log("Bouton filtres trouvé:", mobileFiltersBtn !== null);
    console.log("Container filtres trouvé:", filtersContainer !== null);
    console.log("Formulaire filtres trouvé:", filtersForm !== null);
    console.log("Container bateaux trouvé:", boatsContainer !== null);
    console.log("Grid bateaux trouvé:", boatsGrid !== null);
    
    // S'assurer que les colonnes sont visibles dès le chargement
    if (boatsContainer) {
        boatsContainer.style.display = 'block';
        
        // Ajuster la largeur UNIQUEMENT sur mobile
        adjustContainerForScreenSize();
    }
    
    // Fonction pour ajuster le conteneur en fonction de la taille d'écran
    function adjustContainerForScreenSize() {
        if (window.innerWidth <= 768 && boatsContainer) {
            // Styles pour mobile
            boatsContainer.style.width = '100%';
            boatsContainer.style.padding = '0 10px';
            boatsContainer.style.float = 'none';
        } else if (boatsContainer) {
            // Réinitialiser pour desktop
            boatsContainer.style.width = '';
            boatsContainer.style.padding = '';
            boatsContainer.style.float = '';
        }
    }
    
    // Adapter la grille en fonction de la largeur d'écran
    function adjustGridForMobile() {
        if (window.innerWidth <= 768 && boatsGrid) {
            // Styles pour mobile
            boatsGrid.style.width = '100%';
            boatsGrid.style.padding = '0';
            
            // Ajuster chaque carte de bateau pour mobile
            const boatCards = document.querySelectorAll('.boat-card');
            boatCards.forEach(card => {
                card.style.width = '100%';
                card.style.maxWidth = '100%';
                card.style.margin = '0 0 20px 0';
            });
        } else if (boatsGrid) {
            // Réinitialiser les styles pour desktop
            boatsGrid.style.width = '';
            boatsGrid.style.padding = '';
            
            // Réinitialiser les cartes pour desktop
            const boatCards = document.querySelectorAll('.boat-card');
            boatCards.forEach(card => {
                card.style.width = '';
                card.style.maxWidth = '';
                card.style.margin = '';
            });
        }
    }
    
    // Appliquer les ajustements au chargement
    adjustGridForMobile();
    
    // Réappliquer les ajustements lors du redimensionnement
    window.addEventListener('resize', function() {
        adjustContainerForScreenSize();
        adjustGridForMobile();
    });
    
    // Forcer le bon affichage des colonnes
    setTimeout(function() {
        // S'assurer que la mise en page est correcte
        const row = document.querySelector('.boats-listing .row');
        if (row) {
            // Appliquer des styles différents selon la taille d'écran
            if (window.innerWidth <= 768) {
                row.style.display = 'block';
                row.style.overflow = 'hidden';
            } else {
                row.style.display = '';
                row.style.overflow = '';
            }
        }
        
        // Réappliquer les ajustements
        adjustContainerForScreenSize();
        adjustGridForMobile();
    }, 100);
    
    // Charger les bateaux depuis le localStorage
    loadBoatsFromLocalStorage();
    
    // Fonction pour charger les bateaux depuis le localStorage
    function loadBoatsFromLocalStorage() {
        if (boatsGrid) {
            try {
                // Récupérer les bateaux depuis le localStorage
                const localBoats = JSON.parse(localStorage.getItem('localBoats') || '[]');
                console.log("Bateaux chargés depuis localStorage:", localBoats.length);
                
                // S'il y a des bateaux locaux, les ajouter directement dans la grille principale
                if (localBoats.length > 0) {
                    // Ajouter chaque bateau au début de la grille
                    localBoats.forEach(boat => {
                        const boatCard = createBoatCard(boat);
                        // Insérer au début de la grille (avant le premier bateau existant)
                        boatsGrid.insertBefore(boatCard, boatsGrid.firstChild);
                    });
                    
                    // Réappliquer les styles après avoir ajouté de nouveaux bateaux
                    adjustGridForMobile();
                }
            } catch (error) {
                console.error("Erreur lors du chargement des bateaux:", error);
            }
        }
    }
    
    // Fonction pour créer une carte de bateau
    function createBoatCard(boat) {
        const card = document.createElement('div');
        card.className = 'boat-card';
        card.setAttribute('data-boat-id', boat.id);
        
        // Formatter le prix
        const price = typeof boat.price === 'number' 
            ? boat.price.toLocaleString() + ' €' 
            : boat.price;
        
        // Formatter la longueur avec l'unité
        const length = typeof boat.length === 'number'
            ? boat.length + 'm'
            : boat.length;
        
        card.innerHTML = `
            <div class="boat-image">
                <img src="${boat.image_url || 'img/boats/default-boat.jpg'}" alt="${boat.name}">
            </div>
            <div class="boat-info">
                <h3>${boat.name}</h3>
                <div class="boat-details">
                    <span><i class="fas fa-ruler"></i> ${length}</span>
                    <span><i class="fas fa-calendar"></i> ${boat.year}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${boat.location}</span>
                </div>
                <div class="boat-price">
                    <span class="price">${price}</span>
                </div>
                <a href="bateau-detail.html?id=${boat.id}" class="btn btn-primary">Voir le détail</a>
                <button class="btn btn-sm btn-link delete-boat" style="color: #e74c3c; text-decoration: none;">
                    <i class="fas fa-trash"></i> Retirer de la liste
                </button>
            </div>
        `;
        
        // Ajouter un gestionnaire d'événement pour le bouton de suppression
        const deleteButton = card.querySelector('.delete-boat');
        if (deleteButton) {
            deleteButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                deleteLocalBoat(boat.id);
            });
        }
        
        return card;
    }
    
    // Fonction pour supprimer un bateau local
    function deleteLocalBoat(boatId) {
        try {
            // Récupérer les bateaux depuis le localStorage
            let localBoats = JSON.parse(localStorage.getItem('localBoats') || '[]');
            
            // Filtrer pour supprimer le bateau
            localBoats = localBoats.filter(boat => boat.id !== boatId);
            
            // Sauvegarder dans localStorage
            localStorage.setItem('localBoats', JSON.stringify(localBoats));
            
            // Supprimer la carte du bateau de l'interface
            const boatCard = document.querySelector(`.boat-card[data-boat-id="${boatId}"]`);
            if (boatCard) {
                // Ajouter une animation de fondu avant de supprimer
                boatCard.style.transition = 'opacity 0.3s ease';
                boatCard.style.opacity = '0';
                
                setTimeout(() => {
                    boatCard.remove();
                }, 300);
            }
            
            // Afficher un message discret
            const messageElement = document.createElement('div');
            messageElement.className = 'alert alert-info alert-dismissible fade show';
            messageElement.setAttribute('role', 'alert');
            messageElement.style.position = 'fixed';
            messageElement.style.bottom = '20px';
            messageElement.style.right = '20px';
            messageElement.style.maxWidth = '300px';
            messageElement.style.zIndex = '9999';
            
            messageElement.innerHTML = `
                Bateau retiré de la liste.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            `;
            
            document.body.appendChild(messageElement);
            
            // Supprimer le message après 3 secondes
            setTimeout(() => {
                messageElement.style.opacity = '0';
                setTimeout(() => {
                    messageElement.remove();
                }, 300);
            }, 3000);
        } catch (error) {
            console.error("Erreur lors de la suppression du bateau:", error);
        }
    }
    
    // Gestion du bouton Filtres sur mobile
    if (mobileFiltersBtn && filtersContainer) {
        mobileFiltersBtn.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Toggle la classe pour afficher/masquer les filtres
            filtersContainer.classList.toggle('is-visible');
            
            // Changer le texte du bouton
            if (filtersContainer.classList.contains('is-visible')) {
                mobileFiltersBtn.innerHTML = '<i class="fas fa-times"></i> Fermer';
            } else {
                mobileFiltersBtn.innerHTML = '<i class="fas fa-filter"></i> Filtres';
            }
        });
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
            if (boatsGrid) {
                boatsGrid.style.opacity = '0.5';
                boatsGrid.style.pointerEvents = 'none';
                
                // Simuler un délai de chargement
                setTimeout(() => {
                    boatsGrid.style.opacity = '1';
                    boatsGrid.style.pointerEvents = 'auto';
                }, 1000);
            }
            
            // S'assurer que les bateaux sont visibles après l'application des filtres
            if (boatsContainer) {
                boatsContainer.style.display = 'block';
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