import { DataSource } from 'typeorm';
import { Label } from '../../suppliers/entities/label.entity';
import { labelsData } from '../data/labels.data';

export async function seedLabels(dataSource: DataSource): Promise<Label[]> {
  console.log('📌 Seeding labels...');

  const labelRepo = dataSource.getRepository(Label);
  const labels: Label[] = [];

  for (const labelData of labelsData) {
    let label = await labelRepo.findOne({ where: { name: labelData.name } });

    if (!label) {
      label = await labelRepo.save(labelData);
      console.log(`  ✅ Label créé: ${label.name}`);
    } else {
      console.log(`  ℹ️  Label existe: ${label.name}`);
    }

    labels.push(label);
  }

  return labels;
}
