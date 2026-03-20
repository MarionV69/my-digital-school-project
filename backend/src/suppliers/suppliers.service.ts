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
import { FilterDto } from './dto/supplier-filter.dto';
import { ListItemDto } from './dto/supplier-list-item.dto';

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

  // Récupérer tous les fournisseurs (avec ou sans filtres)
  async findAll(filters: FilterDto): Promise<ListItemDto[]> {

    const query = this.supplierRepository
      .createQueryBuilder('supplier')
      .leftJoinAndSelect('supplier.labels', 'label')
      .leftJoinAndSelect('supplier.productCategories', 'category')
      .leftJoinAndSelect('supplier.supplier', 'establishment')

    // Filtres conditionnels
    if (filters.city) {
      query.andWhere('supplier.city = :city', {city: filters.city});
    }

    if (filters.search) {
      query.andWhere('supplier.name LIKE :search', { search: `%${filters.search}%` });
    }

    if (filters.priceRange) {
      query.andWhere('supplier.priceRange = :priceRange', { priceRange: filters.priceRange});
    }

    if (filters.labels && filters.labels.length > 0) {
      query.andWhere('label.name IN (:...labels)', { labels: filters.labels});
    }

    if (filters.productCategories && filters.productCategories.length > 0) {
      query.andWhere('category.name IN (:...productCategories)', { productCategories: filters.productCategories});
    }
  
    // Transformation des entités en ListItemDto
    const suppliers = await query.getMany();

    return suppliers.map(supplier => ({
      id: supplier.supplierId,
      name: supplier.supplier.legalName,
      city: supplier.supplier.city,
      priceRange: supplier.priceRange,
      labels: supplier.labels.map(label => label.name),
      productCategories: supplier.productCategories.map(ProductCategory => ProductCategory.name),
    }))
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
