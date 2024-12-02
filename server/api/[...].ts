import { joinURL } from 'ufo'

export default defineEventHandler(async (event) => {
  // const hostname = getRequestURL(event).hostname
  const proxyUrl = 'http://localhost:81/api'
  // switch (hostname) {
  //   case 'localhost':
  //   case '127.0.0.1':
  //   case 'eds.amurokb.ru':
  //     proxyUrl = 'http://localhost:81/api'
  //     break
  //   case '10.32.0.204':
  //     proxyUrl = 'http://10.32.0.204:81/api'
  //     break
  //   case '46.16.9.130':
  //     proxyUrl = 'http://localhost:81/api'
  //     break
  // }

  console.log('hostname', hostname)

  // check the path
  const path = event.path.replace(/^\/api\//, '') // /api/users -> users
  const target = joinURL(proxyUrl, path)

  console.log('target', target)

  // proxy it!
  return proxyRequest(event, target)
})
