<?php
// Quick test for payment status update

echo "🧪 Testing Payment Status Update...\n\n";

try {
    // Connect to database
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=sardar_realstate', 'root', '');
    echo "✅ Database connected\n";
    
    // Check if we have any payments
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM payments");
    $result = $stmt->fetch();
    echo "📊 Total payments: " . $result['count'] . "\n";
    
    if ($result['count'] > 0) {
        // Get first payment
        $stmt = $pdo->query("SELECT id, status, admin_notes, approved_by FROM payments LIMIT 1");
        $payment = $stmt->fetch();
        
        echo "\n🔍 Sample payment:\n";
        echo "  ID: " . $payment['id'] . "\n";
        echo "  Status: " . $payment['status'] . "\n";
        echo "  Admin Notes: " . ($payment['admin_notes'] ?: 'NULL') . "\n";
        echo "  Approved By: " . ($payment['approved_by'] ?: 'NULL') . "\n";
        
        // Test update
        $stmt = $pdo->prepare("UPDATE payments SET status = ?, admin_notes = ?, approved_by = ? WHERE id = ?");
        $success = $stmt->execute(['processing', 'Test update from PHP', 1, $payment['id']]);
        
        if ($success) {
            echo "\n✅ Payment update successful!\n";
            
            // Verify update
            $stmt = $pdo->prepare("SELECT status, admin_notes, approved_by FROM payments WHERE id = ?");
            $stmt->execute([$payment['id']]);
            $updated = $stmt->fetch();
            
            echo "📝 Updated values:\n";
            echo "  Status: " . $updated['status'] . "\n";
            echo "  Admin Notes: " . $updated['admin_notes'] . "\n";
            echo "  Approved By: " . $updated['approved_by'] . "\n";
        } else {
            echo "❌ Payment update failed\n";
        }
    } else {
        echo "\n⚠️  No payments found in database\n";
        echo "Create some sample payments first\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n✅ Test completed!\n";
?>
