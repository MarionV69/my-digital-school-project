import { CreateSupplierAttributesDto } from './dto/create-supplier-attributes.dto';
import { UpdateSupplierAttributesDto } from './dto/update-supplier-attributes.dto';
import { In, Repository } from 'typeorm';
import { SupplierAttributes } from './entities/supplier-attributes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductCategory } from './entities/product-category.entity';
import { Label } from './entities/label.entity';
import { LabelDto } from './dto/label.dto';
import { CategoryDto } from './dto/category.dto';
import { FilterDto } from './dto/supplier-filter.dto';
import { SupplierListItemDto } from './dto/supplier-list-item.dto';
import { SupplierDetailDto } from './dto/supplier-details.dto';
import { Favorite } from 'src/favorites/entities/favorite.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { SupplierStatsDto } from './dto/supplier-stats.dto';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(SupplierAttributes)
    private supplierRepository: Repository<SupplierAttributes>,

    @InjectRepository(Label)
    private labelRepository: Repository<Label>,

    @InjectRepository(ProductCategory)
    private categoryRepository: Repository<ProductCategory>,

    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,

    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  // Créer les supplierAttributes
  async create(
    dto: CreateSupplierAttributesDto,
    currentUser: AuthenticatedUser,
  ): Promise<void> {
    const labels = dto.labels
      ? await this.labelRepository.findBy({ id: In(dto.labels) })
      : [];

    const productCategories = dto.productCategories
      ? await this.categoryRepository.findBy({ id: In(dto.productCategories) })
      : [];

    const supplier = this.supplierRepository.create({
      supplierId: currentUser.establishmentId ?? undefined,
      supplierType: dto.supplierType,
      priceRange: dto.priceRange,
      deliveryRadiusKm: dto.deliveryRadiusKm,
      deliveryInformation: dto.deliveryInformation,
      minimumOrderAmount: dto.minimumOrderAmount,
      isPremium: dto.isPremium,
      isVisible: dto.isVisible,
      labels: labels,
      productCategories: productCategories,
    });

    await this.supplierRepository.save(supplier);
  }

  // Récupérer tous les fournisseurs (avec ou sans filtres)
  async findAll(filters: FilterDto): Promise<SupplierListItemDto[]> {
    const query = this.supplierRepository
      .createQueryBuilder('supplier')
      .leftJoinAndSelect('supplier.labels', 'label')
      .leftJoinAndSelect('supplier.productCategories', 'category')
      .leftJoinAndSelect('supplier.supplier', 'establishment');

    // Filtres conditionnels
    if (filters.supplierType) {
      query.andWhere('supplier.supplierType = :supplierType', {
        supplierType: filters.supplierType,
      });
    }

    if (filters.city) {
      query.andWhere('establishment.city = :city', { city: filters.city });
    }

    if (filters.postalCode) {
      query.andWhere('establishment.postalCode LIKE :postalCode', {
        postalCode: `${filters.postalCode}%`,
      });
    }

    if (filters.search) {
      query.andWhere(
        '(establishment.tradeName LIKE :search OR establishment.legalName LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters.priceRange) {
      query.andWhere('supplier.priceRange = :priceRange', {
        priceRange: filters.priceRange,
      });
    }

    if (filters.isPremium) {
      query.andWhere('supplier.isPremium = :isPremium', {
        isPremium: filters.isPremium,
      });
    }

    if (filters.labels && filters.labels.length > 0) {
      query.andWhere('label.name IN (:...labels)', { labels: filters.labels });
    }

    if (filters.productCategories && filters.productCategories.length > 0) {
      query.andWhere('category.name IN (:...productCategories)', {
        productCategories: filters.productCategories,
      });
    }

    // Transformation des entités en ListItemDto
    const suppliers = await query.getMany();

    return suppliers.map((supplier) => ({
      id: supplier.supplierId,
      type: supplier.supplierType,
      name: supplier.supplier.legalName,
      postalCode: supplier.supplier.postalCode,
      city: supplier.supplier.city,
      priceRange: supplier.priceRange,
      isPremium: supplier.isPremium,
      labels: supplier.labels.map((label) => label.name),
      productCategories: supplier.productCategories.map(
        (ProductCategory) => ProductCategory.name,
      ),
    }));
  }

  // Récupérer un fournisseur grâce à son id

  async findOne(id: number): Promise<SupplierDetailDto> {
    const supplier = await this.supplierRepository
      .createQueryBuilder('supplier')
      .leftJoinAndSelect('supplier.supplier', 'establishment')
      .leftJoinAndSelect('supplier.labels', 'labels')
      .leftJoinAndSelect('supplier.productCategories', 'category')
      .leftJoinAndSelect('establishment.documents', 'documents')
      .where('supplier.supplierId = :id', { id })
      .getOne();

    if (!supplier) {
      throw new NotFoundException(`Supplier with id ${id} not found`);
    }

    // Transformation de l'entité en DetailsDto
    return {
      id: supplier.supplierId,
      name: supplier.supplier.legalName,
      city: supplier.supplier.city,
      priceRange: supplier.priceRange,
      labels: supplier.labels.map((label) => label.name),
      productCategories: supplier.productCategories.map(
        (ProductCategory) => ProductCategory.name,
      ),
      description: supplier.supplier.description,
      deliveryRadiusKm: supplier.deliveryRadiusKm,
      deliveryInformation: supplier.deliveryInformation,
      minimumOrderAmount: supplier.minimumOrderAmount,
      website: supplier.supplier.website,
      instagram: supplier.supplier.instagram,
      facebook: supplier.supplier.facebook,
      documents: supplier.supplier.documents,
    };
  }

  // Méthode pour récupérer les statistiques d'un fournisseur
  async findStats(id: number): Promise<SupplierStatsDto> {
    const supplierStats = await this.supplierRepository.findOneBy({
      supplierId: id,
    });

    if (!supplierStats) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    const favoriteCount = await this.favoriteRepository.count({
      where: { targetId: id },
    });

    const averageRating = await this.reviewRepository.average('rating', {
      reviewedSupplierId: id,
    });

    const reviewCount = await this.reviewRepository.count({
      where: { reviewedSupplierId: id },
    });

    return {
      favoriteCount,
      averageRating: averageRating ?? 0,
      reviewCount,
    };
  }

  // Méthode pour mettre à jour un fournisseur
  async update(
    id: number,
    dto: UpdateSupplierAttributesDto,
    currentUser: AuthenticatedUser,
  ): Promise<SupplierAttributes> {
    const supplierAttributes = await this.supplierRepository.findOne({
      where: { supplierId: id },
      relations: ['labels', 'productCategories'],
    });

    if (!supplierAttributes) {
      throw new NotFoundException(`SupplierAttributes with ID ${id} not found`);
    }

    if (supplierAttributes.supplierId !== currentUser.establishmentId) {
      throw new ForbiddenException(
        'Your are not authorized to update this supplier.',
      );
    }

    // Gérer les labels si présents
    if (dto.labels) {
      supplierAttributes.labels = dto.labels
        ? await this.labelRepository.findBy({ id: In(dto.labels) })
        : [];
    }

    // Gérer les productCategories si présents
    if (dto.productCategories) {
      supplierAttributes.productCategories = dto.productCategories
        ? await this.categoryRepository.findBy({
            id: In(dto.productCategories),
          })
        : [];
    }

    Object.assign(supplierAttributes, dto);
    return await this.supplierRepository.save(supplierAttributes);
  }

  // Méthode pour supprimer un fournisseur
  async remove(id: number, currentUser: AuthenticatedUser): Promise<void> {
    const supplierAttributes = await this.supplierRepository.findOneBy({
      supplierId: id,
    });

    if (!supplierAttributes) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    if (supplierAttributes.supplierId !== currentUser.establishmentId) {
      throw new ForbiddenException(
        'You are not authorized to remove this supplier.',
      );
    }

    await this.supplierRepository.remove(supplierAttributes);
  }

  // Récupérer tous les labels
  async findAllLabels(): Promise<LabelDto[]> {
    const labels = await this.labelRepository.find();

    return labels.map((label) => ({
      id: label.id,
      name: label.name,
      description: label.description,
    }));
  }

  // Récupérer toutes les catégories d'aliment
  async findAllCategories(): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.find();

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }
}
