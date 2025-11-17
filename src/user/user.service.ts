import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma.service';
import { hash } from 'node:crypto';

@Injectable()
export class UserService {
	private store: User[] = [];

	constructor(private readonly prisma: PrismaService) {}

	async create(createUserDto: CreateUserDto) {
		if (!createUserDto.name || createUserDto.name.length < 2) {
			throw new BadRequestException('Name must be at least 2 characters long');
		}
		if (!createUserDto.password) {
			throw new BadRequestException('Password is required');
		}
		const createdUser = await this.prisma.user.create({
			data: {
				name: createUserDto.name,
				passwordHash: this.hash(createUserDto.password),
			},
		});
		return createdUser.id;
	}

	async findAll(): Promise<User[]> {
		return await this.prisma.user.findMany({
			select: { id: true, name: true, passwordHash: false },
		});
	}

	async findOne(id: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: { id: true, name: true, passwordHash: false },
		});
		if (!user) {
			throw new BadRequestException(`User with ID ${id} not found`);
		}
		return user;
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		const user = await this.findOne(id);
		if (!user) {
			throw new BadRequestException(`User with ID ${id} not found`);
		}
		return await this.prisma.user.update({
			where: { id },
			data: {
				name: updateUserDto.name,
				...(updateUserDto.password && {
					passwordHash: this.hash(updateUserDto.password),
				}),
			},
			select: { id: true, name: true, passwordHash: false },
		});
	}

	async remove(id: string) {
		const user = await this.prisma.user.findUnique({ where: { id } });
		if (user === undefined) {
			throw new BadRequestException(`User with ID ${id} not found`);
		}
		return await this.prisma.user.delete({
			where: { id },
			select: { id: true, name: true, passwordHash: false }, //omit passwordHash würde hier auch gehen
		});
	}

	private hash(password: string): string {
		return hash('sha256', password);
	}
}
