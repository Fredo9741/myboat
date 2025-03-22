/**
 * Gestion du formulaire d'ajout de bateau
 */
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const addBoatForm = document.getElementById('add-boat-form');
    const submitBtn = document.getElementById('submit-boat');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imageInput = document.getElementById('boat-images');
    const equipmentContainer = document.getElementById('equipment-container');
    
    // Charger les options de filtre depuis l'API
    loadFilterOptions();
    
    // Ajouter la section de statut du bateau
    addStatusOptions();
    
    // Gestionnaire d'événement pour l'envoi du formulaire
    if (addBoatForm) {
        addBoatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitBoatForm();
        });
    }
    
    // Gestionnaire d'événement pour la prévisualisation des images
    if (imageInput) {
        imageInput.addEventListener('change', handleImagePreview);
    }
    
    /**
     * Fonction pour ajouter les options de statut
     */
    function addStatusOptions() {
        // Trouver où ajouter les options de statut
        const descriptionGroup = document.querySelector('#boat-description').closest('.form-group');
        
        if (descriptionGroup) {
            // Créer le conteneur pour le statut
            const statusGroup = document.createElement('div');
            statusGroup.className = 'form-group';
            
            // Créer le label
            const statusLabel = document.createElement('label');
            statusLabel.htmlFor = 'boat-status';
            statusLabel.textContent = 'Statut du bateau';
            
            // Créer le select
            const statusSelect = document.createElement('select');
            statusSelect.className = 'form-control';
            statusSelect.id = 'boat-status';
            statusSelect.name = 'boat-status';
            
            // Créer les options
            const statuses = [
                { value: 'new', text: 'Nouveau listing' },
                { value: 'reduced', text: 'Prix réduit' },
                { value: 'offer', text: 'Sous offre' }
            ];
            
            statuses.forEach(status => {
                const option = document.createElement('option');
                option.value = status.value;
                option.textContent = status.text;
                statusSelect.appendChild(option);
            });
            
            // Assembler le groupe
            statusGroup.appendChild(statusLabel);
            statusGroup.appendChild(statusSelect);
            
            // Insérer après la description
            descriptionGroup.parentNode.insertBefore(statusGroup, descriptionGroup.nextSibling);
        }
    }
    
    /**
     * Fonction pour charger les options de filtre depuis l'API
     */
    function loadFilterOptions() {
        // Afficher un indicateur de chargement
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
        
        // Simulation des données de l'API pour le développement local
        // Remplace l'appel API qui ne fonctionne pas avec un serveur de fichiers statiques
        const mockApiData = {
            types: ['Monocoque', 'Multicoque', 'Bateau à moteur', 'Yacht', 'Catamaran', 'Voilier'],
            conditions: ['Neuf', 'Occasion', 'Rénové'],
            usages: ['Plaisance', 'Pêche', 'Exploration', 'Charter'],
            capacity: {min: 2, max: 20},
            length: {min: 5, max: 50},
            price: {min: 5000, max: 2000000},
            year: {min: 1980, max: 2024},
            equipments: ['Climatisation', 'GPS', 'Électricité solaire', 'Désalinisation', 
                         'Pilote automatique', 'Radar', 'Annexe', 'Winch électrique', 
                         'Générateur', 'Propulseur d\'étrave'],
            locations: ['La Réunion', 'Maurice', 'Madagascar', 'Seychelles', 'Mayotte']
        };
        
        // Mode développement : utiliser les données mockées 
        // En production, décommentez ce code et commentez le bloc ci-dessus
        /*
        fetch('api/boats.php?action=get_options')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des options');
                }
                return response.json();
            })
            .then(data => {
                populateFilterOptions(data);
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'none';
                }
                
                const errorMessage = document.getElementById('error-message');
                if (errorMessage) {
                    errorMessage.textContent = 'Impossible de charger les options. Veuillez réessayer plus tard.';
                    errorMessage.style.display = 'block';
                } else {
                    console.error('Message d\'erreur:', 'Impossible de charger les options. Veuillez réessayer plus tard.');
                }
            });
        */
        
        // Utiliser les données mockées
        setTimeout(() => {
            populateFilterOptions(mockApiData);
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
        }, 500); // Simuler un délai de chargement
    }
    
    /**
     * Fonction pour remplir les options de filtre
     */
    function populateFilterOptions(options) {
        // Remplir les types de bateau
        const typeSelect = document.getElementById('boat-type');
        if (typeSelect && options.types) {
            options.types.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                typeSelect.appendChild(option);
            });
        }
        
        // Remplir les états
        const conditionSelect = document.getElementById('boat-condition');
        if (conditionSelect && options.conditions) {
            options.conditions.forEach(condition => {
                const option = document.createElement('option');
                option.value = condition;
                option.textContent = condition;
                conditionSelect.appendChild(option);
            });
        }
        
        // Remplir les usages
        const usageSelect = document.getElementById('boat-usage');
        if (usageSelect && options.usages) {
            options.usages.forEach(usage => {
                const option = document.createElement('option');
                option.value = usage;
                option.textContent = usage;
                usageSelect.appendChild(option);
            });
        }
        
        // Remplir les localisations
        const locationSelect = document.getElementById('boat-location');
        if (locationSelect && options.locations) {
            options.locations.forEach(location => {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = location;
                locationSelect.appendChild(option);
            });
        }
        
        // Créer les cases à cocher pour les équipements
        if (equipmentContainer && options.equipments) {
            equipmentContainer.innerHTML = '';
            
            options.equipments.forEach(equipment => {
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'form-check';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'form-check-input equipment-checkbox';
                checkbox.id = 'equipment-' + equipment.toLowerCase().replace(/\s+/g, '-');
                checkbox.value = equipment;
                
                const label = document.createElement('label');
                label.className = 'form-check-label';
                label.htmlFor = checkbox.id;
                label.textContent = equipment;
                
                checkboxDiv.appendChild(checkbox);
                checkboxDiv.appendChild(label);
                equipmentContainer.appendChild(checkboxDiv);
            });
        }
    }
    
    /**
     * Fonction pour prévisualiser les images sélectionnées
     */
    function handleImagePreview(e) {
        imagePreviewContainer.innerHTML = '';
        
        const files = e.target.files;
        
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.match('image.*')) {
                    continue;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const preview = document.createElement('div');
                    preview.className = 'image-preview';
                    
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = 'Aperçu de l\'image';
                    
                    // Ajouter un bouton pour définir l'image comme principale
                    const radioBtn = document.createElement('input');
                    radioBtn.type = 'radio';
                    radioBtn.name = 'main-image';
                    radioBtn.value = i;
                    if (i === 0) {
                        radioBtn.checked = true;
                    }
                    
                    const radioLabel = document.createElement('label');
                    radioLabel.appendChild(radioBtn);
                    radioLabel.appendChild(document.createTextNode(' Image principale'));
                    
                    preview.appendChild(img);
                    preview.appendChild(radioLabel);
                    imagePreviewContainer.appendChild(preview);
                }
                
                reader.readAsDataURL(file);
            }
        }
    }
    
    /**
     * Fonction pour soumettre le formulaire d'ajout de bateau
     */
    function submitBoatForm() {
        // Désactiver le bouton de soumission pour éviter les doubles soumissions
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';
        }
        
        // Récupérer les données du formulaire
        const formData = new FormData(addBoatForm);
        
        // Récupérer les équipements sélectionnés
        const selectedEquipments = [];
        document.querySelectorAll('.equipment-checkbox:checked').forEach(checkbox => {
            selectedEquipments.push(checkbox.value);
        });
        
        // Convertir les données en objet pour l'API
        const boatData = {
            name: formData.get('boat-name'),
            type: formData.get('boat-type'),
            condition_state: formData.get('boat-condition'),
            usage_type: formData.get('boat-usage'),
            capacity: parseInt(formData.get('boat-capacity'), 10),
            length: parseFloat(formData.get('boat-length')),
            price: parseFloat(formData.get('boat-price')),
            year: parseInt(formData.get('boat-year'), 10),
            description: formData.get('boat-description'),
            location: formData.get('boat-location'),
            port: formData.get('boat-port'),
            equipment: selectedEquipments,
            contact_name: formData.get('contact-name'),
            contact_email: formData.get('contact-email'),
            contact_phone: formData.get('contact-phone'),
            status: formData.get('boat-status') || 'new',
            isBrokerBoat: true,
            date_added: new Date().toISOString()
        };
        
        // Stockage temporaire des images
        const imageFiles = imageInput.files;
        const imagePreviews = [];
        let mainImageIndex = 0;
        
        // Récupérer l'index de l'image principale
        const mainImageRadios = document.querySelectorAll('input[name="main-image"]:checked');
        if (mainImageRadios.length > 0) {
            mainImageIndex = parseInt(mainImageRadios[0].value, 10);
        }
        
        // Traitement des images (simulé pour le mode développement)
        // En production, les images devraient être téléchargées sur le serveur
        if (imageFiles.length > 0) {
            // Simuler le chargement
            const progressBar = document.getElementById('upload-progress');
            if (progressBar) {
                progressBar.style.display = 'block';
            }
            
            let filesProcessed = 0;
            
            for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];
                if (!file.type.match('image.*')) {
                    filesProcessed++;
                    continue;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Stocker l'URL de données de l'image
                    imagePreviews.push(e.target.result);
                    
                    filesProcessed++;
                    
                    // Mise à jour de la barre de progression
                    if (progressBar) {
                        const progress = Math.round((filesProcessed / imageFiles.length) * 100);
                        progressBar.value = progress;
                    }
                    
                    // Si toutes les images sont traitées, continuer
                    if (filesProcessed === imageFiles.length) {
                        finalizeBoatSubmission(boatData, imagePreviews, mainImageIndex);
                    }
                };
                
                reader.readAsDataURL(file);
            }
        } else {
            // Pas d'images, continuer directement
            finalizeBoatSubmission(boatData, [], 0);
        }
    }
    
    /**
     * Fonction pour finaliser la soumission du bateau après le traitement des images
     */
    function finalizeBoatSubmission(boatData, images, mainImageIndex) {
        // Générer un ID pour le bateau (simulé)
        boatData.id = "local_" + Date.now();
        
        // Ajouter l'URL de l'image principale si disponible
        if (images.length > 0) {
            boatData.image_url = images[mainImageIndex];
            
            // Stocker les autres images
            const additionalImages = [...images];
            additionalImages.splice(mainImageIndex, 1); // Supprimer l'image principale du tableau
            boatData.additional_images = additionalImages;
        } else {
            // Image par défaut
            boatData.image_url = 'img/boats/default-boat.jpg';
            boatData.additional_images = [];
        }
        
        // Remplacer les informations de contact par les informations de courtage
        boatData.contact_name = "MyBoat - Service de courtage";
        boatData.contact_email = "contact@myboat.fr";
        boatData.contact_phone = "+33 1 23 45 67 89";
        boatData.contact_preferred = "email";
        
        // En mode développement, enregistrer dans localStorage
        try {
            const savedBoats = JSON.parse(localStorage.getItem('localBoats') || '[]');
            savedBoats.push(boatData);
            localStorage.setItem('localBoats', JSON.stringify(savedBoats));
            
            // Informations de courtage (à utiliser dans la page de détail)
            const brokerInfo = {
                name: "MyBoat - Service de courtage",
                email: "contact@myboat.fr",
                phone: "+33 1 23 45 67 89",
                address: "12 rue de la Marina, 97410 Saint-Pierre, La Réunion",
                description: "Notre service de courtage professionnel vous accompagne dans l'achat et la vente de bateaux. Nous assurons la sécurité des transactions et gérons tous les aspects administratifs pour vous."
            };
            
            // Stocker également les informations de courtage
            localStorage.setItem('brokerInfo', JSON.stringify(brokerInfo));
            
            showSuccess('Votre bateau a été confié à notre service de courtage avec succès! Un expert vous contactera sous 24h.');
            
            // Rediriger vers la page des bateaux après un délai
            setTimeout(() => {
                window.location.href = 'bateaux.html';
            }, 3000);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde locale:', error);
            showError('Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
        }
        
        // En production, envoyer à l'API
        /*
        fetch('api/boats.php?action=add', {
            method: 'POST',
            body: JSON.stringify(boatData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout du bateau');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showSuccess('Bateau ajouté avec succès!');
                
                // Rediriger vers la page des bateaux
                setTimeout(() => {
                    window.location.href = 'bateaux.html';
                }, 2000);
            } else {
                throw new Error(data.error || 'Erreur lors de l\'ajout du bateau');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            showError(error.message);
        })
        .finally(() => {
            resetSubmitButton();
        });
        */
        
        // Pour la démo, réinitialiser le bouton après un délai
        setTimeout(resetSubmitButton, 2000);
    }
    
    /**
     * Fonction pour afficher un message d'erreur
     */
    function showError(message) {
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Masquer après 5 secondes
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
    
    /**
     * Fonction pour afficher un message de succès
     */
    function showSuccess(message) {
        const successDiv = document.getElementById('success-message');
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        
        // Masquer après 5 secondes
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);
    }
    
    /**
     * Fonction pour réinitialiser le bouton de soumission
     */
    function resetSubmitButton() {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Ajouter le bateau';
        }
    }
}); 