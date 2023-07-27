import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto.toDomain());
  }

  @Get('confirm-account')
  async confirmAccount(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException('Confirmation code is required');
    }

    await this.userService.confirmAccount(code);

    return {
      message: 'Account confirmed successfully',
    };
  }

  @Post('update-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.userService.resetPassword(resetPasswordDto.password, resetPasswordDto.confirmationCode);

    return {
      message: 'Password reset successfully',
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/:id/send-confirmation-email')
  async sendConfirmationEmail(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findById(id);
    await this.userService.sendUserConfirmationEmail(user);
  }
}
