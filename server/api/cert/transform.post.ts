import crypto from "crypto";
import {writeFile} from "fs/promises";
import {format, formatRFC3339 } from "date-fns"
import { X509 } from "jsrsasign"
export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event)

    const file = formData.find((item) => item.name === 'file')

    const certPem = new crypto.X509Certificate(file.data).toJSON()
    const certCrypto = new crypto.X509Certificate(file.data)

    const cert = new X509()
    cert.readCertPEM(certPem)

    const serialNumber = cert.getSerialNumberHex()
    const validFrom = formatRFC3339(certCrypto.validFrom)
    const validTo = formatRFC3339(certCrypto.validTo)
    const subjectRaw = certCrypto.subject

    let subjectArray = subjectRaw.split('\n')

    let subjectObject = {}
    for (let i=0; i<subjectArray.length; i++) {
        const split = subjectArray[i].split('=')
        subjectObject[split[0]] = split[1]
    }

    let subject = {}

    const fullName = subjectObject.CN.split(' ')
    subject.lastName = fullName[0]
    subject.firstName = fullName[1]
    subject.surName = fullName[2]

    subject.inn = subjectObject.INN
    subject.snils = subjectObject.SNILS
    subject.jobTitle = subjectObject.title

    return {
        serialNumber,
        validFrom,
        validTo,
        subject,
    }
})