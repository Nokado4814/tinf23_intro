import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException } from '@nestjs/common/exceptions';

describe('UserService unittest', () => {
	let testObject: UserService;
	let prismaServiceStub;

	beforeEach(async () => {
		prismaServiceStub = {
			user: { create: jest.fn() },
		} as unknown as jest.Mocked<PrismaService>;
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{ provide: PrismaService, useValue: prismaServiceStub },
			],
		}).compile();

		testObject = module.get<UserService>(UserService);
		prismaServiceStub.user.create.mockResolvedValue({
			id: '1234',
			name: 'name',
			passwordHash: 'hashedPassword',
		});
	});

	describe('createUser', () => {
		it('returns the id of the created user', async () => {
			prismaServiceStub.user.create.mockResolvedValue({
				id: '1234',
				name: 'name',
				passwordHash: 'hashedPassword',
			});

			await expect(
				testObject.create({ name: 'name', password: 'password' }),
			).resolves.toEqual('1234');
		});

		it('throws if the username is too short', async () => {
			await expect(
				testObject.create({ name: 'a', password: 'password' }),
			).rejects.toThrow(BadRequestException);
		});

		it('throws if the password is too short', async () => {
			await expect(
				testObject.create({ name: 'validName', password: '12' }),
			).rejects.toThrow(BadRequestException);
		});

		it('throws if the username is empty', async () => {
			await expect(
				testObject.create({ name: '', password: 'password' }),
			).rejects.toThrow(BadRequestException);
		});

		it('throws if the password is empty', async () => {
			await expect(
				testObject.create({ name: 'validName', password: '' }),
			).rejects.toThrow(BadRequestException);
		});

		it('throws if the username is null', async () => {
			await expect(
				testObject.create({ name: null as any, password: 'password' }),
			).rejects.toThrow(BadRequestException);
		});

		it('throws if the password is null', async () => {
			await expect(
				testObject.create({ name: 'validName', password: null as any }),
			).rejects.toThrow(BadRequestException);
		});
		it('passes the correct data to PrismaService', async () => {
			await testObject.create({ name: 'validName', password: 'validPassword' });
			expect(prismaServiceStub.user.create).toHaveBeenCalledTimes(1);
			expect(prismaServiceStub.user.create).toHaveBeenCalledWith({
				data: {
					name: 'validName',
					passwordHash: expect.any(String),
				},
			});
		});
		it('returns the created id', async () => {
			prismaServiceStub.user.create.mockResolvedValue({ id: '5678' });
			expect(
				await testObject.create({
					name: 'validName',
					password: 'validPassword',
				}),
			).toEqual('5678');
		});
	});
});
