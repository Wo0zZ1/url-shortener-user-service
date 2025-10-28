import { Args, Int, Query, Resolver } from '@nestjs/graphql'

import { UsersService } from './users.service'

import { UserEntity } from './entities/user.entity'

@Resolver()
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@Query(() => [UserEntity])
	users() {
		return this.usersService.findAll()
	}

	@Query(() => UserEntity, { nullable: true })
	userById(@Args('id', { type: () => Int }) id: number) {
		return this.usersService.findById(id)
	}
}
