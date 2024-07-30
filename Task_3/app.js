const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3000;


app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());

const dataStore = [];

app.set('view engine', 'ejs');

const formDataStore = {};

app.get('/', (req, res)=>{
    res.render('index', {formData: formDataStore.formData1 || {} , error: null});
})

app.post('/userForm', async (req, res)=>{

    formDataStore.formData1 = req.body;

    const {fname, lname, uname, email, pass, confpass, city, state, pin} = formDataStore.formData1;

    let error = null;
    if (!fname || !lname || !email || !pass) {
        error = "Name, email and Password fields are required!";
    } else if (pass !== confpass) {
        error = "Passwords does not match!";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pass)) {
        error = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
        error = "Invalid Email format!";
    }


    if (error) {
        return res.render('index', {error});
    }

    //hashing
    const saltRounds = 12;

    const hashedPassword = await bcrypt.hash(formDataStore.formData1.pass, saltRounds);
    formDataStore.formData1.pass = hashedPassword;

    const confHashedPassword = await bcrypt.hash(formDataStore.formData1.confpass, saltRounds);
    formDataStore.formData1.confpass = confHashedPassword;

    dataStore.push({fname, lname, uname, email, pass, confpass, city, state, pin});
    
    console.log('Personal Details: ', formDataStore.formData1);
    res.render('details');
    //res.on('finish', ()=>{
        //console.log('To shut down the server press "ctrl+c"...');
        //console.log('Shutting down the server...');
        //process.exit(0);
   // })

} )

app.get('/edu-details', (req, res) => {
    res.render('details', { formData: formDataStore.formData2 || {} });
})

app.post('/submit-form', (req,res) => {
    formDataStore.formData2 = req.body;
    const {cert, degree, course, univ, clg, cgpa} = formDataStore.formData2;
    dataStore.push({cert, degree, course, univ, clg, cgpa});
    console.log('Educational Qualifications: ', formDataStore.formData2);
    res.render('result', {formData1: formDataStore.formData1 , formData2: formDataStore.formData2 });

    res.on('finish', () => {
        console.log('press "ctrl+c" to shut down the server');
    })
})

app.listen(port, ()=>{
    console.log('Server is running on http://localhost:%d', port);
})