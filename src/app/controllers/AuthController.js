const bycript = require('bcryptjs');

const User = require('./../models/User');
const configAuth = require('./../../helpers/token');

module.exports = {
    async store(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email }, '+password');
            if (!user)
                return res.status(400).json({ status: 400, title: "Falha na Autenticação" , description: "Email ou Senha inválidos." });
            
            if(await bycript.compare(password, user.password)) {
                const { _id, email, fullname, nickname, image } = user;
                try {
                    const token = await configAuth.generateToken({ id : _id, email, fullname, nickname, avatar : image})
                    return res.status(200).json({token});
                } catch (error) {
                    return res.status(500).json({ status: 500, title: "Falha na Autenticação" , description: "Não foi possível buscar suas informações no servidor." });       
                }
            }

            return res.status(400).json({ status: 400, title: "Falha na Autenticação" , description: "Email ou Senha inválidos." });

        } catch (error) {
            return res.status(500).json({ status: 500, title: "Falha na Autenticação" , description: "Não foi possível buscar suas informações no servidor." });
        }
    }
}