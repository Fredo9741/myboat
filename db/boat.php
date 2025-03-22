<?php
require_once 'database.php';

/**
 * Classe de gestion des bateaux
 */
class Boat {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    /**
     * Récupérer tous les bateaux avec filtres optionnels
     * 
     * @param array $filters Filtres à appliquer
     * @return array Liste des bateaux
     */
    public function getAllBoats($filters = []) {
        $sql = "SELECT b.*, 
                GROUP_CONCAT(DISTINCT e.name) as equipment
                FROM boats b
                LEFT JOIN boat_equipment be ON b.id = be.boat_id
                LEFT JOIN equipments e ON be.equipment_id = e.id";
        
        $whereConditions = [];
        $params = [];
        
        // Appliquer les filtres
        if (!empty($filters)) {
            // Filtre par type de bateau
            if (!empty($filters['types'])) {
                $placeholders = implode(',', array_fill(0, count($filters['types']), '?'));
                $whereConditions[] = "b.type IN ($placeholders)";
                foreach ($filters['types'] as $type) {
                    $params[] = $type;
                }
            }
            
            // Filtre par état
            if (!empty($filters['conditions'])) {
                $placeholders = implode(',', array_fill(0, count($filters['conditions']), '?'));
                $whereConditions[] = "b.condition_state IN ($placeholders)";
                foreach ($filters['conditions'] as $condition) {
                    $params[] = $condition;
                }
            }
            
            // Filtre par usage
            if (!empty($filters['usages'])) {
                $placeholders = implode(',', array_fill(0, count($filters['usages']), '?'));
                $whereConditions[] = "b.usage_type IN ($placeholders)";
                foreach ($filters['usages'] as $usage) {
                    $params[] = $usage;
                }
            }
            
            // Filtre par capacité
            if (!empty($filters['capacity_min'])) {
                $whereConditions[] = "b.capacity >= ?";
                $params[] = $filters['capacity_min'];
            }
            
            // Filtre par longueur
            if (!empty($filters['length_min'])) {
                $whereConditions[] = "b.length >= ?";
                $params[] = $filters['length_min'];
            }
            if (!empty($filters['length_max'])) {
                $whereConditions[] = "b.length <= ?";
                $params[] = $filters['length_max'];
            }
            
            // Filtre par prix
            if (!empty($filters['price_min'])) {
                $whereConditions[] = "b.price >= ?";
                $params[] = $filters['price_min'];
            }
            if (!empty($filters['price_max'])) {
                $whereConditions[] = "b.price <= ?";
                $params[] = $filters['price_max'];
            }
            
            // Filtre par année
            if (!empty($filters['year_min'])) {
                $whereConditions[] = "b.year >= ?";
                $params[] = $filters['year_min'];
            }
            if (!empty($filters['year_max'])) {
                $whereConditions[] = "b.year <= ?";
                $params[] = $filters['year_max'];
            }
            
            // Filtre par équipements
            if (!empty($filters['equipments'])) {
                // Compter combien d'équipements sont demandés
                $equipmentCount = count($filters['equipments']);
                
                // Sous-requête pour compter les équipements correspondants
                $sql .= " WHERE b.id IN (
                    SELECT be.boat_id
                    FROM boat_equipment be
                    JOIN equipments e ON be.equipment_id = e.id
                    WHERE e.name IN (" . implode(',', array_fill(0, $equipmentCount, '?')) . ")
                    GROUP BY be.boat_id
                    HAVING COUNT(DISTINCT e.id) = $equipmentCount
                )";
                
                foreach ($filters['equipments'] as $equipment) {
                    $params[] = $equipment;
                }
            }
            
            // Filtre par localisation
            if (!empty($filters['locations'])) {
                $placeholders = implode(',', array_fill(0, count($filters['locations']), '?'));
                $whereConditions[] = "b.location IN ($placeholders)";
                foreach ($filters['locations'] as $location) {
                    $params[] = $location;
                }
            }
        }
        
        // Ajouter les conditions WHERE si nécessaire
        if (!empty($whereConditions) && empty($filters['equipments'])) {
            $sql .= " WHERE " . implode(' AND ', $whereConditions);
        } elseif (!empty($whereConditions) && !empty($filters['equipments'])) {
            $sql .= " AND " . implode(' AND ', $whereConditions);
        }
        
        // Grouper par ID de bateau pour éviter les doublons
        $sql .= " GROUP BY b.id";
        
        // Tri par défaut
        $sql .= " ORDER BY b.created_at DESC";
        
        return $this->db->fetchAll($sql, $params);
    }
    
    /**
     * Récupérer un bateau par son ID
     * 
     * @param int $id Identifiant du bateau
     * @return array|null Données du bateau ou null si non trouvé
     */
    public function getBoatById($id) {
        $sql = "SELECT b.*, 
                GROUP_CONCAT(DISTINCT e.name) as equipment
                FROM boats b
                LEFT JOIN boat_equipment be ON b.id = be.boat_id
                LEFT JOIN equipments e ON be.equipment_id = e.id
                WHERE b.id = ?
                GROUP BY b.id";
                
        $boat = $this->db->fetchOne($sql, [$id]);
        
        // Si le bateau existe, récupérer ses images
        if ($boat) {
            $imagesSql = "SELECT * FROM boat_images WHERE boat_id = ? ORDER BY is_main DESC";
            $boat['images'] = $this->db->fetchAll($imagesSql, [$id]);
            
            // Convertir la liste d'équipements en tableau
            if ($boat['equipment']) {
                $boat['equipment'] = explode(',', $boat['equipment']);
            } else {
                $boat['equipment'] = [];
            }
        }
        
        return $boat;
    }
    
    /**
     * Ajouter un nouveau bateau
     * 
     * @param array $data Données du bateau
     * @return int ID du bateau créé
     */
    public function addBoat($data) {
        // Valider les données minimales requises
        $requiredFields = ['name', 'type', 'condition_state', 'usage_type', 'capacity', 
                          'length', 'price', 'year', 'description', 'location', 
                          'main_image', 'contact_name', 'contact_email', 'contact_phone'];
        
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                throw new Exception("Le champ $field est obligatoire");
            }
        }
        
        try {
            // Insérer le bateau
            $sql = "INSERT INTO boats (name, type, condition_state, usage_type, capacity, 
                    length, price, year, description, location, port, main_image, 
                    contact_name, contact_email, contact_phone) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $params = [
                $data['name'],
                $data['type'],
                $data['condition_state'],
                $data['usage_type'],
                $data['capacity'],
                $data['length'],
                $data['price'],
                $data['year'],
                $data['description'],
                $data['location'],
                $data['port'] ?? null,
                $data['main_image'],
                $data['contact_name'],
                $data['contact_email'],
                $data['contact_phone']
            ];
            
            $boatId = $this->db->insert($sql, $params);
            
            // Ajouter l'image principale
            $this->addImage($boatId, $data['main_image'], true);
            
            // Ajouter les images supplémentaires
            if (!empty($data['additional_images'])) {
                foreach ($data['additional_images'] as $image) {
                    $this->addImage($boatId, $image, false);
                }
            }
            
            // Ajouter les équipements
            if (!empty($data['equipment'])) {
                foreach ($data['equipment'] as $equipmentName) {
                    // Obtenir l'ID de l'équipement
                    $equipmentId = $this->getEquipmentId($equipmentName);
                    
                    // Si l'équipement n'existe pas, le créer
                    if (!$equipmentId) {
                        $equipmentId = $this->createEquipment($equipmentName);
                    }
                    
                    // Associer l'équipement au bateau
                    $this->addEquipmentToBoat($boatId, $equipmentId);
                }
            }
            
            return $boatId;
        } catch (Exception $e) {
            // En cas d'erreur, annuler tout et relancer l'exception
            throw new Exception("Erreur lors de l'ajout du bateau: " . $e->getMessage());
        }
    }
    
    /**
     * Mettre à jour un bateau existant
     * 
     * @param int $id ID du bateau à mettre à jour
     * @param array $data Nouvelles données
     * @return bool Succès de la mise à jour
     */
    public function updateBoat($id, $data) {
        // Vérifier si le bateau existe
        $boat = $this->getBoatById($id);
        if (!$boat) {
            return false;
        }
        
        try {
            // Mettre à jour les champs du bateau
            $updates = [];
            $params = [];
            
            $fields = ['name', 'type', 'condition_state', 'usage_type', 'capacity', 
                      'length', 'price', 'year', 'description', 'location', 'port',
                      'contact_name', 'contact_email', 'contact_phone'];
            
            foreach ($fields as $field) {
                if (isset($data[$field])) {
                    $updates[] = "$field = ?";
                    $params[] = $data[$field];
                }
            }
            
            // Si image principale est changée
            if (!empty($data['main_image'])) {
                $updates[] = "main_image = ?";
                $params[] = $data['main_image'];
                
                // Mettre à jour l'image principale dans la table boat_images
                $this->db->update(
                    "UPDATE boat_images SET is_main = 0 WHERE boat_id = ?",
                    [$id]
                );
                
                // Vérifier si l'image existe déjà
                $existingImage = $this->db->fetchOne(
                    "SELECT id FROM boat_images WHERE boat_id = ? AND image_path = ?",
                    [$id, $data['main_image']]
                );
                
                if ($existingImage) {
                    // Définir cette image comme principale
                    $this->db->update(
                        "UPDATE boat_images SET is_main = 1 WHERE id = ?",
                        [$existingImage['id']]
                    );
                } else {
                    // Ajouter la nouvelle image principale
                    $this->addImage($id, $data['main_image'], true);
                }
            }
            
            // Exécuter la mise à jour si des champs sont modifiés
            if (!empty($updates)) {
                $params[] = $id; // Pour la clause WHERE
                $sql = "UPDATE boats SET " . implode(', ', $updates) . " WHERE id = ?";
                $this->db->update($sql, $params);
            }
            
            // Gérer les images supplémentaires
            if (!empty($data['additional_images'])) {
                // Supprimer les images non principales existantes
                $this->db->delete(
                    "DELETE FROM boat_images WHERE boat_id = ? AND is_main = 0",
                    [$id]
                );
                
                // Ajouter les nouvelles images
                foreach ($data['additional_images'] as $image) {
                    $this->addImage($id, $image, false);
                }
            }
            
            // Gérer les équipements
            if (isset($data['equipment'])) {
                // Supprimer les associations existantes
                $this->db->delete(
                    "DELETE FROM boat_equipment WHERE boat_id = ?",
                    [$id]
                );
                
                // Ajouter les nouveaux équipements
                foreach ($data['equipment'] as $equipmentName) {
                    $equipmentId = $this->getEquipmentId($equipmentName);
                    if (!$equipmentId) {
                        $equipmentId = $this->createEquipment($equipmentName);
                    }
                    $this->addEquipmentToBoat($id, $equipmentId);
                }
            }
            
            return true;
        } catch (Exception $e) {
            throw new Exception("Erreur lors de la mise à jour du bateau: " . $e->getMessage());
        }
    }
    
    /**
     * Supprimer un bateau
     * 
     * @param int $id ID du bateau à supprimer
     * @return bool Succès de la suppression
     */
    public function deleteBoat($id) {
        // Les contraintes de clé étrangère CASCADE supprimeront 
        // automatiquement les entrées associées dans les autres tables
        return $this->db->delete("DELETE FROM boats WHERE id = ?", [$id]) > 0;
    }
    
    /**
     * Obtenir les options de filtres disponibles
     * 
     * @return array Options de filtres
     */
    public function getFilterOptions() {
        $options = [];
        
        // Types de bateaux
        $options['types'] = $this->db->fetchAll(
            "SELECT DISTINCT type FROM boats ORDER BY type ASC"
        );
        
        // États
        $options['conditions'] = $this->db->fetchAll(
            "SELECT DISTINCT condition_state FROM boats ORDER BY condition_state ASC"
        );
        
        // Usages
        $options['usages'] = $this->db->fetchAll(
            "SELECT DISTINCT usage_type FROM boats ORDER BY usage_type ASC"
        );
        
        // Capacités
        $capacityRange = $this->db->fetchOne(
            "SELECT MIN(capacity) as min, MAX(capacity) as max FROM boats"
        );
        $options['capacity'] = $capacityRange ?: ['min' => 0, 'max' => 20];
        
        // Longueurs
        $lengthRange = $this->db->fetchOne(
            "SELECT MIN(length) as min, MAX(length) as max FROM boats"
        );
        $options['length'] = $lengthRange ?: ['min' => 0, 'max' => 50];
        
        // Prix
        $priceRange = $this->db->fetchOne(
            "SELECT MIN(price) as min, MAX(price) as max FROM boats"
        );
        $options['price'] = $priceRange ?: ['min' => 0, 'max' => 1000000];
        
        // Années
        $yearRange = $this->db->fetchOne(
            "SELECT MIN(year) as min, MAX(year) as max FROM boats"
        );
        $options['year'] = $yearRange ?: ['min' => 1950, 'max' => date('Y')];
        
        // Équipements
        $options['equipments'] = $this->db->fetchAll(
            "SELECT name FROM equipments ORDER BY name ASC"
        );
        
        // Localisations
        $options['locations'] = $this->db->fetchAll(
            "SELECT DISTINCT location FROM boats ORDER BY location ASC"
        );
        
        return $options;
    }
    
    /**
     * Ajouter une image à un bateau
     * 
     * @param int $boatId ID du bateau
     * @param string $imagePath Chemin de l'image
     * @param bool $isMain Est-ce l'image principale
     * @return int ID de l'image ajoutée
     */
    private function addImage($boatId, $imagePath, $isMain = false) {
        $sql = "INSERT INTO boat_images (boat_id, image_path, is_main) VALUES (?, ?, ?)";
        return $this->db->insert($sql, [$boatId, $imagePath, $isMain ? 1 : 0]);
    }
    
    /**
     * Obtenir l'ID d'un équipement par son nom
     * 
     * @param string $name Nom de l'équipement
     * @return int|null ID de l'équipement ou null si non trouvé
     */
    private function getEquipmentId($name) {
        $equipment = $this->db->fetchOne(
            "SELECT id FROM equipments WHERE name = ?",
            [$name]
        );
        
        return $equipment ? $equipment['id'] : null;
    }
    
    /**
     * Créer un nouvel équipement
     * 
     * @param string $name Nom de l'équipement
     * @return int ID de l'équipement créé
     */
    private function createEquipment($name) {
        return $this->db->insert(
            "INSERT INTO equipments (name) VALUES (?)",
            [$name]
        );
    }
    
    /**
     * Associer un équipement à un bateau
     * 
     * @param int $boatId ID du bateau
     * @param int $equipmentId ID de l'équipement
     * @return bool Succès de l'opération
     */
    private function addEquipmentToBoat($boatId, $equipmentId) {
        try {
            $this->db->insert(
                "INSERT INTO boat_equipment (boat_id, equipment_id) VALUES (?, ?)",
                [$boatId, $equipmentId]
            );
            return true;
        } catch (Exception $e) {
            // Si l'association existe déjà, ignorer l'erreur
            return false;
        }
    }
} 