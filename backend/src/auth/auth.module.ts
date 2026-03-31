import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    // Register JwtModule with the secret key and token expiration
    JwtModule.registerAsync({
      global: true,       // Makes JwtService available in all modules
      imports: [ConfigModule],
      // ConfigService is injected here — reads JWT_SECRET after .env is loaded
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },   // Token expires in 7 days
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule], // Export so other modules can use JwtService
})
export class AuthModule {}