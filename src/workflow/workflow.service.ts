import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workflow } from './entities/workflow.entity';
import { Repository } from 'typeorm';
import { Pdf } from 'src/pdf/entities/pdf.entity';

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(Workflow)
    private workflowRepository: Repository<Workflow>,
    @InjectRepository(Pdf)
    private pdfRepository: Repository<Pdf>,
  ) {}

  async startWorkflow(body: any) {
    const pdf = await this.pdfRepository.findOne({ where: { id: body.id } });

    if (!pdf) {
      throw new HttpException('PDF not found', HttpStatus.NOT_FOUND);
    }

    const workflow = this.workflowRepository.create({
      pdf,
      role1Email: body.role1Email,
      role2Email: body.role2Email,
      role3Email: body.role3Email,
    });

    return await this.workflowRepository.save(workflow);
  }

  async processNextRole(body: any) {
    const workflow = await this.workflowRepository.findOne({
      where: { id: body.workflowId },
      relations: ['pdf'],
    });

    if (workflow) {
      if (workflow.currentRole === 1) {
        workflow.currentRole = 2;
      } else if (workflow.currentRole === 2) {
        workflow.currentRole = 3;
      } else {
        workflow.status = 'Completed';
        workflow.pdf.status = 'completed';
        await this.pdfRepository.save(workflow.pdf);
      }

      return await this.workflowRepository.save(workflow);
    }
  }
}
