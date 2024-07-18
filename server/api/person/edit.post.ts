export default defineEventHandler(async (event) => {
    const prisma = event.context.prisma
    const rawData = await readBody(event)

    console.log(rawData)

    const fullName = `${rawData.lastName} ${rawData.firstName} ${rawData.surName}`
    const data = {...rawData, fullName }

    const certData = {
        update: {
            where: {
                id: data.cert.id
            },
            data: { ...data.cert }
        }
    }

    const personData = {
        ...data,
        cert: certData
    }

    delete data.cert

    const person = await prisma.person.update({
        where: {
            id: data.id
        },
        data: personData,
        include: {
            cert: true
        }
    })

    return {
        person
    }
})