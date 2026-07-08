<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$users = [
    ['email' => 'admin@gmail.com',  'name' => 'Admin Root',      'password' => 'admin123', 'role' => 'admin',    'status' => 'accepted'],
    ['email' => 'user@gmail.com',   'name' => 'User Test',        'password' => 'user123',  'role' => 'user',     'status' => 'accepted'],
    ['email' => 'guide@gmail.com',  'name' => 'Guide Maroc',      'password' => 'guide123', 'role' => 'guide',    'status' => 'accepted'],
    ['email' => 'local@gmail.com',  'name' => 'Local Provider',   'password' => 'local123', 'role' => 'provider', 'status' => 'accepted'],
];

foreach ($users as $u) {
    $found = User::where('email', $u['email'])->first();
    if ($found) {
        $found->update([
            'name'     => $u['name'],
            'password' => Hash::make($u['password']),
            'role'     => $u['role'],
            'status'   => $u['status'],
        ]);
        echo "Updated: " . $u['email'] . PHP_EOL;
    } else {
        User::create([
            'name'     => $u['name'],
            'email'    => $u['email'],
            'password' => Hash::make($u['password']),
            'role'     => $u['role'],
            'status'   => $u['status'],
        ]);
        echo "Created: " . $u['email'] . PHP_EOL;
    }
}
