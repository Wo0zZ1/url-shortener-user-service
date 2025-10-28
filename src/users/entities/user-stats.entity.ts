import { ObjectType, Field, ID, Int } from '@nestjs/graphql'
import { type IUserStatsEntity } from '@wo0zz1/url-shortener-shared'

@ObjectType()
export class UserStatsEntity implements IUserStatsEntity {
	@Field(() => ID)
	id: number

	@Field(() => Int, { nullable: true })
	created_links: number | null
}
