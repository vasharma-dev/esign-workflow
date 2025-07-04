import { Injectable } from '@nestjs/common';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { UpdatePdfDto } from './dto/update-pdf.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pdf } from './entities/pdf.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PdfService {
  constructor(@InjectRepository(Pdf) private pdfRepository: Repository<Pdf>) {}

  async savePdf(fileName: string, filePath: string): Promise<Pdf> {
    try {
      const pdf = this.pdfRepository.create({ fileName, filePath });
      const savedPdf = await this.pdfRepository.save(pdf);
      return savedPdf;
    } catch (error) {
      console.error('Error saving PDF:', error);
      throw new Error('Failed to save PDF. Please try again.');
    }
  }
}
