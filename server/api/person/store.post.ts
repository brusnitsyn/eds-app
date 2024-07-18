import {formatRFC3339} from 'date-fns'
export default defineEventHandler(async (event) => {
    const prisma = event.context.prisma
    const rawData = await readBody(event)

    rawData.cert.create.validFrom = formatRFC3339(rawData.cert.create.validFrom)
    rawData.cert.create.validTo = formatRFC3339(rawData.cert.create.validTo)
    if (rawData.dob) rawData.dob = formatRFC3339(rawData.dob)

    /// TODO: Добавить DIVISION ID
    const fullName = `${rawData.lastName} ${rawData.firstName} ${rawData.surName}`
    const data = {...rawData, fullName }

    const person = await prisma.person.create({
        data: data,
        include: {
            cert: true
        }
    })

    return {
        person
    }
})
