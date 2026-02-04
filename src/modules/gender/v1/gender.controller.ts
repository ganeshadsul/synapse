import { Controller, Get } from '@nestjs/common';

@Controller({
  path: 'genders',
  version: '1',
})
export class GenderController {
  @Get()
  getAll() {
    return {
      success: 'success',
      message: 'Genders list found',
    };
  }
}
