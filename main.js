var express = require('express')
var app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://Hwng5802:hungnguye5802@cluster0.anfsqfh.mongodb.net/test'

app.post('/newToy', async (req,res)=>{
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picture = req.body.txtPicture
    let des = req.body.txtDes
    let color = req.body.txtColor
    if (name.length <= 4) {
        res.render('newToy', {
            'nameError': 'Ten phai dai hon 4 ki tu'
        })
        return
    }
    let product = {
        'name': name,
        'price': price,
        'picture': picture,
        'des' : des,
        'color': color
    }
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    await dbo.collection("products").insertOne(product)
    res.redirect('/')
})

app.get('/insert',(req,res)=>{
    res.render("newToy")
})

app.post('/search',async (req,res)=>{
    let name = req.body.txtName
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    let products = await dbo.collection('products').find({'name': new RegExp(name,'i')}).toArray()
    res.render('allToys',{'products':products})
})

app.get('/',async (req,res)=>{
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    let products = await dbo.collection('products').find().toArray()
    res.render('allToys',{'products':products})
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running!')