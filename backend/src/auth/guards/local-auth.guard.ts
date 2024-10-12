import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
