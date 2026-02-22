import { CreateSupplierDto } from './dto/create-supplier-attributes.dto';
import { UpdateSupplierDto } from './dto/update-supplier-attributes.dto';
import { Repository } from 'typeorm';
import { SupplierAttributes } from './entities/supplier-attributes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(SupplierAttributes)
    private supplierRepository: Repository<SupplierAttributes>,
  ) {}
  create(createSupplierDto: CreateSupplierDto) {
    return `This action adds a new supplier ${JSON.stringify(createSupplierDto)}`;
  }

  findAll() {
    return `This action returns all suppliers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} supplier`;
  }

  update(id: number, updateSupplierDto: UpdateSupplierDto) {
    return `This action updates a #${id} supplier ${JSON.stringify(updateSupplierDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} supplier`;
  }
}
