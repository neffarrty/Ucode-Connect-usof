import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
async function main() {
	await prisma.post.deleteMany();

	await prisma.user.upsert({
		where: { email: 'kovtun.yehor.dev@gmail.com' },
		update: {},
		create: {
			email: 'kovtun.yehor.dev@gmail.com',
			login: 'neffarrty',
			password: await bcrypt.hash('1234', 10),
			role: 'ADMIN',
			avatar: '/img/avatar',
			posts: {
				create: {
					title: 'Check out Prisma with Next.js',
					content: 'https://www.prisma.io/nextjs',
				},
			},
		},
	});
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
