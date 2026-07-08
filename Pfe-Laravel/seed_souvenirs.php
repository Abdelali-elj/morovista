<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Souvenir;

$souvenirs = [
    [
        'name' => 'Premium Leather Pouf — Tan Babouches',
        'tag' => 'Cuir & Babouches',
        'category' => 'Artisanat',
        'origin' => 'Marrakech',
        'price' => 280,
        'badge' => '100% Cuir',
        'description' => 'Handcrafted from genuine premium goat leather, naturally cured in the ancient tanneries of Marrakech. Soft, durable, and stitched with traditional silk thread.',
        'image' => '/img1.jpeg'
    ],
    [
        'name' => 'Fassi Handcrafted Tajine',
        'tag' => 'Céramique & Tajine',
        'category' => 'Cuisine & Art',
        'origin' => 'Fès',
        'price' => 190,
        'badge' => 'Bestseller',
        'description' => 'An authentic clay tajine hand-painted by Fassi pottery artists. Designed with heat-resistant clay to slow-cook delicious, aromatic tagines on embers.',
        'image' => '/img2.jpeg'
    ],
    [
        'name' => 'Berber Hand-Woven Kilim Rug',
        'tag' => 'Tapis & Textiles',
        'category' => 'Décoration',
        'origin' => 'Ouarzazate',
        'price' => 850,
        'badge' => 'Pièce Unique',
        'description' => 'Flat-woven kilim rug representing tribal symbols and ancestral tales of High Atlas Berber families. Hand-dyed with natural saffron and madder roots.',
        'image' => '/img3.jpeg'
    ],
    [
        'name' => 'Engraved Moroccan Teapot',
        'tag' => 'Thé & Service',
        'category' => 'Tradition',
        'origin' => 'Casablanca',
        'price' => 320,
        'badge' => 'Premium',
        'description' => 'A traditional brass teapot with hand-hammered arabesque designs. Perfect for serving the signature Moroccan mint tea with a touch of elegance.',
        'image' => '/img4.jpeg'
    ]
];

foreach ($souvenirs as $s) {
    Souvenir::create($s);
    echo "Added: " . $s['name'] . "\n";
}

echo "All souvenirs added successfully!\n";
