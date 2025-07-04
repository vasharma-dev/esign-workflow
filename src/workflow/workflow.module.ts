import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workflow } from './entities/workflow.entity';
import { Pdf } from 'src/pdf/entities/pdf.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workflow, Pdf])],
  controllers: [WorkflowController],
  providers: [WorkflowService],
})
export class WorkflowModule {}
