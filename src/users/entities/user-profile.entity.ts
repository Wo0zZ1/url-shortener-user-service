import { ObjectType, Field, ID } from '@nestjs/graphql'
import { type IUserProfileEntity } from '@wo0zz1/url-shortener-shared'

@ObjectType()
export class UserProfileEntity implements IUserProfileEntity {
	@Field(() => ID)
	id: number

	@Field(() => String, { nullable: true })
	email?: string | null

	@Field(() => String)
	userName: string

	@Field(() => String, { nullable: true })
	firstName?: string | null

	@Field(() => String, { nullable: true })
	lastName?: string | null
}
