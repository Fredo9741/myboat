<?php
/**
 * Script d'initialisation de la base de données avec des données de test
 * À exécuter une fois pour configurer la base de données
 */

// Inclure les fichiers nécessaires
require_once '../db/database.php';
require_once '../db/boat.php';

// Fonction pour afficher un message
function printMessage($message, $type = 'info') {
    $color = $type === 'success' ? "\033[0;32m" : ($type === 'error' ? "\033[0;31m" : "\033[0;34m");
    $reset = "\033[0m";
    echo $color . $message . $reset . PHP_EOL;
}

// Initialiser la base de données
printMessage("Initialisation de la structure de la base de données...");
$db = Database::getInstance();
try {
    $db->initDatabase();
    printMessage("Structure de la base de données créée avec succès!", 'success');
} catch (Exception $e) {
    printMessage("Erreur lors de la création de la structure: " . $e->getMessage(), 'error');
    exit(1);
}

// Créer une instance de la classe Boat
$boatManager = new Boat();

// Données de test pour les bateaux
$testBoats = [
    [
        'name' => 'Sunreef 60',
        'type' => 'Catamaran',
        'condition_state' => 'Neuf',
        'usage_type' => 'Plaisance',
        'capacity' => 8,
        'length' => 18.3,
        'price' => 950000,
        'year' => 2023,
        'description' => "Le Sunreef 60 est un catamaran de luxe offrant un espace de vie exceptionnel et des performances remarquables. Ce modèle allie confort, design moderne et fonctionnalités innovantes pour une expérience de navigation incomparable.\n\nÉquipé des dernières technologies, il offre un confort optimal pour les longues traversées et les croisières en famille ou entre amis.",
        'location' => 'Maurice',
        'port' => 'Port Louis',
        'main_image' => 'img/boats/catamaran1.jpg',
        'additional_images' => [
            'img/boats/catamaran1-2.jpg',
            'img/boats/catamaran1-3.jpg'
        ],
        'equipment' => [
            'Pilote automatique', 'GPS', 'Radar', 'Sondeur', 'VHF', 
            'Annexe', 'Winch électrique', 'Climatisation', 'Générateur', 
            'Panneaux solaires', 'Électronique de navigation', 'Voiles neuves'
        ],
        'contact_name' => 'Pierre Dubois',
        'contact_email' => 'pierre@myboat.com',
        'contact_phone' => '+230 5712 3456'
    ],
    [
        'name' => 'Oceanis 45',
        'type' => 'Voilier',
        'condition_state' => 'Occasion',
        'usage_type' => 'Plaisance',
        'capacity' => 6,
        'length' => 13.85,
        'price' => 295000,
        'year' => 2019,
        'description' => "L'Oceanis 45 est un voilier spacieux et confortable, idéal pour les croisières en famille. Son design moderne et ses équipements de qualité en font un bateau facile à manœuvrer et agréable à vivre.\n\nCe modèle offre 3 cabines doubles, 2 salles d'eau, un carré lumineux et une cuisine bien équipée. Parfaitement entretenu, il est prêt à naviguer.",
        'location' => 'Réunion',
        'port' => 'Saint-Gilles',
        'main_image' => 'img/boats/voilier1.jpg',
        'additional_images' => [
            'img/boats/voilier1-2.jpg',
            'img/boats/voilier1-3.jpg'
        ],
        'equipment' => [
            'GPS', 'Sondeur', 'VHF', 'Annexe', 'Winch électrique',
            'Électronique de navigation', 'Voiles neuves', 'Cuisine équipée', 
            'Réfrigérateur', 'Système audio'
        ],
        'contact_name' => 'Marie Martin',
        'contact_email' => 'marie@myboat.com',
        'contact_phone' => '+262 692 12 34 56'
    ],
    [
        'name' => 'Azimut 55',
        'type' => 'Yacht',
        'condition_state' => 'Occasion',
        'usage_type' => 'Plaisance',
        'capacity' => 10,
        'length' => 16.7,
        'price' => 750000,
        'year' => 2018,
        'description' => "L'Azimut 55 est un yacht de luxe offrant un design italien raffiné et des prestations haut de gamme. Ce modèle se distingue par sa silhouette élégante et ses espaces de vie généreux.\n\nLe yacht dispose de 3 cabines luxueuses, 2 salles de bain, un salon spacieux et une cuisine entièrement équipée. Son flybridge offre un espace de détente supplémentaire avec bain de soleil et coin repas.",
        'location' => 'Seychelles',
        'port' => 'Victoria',
        'main_image' => 'img/boats/yacht1.jpg',
        'additional_images' => [
            'img/boats/yacht1-2.jpg',
            'img/boats/yacht1-3.jpg'
        ],
        'equipment' => [
            'Pilote automatique', 'GPS', 'Radar', 'Sondeur', 'VHF', 
            'Annexe', 'Climatisation', 'Chauffage', 'Générateur', 
            'Propulseur d\'étrave', 'Électronique de navigation', 
            'Cuisine équipée', 'Réfrigérateur', 'Four', 'TV', 'Système audio'
        ],
        'contact_name' => 'Jean Dupont',
        'contact_email' => 'jean@myboat.com',
        'contact_phone' => '+248 2 712 345'
    ],
    [
        'name' => 'Lagoon 42',
        'type' => 'Catamaran',
        'condition_state' => 'Occasion',
        'usage_type' => 'Plaisance',
        'capacity' => 8,
        'length' => 12.8,
        'price' => 450000,
        'year' => 2020,
        'description' => "Le Lagoon 42 est un catamaran moderne offrant un excellent compromis entre performance et confort. Son design innovant maximise l'espace de vie tout en conservant d'excellentes qualités marines.\n\nCe modèle dispose de 4 cabines doubles, 2 salles d'eau, un carré lumineux et une cuisine fonctionnelle. Le cockpit arrière spacieux est idéal pour les repas en plein air.",
        'location' => 'Maurice',
        'port' => 'Grand Baie',
        'main_image' => 'img/boats/catamaran2.jpg',
        'additional_images' => [
            'img/boats/catamaran2-2.jpg',
            'img/boats/catamaran2-3.jpg'
        ],
        'equipment' => [
            'Pilote automatique', 'GPS', 'Sondeur', 'VHF', 'Annexe', 
            'Panneaux solaires', 'Électronique de navigation', 
            'Cuisine équipée', 'Réfrigérateur', 'Système audio'
        ],
        'contact_name' => 'Sophie Legrand',
        'contact_email' => 'sophie@myboat.com',
        'contact_phone' => '+230 5823 4567'
    ],
    [
        'name' => 'Boston Whaler 270',
        'type' => 'Bateau à moteur',
        'condition_state' => 'Occasion',
        'usage_type' => 'Pêche',
        'capacity' => 10,
        'length' => 8.2,
        'price' => 145000,
        'year' => 2021,
        'description' => "Le Boston Whaler 270 est un bateau à moteur robuste et polyvalent, idéal pour la pêche et les sorties en mer. Réputé pour sa sécurité et sa construction insubmersible, ce modèle offre fiabilité et confort.\n\nÉquipé d'un moteur hors-bord Mercury 300 CV, il combine puissance et économie de carburant. Son pont spacieux et ses équipements de pêche en font un choix parfait pour les amateurs.",
        'location' => 'Maldives',
        'port' => 'Malé',
        'main_image' => 'img/boats/moteur1.jpg',
        'additional_images' => [
            'img/boats/moteur1-2.jpg',
            'img/boats/moteur1-3.jpg'
        ],
        'equipment' => [
            'GPS', 'Radar', 'Sondeur', 'VHF', 'Électronique de navigation',
            'Réfrigérateur', 'Vivier', 'Porte-cannes'
        ],
        'contact_name' => 'Ahmed Rahman',
        'contact_email' => 'ahmed@myboat.com',
        'contact_phone' => '+960 789 1234'
    ],
    [
        'name' => 'Dufour 45',
        'type' => 'Voilier',
        'condition_state' => 'Neuf',
        'usage_type' => 'Plaisance',
        'capacity' => 8,
        'length' => 13.7,
        'price' => 380000,
        'year' => 2023,
        'description' => "Le Dufour 45 est un voilier moderne alliant performances et confort. Son design élégant et ses finitions soignées en font un bateau de croisière haut de gamme.\n\nCe modèle neuf propose 3 cabines spacieuses, 2 salles d'eau, un carré lumineux et une cuisine bien agencée. Son plan de pont dégagé facilite les manœuvres et offre de vastes espaces de détente.",
        'location' => 'Réunion',
        'port' => 'Le Port',
        'main_image' => 'img/boats/voilier2.jpg',
        'additional_images' => [
            'img/boats/voilier2-2.jpg',
            'img/boats/voilier2-3.jpg'
        ],
        'equipment' => [
            'Pilote automatique', 'GPS', 'Sondeur', 'VHF', 'Annexe', 
            'Winch électrique', 'Électronique de navigation', 'Voiles neuves',
            'Cuisine équipée', 'Réfrigérateur', 'Système audio'
        ],
        'contact_name' => 'Paul Fontaine',
        'contact_email' => 'paul@myboat.com',
        'contact_phone' => '+262 693 45 67 89'
    ],
    [
        'name' => 'Princess 68',
        'type' => 'Yacht',
        'condition_state' => 'Occasion',
        'usage_type' => 'Plaisance',
        'capacity' => 12,
        'length' => 20.8,
        'price' => 1250000,
        'year' => 2017,
        'description' => "Le Princess 68 est un yacht de luxe britannique combinant élégance, raffinement et performances. Ce modèle emblématique offre des espaces de vie exceptionnels et des finitions haut de gamme.\n\nLe yacht dispose de 4 cabines luxueuses avec salles de bain privatives, un salon spacieux, une cuisine entièrement équipée et un flybridge généreux. Ses deux moteurs MAN lui confèrent une autonomie et une puissance remarquables.",
        'location' => 'Seychelles',
        'port' => 'Eden Island',
        'main_image' => 'img/boats/yacht2.jpg',
        'additional_images' => [
            'img/boats/yacht2-2.jpg',
            'img/boats/yacht2-3.jpg'
        ],
        'equipment' => [
            'Pilote automatique', 'GPS', 'Radar', 'Sondeur', 'VHF', 
            'Annexe', 'Winch électrique', 'Guindeau électrique',
            'Climatisation', 'Chauffage', 'Générateur', 
            'Propulseur d\'étrave', 'Électronique de navigation', 
            'Cuisine équipée', 'Réfrigérateur', 'Four', 'Micro-ondes',
            'TV', 'Système audio', 'Internet/WiFi'
        ],
        'contact_name' => 'Richard Johnson',
        'contact_email' => 'richard@myboat.com',
        'contact_phone' => '+248 2 789 012'
    ],
    [
        'name' => 'Sea Ray 290',
        'type' => 'Bateau à moteur',
        'condition_state' => 'Occasion',
        'usage_type' => 'Plaisance',
        'capacity' => 8,
        'length' => 8.8,
        'price' => 120000,
        'year' => 2020,
        'description' => "Le Sea Ray 290 est un bateau à moteur sportif et confortable, parfait pour les sorties à la journée et les week-ends en mer. Son design moderne et ses équipements de qualité en font un choix privilégié pour les amateurs de nautisme.\n\nCe modèle dispose d'une cabine avant, de toilettes marines, d'un coin cuisine et d'un vaste cockpit. Son moteur Mercruiser offre d'excellentes performances et une consommation maîtrisée.",
        'location' => 'Maurice', 
        'port' => "Trou d'Eau Douce",
        'main_image' => 'img/boats/moteur2.jpg',
        'additional_images' => [
            'img/boats/moteur2-2.jpg',
            'img/boats/moteur2-3.jpg'
        ],
        'equipment' => [
            'GPS', 'Sondeur', 'VHF', 'Électronique de navigation',
            'Réfrigérateur', 'Système audio', 'Bimini', 'Cockpit aménagé'
        ],
        'contact_name' => 'Anand Sharma',
        'contact_email' => 'anand@myboat.com',
        'contact_phone' => '+230 5934 5678'
    ]
];

// Ajouter les bateaux de test
printMessage("Ajout des bateaux de test...");
$addedCount = 0;
foreach ($testBoats as $boatData) {
    try {
        $boatId = $boatManager->addBoat($boatData);
        $addedCount++;
        printMessage("Bateau ajouté: " . $boatData['name'], 'success');
    } catch (Exception $e) {
        printMessage("Erreur lors de l'ajout du bateau '" . $boatData['name'] . "': " . $e->getMessage(), 'error');
    }
}

// Résumé
printMessage("Initialisation terminée!", 'success');
printMessage("$addedCount bateaux ont été ajoutés à la base de données.", 'success');
printMessage("Vous pouvez maintenant accéder à l'application.");
?> 