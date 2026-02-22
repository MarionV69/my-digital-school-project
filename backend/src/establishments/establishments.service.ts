import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Establishment } from './entities/establishment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstablishmentsService {
  constructor(
    @InjectRepository(Establishment)
    private establishmentRepo: Repository<Establishment>,
  ) {}


  // Méthode pour créer un établissement
  async create(dto: CreateEstablishmentDto): Promise<Establishment> {
    const establishment = this.establishmentRepo.create(dto);
    return await this.establishmentRepo.save(establishment);
  }

  // Méthode pour récupérer tous les établissements
  async findAll(): Promise<Establishment[]> {
    return await this.establishmentRepo.find();
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
  async update(id: number, dto: UpdateEstablishmentDto): Promise<Establishment> {
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
