import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/login
  // This is the endpoint the Next.js frontend calls when an admin logs in
  @Post('login')
  @HttpCode(HttpStatus.OK) // Return 200 instead of default 201 for POST
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}