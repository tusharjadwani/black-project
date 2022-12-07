const express = require('express')
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({ path: './config.env' });
const data = require('./models/Data');
const cors = require('cors')
const path = require('path')

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO || "mongodb+srv://tushar:Bf9Z7Lgqw8xcTA0x@cluster0.3zsfvdw.mongodb.net/blackcoffer";
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(express.static(path.join(__dirname, './client/build')))

mongoose.connect(mongoURI).then(() => console.log("connected to db")).catch((err) => console.log(err));
var totL;

app.get('/api/data', async (req, res) => {
    var rs;
    if (req.query.country) {
        data.find({ country: req.query.country }).then(res => { totL = res });
        rs = await data.find({ country: req.query.country }).limit(req.query.pageSize).skip((req.query.page - 1) * req.query.pageSize);
    }
    else if (req.query.category) {
        data.find({ pestle: req.query.category }).then(res => { totL = res });
        rs = await data.find({ pestle: req.query.category }).limit(req.query.pageSize).skip((req.query.page - 1) * req.query.pageSize);
    }
    else {
        data.find().then(res => { totL = res });
        rs = await data.find().limit(req.query.pageSize).skip((req.query.page - 1) * req.query.pageSize);
    }
    console.log(totL.length)
    res.json({ totalResults: totL.length, articles: rs })
})

app.post('/api/post', (req, res) => {
    data.create(req.body).then(rs => res.json(rs)).catch(err => { res.send(err); console.log(err) })
})

app.get("*", () => (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})
