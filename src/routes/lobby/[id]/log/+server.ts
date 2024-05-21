import type { RequestEvent, RequestHandler } from './$types';
import { produce } from 'sveltekit-sse'
import { Subscription } from 'rxjs'
import { getChannel } from '$lib/chat'

export function POST(ev:RequestEvent): RequestHandler {
	let suscription:Subscription 
	return produce(function start({ emit }) {
		let channel = getChannel(ev.params.id)
		suscription = channel.subscribe((value) => {
			console.log('message', value)
			const {error} = emit('message', value as string)
			if(error) {
				console.log('error', error)
				return
			}
		})
	},
	{
		stop() {
			suscription.unsubscribe()
		},
	})
}
