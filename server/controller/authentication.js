const jwt = require("jsonwebtoken");
require('dotenv').config({ path: '../.env' })


async function authenticateJWT(req, res, next) {
    const token = req.cookies.token;
    // const token2 = req.cookies.token
    // console.log(req.cookies)
    if (!token) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }
  
    try { 
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Token de autenticação inválido' });
        }
    
        req.userId = decoded.userId;
      //   req.isAdmin = decoded.isAdmin;
        next();
      });
    } catch(err) {
        res.clearCookie("token");
        return res.status(403).json({ message: 'Token de autenticação inválido' });
    }
      
}

// Função para gerar o token JWT
function generateToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
}

// // Middleware para verificar se o usuário é um administrador
// function isAdmin(req, res, next) {
//   if (!req.isAdmin) {
//       return res.status(403).json({ message: 'Acesso negado. Somente administradores podem acessar esta rota.' });
//   }
//   next();
// }

module.exports = { 
    authenticateJWT,
    generateToken
    // isAdmin
};