import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus() {
    return {
      service: 'somnog-ems-gateway',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
