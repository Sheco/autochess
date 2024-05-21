import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const nickname = cookies.get('nickname');

	return {
		nickname
	};
};
export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const nickname = formData.get('nickname');
		if(!nickname) 
			return fail(400, { error: 'Sobrenombre invalido' });
        const lobby = formData.get('lobby');
		if(!lobby) 
			return fail(400, { error: 'Nombre de lobby invalido' });


		cookies.set(
			'nickname', nickname as string,
			{
				path: '/',
				maxAge: 60 * 60 * 24 * 365,
				httpOnly: false, // <-- if you want to read it in the browser
			},
		);
		redirect(302, `/lobby/${lobby}`);
    },
}
