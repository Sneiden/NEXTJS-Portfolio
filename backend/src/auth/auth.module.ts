import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    // Register JwtModule with the secret key and token expiration
    JwtModule.register({
      global: true,           // Makes JwtService available in all modules
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' }, // Token expires in 7 days
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}