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
  UseGuards,
} from '@nestjs/common';
import { ResponseMessage } from '../../../common/decorators/response-message.decorator';
import { RoleService } from '../role.service';
import { CreateRoleDto, PatchRoleDto, ReplaceRoleDto } from '../dto/role.dto';
import { RESPONSE_MESSAGE } from '../../../common/constants/messages/response-messages.constant';
import { RequirePermissions } from '../../../common/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../../common/guards/permissions.guard';

@Controller({
  path: 'roles',
  version: '1',
})
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @RequirePermissions('read:role')
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.FOUND_ALL)
  async getAll() {
    return await this.roleService.getAll();
  }

  @Post()
  @RequirePermissions('create:role')
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.CREATED)
  async createOne(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.createOne(createRoleDto);
  }

  @Get('/:id')
  @RequirePermissions('read:role')
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.FOUND_ONE)
  async getOne(@Param('id') id: string) {
    return await this.roleService.getOne(id);
  }

  @Patch('/:id')
  @RequirePermissions('update:role')
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.PATCHED)
  async patchOne(@Param('id') id: string, @Body() patchRoleDto: PatchRoleDto) {
    return await this.roleService.patchOne(id, patchRoleDto);
  }

  @Put('/:id')
  @RequirePermissions('update:role')
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.UPDATED)
  async updateOne(
    @Param('id') id: string,
    @Body() replaceRoleDto: ReplaceRoleDto,
  ) {
    return await this.roleService.updateOne(id, replaceRoleDto);
  }

  @Delete('/:id')
  @RequirePermissions('delete:role')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.DELETED)
  async deleteOne(@Param('id') id: string) {
    return await this.roleService.deleteOne(id);
  }

  @Patch('/:id/restore')
  @RequirePermissions('update:role')
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.RESTORED)
  async restoreOne(@Param('id') id: string) {
    return await this.roleService.restoreOne(id);
  }

  @Patch('/:id/de-activate')
  @RequirePermissions('update:role')
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.DE_ACTIVATED)
  async deActivateOne(@Param('id') id: string) {
    return await this.roleService.deActivateOne(id);
  }

  @Patch('/:id/activate')
  @RequirePermissions('update:role')
  @ResponseMessage(RESPONSE_MESSAGE.ROLE.ACTIVATED)
  async activateOne(@Param('id') id: string) {
    return await this.roleService.activateOne(id);
  }
}
