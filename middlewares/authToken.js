const jwt = require('jsonwebtoken');
const SECRET_KEY = 'mysecretkey';


function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    
    if (!token) {
      return res.status(403).json({ auth: false, message: 'Nenhum token fornecido.' });
    }
  
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(500).json({ auth: false, message: 'Falha ao autenticar o token.' });
      }
  
    
      req.userId = decoded.id;
      next();
    });
}

module.exports = verifyToken;