// Script pour la page de détail d'un bateau
document.addEventListener('DOMContentLoaded', function() {
    // Récupérer l'ID du bateau depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const boatId = urlParams.get('id');
    
    // Références aux éléments du DOM
    const boatLoading = document.getElementById('boat-loading');
    const boatError = document.getElementById('boat-error');
    const boatDetail = document.getElementById('boat-detail');
    
    // Vérifier si l'ID du bateau est présent
    if (!boatId) {
        showError('ID du bateau non spécifié');
        return;
    }
    
    // Charger les détails du bateau
    loadBoatDetails(boatId);
    
    // Configurer le formulaire de contact
    setupContactForm(boatId);
    
    // Fonction pour charger les détails du bateau
    function loadBoatDetails(id) {
        // Essayer d'abord de charger depuis le localStorage
        try {
            const localBoats = JSON.parse(localStorage.getItem('localBoats') || '[]');
            const localBoat = localBoats.find(boat => boat.id.toString() === id.toString());
            
            if (localBoat) {
                console.log("Bateau trouvé dans localStorage:", localBoat);
                // Adapter le format pour correspondre à ce qu'attend displayBoatDetails
                const formattedBoat = {
                    name: localBoat.name,
                    formatted_price: typeof localBoat.price === 'number' 
                        ? localBoat.price.toLocaleString() + ' €' 
                        : localBoat.price + ' €',
                    type_name: localBoat.type,
                    length: localBoat.length,
                    length_meters: localBoat.length, // Déjà en mètres
                    year: localBoat.year,
                    capacity: localBoat.capacity,
                    condition_name: localBoat.condition_state,
                    usage_name: localBoat.usage_type,
                    location_name: localBoat.location,
                    port: localBoat.port,
                    contact_name: "MyBoat - Service de courtage",
                    contact_email: "contact@myboat.fr",
                    contact_phone: "+33 1 23 45 67 89",
                    contact_preferred: 'email',
                    description: localBoat.description,
                    equipment: (localBoat.equipment || []).map(eq => ({ name: eq })),
                    photos: [
                        { url: localBoat.image_url || 'img/boats/default-boat.jpg' }
                    ],
                    status: localBoat.status || 'new',
                    isBrokerBoat: true
                };
                
                // Si le bateau a des images additionnelles
                if (localBoat.additional_images && localBoat.additional_images.length > 0) {
                    localBoat.additional_images.forEach(imgUrl => {
                        formattedBoat.photos.push({ url: imgUrl });
                    });
                }
                
                displayBoatDetails(formattedBoat);
                
                // Masquer l'indicateur de chargement
                if (boatLoading) {
                    boatLoading.style.display = 'none';
                }
                
                // Afficher les détails
                if (boatDetail) {
                    boatDetail.style.display = 'block';
                }
                
                return; // Sortir de la fonction si on a trouvé un bateau local
            }
        } catch (error) {
            console.error("Erreur lors de la recherche dans localStorage:", error);
        }
        
        // Si aucun bateau local n'a été trouvé, essayer l'API
        fetch(`api/boats.php?action=get&id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Ajouter les champs de courtage
                    data.boat.contact_name = "MyBoat - Service de courtage";
                    data.boat.contact_email = "contact@myboat.fr";
                    data.boat.contact_phone = "+33 1 23 45 67 89";
                    data.boat.status = data.boat.status || 'new';
                    data.boat.isBrokerBoat = true;
                    
                    displayBoatDetails(data.boat);
                } else {
                    showError(data.error || 'Erreur lors du chargement des détails du bateau');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la requête API:', error);
                showError('Erreur de communication avec le serveur');
                
                // En mode développement, créer un bateau factice pour l'affichage
                const dummyBoat = {
                    name: "Exemple de bateau (mode hors ligne)",
                    formatted_price: "350 000 €",
                    type_name: "Voilier",
                    length: 12.5,
                    length_meters: 12.5,
                    year: 2021,
                    capacity: 6,
                    condition_name: "Occasion",
                    usage_name: "Plaisance",
                    location_name: "La Réunion",
                    port: "Saint-Pierre",
                    contact_name: "MyBoat - Service de courtage",
                    contact_email: "contact@myboat.fr",
                    contact_phone: "+33 1 23 45 67 89",
                    contact_preferred: "email",
                    description: "<p>Ce bateau est affiché en mode hors ligne car le serveur API n'est pas disponible.</p><p>Dans une application réelle, ces données proviendraient du serveur.</p>",
                    equipment: [
                        { name: "GPS" },
                        { name: "Pilote automatique" },
                        { name: "Climatisation" }
                    ],
                    photos: [
                        { url: "img/boats/default-boat.jpg" }
                    ],
                    status: 'new',
                    isBrokerBoat: true
                };
                
                displayBoatDetails(dummyBoat);
            })
            .finally(() => {
                // Masquer l'indicateur de chargement
                if (boatLoading) {
                    boatLoading.style.display = 'none';
                }
                
                // Afficher les détails (même en cas d'erreur, pour le mode développement)
                if (boatDetail) {
                    boatDetail.style.display = 'block';
                }
            });
    }
    
    // Fonction pour afficher les détails du bateau
    function displayBoatDetails(boat) {
        // Remplir les informations de base
        document.getElementById('boat-name').textContent = boat.name;
        document.getElementById('boat-price').textContent = boat.formatted_price;
        document.getElementById('boat-type').textContent = boat.type_name || 'Non spécifié';
        document.getElementById('boat-length').textContent = `${boat.length} pieds (${boat.length_meters} m)`;
        document.getElementById('boat-year').textContent = boat.year;
        document.getElementById('boat-capacity').textContent = `${boat.capacity} personnes`;
        document.getElementById('boat-condition').textContent = boat.condition_name || 'Non spécifié';
        document.getElementById('boat-usage').textContent = boat.usage_name || 'Non spécifié';
        document.getElementById('boat-location').textContent = boat.location_name || 'Non spécifié';
        document.getElementById('boat-port').textContent = boat.port || 'Non spécifié';
        
        // Remplir les informations de contact
        document.getElementById('contact-name').textContent = boat.contact_name || 'Non spécifié';
        
        const contactEmail = document.getElementById('contact-email');
        if (boat.contact_email) {
            contactEmail.textContent = boat.contact_email;
            contactEmail.href = `mailto:${boat.contact_email}`;
        } else {
            contactEmail.textContent = 'Non spécifié';
            contactEmail.href = '#';
        }
        
        const contactPhone = document.getElementById('contact-phone');
        if (boat.contact_phone) {
            contactPhone.textContent = boat.contact_phone;
            contactPhone.href = `tel:${boat.contact_phone}`;
        } else {
            contactPhone.textContent = 'Non spécifié';
            contactPhone.href = '#';
        }
        
        // Méthode de contact préférée
        let preferredMethod = 'Non spécifié';
        if (boat.contact_preferred === 'email') {
            preferredMethod = 'Email';
        } else if (boat.contact_preferred === 'phone') {
            preferredMethod = 'Téléphone';
        } else if (boat.contact_preferred === 'whatsapp') {
            preferredMethod = 'WhatsApp';
        }
        document.getElementById('contact-preferred').textContent = preferredMethod;
        
        // Remplir la description
        document.getElementById('boat-description-text').innerHTML = boat.description || 'Aucune description disponible';
        
        // Ajouter le badge de statut
        addStatusBadge(boat);
        
        // Ajouter la section d'information de courtage si c'est un bateau de courtage
        if (boat.isBrokerBoat) {
            addBrokerInfo(boat);
        }
        
        // Remplir les équipements
        const equipmentList = document.getElementById('equipment-list');
        equipmentList.innerHTML = '';
        
        if (boat.equipment && boat.equipment.length > 0) {
            boat.equipment.forEach(equipment => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check"></i> ${equipment.name}`;
                equipmentList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Aucun équipement spécifié';
            equipmentList.appendChild(li);
        }
        
        // Remplir les photos
        const carouselIndicators = document.getElementById('carousel-indicators');
        const carouselInner = document.getElementById('carousel-inner');
        
        carouselIndicators.innerHTML = '';
        carouselInner.innerHTML = '';
        
        if (boat.photos && boat.photos.length > 0) {
            boat.photos.forEach((photo, index) => {
                // Indicateur
                const indicator = document.createElement('li');
                indicator.setAttribute('data-target', '#boat-gallery');
                indicator.setAttribute('data-slide-to', index);
                if (index === 0) {
                    indicator.classList.add('active');
                }
                carouselIndicators.appendChild(indicator);
                
                // Diapositive
                const item = document.createElement('div');
                item.className = index === 0 ? 'item active' : 'item';
                
                const img = document.createElement('img');
                img.src = photo.url;
                img.alt = `${boat.name} - Photo ${index + 1}`;
                
                item.appendChild(img);
                carouselInner.appendChild(item);
            });
        } else {
            // Photo par défaut si aucune photo n'est disponible
            const item = document.createElement('div');
            item.className = 'item active';
            
            const img = document.createElement('img');
            img.src = 'assets/images/default-boat.jpeg';
            img.alt = `${boat.name} - Photo par défaut`;
            
            item.appendChild(img);
            carouselInner.appendChild(item);
            
            const indicator = document.createElement('li');
            indicator.setAttribute('data-target', '#boat-gallery');
            indicator.setAttribute('data-slide-to', '0');
            indicator.classList.add('active');
            carouselIndicators.appendChild(indicator);
        }
        
        // Charger des bateaux similaires
        loadSimilarBoats(boat);
    }
    
    // Fonction pour charger des bateaux similaires
    function loadSimilarBoats(currentBoat) {
        // Construire les filtres pour trouver des bateaux similaires
        const filters = {
            type_id: currentBoat.type_id
        };
        
        if (currentBoat.location_id) {
            filters.location_id = currentBoat.location_id;
        }
        
        // Construire l'URL
        let url = 'api/boats.php?action=list';
        Object.keys(filters).forEach(key => {
            url += `&${key}=${filters[key]}`;
        });
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Filtrer pour exclure le bateau actuel et prendre les 3 premiers
                    const similarBoats = data.boats
                        .filter(boat => boat.id !== currentBoat.id)
                        .slice(0, 3);
                    
                    displaySimilarBoats(similarBoats);
                }
            })
            .catch(error => {
                console.error('Erreur lors du chargement des bateaux similaires:', error);
            });
    }
    
    // Fonction pour afficher les bateaux similaires
    function displaySimilarBoats(boats) {
        const container = document.getElementById('similar-boats-container');
        container.innerHTML = '';
        
        if (boats.length === 0) {
            container.innerHTML = '<div class="col-md-12"><p>Aucun bateau similaire trouvé.</p></div>';
            return;
        }
        
        boats.forEach(boat => {
            const col = document.createElement('div');
            col.className = 'col-md-4';
            
            const imageUrl = boat.primary_photo_url || 'assets/images/default-boat.jpeg';
            
            col.innerHTML = `
                <div class="similar-boat-card">
                    <div class="similar-boat-image">
                        <img src="${imageUrl}" alt="${boat.name}">
                    </div>
                    <div class="similar-boat-info">
                        <h3>${boat.name}</h3>
                        <div class="similar-boat-details">
                            <span><i class="fas fa-ruler"></i> ${boat.length_meters}m</span>
                            <span><i class="fas fa-calendar"></i> ${boat.year}</span>
                        </div>
                        <div class="similar-boat-price">
                            <span class="price">${boat.formatted_price}</span>
                        </div>
                        <a href="bateau-detail.html?id=${boat.id}" class="btn btn-primary btn-sm">Voir le détail</a>
                    </div>
                </div>
            `;
            
            container.appendChild(col);
        });
    }
    
    // Fonction pour configurer le formulaire de contact
    function setupContactForm(boatId) {
        const form = document.getElementById('boat-contact-form');
        
        if (form) {
            // Ajouter l'ID du bateau au formulaire
            document.getElementById('contact-form-boat-id').value = boatId;
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Dans un environnement réel, vous enverriez les données à un endpoint API
                // qui traiterait le formulaire et enverrait un email
                
                // Simuler un envoi réussi
                const formData = new FormData(form);
                const formValues = Object.fromEntries(formData.entries());
                
                console.log('Données du formulaire:', formValues);
                
                // Afficher une confirmation
                alert('Votre message a été envoyé avec succès! Le vendeur vous contactera bientôt.');
                
                // Réinitialiser le formulaire
                form.reset();
            });
        }
    }
    
    // Fonction pour afficher une erreur
    function showError(message) {
        boatLoading.style.display = 'none';
        
        const errorMessageElement = boatError.querySelector('p');
        if (errorMessageElement) {
            errorMessageElement.textContent = message;
        }
        
        boatError.style.display = 'block';
    }
    
    // Fonction pour ajouter le badge de statut
    function addStatusBadge(boat) {
        // Trouver l'élément où placer le badge
        const headerElement = document.querySelector('.boat-header') || document.getElementById('boat-name').parentElement;
        
        if (headerElement) {
            // Supprimer le badge existant s'il y en a un
            const existingBadge = headerElement.querySelector('.boat-status');
            if (existingBadge) {
                existingBadge.remove();
            }
            
            // Créer le badge
            const statusBadge = document.createElement('div');
            statusBadge.className = `boat-status status-${boat.status || 'new'}`;
            
            let statusText = 'Nouveau';
            switch(boat.status) {
                case 'offer':
                    statusText = 'Sous offre';
                    break;
                case 'reduced':
                    statusText = 'Prix réduit';
                    break;
                case 'sold':
                    statusText = 'Vendu';
                    break;
                default:
                    statusText = 'Nouveau';
            }
            
            statusBadge.textContent = statusText;
            
            // Positionner le badge
            headerElement.style.position = 'relative';
            statusBadge.style.position = 'absolute';
            statusBadge.style.top = '0';
            statusBadge.style.right = '0';
            statusBadge.style.padding = '5px 10px';
            statusBadge.style.borderRadius = '20px';
            statusBadge.style.color = 'white';
            statusBadge.style.fontWeight = 'bold';
            statusBadge.style.fontSize = '14px';
            statusBadge.style.zIndex = '10';
            statusBadge.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            
            switch(boat.status) {
                case 'offer':
                    statusBadge.style.backgroundColor = '#9C27B0'; // Violet
                    break;
                case 'reduced':
                    statusBadge.style.backgroundColor = '#FF9800'; // Orange
                    break;
                case 'sold':
                    statusBadge.style.backgroundColor = '#F44336'; // Rouge
                    break;
                default:
                    statusBadge.style.backgroundColor = '#2196F3'; // Bleu
            }
            
            headerElement.appendChild(statusBadge);
        }
    }
    
    // Fonction pour ajouter la section d'information de courtage
    function addBrokerInfo(boat) {
        // Chercher où insérer l'information de courtage
        const targetSection = document.querySelector('.description-section') || document.querySelector('.equipment-section');
        
        if (targetSection) {
            // Vérifier si la section existe déjà
            if (!document.querySelector('.broker-section')) {
                // Créer la section
                const brokerSection = document.createElement('div');
                brokerSection.className = 'panel panel-default broker-section';
                
                // Ajouter le contenu
                brokerSection.innerHTML = `
                    <div class="panel-heading" style="background-color: #023f86; color: white;">
                        <h3 class="panel-title"><i class="fas fa-handshake"></i> Service de courtage MyBoat</h3>
                    </div>
                    <div class="panel-body">
                        <p>Ce bateau est présenté par notre service de courtage. Nous agissons comme intermédiaire entre l'acheteur et le vendeur pour garantir une transaction sécurisée et transparente.</p>
                        <h4>Nos services inclus :</h4>
                        <ul class="broker-services">
                            <li><i class="fas fa-check-circle"></i> Vérification complète du bateau et de ses documents</li>
                            <li><i class="fas fa-check-circle"></i> Organisation des visites et essais en mer</li>
                            <li><i class="fas fa-check-circle"></i> Conseils personnalisés pour acheteurs et vendeurs</li>
                            <li><i class="fas fa-check-circle"></i> Assistance administrative complète</li>
                            <li><i class="fas fa-check-circle"></i> Suivi post-vente</li>
                        </ul>
                        <div class="text-center" style="margin-top: 20px;">
                            <a href="#contact-section" class="btn btn-success btn-lg"><i class="fas fa-calendar-alt"></i> Demander une visite</a>
                        </div>
                    </div>
                `;
                
                // Insérer après la section cible
                targetSection.parentNode.insertBefore(brokerSection, targetSection.nextSibling);
                
                // Ajouter des styles
                const style = document.createElement('style');
                style.textContent = `
                    .broker-services li {
                        margin-bottom: 8px;
                        list-style-type: none;
                    }
                    .broker-services li i {
                        color: #4CAF50;
                        margin-right: 10px;
                    }
                    .broker-section {
                        margin-bottom: 30px;
                        border-color: #023f86;
                    }
                    .broker-section .panel-heading h3 {
                        font-weight: bold;
                    }
                    .broker-section .btn-success {
                        background-color: #4CAF50;
                        border-color: #388E3C;
                        padding: 10px 20px;
                    }
                    .broker-section .btn-success:hover {
                        background-color: #388E3C;
                        transform: translateY(-2px);
                        transition: all 0.3s ease;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
}); 