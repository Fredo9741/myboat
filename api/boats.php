<?php
// Inclure les fichiers nécessaires
require_once '../db/boat.php';

// Activer CORS pour permettre les requêtes depuis le frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Gérer les requêtes OPTIONS (pré-flight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Initialiser l'objet Boat
$boatManager = new Boat();

// Récupérer l'action demandée
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Fonction pour renvoyer une réponse JSON
function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// Fonction pour gérer les erreurs
function handleError($message, $status = 400) {
    sendResponse(['error' => $message], $status);
}

// Traiter l'action demandée
try {
    switch ($action) {
        case 'list':
            // Récupérer les filtres de l'URL
            $filters = [];
            
            // Filtres de type
            if (isset($_GET['types']) && !empty($_GET['types'])) {
                $filters['types'] = explode(',', $_GET['types']);
            }
            
            // Filtres d'état
            if (isset($_GET['conditions']) && !empty($_GET['conditions'])) {
                $filters['conditions'] = explode(',', $_GET['conditions']);
            }
            
            // Filtres d'usage
            if (isset($_GET['usages']) && !empty($_GET['usages'])) {
                $filters['usages'] = explode(',', $_GET['usages']);
            }
            
            // Filtres de capacité
            if (isset($_GET['capacity_min']) && is_numeric($_GET['capacity_min'])) {
                $filters['capacity_min'] = (int)$_GET['capacity_min'];
            }
            
            // Filtres de longueur
            if (isset($_GET['length_min']) && is_numeric($_GET['length_min'])) {
                $filters['length_min'] = (float)$_GET['length_min'];
            }
            if (isset($_GET['length_max']) && is_numeric($_GET['length_max'])) {
                $filters['length_max'] = (float)$_GET['length_max'];
            }
            
            // Filtres de prix
            if (isset($_GET['price_min']) && is_numeric($_GET['price_min'])) {
                $filters['price_min'] = (float)$_GET['price_min'];
            }
            if (isset($_GET['price_max']) && is_numeric($_GET['price_max'])) {
                $filters['price_max'] = (float)$_GET['price_max'];
            }
            
            // Filtres d'année
            if (isset($_GET['year_min']) && is_numeric($_GET['year_min'])) {
                $filters['year_min'] = (int)$_GET['year_min'];
            }
            if (isset($_GET['year_max']) && is_numeric($_GET['year_max'])) {
                $filters['year_max'] = (int)$_GET['year_max'];
            }
            
            // Filtres d'équipements
            if (isset($_GET['equipments']) && !empty($_GET['equipments'])) {
                $filters['equipments'] = explode(',', $_GET['equipments']);
            }
            
            // Filtres de localisation
            if (isset($_GET['locations']) && !empty($_GET['locations'])) {
                $filters['locations'] = explode(',', $_GET['locations']);
            }
            
            // Récupérer les bateaux avec les filtres
            $boats = $boatManager->getAllBoats($filters);
            
            // Transformer les données pour le frontend
            foreach ($boats as &$boat) {
                // Convertir l'équipement en tableau
                if (!empty($boat['equipment'])) {
                    $boat['equipment'] = explode(',', $boat['equipment']);
                } else {
                    $boat['equipment'] = [];
                }
                
                // Convertir les valeurs numériques
                $boat['capacity'] = (int)$boat['capacity'];
                $boat['length'] = (float)$boat['length'];
                $boat['price'] = (float)$boat['price'];
                $boat['year'] = (int)$boat['year'];
            }
            
            sendResponse($boats);
            break;
            
        case 'get':
            // Vérifier si l'ID est fourni
            if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
                handleError('ID du bateau manquant ou invalide');
            }
            
            $id = (int)$_GET['id'];
            $boat = $boatManager->getBoatById($id);
            
            if (!$boat) {
                handleError('Bateau non trouvé', 404);
            }
            
            sendResponse($boat);
            break;
            
        case 'get_options':
            // Récupérer les options de filtres disponibles
            $options = $boatManager->getFilterOptions();
            
            // Transformer les résultats pour le frontend
            $transformedOptions = [
                'types' => array_column($options['types'], 'type'),
                'conditions' => array_column($options['conditions'], 'condition_state'),
                'usages' => array_column($options['usages'], 'usage_type'),
                'capacity' => $options['capacity'],
                'length' => $options['length'],
                'price' => $options['price'],
                'year' => $options['year'],
                'equipments' => array_column($options['equipments'], 'name'),
                'locations' => array_column($options['locations'], 'location')
            ];
            
            sendResponse($transformedOptions);
            break;
            
        case 'add':
            // Vérifier si c'est une requête POST
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                handleError('Méthode non autorisée', 405);
            }
            
            // Récupérer les données JSON
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                handleError('Données invalides');
            }
            
            // Ajouter le bateau
            $id = $boatManager->addBoat($data);
            
            sendResponse(['id' => $id, 'message' => 'Bateau ajouté avec succès']);
            break;
            
        case 'update':
            // Vérifier si c'est une requête PUT
            if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
                handleError('Méthode non autorisée', 405);
            }
            
            // Vérifier si l'ID est fourni
            if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
                handleError('ID du bateau manquant ou invalide');
            }
            
            $id = (int)$_GET['id'];
            
            // Récupérer les données JSON
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                handleError('Données invalides');
            }
            
            // Mettre à jour le bateau
            $success = $boatManager->updateBoat($id, $data);
            
            if (!$success) {
                handleError('Bateau non trouvé', 404);
            }
            
            sendResponse(['message' => 'Bateau mis à jour avec succès']);
            break;
            
        case 'delete':
            // Vérifier si c'est une requête DELETE
            if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
                handleError('Méthode non autorisée', 405);
            }
            
            // Vérifier si l'ID est fourni
            if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
                handleError('ID du bateau manquant ou invalide');
            }
            
            $id = (int)$_GET['id'];
            
            // Supprimer le bateau
            $success = $boatManager->deleteBoat($id);
            
            if (!$success) {
                handleError('Bateau non trouvé', 404);
            }
            
            sendResponse(['message' => 'Bateau supprimé avec succès']);
            break;
            
        case 'init_db':
            // Initialiser la base de données (uniquement pour le développement)
            $db = Database::getInstance();
            $result = $db->initDatabase();
            
            if ($result) {
                sendResponse(['message' => 'Base de données initialisée avec succès']);
            } else {
                handleError('Erreur lors de l\'initialisation de la base de données');
            }
            break;
            
        default:
            handleError('Action non reconnue', 404);
    }
} catch (Exception $e) {
    handleError($e->getMessage(), 500);
}
?> 