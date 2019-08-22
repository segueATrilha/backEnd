/* Importação das Bibliotecas */
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

/* Importação do Model Usuário */
const User = require('./../models/User');
const authConfig = require('./../../helpers/token');

/* Função para remoção da imagem criada com o middleware do multer. */
async function removeImageCreated(requestFile) {
    if (requestFile)
        await promisify(fs.unlink)(path.resolve(__dirname, '..', '..', '..', 'tmp', 'profiles', requestFile.filename));
}

module.exports = {
    async show(req, res) {

        const { authorization } = req.headers;
        const user = await authConfig.decodeToken(authConfig.recoveToken(authorization));

        user.iat = undefined;
        user.exp = undefined;
        
        return res.status(200).json(user);
    },

    /* Cadastro de Usuários */
    async store(req, res) {

        const { fullname, nickname, email, password } = req.body;
        let image = null;

        // Verificação de Quantidade de Caracteres
        if (fullname.length < 10 || nickname.length < 8 || password.length < 8) {
            await removeImageCreated(req.file);
            return res.status(400).json({ status: 400, title: "Campos Inválidos", description: "Alguns dos campos na requisição possui caracteres insuficientes." });
        }

        // Verificação se o email está no formtao válido.
        const emailRegx = new RegExp(/^([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})+$/);removeImageCreated
        if (!emailRegx.test(email)) {
            await removeImageCreated(req.file);
            return res.status(400).json({ status: 400, title: "Campos Inválidos", description: "O campo de email está mal formatado." });
        }

        // Verificando se o usuário já está cadastrado.
        try {
            const user = await User.findOne({ email });
            if (user) {
                await removeImageCreated(req.file);
                return res.status(400).json({ status: 400, title: "Campos Inválidos", description: "Já existe um registre com este email." });
            }
        } catch (error) {
            removeImageCreated(req.file);
            return res.status(500).json({ status: 500, title: "Falha na Requisição", description: "Foi detectado um erro no serviço por favor tente mais tarde." });
        }

        // Criando a URL para acesso da imagem de perfil.
        if (req.file) {
            const { filename } = req.file;
            image = `${process.env.URL || 'http://localhost:3001'}/files/${filename}`
        }

        // Gerando hash da senha e salvando arquivos.
        bcrypt.genSalt(12, async (error, salt) => {
            if (error) {
                await removeImageCreated(req.file);
                return res.status(400).json({ status: 500, title: "Falha na Requisição", description: "Não foi possível salvar o usuário." });
            }
            bcrypt.hash(password, salt, async (error, hash) => {
                if (error) {
                    await removeImageCreated(req.file);
                    return res.status(400).json({ status: 500, title: "Falha na Requisição", description: "Não foi possível salvar o usuário." });
                }

                try {
                    const newUser = await User.create({
                        fullname, nickname, email, password: hash, image
                    });
                    newUser.password = undefined;
                    return res.status(201).json(newUser);
                } catch (error) {
                    await removeImageCreated(req.file);
                    return res.status(400).json({ status: 500, title: "Falha na Requisição", description: "Não foi possível salvar o usuário." });
                }
            });
        });
    }
}