import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/modules/users/dto/user.dto';

@ApiExtraModels(UserDto)
export class AuthResponseDto {
	@ApiProperty({
		description: 'User information',
		type: UserDto,
	})
	user: UserDto;

	@ApiProperty({
		description: 'Access token for authentication',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	token: string;
}
