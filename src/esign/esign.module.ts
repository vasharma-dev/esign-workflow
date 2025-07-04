import { Module } from '@nestjs/common';
import { EsignService } from './esign.service';
import { EsignController } from './esign.controller';

@Module({
  controllers: [EsignController],
  providers: [EsignService],
})
export class EsignModule {}
