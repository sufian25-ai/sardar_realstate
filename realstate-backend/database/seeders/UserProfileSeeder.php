<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserOrder;
use App\Models\UserProperty;
use Illuminate\Support\Facades\Hash;

class UserProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample users with profile data
        $users = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'phone' => '+880 1234-567890',
                'address' => 'Gulshan, Dhaka, Bangladesh',
                'bio' => 'Looking for a perfect family home in a quiet neighborhood.',
                'date_of_birth' => '1990-05-15',
                'gender' => 'male',
                'occupation' => 'Software Engineer',
                'annual_income' => 120000.00,
                'is_verified' => true,
                'last_login_at' => now()
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'phone' => '+880 1987-654321',
                'address' => 'Banani, Dhaka, Bangladesh',
                'bio' => 'Real estate investor interested in commercial properties.',
                'date_of_birth' => '1985-08-22',
                'gender' => 'female',
                'occupation' => 'Business Owner',
                'annual_income' => 200000.00,
                'is_verified' => true,
                'last_login_at' => now()
            ]
        ];

        foreach ($users as $userData) {
            $user = User::create($userData);

            // Create sample orders for each user
            if ($user->id == 1) { // John's orders
                UserOrder::create([
                    'user_id' => $user->id,
                    'property_id' => 1, // Assuming property with pid=1 exists
                    'amount' => 450000.00,
                    'status' => 'completed',
                    'order_type' => 'purchase',
                    'notes' => 'Purchased luxury villa for family',
                    'completed_at' => now()->subDays(30)
                ]);

                UserOrder::create([
                    'user_id' => $user->id,
                    'property_id' => 2, // Assuming property with pid=2 exists
                    'amount' => 220000.00,
                    'status' => 'pending',
                    'order_type' => 'purchase',
                    'notes' => 'Interested in modern apartment'
                ]);

                // Create sample user properties
                UserProperty::create([
                    'user_id' => $user->id,
                    'property_id' => 1,
                    'ownership_type' => 'owned',
                    'purchase_price' => 450000.00,
                    'purchase_date' => now()->subDays(30),
                    'ownership_notes' => 'Primary residence for family'
                ]);
            }

            if ($user->id == 2) { // Jane's orders
                UserOrder::create([
                    'user_id' => $user->id,
                    'property_id' => 3, // Assuming property with pid=3 exists
                    'amount' => 800000.00,
                    'status' => 'processing',
                    'order_type' => 'purchase',
                    'notes' => 'Commercial property investment'
                ]);

                UserProperty::create([
                    'user_id' => $user->id,
                    'property_id' => 2,
                    'ownership_type' => 'rented',
                    'monthly_rent' => 2500.00,
                    'lease_start_date' => now()->subMonths(6),
                    'lease_end_date' => now()->addMonths(6),
                    'ownership_notes' => 'Rental property for investment'
                ]);
            }
        }
    }
}
