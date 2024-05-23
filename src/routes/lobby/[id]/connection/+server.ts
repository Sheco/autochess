import type { RequestHandler } from './$types';
import { produce } from 'sveltekit-sse'
import { Subscription } from 'rxjs'
import { getChannel } from '$lib/chat'

export let POST:RequestHandler = function (ev) {
	let suscription:Subscription 
	let channel = getChannel(ev.params.id)
	let nickname = ev.cookies.get('nickname')
	return produce(function start({ emit }) {
		channel.next(`${nickname} ha llegado`)
		suscription = channel.subscribe((value) => {
			const {error} = emit('message', value as string)
			if(error) {
				console.log('error', error)
				return
			}
		})
	},
	{
		stop() {
			channel.next(`${nickname} se ha ido`)
			suscription.unsubscribe()
		},
	})
}

