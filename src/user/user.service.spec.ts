import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';

describe('UserService', () => {
	let prismaServiceStub: jest.Mocked<PrismaService>;
	let testObject: UserService;

	beforeEach(async () => {
		prismaServiceStub = {} as jest.Mocked<PrismaService>;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{ provide: 'PrismaService', useValue: prismaServiceStub },
			],
		}).compile();

		testObject = module.get<UserService>(UserService);
	});

	describe('create', () => {
		it('returns the id of the created user', () => {
			expect(
				await testObject.create(
					{ name: 'name', password: 'password' }.resolves.toEqual(,12345),
				),
			);
		});
		it('throws if the username is too short');

		it('throws if the username is empty');

		it('throws if the username is null');

		it('throws if the password is empty');

		it('throws if the password is null');

		
	});
});
