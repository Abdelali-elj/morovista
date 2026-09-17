<?php

$jsonFile = __DIR__ . '/Pfe-Laravel/database/data_export.json';
if (!file_exists($jsonFile)) {
    die("Error: data_export.json not found!\n");
}

$data = json_decode(file_get_contents($jsonFile), true);

$sql = "SET FOREIGN_KEY_CHECKS = 0;\n";
$sql .= "SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';\n";
$sql .= "SET time_zone = '+00:00';\n\n";

// Drop child tables first
$sql .= "DROP TABLE IF EXISTS `my_plans`;\n";
$sql .= "DROP TABLE IF EXISTS `commentaires`;\n";
$sql .= "DROP TABLE IF EXISTS `service_locals`;\n";
$sql .= "DROP TABLE IF EXISTS `plan_tours`;\n";
$sql .= "DROP TABLE IF EXISTS `lieu_places`;\n";
$sql .= "DROP TABLE IF EXISTS `stades`;\n";
$sql .= "DROP TABLE IF EXISTS `restaurants`;\n";
$sql .= "DROP TABLE IF EXISTS `hotels`;\n";
$sql .= "DROP TABLE IF EXISTS `villes`;\n";
$sql .= "DROP TABLE IF EXISTS `personal_access_tokens`;\n";
$sql .= "DROP TABLE IF EXISTS `souvenirs`;\n";
$sql .= "DROP TABLE IF EXISTS `transports`;\n";
$sql .= "DROP TABLE IF EXISTS `urgence_phonens`;\n";
$sql .= "DROP TABLE IF EXISTS `password_reset_tokens`;\n";
$sql .= "DROP TABLE IF EXISTS `sessions`;\n";
$sql .= "DROP TABLE IF EXISTS `users`;\n\n";

function escape($val) {
    if (is_null($val)) return "NULL";
    if (is_bool($val)) return $val ? '1' : '0';
    if (is_int($val) || is_float($val)) return (string)$val;
    $val = (string)$val;
    $escaped = addslashes($val);
    $escaped = str_replace(["\r\n", "\r", "\n"], ["\\n", "\\n", "\\n"], $escaped);
    return "'" . $escaped . "'";
}

// 1. Users
$sql .= "CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'visitor',
  `status` varchar(50) NOT NULL DEFAULT 'accepted',
  `firebase_uid` varchar(255) NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

// 2. Villes
$sql .= "CREATE TABLE `villes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `image_url` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

// 3. Personal Access Tokens
$sql .= "CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL UNIQUE,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

// 4. Hotels
$sql .= "CREATE TABLE `hotels` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `photo_url` text DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `prix_chambre` varchar(255) DEFAULT NULL,
  `categorie` varchar(255) DEFAULT NULL,
  `likes` int(11) NOT NULL DEFAULT 0,
  `ville_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `hotels_ville_id_foreign` (`ville_id`),
  CONSTRAINT `hotels_ville_id_foreign` FOREIGN KEY (`ville_id`) REFERENCES `villes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

// 5. Restaurants
$sql .= "CREATE TABLE `restaurants` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `photo_url` text DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `prix_moyen` varchar(255) DEFAULT NULL,
  `categorie` varchar(255) DEFAULT NULL,
  `likes` int(11) NOT NULL DEFAULT 0,
  `ville_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `restaurants_ville_id_foreign` (`ville_id`),
  CONSTRAINT `restaurants_ville_id_foreign` FOREIGN KEY (`ville_id`) REFERENCES `villes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

// 6. Stades
$sql .= "CREATE TABLE `stades` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `image_url` text DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `capacite` varchar(255) DEFAULT NULL,
  `likes` int(11) NOT NULL DEFAULT 0,
  `ville_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `stades_ville_id_foreign` (`ville_id`),
  CONSTRAINT `stades_ville_id_foreign` FOREIGN KEY (`ville_id`) REFERENCES `villes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

// 7. Lieu Places
$sql .= "CREATE TABLE `lieu_places` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `image_url` text DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `likes` int(11) NOT NULL DEFAULT 0,
  `ville_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `lieu_places_ville_id_foreign` (`ville_id`),
  CONSTRAINT `lieu_places_ville_id_foreign` FOREIGN KEY (`ville_id`) REFERENCES `villes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

// 8. Plan Tours
$sql .= "CREATE TABLE `plan_tours` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) NOT NULL,
  `image_url` text DEFAULT NULL,
  `prix` decimal(10,2) DEFAULT NULL,
  `duree` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `addedBy` varchar(255) NOT NULL DEFAULT 'admin',
  `ville_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `plan_tours_ville_id_foreign` (`ville_id`),
  CONSTRAINT `plan_tours_ville_id_foreign` FOREIGN KEY (`ville_id`) REFERENCES `villes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

// 9. Service Locals
$sql .= "CREATE TABLE `service_locals` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nom_service` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'accepted',
  `image_url` text DEFAULT NULL,
  `ville_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `service_locals_ville_id_foreign` (`ville_id`),
  CONSTRAINT `service_locals_ville_id_foreign` FOREIGN KEY (`ville_id`) REFERENCES `villes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

// 10. Transports
$sql .= "CREATE TABLE `transports` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `type_vehicule` varchar(255) NOT NULL,
  `photo_url` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `lien` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

// 11. Urgence Phone Numbers
$sql .= "CREATE TABLE `urgence_phonens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `service_nom` varchar(255) NOT NULL,
  `numero` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

// 12. Commentaires
$sql .= "CREATE TABLE `commentaires` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `auteur_nom` varchar(255) NOT NULL,
  `contenu` text NOT NULL,
  `note` int(11) NOT NULL DEFAULT 5,
  `pays` varchar(255) DEFAULT NULL,
  `service_type` varchar(255) DEFAULT NULL,
  `service_id` bigint(20) unsigned DEFAULT NULL,
  `date_pub` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

// 13. Souvenirs
$sql .= "CREATE TABLE `souvenirs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `origin` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `badge` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

// 14. My Plans
$sql .= "CREATE TABLE `my_plans` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `plan_id` bigint(20) unsigned DEFAULT NULL,
  `titre` varchar(255) NOT NULL,
  `ville` varchar(255) DEFAULT NULL,
  `duree` varchar(255) DEFAULT NULL,
  `budget` decimal(10,2) DEFAULT NULL,
  `statut` varchar(50) NOT NULL DEFAULT 'En cours',
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `my_plans_user_id_foreign` (`user_id`),
  CONSTRAINT `my_plans_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

// ========================================================
// INSERTION DES DONNEES
// ========================================================

// 1. Users (Standard + Utilisateurs from JSON)
$passDefault = password_hash('password123', PASSWORD_BCRYPT);
$passAdmin = password_hash('admin123', PASSWORD_BCRYPT);
$passUser = password_hash('user123', PASSWORD_BCRYPT);
$passGuide = password_hash('guide123', PASSWORD_BCRYPT);
$passLocal = password_hash('local123', PASSWORD_BCRYPT);

$userRows = [
    "(1, 'Admin Root', 'admin@gmail.com', '{$passAdmin}', 'admin', 'accepted', NULL)",
    "(2, 'User Test', 'user@gmail.com', '{$passUser}', 'user', 'accepted', NULL)",
    "(3, 'Guide Maroc', 'guide@gmail.com', '{$passGuide}', 'guide', 'accepted', NULL)",
    "(4, 'Local Provider', 'local@gmail.com', '{$passLocal}', 'provider', 'accepted', NULL)"
];

$existingEmails = ['admin@gmail.com' => true, 'user@gmail.com' => true, 'guide@gmail.com' => true, 'local@gmail.com' => true];
$userId = 5;

if (!empty($data['utilisateurs'])) {
    foreach ($data['utilisateurs'] as $u) {
        $email = $u['email'] ?? null;
        if ($email && !isset($existingEmails[$email])) {
            $existingEmails[$email] = true;
            $name = $u['name'] ?? $email;
            $role = $u['userType'] ?? 'visitor';
            $uid = $u['id'] ?? null;
            $userRows[] = "(" . $userId++ . ", " . escape($name) . ", " . escape($email) . ", '{$passDefault}', " . escape($role) . ", 'accepted', " . escape($uid) . ")";
        }
    }
}
$sql .= "INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `status`, `firebase_uid`) VALUES\n" . implode(",\n", $userRows) . ";\n\n";

// 2. Villes (city list)
$villesMap = [];
$villeId = 1;

$cityList = $data['city'] ?? $data['villes'] ?? [];
foreach ($cityList as $c) {
    $nom = $c['nom'] ?? 'Ville';
    if (!isset($villesMap[$nom])) {
        $villesMap[$nom] = ['id' => $villeId++, 'nom' => $nom, 'image' => $c['image'] ?? $c['image_url'] ?? null];
    }
}

// Discover missing cities
foreach (['hotels', 'restaurant', 'restaurants', 'stadium', 'stades', 'place', 'places', 'tours', 'plans', 'localServices', 'local_services'] as $cat) {
    if (!empty($data[$cat])) {
        foreach ($data[$cat] as $item) {
            $vNom = $item['ville'] ?? $item['destination'] ?? null;
            if ($vNom && !isset($villesMap[$vNom])) {
                $villesMap[$vNom] = ['id' => $villeId++, 'nom' => $vNom, 'image' => null];
            }
        }
    }
}

$vRows = [];
foreach ($villesMap as $v) {
    $vRows[] = "(" . $v['id'] . ", " . escape($v['nom']) . ", " . escape($v['image']) . ")";
}
if (!empty($vRows)) {
    $sql .= "INSERT INTO `villes` (`id`, `nom`, `image_url`) VALUES\n" . implode(",\n", $vRows) . ";\n\n";
}

// 3. Hotels
$hotelList = $data['hotels'] ?? [];
if (!empty($hotelList)) {
    $hotelRows = [];
    foreach ($hotelList as $h) {
        $vId = isset($h['ville']) && isset($villesMap[$h['ville']]) ? $villesMap[$h['ville']]['id'] : "NULL";
        $hotelRows[] = "(" . implode(', ', [
            escape($h['nom'] ?? 'Hotel'),
            escape($h['photo'] ?? $h['photo_url'] ?? null),
            escape($h['adress'] ?? $h['adresse'] ?? null),
            escape($h['contact'] ?? null),
            escape($h['email'] ?? null),
            escape($h['prix_chambre'] ?? $h['price'] ?? null),
            escape($h['categorie'] ?? null),
            (int)($h['likes'] ?? 0),
            $vId
        ]) . ")";
    }
    if (!empty($hotelRows)) {
        $chunks = array_chunk($hotelRows, 50);
        foreach ($chunks as $c) {
            $sql .= "INSERT INTO `hotels` (`nom`, `photo_url`, `adresse`, `contact`, `email`, `prix_chambre`, `categorie`, `likes`, `ville_id`) VALUES\n" . implode(",\n", $c) . ";\n\n";
        }
    }
}

// 4. Restaurants (restaurant / restaurants)
$restaurantList = $data['restaurant'] ?? $data['restaurants'] ?? [];
if (!empty($restaurantList)) {
    $restoRows = [];
    foreach ($restaurantList as $r) {
        $vId = isset($r['ville']) && isset($villesMap[$r['ville']]) ? $villesMap[$r['ville']]['id'] : "NULL";
        $restoRows[] = "(" . implode(', ', [
            escape($r['nom'] ?? 'Restaurant'),
            escape($r['photo'] ?? $r['photo_url'] ?? null),
            escape($r['adress'] ?? $r['adresse'] ?? null),
            escape($r['contact'] ?? null),
            escape($r['email'] ?? null),
            escape($r['prix_moyen'] ?? $r['price'] ?? null),
            escape($r['categorie'] ?? $r['cuisine'] ?? null),
            (int)($r['likes'] ?? 0),
            $vId
        ]) . ")";
    }
    if (!empty($restoRows)) {
        $chunks = array_chunk($restoRows, 50);
        foreach ($chunks as $c) {
            $sql .= "INSERT INTO `restaurants` (`nom`, `photo_url`, `adresse`, `contact`, `email`, `prix_moyen`, `categorie`, `likes`, `ville_id`) VALUES\n" . implode(",\n", $c) . ";\n\n";
        }
    }
}

// 5. Stades (stadium / stades)
$stadiumList = $data['stadium'] ?? $data['stades'] ?? [];
if (!empty($stadiumList)) {
    $stadeRows = [];
    foreach ($stadiumList as $s) {
        $vId = isset($s['ville']) && isset($villesMap[$s['ville']]) ? $villesMap[$s['ville']]['id'] : "NULL";
        $stadeRows[] = "(" . implode(', ', [
            escape($s['nom'] ?? 'Stade'),
            escape($s['image'] ?? $s['photo'] ?? $s['image_url'] ?? null),
            escape($s['adress'] ?? $s['adresse'] ?? null),
            escape($s['contact'] ?? null),
            escape($s['capacite'] ?? null),
            (int)($s['likes'] ?? 0),
            $vId
        ]) . ")";
    }
    if (!empty($stadeRows)) {
        $chunks = array_chunk($stadeRows, 50);
        foreach ($chunks as $c) {
            $sql .= "INSERT INTO `stades` (`nom`, `image_url`, `adresse`, `contact`, `capacite`, `likes`, `ville_id`) VALUES\n" . implode(",\n", $c) . ";\n\n";
        }
    }
}

// 6. Lieu Places (place / places)
$placeList = $data['place'] ?? $data['places'] ?? [];
if (!empty($placeList)) {
    $placeRows = [];
    foreach ($placeList as $p) {
        $vId = isset($p['ville']) && isset($villesMap[$p['ville']]) ? $villesMap[$p['ville']]['id'] : "NULL";
        $desc = is_array($p['description'] ?? null) ? json_encode($p['description'], JSON_UNESCAPED_UNICODE) : ($p['description'] ?? null);
        $img = $p['image'] ?? $p['photo'] ?? $p['image_url'] ?? null;
        $placeRows[] = "(" . implode(', ', [
            escape($p['nom'] ?? 'Lieu'),
            escape($img),
            escape($p['adress'] ?? $p['adresse'] ?? null),
            escape($desc),
            (int)($p['likes'] ?? 0),
            $vId
        ]) . ")";
    }
    if (!empty($placeRows)) {
        $chunks = array_chunk($placeRows, 50);
        foreach ($chunks as $c) {
            $sql .= "INSERT INTO `lieu_places` (`nom`, `image_url`, `adresse`, `description`, `likes`, `ville_id`) VALUES\n" . implode(",\n", $c) . ";\n\n";
        }
    }
}

// 7. Plan Tours (tours / plans)
$tourList = $data['tours'] ?? $data['plans'] ?? [];
if (!empty($tourList)) {
    $planRows = [];
    foreach ($tourList as $pl) {
        $vNom = $pl['destination'] ?? $pl['ville'] ?? null;
        $vId = $vNom && isset($villesMap[$vNom]) ? $villesMap[$vNom]['id'] : "NULL";
        $planRows[] = "(" . implode(', ', [
            escape($pl['titre'] ?? 'Plan'),
            escape($pl['image'] ?? $pl['image_url'] ?? null),
            escape($pl['prix'] ?? null),
            escape($pl['duree'] ?? null),
            escape($pl['status'] ?? 'active'),
            escape($pl['addedBy'] ?? 'admin'),
            $vId
        ]) . ")";
    }
    if (!empty($planRows)) {
        $chunks = array_chunk($planRows, 50);
        foreach ($chunks as $c) {
            $sql .= "INSERT INTO `plan_tours` (`titre`, `image_url`, `prix`, `duree`, `status`, `addedBy`, `ville_id`) VALUES\n" . implode(",\n", $c) . ";\n\n";
        }
    }
}

// 8. Service Locals (localServices / local_services)
$localServiceList = $data['localServices'] ?? $data['local_services'] ?? [];
if (!empty($localServiceList)) {
    $srvRows = [];
    foreach ($localServiceList as $srv) {
        $vId = isset($srv['ville']) && isset($villesMap[$srv['ville']]) ? $villesMap[$srv['ville']]['id'] : "NULL";
        $srvRows[] = "(" . implode(', ', [
            escape($srv['nom'] ?? $srv['nom_service'] ?? 'Service'),
            escape($srv['type'] ?? null),
            escape($srv['telephone'] ?? null),
            escape($srv['adress'] ?? $srv['adresse'] ?? null),
            escape($srv['status'] ?? 'accepted'),
            escape($srv['image'] ?? $srv['image_url'] ?? null),
            $vId
        ]) . ")";
    }
    if (!empty($srvRows)) {
        $chunks = array_chunk($srvRows, 50);
        foreach ($chunks as $c) {
            $sql .= "INSERT INTO `service_locals` (`nom_service`, `type`, `telephone`, `adresse`, `status`, `image_url`, `ville_id`) VALUES\n" . implode(",\n", $c) . ";\n\n";
        }
    }
}

// 9. Transports (transport / transports)
$transportList = $data['transport'] ?? $data['transports'] ?? [];
if (!empty($transportList)) {
    $trRows = [];
    foreach ($transportList as $tr) {
        $trRows[] = "(" . implode(', ', [
            escape($tr['nom'] ?? $tr['type_vehicule'] ?? $tr['type'] ?? 'Transport'),
            escape($tr['photo'] ?? $tr['photo_url'] ?? null),
            escape($tr['desc'] ?? $tr['description'] ?? null),
            escape($tr['lien'] ?? null)
        ]) . ")";
    }
    if (!empty($trRows)) {
        $chunks = array_chunk($trRows, 50);
        foreach ($chunks as $c) {
            $sql .= "INSERT INTO `transports` (`type_vehicule`, `photo_url`, `description`, `lien`) VALUES\n" . implode(",\n", $c) . ";\n\n";
        }
    }
}

// 10. Urgence Phone Numbers (PhoneN / urgence_phonens)
$phoneList = $data['PhoneN'] ?? $data['urgence_phonens'] ?? [];
if (!empty($phoneList)) {
    $urgRows = [];
    foreach ($phoneList as $urg) {
        $urgRows[] = "(" . implode(', ', [
            escape($urg['nom'] ?? $urg['service_nom'] ?? 'Service'),
            escape($urg['num'] ?? $urg['numero'] ?? '112')
        ]) . ")";
    }
    if (!empty($urgRows)) {
        $sql .= "INSERT INTO `urgence_phonens` (`service_nom`, `numero`) VALUES\n" . implode(",\n", $urgRows) . ";\n\n";
    }
}

// 11. Commentaires (siteComments / commentaires)
$commentList = $data['siteComments'] ?? $data['commentaires'] ?? [];
if (!empty($commentList)) {
    $commRows = [];
    foreach ($commentList as $comm) {
        $commRows[] = "(" . implode(', ', [
            escape($comm['user'] ?? $comm['auteur_nom'] ?? 'Anonyme'),
            escape($comm['text'] ?? $comm['contenu'] ?? ''),
            (int)($comm['rating'] ?? $comm['note'] ?? 5),
            escape($comm['pays'] ?? null),
            escape($comm['service_type'] ?? null),
            escape($comm['service_id'] ?? null)
        ]) . ")";
    }
    if (!empty($commRows)) {
        $sql .= "INSERT INTO `commentaires` (`auteur_nom`, `contenu`, `note`, `pays`, `service_type`, `service_id`) VALUES\n" . implode(",\n", $commRows) . ";\n\n";
    }
}

// 12. Souvenirs
$sql .= "INSERT INTO `souvenirs` (`name`, `tag`, `category`, `origin`, `price`, `badge`, `description`, `image`) VALUES
('Premium Leather Pouf — Tan Babouches', 'Cuir & Babouches', 'Artisanat', 'Marrakech', 280.00, '100% Cuir', 'Handcrafted from genuine premium goat leather, naturally cured in the ancient tanneries of Marrakech.', '/img1.jpeg'),
('Fassi Handcrafted Tajine', 'Céramique & Tajine', 'Cuisine & Art', 'Fès', 190.00, 'Bestseller', 'An authentic clay tajine hand-painted by Fassi pottery artists. Designed with heat-resistant clay.', '/img2.jpeg'),
('Berber Hand-Woven Kilim Rug', 'Tapis & Textiles', 'Décoration', 'Ouarzazate', 850.00, 'Pièce Unique', 'Flat-woven kilim rug representing tribal symbols and ancestral tales of High Atlas Berber families.', '/img3.jpeg'),
('Engraved Moroccan Teapot', 'Thé & Service', 'Tradition', 'Casablanca', 320.00, 'Premium', 'A traditional brass teapot with hand-hammered arabesque designs. Perfect for serving signature mint tea.', '/img4.jpeg');\n\n";

$sql .= "SET FOREIGN_KEY_CHECKS = 1;\n";

// Save to root and Pfe-Laravel
file_put_contents(__DIR__ . '/pfe.sql', $sql);
file_put_contents(__DIR__ . '/pfe_clean.sql', $sql);
file_put_contents(__DIR__ . '/Pfe-Laravel/pfe.sql', $sql);
file_put_contents(__DIR__ . '/Pfe-Laravel/database/pfe.sql', $sql);

echo "Successfully created COMPLETE and clean SQL (" . number_format(strlen($sql)) . " bytes)\n";
