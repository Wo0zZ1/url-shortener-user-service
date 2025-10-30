import { Controller } from '@nestjs/common'
import { Channel, Message } from 'amqplib'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'

import {
	EEventPattern,
	type UserAccountsMergedEvent,
	type UserDeletedEvent,
} from '@wo0zz1/url-shortener-shared'

import { UsersService } from 'src/users/users.service'

@Controller()
export class UsersEventHandler {
	constructor(private readonly usersService: UsersService) {}

	ack(context: RmqContext) {
		const channel = context.getChannelRef() as Channel
		const originalMsg = context.getMessage() as Message
		channel.ack(originalMsg)
	}

	nack(context: RmqContext) {
		const channel = context.getChannelRef() as Channel
		const originalMsg = context.getMessage() as Message
		channel.nack(originalMsg, false, true)
	}

	@EventPattern(EEventPattern.USER_DELETED)
	async handleUserDeleted(@Payload() data: UserDeletedEvent, @Ctx() context: RmqContext) {
		console.log('Received user deleted event:', data)

		const deletedUser = await this.usersService.deleteById(data.userId)

		if (!deletedUser) {
			console.error('Failed to delete user with ID:', data.userId)
			return this.nack(context)
		}

		console.log('Successfully deleted user with ID:', data.userId)
		return this.ack(context)
	}

	@EventPattern(EEventPattern.USER_ACCOUNTS_MERGED)
	async handleUserAccountsMerged(
		@Payload() data: UserAccountsMergedEvent,
		@Ctx() context: RmqContext,
	) {
		console.log('UsersService: Received accounts merged event:', data)

		try {
			const fromEntity = await this.usersService.findById(data.sourceUserId)
			const toEntity = await this.usersService.findById(data.targetUserId)

			if (!fromEntity) return this.nack(context)
			if (!toEntity) return this.nack(context)
			if (!toEntity.userProfile) return this.nack(context)

			const fromProfile = fromEntity.userProfile
			const toProfile = toEntity.userProfile

			const fromStats = fromEntity.userStats
			const toStats = toEntity.userStats

			const mergedStats = {
				created_links: (toStats?.created_links || 0) + (fromStats?.created_links || 0),
			}

			const mergedProfile = {
				email: toProfile?.email ?? fromProfile?.email,
				firstName: toProfile?.firstName ?? fromProfile?.firstName,
				lastName: toProfile?.lastName ?? fromProfile?.lastName,
				userName: toProfile.userName,
			}

			await this.usersService.updateById(toEntity.id, {
				userStats: mergedStats,
				userProfile: mergedProfile,
			})

			await this.usersService.deleteById(fromEntity.id)

			return this.ack(context)
		} catch (error) {
			console.error('Failed to merge accounts:', error)
			return this.nack(context)
		}
	}
}
