import { CreateSupplierAttributesDto } from './dto/create-supplier-attributes.dto';
import { UpdateSupplierAttributesDto } from './dto/update-supplier-attributes.dto';
import { Repository } from 'typeorm';
import { SupplierAttributes } from './entities/supplier-attributes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductCategory } from './entities/product-category.entity';
import { Label } from './entities/label.entity';
import { LabelDto } from './dto/label.dto';
import { CategoryDto } from './dto/category.dto';
import { FilterDto } from './dto/supplier-filter.dto';
import { SupplierListItemDto} from './dto/supplier-list-item.dto';
import { SupplierDetailDto } from './dto/supplier-details.dto';

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

  // Créer les supplierAttributes directement après la création d'un Establishement de type 'SUPPLIER'
  async create(createSupplierDto: CreateSupplierAttributesDto): Promise<void> {
    const supplier = this.supplierRepository.create({
      supplierId: createSupplierDto.supplierId
    })
    
    await this.supplierRepository.save(supplier)
  }

  // Récupérer tous les fournisseurs (avec ou sans filtres)
  async findAll(filters: FilterDto): Promise<SupplierListItemDto[]> {

    const query = this.supplierRepository
      .createQueryBuilder('supplier')
      .leftJoinAndSelect('supplier.labels', 'label')
      .leftJoinAndSelect('supplier.productCategories', 'category')
      .leftJoinAndSelect('supplier.supplier', 'establishment')

    // Filtres conditionnels
    if (filters.city) {
      query.andWhere('establishment.city = :city', {city: filters.city});
    }

    if (filters.search) {
      query.andWhere('establishment.name LIKE :search', { search: `%${filters.search}%` });
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

  // Récupérer un fournisseur grâce à son id

  async findOne(id: number): Promise<SupplierDetailDto> {
    const supplier = await this.supplierRepository
      .createQueryBuilder('supplier')
      .leftJoinAndSelect('supplier.supplier', 'establishment')
      .leftJoinAndSelect('supplier.labels', 'labels')
      .leftJoinAndSelect('supplier.productCategories', 'category')
      .leftJoinAndSelect('establishment.documents', 'documents')
      .where('supplier.supplierId = :id', {id})
      .getOne();

    if(!supplier) {
      throw new NotFoundException(`Supplier with id ${id} not found`)
    }

    // Transformation de l'entité en DetailsDto
    return {
      id: supplier.supplierId,
      name: supplier.supplier.legalName,
      city: supplier.supplier.city,
      priceRange: supplier.priceRange,
      labels: supplier.labels.map(label => label.name),
      productCategories: supplier.productCategories.map(ProductCategory => ProductCategory.name),
      description: supplier.supplier.description,
      deliveryRadiusKm: supplier.deliveryRadiusKm,
      deliveryInformation: supplier.deliveryInformation,
      minimumOrderAmount: supplier.minimumOrderAmount,
      website: supplier.supplier.website,
      instagram: supplier.supplier.instagram,
      facebook: supplier.supplier.facebook,
      documents: supplier.supplier.documents
    }
  }


  // Méthode pour mettre à jour un fournisseur
  async update(
    id: number, 
    dto: UpdateSupplierAttributesDto): Promise<SupplierAttributes> {
      const supplierAttributes = await this.supplierRepository.findOneBy({ supplierId: id });
      if(!supplierAttributes) {
        throw new NotFoundException(`SupplierAttributes with ID ${id} not found`);
      }
      Object.assign(supplierAttributes, dto);
      return await this.supplierRepository.save(supplierAttributes)
  }

  // Méthode pour supprimer un fournisseur
  async remove(id: number): Promise<void> {
    const supplierAttributes = await this.supplierRepository.findOneBy({ supplierId: id});
    if (!supplierAttributes) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    await this.supplierRepository.remove(supplierAttributes);
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
