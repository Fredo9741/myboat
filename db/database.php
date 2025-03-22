<?php
// Classe Database pour gérer la connexion à la base de données SQLite
class Database {
    private $db;
    private static $instance = null;

    // Constructeur privé (pattern Singleton)
    private function __construct() {
        try {
            // Création du dossier db s'il n'existe pas
            if (!file_exists(dirname(__FILE__))) {
                mkdir(dirname(__FILE__), 0777, true);
            }
            
            // Connexion à la base SQLite
            $this->db = new PDO('sqlite:' . dirname(__FILE__) . '/myboat.db');
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Création des tables si elles n'existent pas
            $this->createTables();
        } catch (PDOException $e) {
            die("Erreur de connexion à la base de données: " . $e->getMessage());
        }
    }

    // Méthode pour obtenir l'instance de la base de données (Singleton)
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    // Méthode pour créer les tables si elles n'existent pas
    private function createTables() {
        // Table des types de bateaux
        $this->db->exec("CREATE TABLE IF NOT EXISTS boat_types (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )");

        // Table des conditions (état du bateau)
        $this->db->exec("CREATE TABLE IF NOT EXISTS conditions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )");

        // Table des usages (utilisation prévue)
        $this->db->exec("CREATE TABLE IF NOT EXISTS usages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )");

        // Table des localisations
        $this->db->exec("CREATE TABLE IF NOT EXISTS locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )");

        // Table des équipements
        $this->db->exec("CREATE TABLE IF NOT EXISTS equipments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )");

        // Table principale des bateaux
        $this->db->exec("CREATE TABLE IF NOT EXISTS boats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type_id INTEGER,
            length REAL NOT NULL,
            year INTEGER NOT NULL,
            price REAL NOT NULL,
            capacity INTEGER NOT NULL,
            condition_id INTEGER,
            usage_id INTEGER,
            location_id INTEGER,
            port TEXT,
            description TEXT,
            contact_name TEXT,
            contact_email TEXT,
            contact_phone TEXT,
            contact_preferred TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (type_id) REFERENCES boat_types(id),
            FOREIGN KEY (condition_id) REFERENCES conditions(id),
            FOREIGN KEY (usage_id) REFERENCES usages(id),
            FOREIGN KEY (location_id) REFERENCES locations(id)
        )");

        // Table de relation entre bateaux et équipements (many-to-many)
        $this->db->exec("CREATE TABLE IF NOT EXISTS boat_equipment (
            boat_id INTEGER,
            equipment_id INTEGER,
            PRIMARY KEY (boat_id, equipment_id),
            FOREIGN KEY (boat_id) REFERENCES boats(id),
            FOREIGN KEY (equipment_id) REFERENCES equipments(id)
        )");

        // Table des photos de bateaux
        $this->db->exec("CREATE TABLE IF NOT EXISTS boat_photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            boat_id INTEGER,
            filename TEXT NOT NULL,
            is_primary BOOLEAN DEFAULT 0,
            FOREIGN KEY (boat_id) REFERENCES boats(id)
        )");

        // Insérer des données de base si les tables sont vides
        $this->insertInitialData();
    }

    // Méthode pour insérer des données initiales
    private function insertInitialData() {
        // Vérifier si la table boat_types est vide
        $stmt = $this->db->query("SELECT COUNT(*) FROM boat_types");
        if ($stmt->fetchColumn() == 0) {
            // Insérer les types de bateaux
            $types = ['Monocoque', 'Multicoque', 'Bateau à moteur', 'Bateau neuf'];
            $stmt = $this->db->prepare("INSERT INTO boat_types (name) VALUES (?)");
            foreach ($types as $type) {
                $stmt->execute([$type]);
            }
        }

        // Vérifier si la table conditions est vide
        $stmt = $this->db->query("SELECT COUNT(*) FROM conditions");
        if ($stmt->fetchColumn() == 0) {
            // Insérer les conditions
            $conditions = ['Neuf', 'Occasion', 'Rénové'];
            $stmt = $this->db->prepare("INSERT INTO conditions (name) VALUES (?)");
            foreach ($conditions as $condition) {
                $stmt->execute([$condition]);
            }
        }

        // Vérifier si la table usages est vide
        $stmt = $this->db->query("SELECT COUNT(*) FROM usages");
        if ($stmt->fetchColumn() == 0) {
            // Insérer les usages
            $usages = ['Plaisance', 'Pêche', 'Exploration', 'Charter'];
            $stmt = $this->db->prepare("INSERT INTO usages (name) VALUES (?)");
            foreach ($usages as $usage) {
                $stmt->execute([$usage]);
            }
        }

        // Vérifier si la table locations est vide
        $stmt = $this->db->query("SELECT COUNT(*) FROM locations");
        if ($stmt->fetchColumn() == 0) {
            // Insérer les localisations
            $locations = ['La Réunion', 'Maurice', 'Madagascar', 'Seychelles', 'Mayotte'];
            $stmt = $this->db->prepare("INSERT INTO locations (name) VALUES (?)");
            foreach ($locations as $location) {
                $stmt->execute([$location]);
            }
        }

        // Vérifier si la table equipments est vide
        $stmt = $this->db->query("SELECT COUNT(*) FROM equipments");
        if ($stmt->fetchColumn() == 0) {
            // Insérer les équipements
            $equipments = ['Climatisation', 'GPS', 'Électricité solaire', 'Désalinisation'];
            $stmt = $this->db->prepare("INSERT INTO equipments (name) VALUES (?)");
            foreach ($equipments as $equipment) {
                $stmt->execute([$equipment]);
            }
        }
    }

    // Méthode pour exécuter une requête
    public function query($sql, $params = []) {
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            die("Erreur d'exécution de la requête: " . $e->getMessage());
        }
    }

    // Méthode pour initialiser la base de données complète
    public function initDatabase() {
        try {
            // Créer les tables si elles n'existent pas
            $this->createTables();
            
            // Cette méthode est déjà appelée dans createTables(), 
            // mais on peut la rappeler explicitement ici si nécessaire
            // $this->insertInitialData();
            
            return true;
        } catch (PDOException $e) {
            error_log("Erreur d'initialisation de la base de données: " . $e->getMessage());
            return false;
        }
    }

    // Méthode pour obtenir le dernier ID inséré
    public function lastInsertId() {
        return $this->db->lastInsertId();
    }
} 