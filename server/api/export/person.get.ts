export default defineEventHandler(async (event) => {
    const prisma = event.context.prisma

    const persons = await prisma.person.findMany({
        select: {
            id: true,
            fullName: true,
            inn: true,
            snils: true,
            jobTitle: true,
            dob: true,
            tel: true,
            cert: {
                select: {
                    serialNumber: true,
                    validFrom: true,
                    validTo: true,
                }
            }
        },
    })

    return {
        persons
    }
})