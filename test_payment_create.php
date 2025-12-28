<?php
// Test payment creation

echo "🧪 Testing Payment Creation...\n\n";

try {
    // Connect to database
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=sardar_realstate', 'root', '');
    echo "✅ Database connected\n";
    
    // Check payments table structure
    $stmt = $pdo->query("DESCRIBE payments");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "\n📋 Payments table structure:\n";
    foreach ($columns as $column) {
        $default = $column['Default'] ? "DEFAULT: {$column['Default']}" : "NO DEFAULT";
        $null = $column['Null'] === 'YES' ? 'NULL' : 'NOT NULL';
        echo "  {$column['Field']} - {$column['Type']} - {$null} - {$default}\n";
    }
    
    // Test insert with all required fields
    $testData = [
        'property_id' => 1,
        'user_id' => 1,
        'amount_paid' => 5000.00,
        'remaining_amount' => 45000.00,
        'property_price' => 50000.00,
        'installment_amount' => 5000.00,
        'interest_rate' => '0%',
        'amount_with_interest' => 5000.00,
        'discount' => 0.00,
        'transaction_id' => 'TEST_' . time(),
        'payment_method' => 'bank_transfer',
        'payment_details' => 'Test payment',
        'status' => 'pending',
        'payment_date' => date('Y-m-d H:i:s'),
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ];
    
    $columns = implode(', ', array_keys($testData));
    $placeholders = ':' . implode(', :', array_keys($testData));
    
    $sql = "INSERT INTO payments ({$columns}) VALUES ({$placeholders})";
    $stmt = $pdo->prepare($sql);
    
    $success = $stmt->execute($testData);
    
    if ($success) {
        $paymentId = $pdo->lastInsertId();
        echo "\n✅ Test payment created successfully!\n";
        echo "   Payment ID: {$paymentId}\n";
        echo "   Transaction ID: {$testData['transaction_id']}\n";
        
        // Verify the payment
        $stmt = $pdo->prepare("SELECT * FROM payments WHERE id = ?");
        $stmt->execute([$paymentId]);
        $payment = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "\n📝 Created payment details:\n";
        echo "   Amount Paid: {$payment['amount_paid']}\n";
        echo "   Remaining: {$payment['remaining_amount']}\n";
        echo "   Status: {$payment['status']}\n";
        
    } else {
        echo "\n❌ Failed to create test payment\n";
        print_r($stmt->errorInfo());
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n✅ Test completed!\n";
?>
