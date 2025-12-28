<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Property;
use App\Models\Payment;

class SampleOrdersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get first user (John Doe from UserProfileSeeder)
        $user = User::where('email', 'john@example.com')->first();
        
        if (!$user) {
            echo "User not found. Please run UserProfileSeeder first.\n";
            return;
        }

        // Get some properties
        $properties = Property::take(3)->get();
        
        if ($properties->count() == 0) {
            echo "No properties found. Please add some properties first.\n";
            return;
        }

        foreach ($properties as $index => $property) {
            // Create some payments for sale properties
            if ($property->stype === 'sale') {
                // First payment (partial)
                Payment::create([
                    'property_id' => $property->pid,
                    'user_id' => $user->id,
                    'amount_paid' => $property->price * 0.3, // 30% payment
                    'property_price' => $property->price,
                    'remaining_amount' => $property->price * 0.7,
                    'installment_amount' => $property->price * 0.3,
                    'amount_with_interest' => $property->price * 0.3,
                    'transaction_id' => 'TXN_' . time() . '_' . rand(1000, 9999),
                    'payment_method' => 'card',
                    'payment_details' => 'First installment payment',
                    'status' => 'completed',
                    'payment_date' => now()->subDays(30)
                ]);

                // Second payment (if completed or processing)
                if ($index <= 1) {
                    Payment::create([
                        'property_id' => $property->pid,
                        'user_id' => $user->id,
                        'amount_paid' => $property->price * 0.4, // 40% payment
                        'property_price' => $property->price,
                        'remaining_amount' => $property->price * 0.3,
                        'installment_amount' => $property->price * 0.4,
                        'amount_with_interest' => $property->price * 0.4,
                        'transaction_id' => 'TXN_' . time() . '_' . rand(1000, 9999),
                        'payment_method' => 'bank_transfer',
                        'payment_details' => 'Second installment payment',
                        'status' => $index == 0 ? 'completed' : 'processing',
                        'payment_date' => now()->subDays(15)
                    ]);
                }

                // Final payment (if completed)
                if ($index == 0) {
                    Payment::create([
                        'property_id' => $property->pid,
                        'user_id' => $user->id,
                        'amount_paid' => $property->price * 0.3, // Final 30% payment
                        'property_price' => $property->price,
                        'remaining_amount' => 0,
                        'installment_amount' => $property->price * 0.3,
                        'amount_with_interest' => $property->price * 0.3,
                        'transaction_id' => 'TXN_' . time() . '_' . rand(1000, 9999),
                        'payment_method' => 'bkash',
                        'payment_details' => 'Final payment - Property fully paid',
                        'status' => 'completed',
                        'payment_date' => now()->subDays(5)
                    ]);
                }
            }
        }

        echo "Sample orders and payments created successfully for user: {$user->name}\n";
    }
}
