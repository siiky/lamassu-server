import * as R from 'ramda'
import * as Yup from 'yup'

import { Autocomplete, NumberInput } from 'src/components/inputs/formik'
import { bold } from 'src/styling/helpers'
import denominations from 'src/utils/bill-denominations'
import { getBillOptions } from 'src/utils/bill-options'
import { CURRENCY_MAX } from 'src/utils/constants'
import { transformNumber } from 'src/utils/number'

const widthsByNumberOfUnits = {
  2: { machine: 325, cassette: 340 },
  3: { machine: 300, cassette: 235 },
  4: { machine: 205, cassette: 200 },
  5: { machine: 180, cassette: 165 },
  6: { machine: 165, cassette: 140 },
  7: { machine: 130, cassette: 125 }
}

const DenominationsSchema = Yup.object().shape({
  cassette1: Yup.number()
    .label('Cassette 1')
    .required()
    .min(1)
    .max(CURRENCY_MAX),
  cassette2: Yup.number()
    .label('Cassette 2')
    .min(1)
    .max(CURRENCY_MAX)
    .nullable()
    .transform(transformNumber),
  cassette3: Yup.number()
    .label('Cassette 3')
    .min(1)
    .max(CURRENCY_MAX)
    .nullable()
    .transform(transformNumber),
  cassette4: Yup.number()
    .label('Cassette 4')
    .min(1)
    .max(CURRENCY_MAX)
    .nullable()
    .transform(transformNumber),
  stacker1f: Yup.number()
    .label('Stacker 1')
    .min(1)
    .max(CURRENCY_MAX)
    .nullable()
    .transform(transformNumber),
  stacker1r: Yup.number()
    .label('Stacker 1')
    .min(1)
    .max(CURRENCY_MAX)
    .nullable()
    .transform(transformNumber),
  stacker2f: Yup.number()
    .label('Stacker 2')
    .min(1)
    .max(CURRENCY_MAX)
    .nullable()
    .transform(transformNumber),
  stacker2r: Yup.number()
    .label('Stacker 2')
    .min(1)
    .max(CURRENCY_MAX)
    .nullable()
    .transform(transformNumber),
  stacker3f: Yup.number()
    .label('Stacker 3')
    .min(1)
    .max(CURRENCY_MAX)
    .nullable()
    .transform(transformNumber),
  stacker3r: Yup.number()
    .label('Stacker 3')
    .min(1)
    .max(CURRENCY_MAX)
    .nullable()
    .transform(transformNumber)
})

const getElements = (machines, locale = {}, classes) => {
  const fiatCurrency = R.prop('fiatCurrency')(locale)
  const maxNumberOfCassettes = Math.max(
    ...R.map(it => it.numberOfCassettes, machines),
    0
  )
  const maxNumberOfStackers = Math.max(
    ...R.map(it => it.numberOfStackers, machines),
    0
  )
  const numberOfCashUnits = maxNumberOfCassettes + maxNumberOfStackers

  const options = getBillOptions(locale, denominations)
  const cassetteProps =
    options?.length > 0
      ? {
          options: options,
          labelProp: 'display',
          valueProp: 'code',
          className: classes.autoComplete
        }
      : { decimalPlaces: 0 }

  const elements = [
    {
      name: 'id',
      header: 'Machine',
      width: widthsByNumberOfUnits[numberOfCashUnits]?.machine,
      view: it => machines.find(({ deviceId }) => deviceId === it).name,
      size: 'sm',
      editable: false
    }
  ]

  R.until(
    R.gt(R.__, maxNumberOfCassettes),
    it => {
      elements.push({
        name: `cassette${it}`,
        header: `Cassette ${it}`,
        size: 'sm',
        stripe: true,
        textAlign: 'right',
        width: widthsByNumberOfUnits[numberOfCashUnits]?.cassette,
        suffix: fiatCurrency,
        bold: bold,
        view: it => it,
        input: options?.length > 0 ? Autocomplete : NumberInput,
        inputProps: cassetteProps,
        doubleHeader: 'Denominations of Cassettes & Recyclers',
        isHidden: machine =>
          it >
          machines.find(({ deviceId }) => deviceId === machine.id)
            .numberOfCassettes
      })
      return R.add(1, it)
    },
    1
  )

  R.until(
    R.gt(R.__, maxNumberOfStackers),
    it => {
      elements.push({
        names: [`stacker${it}f`, `stacker${it}r`],
        header: `Stacker ${it}`,
        size: 'sm',
        stripe: true,
        textAlign: 'right',
        width: widthsByNumberOfUnits[numberOfCashUnits]?.cassette,
        prefix: it => (R.last(it) === 'f' ? 'F' : 'R'),
        suffix: fiatCurrency,
        bold: bold,
        input: options?.length > 0 ? Autocomplete : NumberInput,
        inputProps: cassetteProps,
        doubleHeader: 'Denominations of Cassettes & Recyclers',
        isHidden: machine =>
          it >
          machines.find(({ deviceId }) => deviceId === machine.id)
            .numberOfStackers
      })
      return R.add(1, it)
    },
    1
  )

  return elements
}

export { DenominationsSchema, getElements }
