import { formatRFC3339 } from 'date-fns'

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma
  const rawData = await readBody(event)

  console.log(rawData)

  const fullName = `${rawData.lastName} ${rawData.firstName} ${rawData.surName}`

  const cert = {
    validTo: formatRFC3339(rawData.cert.validTo),
    validFrom: formatRFC3339(rawData.cert.validFrom),
  }

  const personDob = {
    dob: rawData.dob ? formatRFC3339(rawData.dob) : null
  }

  const data = { ...rawData, ...personDob, fullName }

  const certData = {
    update: {
      where: {
        id: data.cert.id
      },
      data: { ...data.cert, ...cert }
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
