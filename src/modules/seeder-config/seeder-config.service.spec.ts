import { Test, TestingModule } from '@nestjs/testing';
import { SeederConfigService } from './seeder-config.service';

describe('SeederConfigService', () => {
  let service: SeederConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeederConfigService],
    }).compile();

    service = module.get<SeederConfigService>(SeederConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
