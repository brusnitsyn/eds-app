import crypto from "crypto";
import {writeFile} from "fs/promises";
import {format, formatRFC3339, getTime } from "date-fns"
import { X509 } from "jsrsasign"
import {MultiPartData} from "h3";
export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event) as MultiPartData[]

    const file = formData.find((item) => item.name === 'file') as MultiPartData

    const certPem = new crypto.X509Certificate(file.data).toJSON()
    const certCrypto = new crypto.X509Certificate(file.data)

    const cert = new X509()
    cert.readCertPEM(certPem)

    const serial_number = (cert.getSerialNumberHex() as string).toUpperCase()
    const valid_from = getTime(Date.parse(certCrypto.validFrom))
    const valid_to = getTime(Date.parse(certCrypto.validTo))
    const subjectRaw = certCrypto.subject

    const certObject = { serial_number, valid_from, valid_to }

    let subjectArray = subjectRaw.split('\n')

    let subjectObject = {}
    for (let i=0; i<subjectArray.length; i++) {
        const split = subjectArray[i].split('=')
        subjectObject[split[0]] = split[1]
    }

    let subject = {}

    const fullName = subjectObject.CN.split(' ')
    subject.last_name = fullName[0]
    subject.first_name = fullName[1]
    subject.middle_name = fullName[2]

    subject.inn = subjectObject.INN
    subject.snils = subjectObject.SNILS
    subject.job_title = subjectObject.title

    return {
        cert: certObject,
        ...subject,
    }
})
