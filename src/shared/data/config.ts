const isServer = typeof window === 'undefined'

export const config = {
  url: isServer
    ? (process.env.SUPABASE_API_URL as string)
    : (process.env.NEXT_PUBLIC_SUPABASE_URL as string),
  token: isServer
    ? (process.env.SUPABASE_ACCESS_TOKEN as string)
    : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string),
}

if (typeof config.url !== 'string')
  throw new Error('Unexpected [config.url] value. Got: ' + config.url)

if (typeof config.token !== 'string')
  throw new Error('Undexpected [config.token] value. Got: ' + config.token)

console.log('config', isServer, config)
