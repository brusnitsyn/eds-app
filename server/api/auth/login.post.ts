import { createError, eventHandler, readBody } from 'h3'
import { z } from 'zod'
import { sign } from 'jsonwebtoken'

const refreshTokens: Record<number, Record<string, any>> = {}
export const SECRET = 'dummy'

export default eventHandler(async (event) => {
    const result = z.object({ login: z.string().min(1), password: z.string().min(1) }).safeParse(await readBody(event))
    if (!result.success) {
        throw createError({ statusCode: 403, statusMessage: 'Unauthorized, hint: try `hunter2` as password' })
    }

    const expiresIn = 15
    const refreshToken = Math.floor(Math.random() * (1000000000000000 - 1 + 1)) + 1
    const { login } = result.data
    const user = await event.context.prisma.user.findUnique({
        where: {
            login
        },
    })

    const accessToken = sign({ ...user, scope: [user.role] }, SECRET, { expiresIn })
    refreshTokens[refreshToken] = {
        accessToken,
        user
    }

    return {
        token: {
            accessToken,
            refreshToken
        }
    }
})
