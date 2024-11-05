import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class LocalGuard extends AuthGuard('local') {}
