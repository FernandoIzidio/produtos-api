const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authToken = require('./middlewares/authToken');
const {User, Product} = require('./db');


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

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username: username } });



    if (!user) {
      return res.status(401).json({ auth: false, message: 'Invalid Credentials' });
  }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid){
      return res.status(401).json({ auth: false, message: 'Invalid Credentials' });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
        expiresIn: 86400
      });

      res.json({ 'user': user, 'token': token });
})

app.post('/register', async (req, res) => {
    authError.splice(0, authError.length);
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

app.get('/user/products', authToken, async (req, res) => {

    try {
        const token = req.headers['x-access-token'];

        const decoded = jwt.verify(token, SECRET_KEY);

        const userId =  decoded.id;

        const products = await Product.findAll({
            where: { userId }
        });

        return res.status(200).json(products);
    } catch (error) {
    res.status(500).json({ status: 'Failure' });
  }


});

app.get('/products/:id', authToken, async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);

        return res.status(200).json(product);
    } catch (e){
        res.status(500).json({ status: 'Failure' });
    }
})

app.post('/products', authToken, async (req, res) => {
  const { name, description, price, quantity, userId } = req.body;

  if (!name || !description || !price || quantity == null || !userId) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      userId
    });

    res.status(201).json({status: "Success"});
  } catch (error) {
    res.status(500).json({status: "Failure"});
  }
})

app.put('/products', authToken, async (req, res) => {
    const { id, name, description, price, quantity } = req.body;

    if (!name || !description || !price || quantity == null ) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }




        await Product.update(
            { name, description, price, quantity },
            { where: { id } }
        );

        res.status(200).json({ status: 'Success' });
    } catch (error) {

        res.status(500).json({ status: 'Failure' });
    }



})

app.delete('/products/:id', authToken, async (req, res) => {
    const { id } = req.params;

    try {

        await Product.destroy({ where: { id } });

        res.status(200).json({status: "Success"});
    }catch(error){
        res.status(500).json({ status: "Failure" });
    }
})


app.listen(port, () => {
  console.log(`Listen in http://localhost:${port}`);
});
