const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authToken = require('./middlewares/authToken');
const {User} = require('./db');


const app = express();
const SECRET_KEY = 'mysecretkey';
const cors = require('cors');
const port = 3000;
const authError = [
        
]

app.use(cors());
app.use(express.json());

function pushError (field, message){
    authError.push(
        {
            field: field,
            defaultMessage: message
        });

    return true
}


app.get('/', (req, res) => {
    const user = {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com'
      };
    
    res.json(user);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
        expiresIn: 86400 
      });
    
      res.json({ 'auth': true, 'token': token });
})

app.post('/register', async (req, res) => {
    const { firstName, lastName, gender, username, password, email, phone, cpf, birthdate } = req.body;
  
   
    
    try {
    
      const existingUser = await User.findOne({ where: { username } });
      const existingEmail = await User.findOne({ where: { email } });
      const existingCpf = await User.findOne({ where: { cpf } });
      let hasAnyError = false;
  
      if (existingUser) {
        hasAnyError = pushError('usernameError', 'Usuário já cadastrado');
      }
  
      if (existingEmail) {
        hasAnyError = pushError('emailError', 'Email já cadastrado');
      }
  
      if (existingCpf) {
        hasAnyError = pushError('cpfError', 'CPF já cadastrado')
      }
  
      
      if (hasAnyError){
        return res.status(400).json(authError);
      }


      const hashedPassword = bcrypt.hashSync(password, 8);
      
      
     
      await User.create({
        firstName,
        lastName,
        gender,
        username,
        password: hashedPassword,
        email,
        phone,
        cpf,
        birthdate
      });
  
      res.status(201).json({ status: 'Success'})
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ status: 'Failure' });
      }
    
});





app.listen(port, () => {
  console.log(`Listen in http://localhost:${port}`);
});
