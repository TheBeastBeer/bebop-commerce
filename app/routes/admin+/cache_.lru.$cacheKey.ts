import { json, type DataFunctionArgs } from '@remix-run/node'
import { lruCache } from '~/utils/cache.server.ts'
import { invariantResponse } from '~/utils/misc.tsx'
import { requireAdmin } from '~/utils/permissions.server.ts'

export async function loader({ request, params }: DataFunctionArgs) {
	await requireAdmin(request)

	const { cacheKey } = params
	invariantResponse(cacheKey, 'cacheKey is required')
	return json({
		cacheKey,
		value: lruCache.get(cacheKey),
	})
}
