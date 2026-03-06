import { CreateSupplierAttributesDto } from './dto/create-supplier-attributes.dto';
import { UpdateSupplierAttributesDto } from './dto/update-supplier-attributes.dto';
import { Repository } from 'typeorm';
import { SupplierAttributes } from './entities/supplier-attributes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ProductCategory } from './entities/product-category.entity';
import { Label } from './entities/label.entity';
import { LabelDto } from './dto/label.dto';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class SuppliersService {
  constructor(

    @InjectRepository(SupplierAttributes)
    private supplierRepository: Repository<SupplierAttributes>,

    @InjectRepository(Label)
    private labelRepository:
    Repository<Label>,

    @InjectRepository(ProductCategory)
    private categoryRepository:
    Repository<ProductCategory>

  ) {}

  create(createSupplierDto: CreateSupplierAttributesDto) {
    return `This action adds a new supplier ${JSON.stringify(createSupplierDto)}`;
  }

  findAll() {
    return `This action returns all suppliers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} supplier`;
  }

  update(id: number, updateSupplierDto: UpdateSupplierAttributesDto) {
    return `This action updates a #${id} supplier ${JSON.stringify(updateSupplierDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} supplier`;
  }

  // Récupérer tous les labels
  async findAllLabels(): Promise<LabelDto[]> {
  
    const labels = await this.labelRepository.find()

    return labels.map(label => ({
      id: label.id,
      name: label.name,
      description: label.description,

    }));
  }

  // Récupérer toutes les catégories d'aliment
  async findAllCategories(): Promise<CategoryDto[]> {

    const categories = await this.categoryRepository.find()

    return categories.map(category => ({
      id: category.id,
      name: category.name,

    }));
  }

}
