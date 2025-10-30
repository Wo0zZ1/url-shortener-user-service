import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'

import { PrismaModule } from 'src/prisma/prisma.module'

import { UsersController } from './users.controller'
import { UsersEventHandler } from './users.event-handler'

import { UsersService } from './users.service'
import { UsersResolver } from './users.resolver'
import { getEventEmitterConfig } from '@wo0zz1/url-shortener-shared'

@Module({
	imports: [
		PrismaModule,
		ClientsModule.register([getEventEmitterConfig(process.env.RABBITMQ_URL!)]),
	],
	controllers: [UsersController, UsersEventHandler],
	providers: [UsersService, UsersResolver],
	exports: [UsersService],
})
export class UsersModule {}
