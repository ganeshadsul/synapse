import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ResponseMessage } from '../../../common/decorators/response-message.decorator';
import { RoleService } from '../role.service';
import { CreateRoleDto, PatchRoleDto, ReplaceRoleDto } from '../dto/role.dto';
import { RESPONSE_MESSAGE } from '../../../common/constants/messages/response-messages.constant';

@Controller({
  path: 'roles',
  version: '1',
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.FOUND_ALL)
  async getAll() {
    return await this.roleService.getAll();
  }

  @Post()
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.CREATED)
  async createOne(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.createOne(createRoleDto);
  }

  @Get('/:id')
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.FOUND_ONE)
  async getOne(@Param('id') id: string) {
    return await this.roleService.getOne(id);
  }

  @Patch('/:id')
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.PATCHED)
  async patchOne(@Param('id') id: string, @Body() patchRoleDto: PatchRoleDto) {
    return await this.roleService.patchOne(id, patchRoleDto);
  }

  @Put('/:id')
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.UPDATED)
  async updateOne(
    @Param('id') id: string,
    @Body() replaceRoleDto: ReplaceRoleDto,
  ) {
    return await this.roleService.updateOne(id, replaceRoleDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.DELETED)
  async deleteOne(@Param('id') id: string) {
    return await this.roleService.deleteOne(id);
  }

  @Patch('/:id/restore')
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.RESTORED)
  async restoreOne(@Param('id') id: string) {
    return await this.roleService.restoreOne(id);
  }

  @Patch('/:id/de-activate')
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.DE_ACTIVATED)
  async deActivateOne(@Param('id') id: string) {
    return await this.roleService.deActivateOne(id);
  }

  @Patch('/:id/activate')
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.ACTIVATED)
  async activateOne(@Param('id') id: string) {
    return await this.roleService.activateOne(id);
  }
}
