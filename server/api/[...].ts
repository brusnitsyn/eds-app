import { joinURL } from 'ufo'
import { getToken } from '#auth'
export default defineEventHandler(async (event) => {
 // Get the runtimeconfig proxy url
 const proxyUrl = useRuntimeConfig().public.proxyApiUrl
 // check the path
 const path = event.path.replace(/^\/api\//, '') // /api/users -> users
 const target = joinURL(proxyUrl, path)
 
 const token = await getToken({ event })
 
 console.log(token)

 // proxy it!
 return proxyRequest(event, target, {

 })
})
