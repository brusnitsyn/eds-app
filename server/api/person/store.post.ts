export default defineEventHandler(async (event) => {
    const prisma = event.context.prisma
    const rawData = await readBody(event)

    /// TODO: Добавить DIVISION ID
    const fullName = `${rawData.lastName} ${rawData.firstName} ${rawData.surName}`
    const data = {...rawData, tel: rawData.tel.substring(1), fullName }

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