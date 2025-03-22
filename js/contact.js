document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Récupération des données du formulaire
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Validation des champs requis
            if (!data.nom || !data.prenom || !data.email || !data.sujet || !data.message) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }

            // Validation de l'email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Veuillez entrer une adresse email valide');
                return;
            }

            // Simulation d'envoi du formulaire
            console.log('Données du formulaire :', data);
            
            // Réinitialisation du formulaire
            contactForm.reset();
            
            // Message de confirmation
            alert('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
        });
    }
}); 