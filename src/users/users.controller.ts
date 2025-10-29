import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	Delete,
	ParseIntPipe,
	NotFoundException,
	Patch,
	UseGuards,
} from '@nestjs/common'

import {
	CreateUserDto,
	GatewaySecretGuard,
	UpdateUserDto,
	CreateUserResponse,
	GetAllUsersResponse,
	GetUserByIdResponse,
	GetUserByUuidResponse,
	UpdateUserByIdResponse,
	UpdateUserByUuidResponse,
	DeleteUserByIdResponse,
	DeleteUserByUuidResponse,
} from '@wo0zz1/url-shortener-shared'

import { UsersService } from './users.service'

@Controller('users')
@UseGuards(GatewaySecretGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async getUsers(): Promise<GetAllUsersResponse> {
		const users = await this.usersService.findAll()
		return users
	}

	@Post()
	async createUser(@Body() createUserDto: CreateUserDto): Promise<CreateUserResponse> {
		return this.usersService.create(createUserDto)
	}

	@Get('id/:id')
	async getUserById(@Param('id', ParseIntPipe) id: number): Promise<GetUserByIdResponse> {
		const user = await this.usersService.findById(id)
		if (!user) throw new NotFoundException('User not found')
		return user
	}

	@Get('uuid/:uuid')
	async getUserByUUID(@Param('uuid') uuid: string): Promise<GetUserByUuidResponse> {
		const user = await this.usersService.findByUuid(uuid)
		if (!user) throw new NotFoundException('User not found')
		return user
	}

	@Patch('id/:id')
	async updateUser(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<UpdateUserByIdResponse> {
		return await this.usersService.updateById(id, updateUserDto)
	}

	@Patch('uuid/:uuid')
	async updateUserByUuid(
		@Param('uuid') uuid: string,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<UpdateUserByUuidResponse> {
		return await this.usersService.updateByUuid(uuid, updateUserDto)
	}

	@Delete('id/:id')
	async deleteUser(
		@Param('id', ParseIntPipe) id: number,
	): Promise<DeleteUserByIdResponse> {
		return await this.usersService.deleteById(id)
	}

	@Delete('uuid/:uuid')
	async deleteUserByUuid(@Param('uuid') uuid: string): Promise<DeleteUserByUuidResponse> {
		return await this.usersService.deleteByUuid(uuid)
	}
}
