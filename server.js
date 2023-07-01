const express = require('express')
const path = require('path')
const app = express()
const bodyparser = require('body-parser')
app.use(bodyparser.json())
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./Model/user')
const jwt = require('jsonwebtoken')
const PORT = process.env.PORT || 3030;

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'


mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser :true,
    useUnifiedTopology : true,
})


app.post('/api/signup', async(req, res) => {
    console.log(req.body)
    const { firstname, lastname , email, password : plainTextPassword } = req.body
    console.log(req.body)
    const password = await bcrypt.hash(plainTextPassword, 10)

    try{
        const response =  await User.create({
            firstname,
            lastname,
            email,
            password
        })
        console.log("user created successfully:", response  )
        console.log(response)
    }catch(error){
        if(error.code === 11000)
        {
        console.log(error)
        return res.json("duplicate error")
        }
    }
    res.json({ status: 'ok' })
})

app.post('/api/signin', async (req, res) => {
	const { email, password } = req.body
	const user = await User.findOne({ email }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid email/password'})
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				email: user.email
			},
			JWT_SECRET
		)

		return res.json({ status: 'Success', data: token })
	}

	res.json({ status: 'Failure', error: 'Invalid email/password' })
})

//app.get('/', function(req, res){
   // res.render('index.ejs');
  //});

app.listen(3000 , () =>{
    console.log("server listened")
})