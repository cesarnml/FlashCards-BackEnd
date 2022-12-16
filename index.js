import * as dotenv from 'dotenv'
import { default as sqlite3 } from 'sqlite3'
import { createClient } from '@supabase/supabase-js'
import './assets/Thai__J2__Ch01-BuyStuff/44'
import testImage from './assets/Thai__J2__Ch01-BuyStuff/44'

dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
const { data, error } = await supabase.storage.from('images').list()
const publicUrl = await supabase.storage.from('images').getPublicUrl()
console.log('publicUrl:', publicUrl.data.publicUrl)
const image = data[0]
console.log(image.name)
console.log(`${publicUrl.data.publicUrl.split('undefined')[0]}${image.name}`)
const db = new sqlite3.Database('./assets/Thai__J2__Ch01-BuyStuff/collection.anki21')

const uploadResult = await supabase.storage.from('images').upload('testImage', testImage)
console.log('uploadResult:', uploadResult)
const sqlNotes = `SELECT mid, flds FROM notes`
const sqlModels = `SELECT models FROM col`

async function db_all(query) {
  return new Promise(function (resolve, reject) {
    db.all(query, function (err, rows) {
      if (err) {
        return reject(err)
      }
      resolve(rows)
    })
  })
}

const rowsFieldValue = await db_all(sqlNotes)
const modelId = rowsFieldValue[0].mid
// console.log('modelId:', modelId)
const processedValues = rowsFieldValue.map((row) => row.flds.split('\x1F'))
// console.log('processedValues:', processedValues)

const result = await db_all(sqlModels)
const model = JSON.parse(result[0].models)[modelId]

const modelCss = model.css
const modelFields = model.flds
const modelTemplates = model.tmpls.map((template) => {
  return {
    name: template.name,
    questionFrontmatter: template.qfmt,
    answerFrontmatter: template.afmt,
    order: template.ord,
  }
})
// console.log('modelTemplates:', modelTemplates)

const modelValues = processedValues.map((values) => {
  const result = {}
  modelFields.forEach((field) => {
    result[field.name] = values[field.ord]
  })
  return result
})
db.close()
