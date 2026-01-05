#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up MediaPlanPro development environment...\n');

function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} exists`);
    return true;
  } else {
    console.log(`⚠️  ${description} not found`);
    return false;
  }
}

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

// Check environment file
if (!checkFile('.env', 'Environment file')) {
  console.log('📝 Creating .env file from template...');
  if (fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ .env file created\n');
  } else {
    console.error('❌ .env.example not found');
    process.exit(1);
  }
}

// Install dependencies
runCommand('npm install', 'Installing dependencies');

// Generate Prisma client
runCommand('npx prisma generate', 'Generating Prisma client');

// Create database and run migrations
runCommand('npx prisma db push', 'Setting up database');

// Seed database
runCommand('npx prisma db seed', 'Seeding database with sample data');

console.log('🎉 Development environment setup complete!\n');
console.log('🚀 To start the development server:');
console.log('   npm run dev\n');
console.log('🔧 To start the backend server:');
console.log('   npm run server:dev\n');
console.log('📊 To view the database:');
console.log('   npx prisma studio\n');
console.log('🌐 The application will be available at:');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend API: http://localhost:4000');
console.log('   GraphQL Playground: http://localhost:4000/api/graphql\n');
console.log('📧 Test users created:');
console.log('   Admin: admin@mediaplanpro.com / admin123');
console.log('   Editor: editor@mediaplanpro.com / editor123');
console.log('   User: user@mediaplanpro.com / user123\n');
