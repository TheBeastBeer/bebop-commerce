import { type DataFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { z } from 'zod'
import { cache } from '~/utils/cache.server.ts'

export async function action({ request }: DataFunctionArgs) {
	const token = process.env.INTERNAL_COMMAND_TOKEN
	const isAuthorized =
		request.headers.get('Authorization') === `Bearer ${token}`
	if (!isAuthorized) {
		// rick roll them
		return redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
	}
	const { key, cacheValue } = z
		.object({ key: z.string(), cacheValue: z.unknown().optional() })
		.parse(await request.json())
	if (cacheValue === undefined) {
		await cache.delete(key)
	} else {
		// @ts-expect-error - we don't reliably know the type of cacheValue
		await cache.set(key, cacheValue)
	}
	return json({ success: true })
}

export async function updatePrimaryCacheValue({
	key,
	cacheValue,
}: {
	key: string
	cacheValue: any
}) {
	const token = process.env.INTERNAL_COMMAND_TOKEN
	return fetch(`/admin/cache/sqlite`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ key, cacheValue }),
	})
}
