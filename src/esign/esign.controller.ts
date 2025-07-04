import { Controller, Post, Body } from '@nestjs/common';
import { EsignService } from './esign.service';

@Controller('esign')
export class EsignController {
  constructor(private readonly esignService: EsignService) {}

  @Post('submit')
  async submitDocument(@Body() body: { pdfPath: string; signerEmail: string }) {
    return await this.esignService.sendForSignature(
      body.pdfPath,
      body.signerEmail,
    );
  }
}
