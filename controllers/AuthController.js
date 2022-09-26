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

        User.create(user)
            .then((user) => {
        // initialize session
                req.session.userid = user.id

        // console.log('salvou dado')
        // console.log(req.session.userid)

        req.session.userid = user.id

        req.flash('message', 'Cadastro realizado com sucesso!')

        console.log(user);

        req.session.save(() => {
          res.redirect('/')
        })
      })
      .catch((err) => console.log(err))
    }
}