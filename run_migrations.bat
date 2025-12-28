@echo off
echo Running Laravel Migrations...
cd realstate-backend

echo.
echo 1. Running migrations...
php artisan migrate

echo.
echo 2. Checking if admin_notes column exists...
php artisan tinker --execute="echo 'Checking payments table structure:'; \Schema::getColumnListing('payments');"

echo.
echo 3. Creating sample data if needed...
php artisan db:seed --class=UserProfileSeeder

echo.
echo 4. Testing API endpoint...
curl -X GET http://localhost:8000/api/test

echo.
echo Migration completed!
pause
