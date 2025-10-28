import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'

import { PrismaModule } from 'src/prisma/prisma.module'
import { getLinkServiceConfig } from '@wo0zz1/url-shortener-shared'

import { UsersController } from './users.controller'
import { UsersEventHandler } from 'src/users/users.event-handler'

import { UsersService } from './users.service'
import { UsersResolver } from './users.resolver'

@Module({
	imports: [
		PrismaModule,
		ClientsModule.register([getLinkServiceConfig(process.env.RABBITMQ_URL!)]),
	],
	controllers: [UsersController, UsersEventHandler],
	providers: [UsersService, UsersResolver],
	exports: [UsersService],
})
export class UsersModule {}
