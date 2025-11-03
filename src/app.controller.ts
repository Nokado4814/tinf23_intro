import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('user') //hier in der Klammer wäre der Pfad, z.B. http://localhost:3000/user
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
}
