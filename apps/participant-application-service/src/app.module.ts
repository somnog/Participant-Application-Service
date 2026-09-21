import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ParticipantsModule } from './participants/participants.module.js';
import { ApplicationsModule } from './applications/applications.module.js';

@Module({
  imports: [PrismaModule, ParticipantsModule, ApplicationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

