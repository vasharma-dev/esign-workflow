import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('start')
  startWorkflow(
    @Body()
    body: {
      pdfId: number;
      role1Email: string;
      role2Email: string;
      role3Email: string;
    },
  ) {
    return this.workflowService.startWorkflow(body);
  }

  @Post('next')
  nextRole(@Body() body: { workflowId: number; signerEmail: string }) {
    return this.workflowService.processNextRole(body);
  }
}
