import { Controller, Inject, OnModuleInit } from '@nestjs/common'
import {
	ClientProxy,
	Ctx,
	EventPattern,
	Payload,
	RmqContext,
} from '@nestjs/microservices'
import {
	EEventPattern,
	EventService,
	LinkMigratedEvent,
	type UserMigratedFromGuestEvent,
	type UserAccountsMergedEvent,
} from '@wo0zz1/url-shortener-shared'
import { Channel, Message } from 'amqplib'

import { UsersService } from 'src/users/users.service'

@Controller()
export class UsersEventHandler implements OnModuleInit {
	constructor(
		private readonly usersService: UsersService,
		@Inject(EventService.LINK_SERVICE) private readonly linkServiceClient: ClientProxy,
	) {}

	async onModuleInit() {
		await Promise.all([this.linkServiceClient.connect()])
	}

	@EventPattern(EEventPattern.USER_MIGRATED_FROM_GUEST)
	handleUserMigratedFromGuest(@Payload() data: UserMigratedFromGuestEvent) {
		console.log('LinksService: Received guest migration event:', data)

		try {
			// TODO: create new userProfile and userStats

			// await this.usersService.updateById(data.targetUserId, {
			// 	type: 'User',
			// 	uuid: null,
			// 	userProfile: userProfile,
			// })
			console.log('Successfully migrated guest links')
		} catch (error) {
			console.error('Failed to migrate guest links:', error)
		}
	}

	@EventPattern(EEventPattern.USER_ACCOUNTS_MERGED)
	async handleUserAccountsMerged(
		@Payload() data: UserAccountsMergedEvent,
		@Ctx() context: RmqContext,
	) {
		console.log('UsersService: Received accounts merged event:', data)
		const channel = context.getChannelRef() as Channel
		const originalMsg = context.getMessage() as Message

		try {
			const fromEntity = await this.usersService.findById(data.sourceUserId)
			const toEntity = await this.usersService.findById(data.targetUserId)

			if (!fromEntity) throw new Error('fromEntity not found')
			if (!toEntity) throw new Error('toEntity not found')
			if (!toEntity.userProfile) throw new Error('toEntity.userProfile not found')

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

			const linksMigratedEvent: LinkMigratedEvent = {
				sourceUserId: data.sourceUserId,
				targetUserId: data.targetUserId,
				timestamp: new Date(),
			}
			this.linkServiceClient.emit(EEventPattern.LINK_MIGRATED, linksMigratedEvent)
			console.log(`Emitted ${EEventPattern.LINK_MIGRATED} with data:`, linksMigratedEvent)

			channel.ack(originalMsg)
		} catch (error) {
			channel.nack(originalMsg, false, true)
			console.error('Failed to merge accounts:', error)
		}
	}
}
