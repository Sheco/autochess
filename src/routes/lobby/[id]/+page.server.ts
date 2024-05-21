import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const nickname = cookies.get('nickname');

	return {
		nickname
	};
};
