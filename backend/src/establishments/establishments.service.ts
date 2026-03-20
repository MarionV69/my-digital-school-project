import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Establishment } from './entities/establishment.entity';
import { Repository } from 'typeorm';
import { EstablishmentType } from './enums/establishment-type.enum';
import { User } from '../users/entities/user.entity';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { SuppliersService } from 'src/suppliers/suppliers.service';

@Injectable()
export class EstablishmentsService {
  constructor(
    @InjectRepository(Establishment)
    private establishmentRepo: Repository<Establishment>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private suppliersService: SuppliersService,
  ) {}

  // Méthode pour créer un établissement
  async create(
    dto: CreateEstablishmentDto,
    currentUser: AuthenticatedUser,
  ): Promise<Establishment> {
    // Vérification: Le user a t-il déjà un établissement
    if (currentUser.establishmentId) {
      throw new BadRequestException(
        "Vous avez déjà créé un établissement. Un utilisateur ne peut gérer qu'un seul établissement.",
      );
    }
    // Créer l'établissement
    const establishment = this.establishmentRepo.create(dto);
    const savedEstablishment = await this.establishmentRepo.save(establishment);

    // Créer les supplierAttributes si l'Establishment est un 'SUPPLIER'
    if (savedEstablishment.type === EstablishmentType.SUPPLIER) {
      await this.suppliersService.create({ supplierId: savedEstablishment.id})
    }


    console.log('currentUser:', currentUser);
    console.log('savedEstablishment.id:', savedEstablishment.id);

    // Lier le user à cet établissement
    if (currentUser && currentUser.id) {
      console.log('Tentative de mise à jour du user ID:', currentUser.id);
      await this.userRepository.update(currentUser.id, {
        establishmentId: savedEstablishment.id,
      });

      console.log('User mis à jour');
    } else {
      console.log('❌ currentUser ou currentUser.userId manquant');
    }

    return savedEstablishment;
  }

  // Méthode pour récupérer tous les établissements
  async findAll(currentUser: AuthenticatedUser): Promise<Establishment[]> {
    // Si pas d'établissement
    if (!currentUser.establishmentType) {
      return await this.establishmentRepo.find();
    }

    // Calculer le type d'établissement opposé
    const oppositeType =
      currentUser.establishmentType === EstablishmentType.RESTAURANT
        ? EstablishmentType.SUPPLIER
        : EstablishmentType.RESTAURANT;

    // Filtrer par type
    return await this.establishmentRepo.find({
      where: { type: oppositeType },
    });
  }

  // Méthode pour récupérer un établissement par son ID
  async findOne(id: number): Promise<Establishment> {
    const establishment = await this.establishmentRepo.findOne({
      where: { id },
      relations: ['supplierAttributes'],
    });
    if (!establishment) {
      throw new NotFoundException(`Establishment with ID ${id} not found`);
    }
    return establishment;
  }

  // Méthode pour mettre à jour un établissement
  async update(
    id: number,
    dto: UpdateEstablishmentDto,
  ): Promise<Establishment> {
    const establishment = await this.establishmentRepo.findOneBy({ id });
    if (!establishment) {
      throw new NotFoundException(`Establishment with ID ${id} not found`);
    }
    Object.assign(establishment, dto);
    return await this.establishmentRepo.save(establishment);
  }

  // Méthode pour supprimer un établissement
  async remove(id: number): Promise<void> {
    const establishment = await this.establishmentRepo.findOneBy({ id });
    if (!establishment) {
      throw new NotFoundException(`Establishment with ID ${id} not found`);
    }
    await this.establishmentRepo.remove(establishment);
  }
}
