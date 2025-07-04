import { PartialType } from '@nestjs/mapped-types';
import { CreateEsignDto } from './create-esign.dto';

export class UpdateEsignDto extends PartialType(CreateEsignDto) {}
