document.addEventListener('DOMContentLoaded', function() {
    // Charger le header
    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
        })
        .catch(error => console.error('Erreur lors du chargement du header:', error));

    // Charger le footer
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        })
        .catch(error => console.error('Erreur lors du chargement du footer:', error));
}); 