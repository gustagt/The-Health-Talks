const User = require('../models/User');
const bcrypt = require('bcryptjs');


module.exports = class AuthController {

    static login(req, res){
        res.render('auth/login')
    }

    static register(req, res){
        res.render('auth/register')
    }

    static async registerPost(req, res){
        
        const { name, email, password, confirmpassword } = req.body;

        //Validação de senha e confirmação de senha
        if(password != confirmpassword)
        {
            req.flash('message', 'As senhas não coincidem!');
            res.render('auth/register');

            return
        }

        //Validação do e-mail
        const checkIfUserExists = await User.findOne( { where: { email: email }});
        if(checkIfUserExists)
        {
            req.flash('message', 'Este e-mail já está em uso!');
            res.render('auth/register');

            return
        }

        //Password encrypt
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try
        {
            const createdUser = await User.create(user);

            req.session.userid = createdUser.id;

            req.flash('message', 'Usuário registrado com sucesso!');

            req.session.save(() => {
                res.redirect('/');
            })       
        }
        catch(err)
        {
            console.log(err);
        }       
    }
}