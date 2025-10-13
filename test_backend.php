<?php
// Simple test script to check backend status

echo "🔧 Testing Backend Status...\n\n";

// Test 1: Check if Laravel is working
echo "1. Testing Laravel Basic Response:\n";
$response = file_get_contents('http://localhost:8000/api/test');
if ($response) {
    $data = json_decode($response, true);
    if ($data && $data['status'] === 'success') {
        echo "✅ Laravel API is working\n";
        echo "   Message: " . $data['message'] . "\n";
    } else {
        echo "❌ Laravel API response invalid\n";
    }
} else {
    echo "❌ Cannot connect to Laravel server\n";
    echo "   Make sure to run: php artisan serve\n";
}

echo "\n";

// Test 2: Check database connection
echo "2. Testing Database Connection:\n";
try {
    $pdo = new PDO('sqlite:' . __DIR__ . '/realstate-backend/database/database.sqlite');
    echo "✅ Database connection successful\n";
    
    // Check if users table exists
    $stmt = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
    if ($stmt->fetch()) {
        echo "✅ Users table exists\n";
        
        // Count users
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
        $result = $stmt->fetch();
        echo "   Users in database: " . $result['count'] . "\n";
    } else {
        echo "❌ Users table not found - Run migrations\n";
    }
    
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    echo "   Make sure database file exists\n";
}

echo "\n";

// Test 3: Check migrations status
echo "3. Migration Status:\n";
echo "   Run these commands in realstate-backend folder:\n";
echo "   php artisan migrate\n";
echo "   php artisan db:seed\n";

echo "\n✅ Backend test completed!\n";
?>
