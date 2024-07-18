import {useNow} from "@vueuse/core";
import {eachDayOfInterval, isFuture} from "date-fns";

export default defineEventHandler(async (event) => {
    const prisma = event.context.prisma
    const id = getRouterParam(event, 'id')

    const person = await prisma.person.findUnique({
        where: {
            id: Number.parseInt(id)
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            surName: true,
            inn: true,
            snils: true,
            jobTitle: true,
            dob: true,
            tel: true,
            sex: true,
            cert: {
                select: {
                    id: true,
                    serialNumber: true,
                    validFrom: true,
                    validTo: true,
                }
            }
        },
    })

    const dateNow = useNow().value
    const validTo = new Date(person.cert.validTo)

    if (isFuture(validTo)) {
        if ((validTo.getMonth() - dateNow.getMonth()) > 0 && (validTo.getMonth() - dateNow.getMonth()) === 1) {
            person.cert.hasRequestNew = true
        }

        person.cert.hasValid = true
    } else {
        person.cert.hasValid = false
    }

    return {
        person
    }
})