<?php
// Debug script to test payment status update

echo "🔧 Testing Payment Status Update...\n\n";

// Test database connection first
try {
    $pdo = new PDO('sqlite:' . __DIR__ . '/realstate-backend/database/database.sqlite');
    echo "✅ Database connection successful\n";
    
    // Check if payments table exists and has required columns
    $stmt = $pdo->query("PRAGMA table_info(payments)");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "\n📋 Payments table columns:\n";
    $hasAdminNotes = false;
    $hasApprovedBy = false;
    $hasStatus = false;
    
    foreach ($columns as $column) {
        echo "  - " . $column['name'] . " (" . $column['type'] . ")\n";
        if ($column['name'] === 'admin_notes') $hasAdminNotes = true;
        if ($column['name'] === 'approved_by') $hasApprovedBy = true;
        if ($column['name'] === 'status') $hasStatus = true;
    }
    
    echo "\n🔍 Column Check:\n";
    echo "  admin_notes: " . ($hasAdminNotes ? "✅ EXISTS" : "❌ MISSING") . "\n";
    echo "  approved_by: " . ($hasApprovedBy ? "✅ EXISTS" : "❌ MISSING") . "\n";
    echo "  status: " . ($hasStatus ? "✅ EXISTS" : "❌ MISSING") . "\n";
    
    if (!$hasAdminNotes || !$hasApprovedBy) {
        echo "\n⚠️  Missing columns detected. Run migration:\n";
        echo "   cd realstate-backend\n";
        echo "   php artisan migrate\n";
    }
    
    // Check if there are any payments
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM payments");
    $result = $stmt->fetch();
    echo "\n📊 Total payments in database: " . $result['count'] . "\n";
    
    if ($result['count'] > 0) {
        // Show sample payment
        $stmt = $pdo->query("SELECT id, user_id, status, amount_paid FROM payments LIMIT 1");
        $payment = $stmt->fetch();
        echo "  Sample payment ID: " . $payment['id'] . " (Status: " . $payment['status'] . ")\n";
    }
    
    // Check users table for agent/admin
    $stmt = $pdo->query("SELECT id, name, role FROM users WHERE role IN ('agent', 'admin') LIMIT 1");
    $agent = $stmt->fetch();
    
    if ($agent) {
        echo "\n👤 Found agent/admin user:\n";
        echo "  ID: " . $agent['id'] . "\n";
        echo "  Name: " . $agent['name'] . "\n";
        echo "  Role: " . $agent['role'] . "\n";
    } else {
        echo "\n❌ No agent/admin user found. Create one:\n";
        echo "   Register with role 'agent' or 'admin'\n";
    }
    
} catch (Exception $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
}

echo "\n🚀 Next Steps:\n";
echo "1. Make sure Laravel server is running: php artisan serve\n";
echo "2. Run migrations if columns are missing\n";
echo "3. Login as agent/admin user\n";
echo "4. Try payment status update\n";
echo "5. Check Laravel logs: realstate-backend/storage/logs/laravel.log\n";

echo "\n✅ Debug completed!\n";
?>
