import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { GenderService } from '../gender.service';
import {
  CreateGenderDto,
  PatchGenderDto,
  ReplaceGenderDto,
} from '../dto/gender.dto';
import { ResponseMessage } from '../../../common/decorators/response-message.decorator';
import { RESPONSE_MESSAGE } from '../../../common/constants/messages/response-messages.constant';

@Controller({
  path: 'genders',
  version: '1',
})
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  // get all genders
  @Get()
  @ResponseMessage(RESPONSE_MESSAGE.GENDER.FOUND_ALL)
  async getAll() {
    return await this.genderService.getAll();
  }

  // create gender
  @Post()
  @ResponseMessage(RESPONSE_MESSAGE.GENDER.CREATED)
  async createOne(@Body() createGenderDto: CreateGenderDto) {
    return this.genderService.createOne(createGenderDto);
  }

  // get one gender
  @Get('/:id')
  @ResponseMessage(RESPONSE_MESSAGE.GENDER.FOUND_ONE)
  async getOne(@Param('id') id: string) {
    return await this.genderService.getOne(id);
  }

  // patch one
  @Patch('/:id')
  @ResponseMessage(RESPONSE_MESSAGE.GENDER.PATCHED)
  async patchOne(
    @Param('id') id: string,
    @Body() patchGenderDto: PatchGenderDto,
  ) {
    return await this.genderService.patchOne(id, patchGenderDto);
  }

  // update/replace one
  @Put('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ResponseMessage(RESPONSE_MESSAGE.GENDER.UPDATED)
  async updateOne(
    @Param('id') id: string,
    @Body() replaceGenderDto: ReplaceGenderDto,
  ) {
    return await this.genderService.updateOne(id, replaceGenderDto);
  }

  // delete one
  @Delete('/:id')
  @ResponseMessage(RESPONSE_MESSAGE.GENDER.DELETED)
  async deleteOne(@Param('id') id: string) {
    return await this.genderService.deleteOne(id);
  }

  // restore one
  @Patch('/:id/restore')
  @ResponseMessage(RESPONSE_MESSAGE.GENDER.RESTORED)
  async restoreOne(@Param('id') id: string) {
    return await this.genderService.restoreOne(id);
  }

  // activate one
  @Patch('/:id/activate')
  @ResponseMessage(RESPONSE_MESSAGE.GENDER.ACTIVATED)
  async activateOne(@Param('id') id: string) {
    return await this.genderService.activateOne(id);
  }

  // de-activate one
  @Patch('/:id/de-activate')
  @ResponseMessage(RESPONSE_MESSAGE.GENDER.DE_ACTIVATED)
  async deactivateOne(@Param('id') id: string) {
    return await this.genderService.deactivateOne(id);
  }
}
