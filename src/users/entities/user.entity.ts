import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql'

import { IUserEntity, UserType } from '@wo0zz1/url-shortener-shared'

import { UserProfileEntity } from './user-profile.entity'
import { UserStatsEntity } from './user-stats.entity'

registerEnumType(UserType, { name: 'UserType' })

@ObjectType()
export class UserEntity implements IUserEntity {
	@Field(() => ID)
	id: number

	@Field(() => String, { nullable: true })
	uuid: string | null

	@Field(() => UserType)
	type: UserType

	@Field(() => Date)
	createdAt: Date

	@Field(() => UserProfileEntity, { nullable: true })
	userProfile: UserProfileEntity | null

	@Field(() => UserStatsEntity, { nullable: true })
	userStats: UserStatsEntity | null
}
