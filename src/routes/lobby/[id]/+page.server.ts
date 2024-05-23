import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const nickname = cookies.get('nickname');
	if(!nickname) {
		throw redirect(307, '/lobby')
	}

	return {
		nickname
	};
};

import type { Actions, RequestEvent } from './$types';
import { getChannel } from './connection';

export const actions = {
	send: async (event:RequestEvent) => {
		let id = event.params.id
		let nickname = event.cookies.get('nickname')
		let data = await event.request.formData()
		let message = data.get('message')
		console.log(`nm: ${nickname}: ${message}`)

		let channel = getChannel(id)
		channel.next(`${nickname}: ${message}`)
	},
} satisfies Actions;
