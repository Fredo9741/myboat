document.addEventListener('DOMContentLoaded', function() {
    console.log('Chargement des composants...');
    
    // Charger le header
    fetch('components/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau lors du chargement du header: ' + response.status);
            }
            return response.text();
        })
        .then(data => {
            console.log('Header chargé avec succès');
            document.body.insertAdjacentHTML('afterbegin', data);
            
            // Initialiser les événements du header après son chargement
            if (typeof initializeHeaderEvents === 'function') {
                setTimeout(initializeHeaderEvents, 100);
            }
            
            if (typeof initializeDropdowns === 'function') {
                setTimeout(initializeDropdowns, 100);
            }
        })
        .catch(error => console.error('Erreur lors du chargement du header:', error));

    // Charger le footer
    fetch('components/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau lors du chargement du footer: ' + response.status);
            }
            return response.text();
        })
        .then(data => {
            console.log('Footer chargé avec succès');
            document.body.insertAdjacentHTML('beforeend', data);
        })
        .catch(error => console.error('Erreur lors du chargement du footer:', error));
}); 