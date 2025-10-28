import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto, UpdateUserDto, UserEntity } from '@wo0zz1/url-shortener-shared'

import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UsersService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(data: CreateUserDto): Promise<UserEntity> {
		const isGuest = data.type === 'Guest'
		if (!isGuest && !data.userProfile)
			throw new BadRequestException('userProfile is required for non-guest users')

		try {
			const result = await this.prismaService.baseUser.create({
				data: {
					type: data.type,
					uuid: data.uuid,
					userStats: { create: { ...data.userStats } },
					userProfile: !isGuest ? { create: { ...data.userProfile! } } : undefined,
				},
				include: {
					userProfile: true,
					userStats: true,
				},
			})

			return result
		} catch (error) {
			if (error.code === 'P2002')
				throw new BadRequestException('User with this UUID already exists')
			throw error
		}
	}

	async updateById(id: number, data: UpdateUserDto): Promise<UserEntity> {
		const isGuest = data.type === 'Guest'

		try {
			const result = await this.prismaService.baseUser.update({
				where: { id },
				data: {
					type: data.type,
					uuid: data.uuid,
					userProfile: !isGuest
						? {
								upsert: {
									where: { baseUserId: id },
									update: { userName: data.userProfile?.userName },
									create: { userName: data.userProfile?.userName ?? 'Аноним' },
								},
							}
						: undefined,
					userStats: { update: { data: data.userStats } },
				},
				include: {
					userProfile: true,
					userStats: true,
				},
			})

			return result
		} catch (error) {
			if (error.code === 'P2025') throw new NotFoundException('User not found')
			throw error
		}
	}

	async updateByUuid(uuid: string, data: UpdateUserDto): Promise<UserEntity> {
		const isGuest = data.type === 'Guest'

		try {
			const result = await this.prismaService.baseUser.update({
				where: { uuid },
				data: {
					type: data.type,
					uuid: data.uuid,
					userProfile: !isGuest
						? {
								upsert: {
									where: { baseUserId: (await this.findByUuid(uuid))?.id },
									update: { userName: data.userProfile?.userName },
									create: { userName: data.userProfile?.userName ?? 'Аноним' },
								},
							}
						: undefined,
					userStats: { update: { data: data.userStats } },
				},
				include: {
					userProfile: true,
					userStats: true,
				},
			})

			return result
		} catch (error) {
			if (error.code === 'P2025') throw new NotFoundException('User not found')
			throw error
		}
	}

	async findAll(): Promise<UserEntity[]> {
		const users = await this.prismaService.baseUser.findMany({
			include: {
				userProfile: true,
				userStats: true,
			},
		})

		return users
	}

	async findById(id: number): Promise<UserEntity | null> {
		const user = await this.prismaService.baseUser.findUnique({
			where: { id },
			include: {
				userProfile: true,
				userStats: true,
			},
		})

		return user
	}

	async findByUuid(uuid: string): Promise<UserEntity | null> {
		const user = await this.prismaService.baseUser.findUnique({
			where: { uuid },
			include: {
				userProfile: true,
				userStats: true,
			},
		})

		return user
	}

	async deleteById(id: number): Promise<UserEntity> {
		try {
			const user = await this.prismaService.baseUser.delete({
				where: { id },
				include: {
					userProfile: true,
					userStats: true,
				},
			})

			return user
		} catch (error) {
			if (error.code === 'P2025') throw new NotFoundException('User not found')
			throw error
		}
	}

	async deleteByUuid(uuid: string): Promise<UserEntity> {
		try {
			const user = await this.prismaService.baseUser.delete({
				where: { uuid },
				include: {
					userProfile: true,
					userStats: true,
				},
			})

			return user
		} catch (error) {
			if (error.code === 'P2025') throw new NotFoundException('User not found')
			throw error
		}
	}
}
