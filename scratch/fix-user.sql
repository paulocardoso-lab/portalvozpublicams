-- Check user
SELECT id, email, role FROM "User" WHERE email = 'paulofernandogarciacardoso@gmail.com';

-- Update user role if exists
UPDATE "User" SET role = 'SUPER_ADMIN' WHERE email = 'paulofernandogarciacardoso@gmail.com';
