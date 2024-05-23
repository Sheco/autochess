import { ReplaySubject } from "rxjs";

let channels:{[key:string]:ReplaySubject<unknown>} = {}
export function getChannel(id:string) {
	if(!channels[id]) {
		channels[id] = new ReplaySubject(5)
	}
	return channels[id]
}

