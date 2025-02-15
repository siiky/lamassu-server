const twilio = require('twilio')
const _ = require('lodash/fp')

const NAME = 'Twilio'

const BAD_NUMBER_CODES = [21201, 21202, 21211, 21214, 21216, 21217, 21219, 21408,
  21610, 21612, 21614, 21608]

function sendMessage (account, rec) {
  return Promise.resolve()
    .then(() => {
      // to catch configuration errors like
      // "Error: username is required"
      const client = twilio(account.accountSid, account.authToken)
      const body = rec.sms.body
      const _toNumber = rec.sms.toNumber || account.toNumber
      const from = (_.startsWith('+')(account.fromNumber) 
        || !_.isNumber(String(account.fromNumber).replace(/\s/g,'')))
        ? account.fromNumber : `+${account.fromNumber}`

      const opts = {
        body: body,
        to: _toNumber,
        from
      }

      return client.messages.create(opts)
    })
    .catch(err => {
      if (_.includes(err.code, BAD_NUMBER_CODES)) {
        const badNumberError = new Error(err.message)
        badNumberError.name = 'BadNumberError'
        throw badNumberError
      }

      throw new Error(`Twilio error: ${err.message}`)
    })
}

function getLookup (account, number) {
  return Promise.resolve()
    .then(() => {
      const client = twilio(account.accountSid, account.authToken)
      return client.lookups.v1.phoneNumbers(number)
        .fetch({ addOns: ['lamassu_ekata'] })
    })
    .then(info => info.addOns.results['lamassu_ekata'])
    .catch(err => {
      if (_.includes(err.code, BAD_NUMBER_CODES)) {
        const badNumberError = new Error(err.message)
        badNumberError.name = 'BadNumberError'
        throw badNumberError
      }

      throw new Error(`Twilio error: ${err.message}`)
    })
}

module.exports = {
  NAME,
  sendMessage,
  getLookup
}
