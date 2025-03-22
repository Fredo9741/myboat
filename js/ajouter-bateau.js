document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-boat-form');
    const photoInput = document.getElementById('boat-photos');
    const photoPreview = document.getElementById('photo-preview');

    // Gestion de la prévisualisation des photos
    photoInput.addEventListener('change', function(e) {
        photoPreview.innerHTML = ''; // Vider la prévisualisation existante
        
        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = 'Aperçu du bateau';
                    photoPreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        }
    });

    // Gestion de la soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les données du formulaire
        const formData = new FormData(form);
        const boatData = {
            name: formData.get('boat-name'),
            type: formData.get('boat-type'),
            length: formData.get('boat-length'),
            year: formData.get('boat-year'),
            price: formData.get('boat-price'),
            capacity: formData.get('boat-capacity'),
            condition: formData.get('boat-condition'),
            usage: formData.get('boat-usage'),
            equipment: formData.getAll('equipment'),
            location: formData.get('boat-location'),
            port: formData.get('boat-port'),
            description: formData.get('boat-description'),
            contact: {
                name: formData.get('contact-name'),
                email: formData.get('contact-email'),
                phone: formData.get('contact-phone'),
                preferred: formData.get('contact-preferred')
            }
        };

        // Simuler un chargement
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Publication en cours...';

        // Simuler une requête API
        setTimeout(() => {
            console.log('Données du bateau:', boatData);
            alert('Votre annonce a été publiée avec succès !');
            form.reset();
            photoPreview.innerHTML = '';
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, 1500);
    });

    // Validation des champs numériques
    const numberInputs = form.querySelectorAll('input[type="number"]');
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