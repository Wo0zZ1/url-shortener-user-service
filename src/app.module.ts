import { join } from 'path'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'

import { UsersModule } from './users/users.module'

import { AppController } from './app.controller'

import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'

@Module({
	imports: [
		PrismaModule,
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
			playground: true,
			debug: true,
			buildSchemaOptions: {
				dateScalarMode: 'timestamp',
			},
		}),
		UsersModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
