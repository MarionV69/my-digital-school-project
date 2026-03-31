import {
  BadRequestException,
  ForbiddenException,
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
import { EstablishmentDetailsDto } from './dto/establishment-details.dto';
import { EstablishmentPreviewDto } from './dto/establishment-preview.dto';
import { DocumentsService } from 'src/documents/documents.service';

@Injectable()
export class EstablishmentsService {
  constructor(
    @InjectRepository(Establishment)
    private establishmentRepo: Repository<Establishment>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private documentsService: DocumentsService,
  ) {}

  // POST /establishments
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

    // Lier le user à cet établissement
    await this.userRepository.update(currentUser.id, {
      establishmentId: savedEstablishment.id,
    });

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

  // GET /establishments/:id
  async findOne(
    id: number,
    currentUser: AuthenticatedUser,
  ): Promise<EstablishmentDetailsDto> {

    const establishment = await this.establishmentRepo
      .createQueryBuilder('establishment')
      .leftJoinAndSelect('establishment.documents', 'documents')
      .leftJoinAndSelect('documents.file', 'file')
      .where('establishment.id = :id', { id })
      .getOne();

    if (!establishment) {
      throw new NotFoundException(`Establishment with ID ${id} not found`);
    }

    if (currentUser.establishmentId !== id) {
      throw new ForbiddenException(
        'You are not authorized to view this establishment.',)
    }

    return {
      siret: establishment.siret,
      legalName: establishment.legalName,
      tradeName: establishment.tradeName ?? undefined,
      vatNumber: establishment.vatNumber ?? undefined,
      email: establishment.email ?? undefined,
      phone: establishment.phone ?? undefined,
      address: establishment.address,
      city: establishment.city,
      postalCode: establishment.postalCode,
      country: establishment.country,
      description: establishment.description ?? undefined,
      website: establishment.website ?? undefined,
      instagram: establishment.instagram ?? undefined,
      facebook: establishment.facebook ?? undefined,
      ...this.documentsService.getAllDocumentUrls(establishment.documents ?? []),
    }
  }

  // GET /establishments/:id/preview
  async findPreview(id: number): Promise<EstablishmentPreviewDto> {

    const establishment = await this.establishmentRepo
      .createQueryBuilder('establishment')
      .leftJoinAndSelect('establishment.documents', 'documents')
      .leftJoinAndSelect('documents.file', 'file')
      .where('establishment.id = :id', { id })
      .getOne();


    if (!establishment) {
      throw new NotFoundException(`Establishment with ID ${id} not found`);
    } 

    // Extraction de l'URL du logo depuis les documents liés à l'établissement
    const { logoUrl } =  this.documentsService.getAllDocumentUrls(establishment.documents ?? []);

    return {
      legalName: establishment.legalName,
      city: establishment.city,
      website: establishment.website ?? undefined,
      logoUrl,
    }
  }

  // PATCH /establishments/:id
  async update(
    id: number,
    dto: UpdateEstablishmentDto,
    currentUser: AuthenticatedUser,
  ): Promise<Establishment> {

    const establishment = await this.establishmentRepo.findOneBy({ id });

    if (!establishment) {
      throw new NotFoundException(`Establishment with ID ${id} not found`);
    }

    if (establishment.id !== currentUser.establishmentId) {
      throw new ForbiddenException(
        'You are not authorized to update this establishment.',
      );
    }
    
    Object.assign(establishment, dto);
    return await this.establishmentRepo.save(establishment);
  }

  // DELETE /establishments/:id
  async remove(id: number, currentUser: AuthenticatedUser): Promise<void> {
    const establishment = await this.establishmentRepo.findOneBy({ id });
    if (!establishment) {
      throw new NotFoundException(`Establishment with ID ${id} not found`);
    }
    if (establishment.id !== currentUser.establishmentId) {
      throw new ForbiddenException(
        'You are not authorized to delete this establishment.',
      );
    }
    await this.establishmentRepo.remove(establishment);
  }
}
