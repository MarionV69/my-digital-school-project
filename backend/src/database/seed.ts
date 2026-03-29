import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { seedLabels } from './seeders/labels.seeder';
import { seedCategories } from './seeders/productCategories.seeder';
import { seedRestaurants } from './seeders/restaurants.seeder';
import { seedSuppliers } from './seeders/suppliers.seeder';
import { seedConversations } from './seeders/conversations.seeder';
import { seedReviews } from './seeders/reviews.seeder';
import { restaurantsData } from './data/restaurants.data';
import { suppliersData } from './data/suppliers.data';
import { SeedModule } from './seed.module';

async function seed() {
  console.log('🌱 Starting seed...\n');

  const app = await NestFactory.createApplicationContext(SeedModule);
  const dataSource = app.get(DataSource);

  try {
    // Password hashing
    console.log('🔒 Hashing default password...');
    const DEFAULT_PASSWORD = 'Password123!';
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    console.log('✅ Password hashed\n');

    // Seed data in the correct order based on dependencies

    // 1. Labels
    const labels = await seedLabels(dataSource);
    console.log();

    // 2. Categories
    const categories = await seedCategories(dataSource);
    console.log();

    // 3. Restaurants
    await seedRestaurants(dataSource, hashedPassword);
    console.log();

    // 4. Suppliers
    await seedSuppliers(dataSource, hashedPassword, labels, categories);
    console.log();

    // 5. Conversations & Messages
    await seedConversations(dataSource);
    console.log();

    // 6. Reviews
    await seedReviews(dataSource);
    console.log();

    // Summary
    console.log('🎉 Seed completed!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 TEST CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log();
    console.log(`All users have the same password: ${DEFAULT_PASSWORD}`);
    console.log();
    console.log('🏭 SUPPLIERS:');

    suppliersData.forEach((s) => {
      console.log(`   • ${s.email}`);
    });
    console.log();
    console.log('🍽️  RESTAURANTS:');
    restaurantsData.forEach((r) => {
      console.log(`   • ${r.email}`);
    });
    console.log();
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
