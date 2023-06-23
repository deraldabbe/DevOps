const express = require('express')
const app = express()
const path = require('path')

app.use(express.json())

let Rollbar = require('rollbar')
let rollbar = new Rollbar({
  accessToken: 'a08280ed474b43e6955bd22aedb3118a',
  captureUncaught: true,
  captureUnhandledRejections: true,
})
rollbar.log('Hello World')
const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/students', (req, res) => {
    res.status(200).send(students)
    rollbar.log('student list name', students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
        rollbar.critical('attemted empty name')
           res.status(400).send('You must enter a name.')
       } else {
        rollbar.error('attemped duplicate name')
           res.status(400).send('That student already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
