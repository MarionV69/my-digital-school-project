import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
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
