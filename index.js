const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
//app.use(morgan('tiny'))
app.use(morgan(function (tokens, req, res) {
    //console.log('tokens.method(req, res) :>> ', tokens.method(req, res));
    //console.log('type :>> ', typeof(tokens.method(req, res)));

    if (tokens.method(req, res)==='POST') {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            JSON.stringify(req.body, null)
          ].join(' ')
    } else {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
          ].join(' ')
    } 

    
}))

let puhelinLuettelo = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
    {
        "name": "Test Person",
        "number": "987zzzZZZ",
        "id": 5
    }
]

const getDateString = () => {
    const weekdays = new Array('Sun','Mon','Tue','Wed','Thu','Fri','Sat');
    const months = new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
    const now = new Date();
    const currWeekDay = weekdays[now.getDay()]
    const currMonth = months[now.getMonth()]
    const timezonePlusOrMinus = now.getTimezoneOffset() < 0 ? '+' : '-'
    const timezone = (((-1)*(now.getTimezoneOffset()))/60)-1

    return `${currWeekDay} ${currMonth} ${now.getDate()} ${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} GTM${timezonePlusOrMinus}${timezone} (Eastern European Standard Time)`
}


app.get('/api/persons', (request, response) => {
    response.json(puhelinLuettelo)
})

app.get('/api/persons/:id', (request, response) => {
    const id =  Number(request.params.id);
    const contact = puhelinLuettelo.find(contact => contact.id === id );
    console.log('contact :>> ', contact);
    response.json(contact);
})

app.get('/info', (request, response) =>{
    
    response.send(`<p>Phonebook has info for ${puhelinLuettelo.length} people <br></br> ${getDateString()}</p>`);
})

app.delete('/api/persons/:id',  (request, response) => {
    const id =  Number(request.params.id);
    const contactIndex = puhelinLuettelo.findIndex(contact => contact.id === id );
    console.log('contactIndex :>> ', contactIndex);
    console.log('puhelinLuettelo :>> ', puhelinLuettelo);
    if (contactIndex>-1) {
        puhelinLuettelo.splice(contactIndex, 1);
        console.log('puhelinLuettelo :>> ', puhelinLuettelo);
        response.status(204).end();
    } else {
        console.log('puhelinLuettelo :>> ', puhelinLuettelo);
        response.status(204).end();
    }
})

app.post('/api/persons', (request, response)=>{
    const body = request.body

    if (!(body.name)||!(body.number)) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    if ( (puhelinLuettelo.find(contact => contact.name ===body.name)) ||
            (puhelinLuettelo.find(contact => contact.number ===body.number))) {
        return response.status(403).json({
            error: 'name or number duplicate'
        })
    }

    const newContact = {
        name: body.name,
        number: body.number,
        id: Math.round(Math.random()*10000)
    } 

    puhelinLuettelo.push(newContact)

    //console.log(puhelinLuettelo);

    response.json(newContact)
})

console.log('Hello world');

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
