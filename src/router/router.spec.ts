import { describe, expect, it } from 'vitest'

import router from './index'

describe('application routes', () => {
  it('registers the five MVP screens', () => {
    const routePaths = router.getRoutes().map((route) => route.path).sort()

    expect(routePaths).toEqual(['/', '/companion', '/habits', '/journey', '/settings'])
  })
})
