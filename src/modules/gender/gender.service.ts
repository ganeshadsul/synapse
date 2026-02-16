import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gender } from './entities/gender.entity';
import { Repository } from 'typeorm';
import { SeederConfigService } from '../seeder-config/seeder-config.service';
import gendersData from './data/genders.json';
import {
  CreateGenderDto,
  PatchGenderDto,
  ReplaceGenderDto,
} from './dto/gender.dto';
import { RESPONSE_MESSAGE } from '../../common/constants/messages/response-messages.constant';
import { IsActiveStatus } from '../../common/enums/is-active-status.enum';

@Injectable()
export class GenderService {
  private readonly logger = new Logger(GenderService.name);
  constructor(
    @InjectRepository(Gender)
    private readonly genderRepo: Repository<Gender>,
    private readonly seederConfigService: SeederConfigService,
  ) {}

  async onModuleInit() {
    const tableName = this.genderRepo.metadata.tableName;

    this.logger.log(`Checking seeder config for table: ${tableName}`);
    if (await this.seederConfigService.shouldSeed(tableName)) {
      // cleared the old entries
      await this.genderRepo.clear();

      // inserting new entries
      await this.genderRepo.insert(gendersData);

      // Mard isSeeded as true as data is inserted successfully
      await this.seederConfigService.setSeeded(tableName);
    }
  }

  async getAll() {
    const genders = await this.genderRepo.find();

    return { genders };
  }

  async createOne(createGenderDto: CreateGenderDto) {
    const { name, shortName } = createGenderDto;
    if (!name) {
      throw new BadRequestException('name is required.');
    }
    if (!shortName) {
      throw new BadRequestException('shortName is required.');
    }

    const gender = this.genderRepo.create({ name, shortName });
    return await this.genderRepo.save(gender);
  }

  async getOne(id: string) {
    const gender = await this.genderRepo.findOneBy({ id });
    if (!gender) throw new NotFoundException(RESPONSE_MESSAGE.GENDER.NOT_FOUND);

    return { gender };
  }

  async patchOne(id: string, patchGenderDto: PatchGenderDto) {
    const oldGender = await this.genderRepo.findOneBy({ id });
    if (!oldGender)
      throw new NotFoundException(RESPONSE_MESSAGE.GENDER.NOT_FOUND);

    Object.assign(oldGender, patchGenderDto);
    const gender = this.genderRepo.create(oldGender);
    const updatedGender = await this.genderRepo.save(gender);
    return { gender: updatedGender };
  }

  async updateOne(id: string, replaceGenderDto: ReplaceGenderDto) {
    const gender = await this.genderRepo.findOneBy({ id });
    if (!gender) throw new NotFoundException(RESPONSE_MESSAGE.GENDER.NOT_FOUND);

    Object.assign(gender, replaceGenderDto);

    const genderObj = this.genderRepo.create(gender);
    const updatedGender = await this.genderRepo.save(genderObj);
    return { gender: updatedGender };
  }

  async deleteOne(id: string) {
    const gender = await this.genderRepo.findOneBy({ id });
    if (!gender) throw new NotFoundException(RESPONSE_MESSAGE.GENDER.NOT_FOUND);

    await this.genderRepo.softDelete(id);
  }

  async restoreOne(id: string) {
    const result = await this.genderRepo.restore(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Deleted Gender with ID ${id} not found`);
    }
    const gender = await this.genderRepo.findOneBy({ id });

    return { gender };
  }

  async activateOne(id: string) {
    const gender = await this.genderRepo.findOneBy({ id });
    if (!gender) throw new NotFoundException(RESPONSE_MESSAGE.GENDER.NOT_FOUND);

    gender.isActive = IsActiveStatus.ACTIVE;
    const updatedGender = await this.genderRepo.save(gender);
    return { updatedGender };
  }

  async deactivateOne(id: string) {
    const gender = await this.genderRepo.findOneBy({ id });
    if (!gender) throw new NotFoundException(RESPONSE_MESSAGE.GENDER.NOT_FOUND);

    gender.isActive = IsActiveStatus.INACTIVE;

    const updatedGender = await this.genderRepo.save(gender);
    return { updatedGender };
  }
}
