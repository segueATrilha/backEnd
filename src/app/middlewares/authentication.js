const jwt = require('jsonwebtoken');

const { SECRET_AUTH } = require('../../config/auth');
const authToken = require('../../helpers/token');

module.exports = {
    async authentication(req, res, next) {
        const token = authToken.recoveToken(req.headers.authorization);
        if(!token) {
            return res.status(401).json({status:401, title: "Você não está autenticado", description: "Token não fornecido"});
        } else {
            jwt.verify(token, SECRET_AUTH, (error, decoded) => {
                if(error)
                    return res.status(401).send({status:401, title: "Você não está autenticado", description: "Token mal formatado"});
                return next();
            })
        }
    }
}