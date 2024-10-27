import {
	LikeType,
	PrismaClient,
	User,
	Post,
	Comment,
	Category,
	Like,
	Status,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const USERS_NUMBER = 50;
const POSTS_NUMBER = 150;
const COMMENTS_NUMBER = 200;
const LIKES_NUMBER = 1000;
const CATEGORIES_NUMBER = 25;

function getRandomCategories(
	categories: Category[],
	min: number,
	max: number,
): Category[] {
	const result = new Set(
		Array.from({ length: Math.floor(Math.random() * max) + min }).map(
			() => categories[Math.floor(Math.random() * categories.length)],
		),
	);

	return [...result];
}

async function cleanDatabase() {
	await prisma.postsCategories.deleteMany();
	await prisma.category.deleteMany();
	await prisma.like.deleteMany();
	await prisma.comment.deleteMany();
	await prisma.post.deleteMany();
	await prisma.user.deleteMany();
}

async function fakeUsers(): Promise<User[]> {
	await prisma.user.createMany({
		data: [
			{
				email: 'admin@example.com',
				login: 'admin',
				password: await bcrypt.hash('admin', 10),
				role: 'ADMIN',
				verified: true,
				avatar: '/avatar/default.webp',
			},
			{
				email: 'neffarrty@example.com',
				login: 'neffarrty',
				password: await bcrypt.hash('securepass', 10),
				verified: true,
				avatar: '/avatar/default.webp',
			},
		],
	});

	for (let i = 0; i < USERS_NUMBER; i++) {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();
		const email = faker.internet.email({ firstName, lastName });

		await prisma.user.create({
			data: {
				email,
				login: faker.internet.userName({ firstName, lastName }),
				fullname: `${firstName} ${lastName}`,
				password: await bcrypt.hash(faker.internet.password(), 10),
				avatar: '/avatar/default.webp',
			},
		});
	}

	return prisma.user.findMany();
}

async function fakeCategories(): Promise<Category[]> {
	for (let i = 0; i < CATEGORIES_NUMBER; i++) {
		await prisma.category.create({
			data: {
				title: faker.lorem.words({ min: 1, max: 2 }),
				description: faker.lorem.sentence(),
			},
		});
	}

	return prisma.category.findMany();
}

async function fakePosts(
	users: User[],
	categories: Category[],
): Promise<Post[]> {
	const statuses = [Status.ACTIVE, Status.ACTIVE, Status.INACTIVE];

	for (let i = 0; i < POSTS_NUMBER; i++) {
		const user = users[Math.floor(Math.random() * users.length)];

		const post = await prisma.post.create({
			data: {
				title: faker.word.words({ count: { min: 1, max: 5 } }),
				status: statuses[Math.floor(Math.random() * statuses.length)],
				content: faker.lorem.paragraphs({ min: 10, max: 25 }),
				authorId: user.id,
			},
		});

		for (const category of getRandomCategories(categories, 1, 5)) {
			await prisma.post.update({
				where: { id: post.id },
				data: {
					categories: {
						create: {
							category: {
								connect: {
									id: category.id,
								},
							},
						},
					},
				},
			});
		}
	}

	return prisma.post.findMany();
}

async function fakeComments(users: User[], posts: Post[]): Promise<Comment[]> {
	for (let i = 0; i < COMMENTS_NUMBER; i++) {
		let user = users[Math.floor(Math.random() * users.length)];
		let post = posts[Math.floor(Math.random() * posts.length)];

		while (user.id === post.authorId) {
			post = posts[Math.floor(Math.random() * posts.length)];
		}

		await prisma.comment.create({
			data: {
				content: faker.lorem.sentences(
					Math.floor(Math.random() * 5) + 1,
				),
				postId: post.id,
				authorId: user.id,
			},
		});
	}

	return prisma.comment.findMany();
}

async function fakeLikes(
	users: User[],
	posts: Post[],
	comments: Comment[],
): Promise<Like[]> {
	const types = [LikeType.DISLIKE, LikeType.LIKE];

	for (let i = 0; i < LIKES_NUMBER; i++) {
		const user = users[Math.floor(Math.random() * users.length)];

		if (faker.datatype.boolean()) {
			let post = posts[Math.floor(Math.random() * posts.length)];

			while (user.id === post.authorId) {
				post = posts[Math.floor(Math.random() * posts.length)];
			}

			await prisma.like.create({
				data: {
					postId: post.id,
					authorId: user.id,
					type: types[Math.floor(Math.random() * types.length)],
				},
			});
		} else {
			let comment = comments[Math.floor(Math.random() * comments.length)];

			while (user.id === comment.authorId) {
				comment = comments[Math.floor(Math.random() * comments.length)];
			}

			await prisma.like.create({
				data: {
					commentId: comment.id,
					authorId: user.id,
					type: types[Math.floor(Math.random() * types.length)],
				},
			});
		}
	}

	return prisma.like.findMany();
}

async function main() {
	await cleanDatabase();

	const users = await fakeUsers();
	const categories = await fakeCategories();
	const posts = await fakePosts(users, categories);
	const comments = await fakeComments(users, posts);
	await fakeLikes(users, posts, comments);
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
