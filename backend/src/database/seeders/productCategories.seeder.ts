import { DataSource } from 'typeorm';
import { ProductCategory } from '../../suppliers/entities/product-category.entity';
import { categoriesData } from '../data/productCategories.data';

export async function seedCategories(
  dataSource: DataSource,
): Promise<ProductCategory[]> {
  console.log('📌 Seeding product categories...');

  const categoryRepo = dataSource.getRepository(ProductCategory);
  const categories: ProductCategory[] = [];

  for (const categoryData of categoriesData) {
    let category = await categoryRepo.findOne({
      where: { name: categoryData.name },
    });

    if (!category) {
      category = await categoryRepo.save(categoryData);
      console.log(`  ✅ Catégorie créée: ${category.name}`);
    } else {
      console.log(`  ℹ️  Catégorie existe: ${category.name}`);
    }

    categories.push(category);
  }

  return categories;
}
