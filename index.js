const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const app = express()
const PORT = 3000

app.use(express.static(path.join(__dirname, 'public')))

app.use(cors())
app.use(bodyParser.json())

let messages = []

if (fs.existsSync('messages.json')) {
  messages = JSON.parse(fs.readFileSync('messages.json'))
}

app.post('/send-message', (req, res) => {
  const { username, color, message } = req.body
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const newMsg = { username, color, message, timestamp }
  messages.push(newMsg)

  fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2))

  res.sendStatus(200)
})

app.get('/messages', (req, res) => {
  res.json(messages)
})

app.listen(PORT, () => console.log(`ChitChat server live on http://localhost:${PORT}`))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})
