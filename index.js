import { default as sqlite3 } from 'sqlite3'

const db = new sqlite3.Database('./assets/Thai__J2__Ch01-BuyStuff/collection.anki21')

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
console.log('modelId:', modelId)
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

const modelValues = processedValues.map((values) => {
  const result = {}
  modelFields.forEach((field) => {
    result[field.name] = values[field.ord]
  })
  return result
})
db.close()
