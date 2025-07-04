import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfModule } from './pdf/pdf.module';
import { WorkflowModule } from './workflow/workflow.module';
import { EsignModule } from './esign/esign.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Vansh@2510',
      database: 'esign_workflow',
      autoLoadEntities: true,
      logging: true,
      synchronize: true,
    }),
    PdfModule,
    WorkflowModule,
    EsignModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
