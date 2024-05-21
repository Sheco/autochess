import { getChannel } from '$lib/chat';
import type { Actions, RequestEvent } from './$types';

export const actions = {
	default: async (event:RequestEvent) => {
		let id = event.params.id
		let nickname = event.cookies.get('nickname')
		let data = await event.request.formData()
		let message = data.get('message')

		let channel = getChannel(id)
		channel.next(`${nickname}: ${message}`)
	},
} satisfies Actions;
