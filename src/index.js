export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const response = await env.ASSETS.fetch(request)
    if (response.status === 404 && !url.pathname.startsWith('/assets/')) {
      return env.ASSETS.fetch(new Request(new URL('/', request.url)))
    }
    return response
  },
}
