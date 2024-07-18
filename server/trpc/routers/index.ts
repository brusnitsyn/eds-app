import { z } from 'zod'
import { useNow } from '@vueuse/core'
import { isFuture } from 'date-fns'
import { publicProcedure, router } from '../trpc'

export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string().nullish()
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
        time: new Date()
      }
    }),

  getUser: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.person.findUnique({
        where: {
          id: input.id
        },
        select: {
          id: true,
          fullName: true,
          inn: true,
          snils: true,
          jobTitle: true,
          dob: true,
          tel: true,
          sex: true,
          cert: {
            select: {
              serialNumber: true,
              validFrom: true,
              validTo: true,
            }
          }
        },
      })

      const dateNow = useNow().value
      const validTo = new Date(user.cert.validTo)

      if (isFuture(validTo)) {
        if ((dateNow.getFullYear() === validTo.getFullYear())
          && (validTo.getMonth() - dateNow.getMonth()) > 0
          && (validTo.getMonth() - dateNow.getMonth()) === 1) {
          user.cert.hasRequestNew = true
        }

        user.cert.hasValid = true
      }
      else {
        user.cert.hasValid = false
      }

      return {
        ...user
      }
    })
})

// export type definition of API
export type AppRouter = typeof appRouter
