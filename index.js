const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(bodyParser.json())

let messages = []

try {
  if (fs.existsSync('messages.json')) {
    const raw = fs.readFileSync('messages.json', 'utf-8')
    messages = raw.trim() ? JSON.parse(raw) : []
  }
} catch (err) {
  console.error('Error reading messages.json:', err)
  messages = []
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.listen(PORT, () => {
  console.log(`ChitChat server live on http://localhost:${PORT}`)
})
