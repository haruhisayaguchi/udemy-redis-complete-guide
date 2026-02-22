import { randomBytes } from "crypto";
import { client } from "./client";

export const withLock = async (key: string, cb: (signal: any) => any) => {
	// initialize a few variables to control retry behavior
	const retryDelayMs = 100;
	let retries = 20;

	// generate a random value to store at the lock key
	const token = randomBytes(6).toString("hex");
	// create the lock key
	const lockKey = `lock:${key}`;
	// set up a while loop to implement the retry behavior
	while (retries >= 0) {
		retries--;
		// try to do a set nx operation
		const acquired = await client.set(lockKey, token, { NX: true, PX: 2000 });
		if (!acquired) {
			// else brief pause (retryDelays) and then retry
			await pause(retryDelayMs);
			continue;
		}
		// if the set is successful, then run the callback
		try {
			const signal = { expired: false };
			setTimeout(() => { signal.expired = true }, 2000)
			const result = await cb(signal);
			return result;
		} finally {
			// unset the locked set
			await client.unlock(lockKey, token);
		}
	}
};

const buildClientProxy = () => { };

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
