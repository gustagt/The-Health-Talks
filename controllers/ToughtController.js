const Tought = require('../models/Tought')
const User = require('../models/User')

module.exports = class ToughtController {

    static async showToughts(req, res){
        res.render('toughts/home')
    }

    static async dashboard(req, res){

        const userId = req.session.userid;

        const user = await User.findOne({ where: {id: userId }, include: Tought, plain: true,});

        if(!user){
            res.redirect('/login');
        }

        const toughts = user.Toughts.map((result) => result.dataValues);
        let emptyToughts = false;
        
        if(toughts.length === 0){
            emptyToughts = true;
        }

        res.render('toughts/dashboard', { toughts, emptyToughts });
    }

    static createTought(req, res){
        res.render('toughts/create');
    }

    static async createToughtPost(req, res){
        const tought = {
            title: req.body.title,
            UserId: req.session.userid,
        }

        await Tought.create(tought);

        req.flash('message', 'Criado!');

        try
        {
            req.session.save(() => {
                res.redirect('/toughts/dashboard');
            })

        }
        catch(err)
        {
            console.log('Error: ' + err);
        }
        
        
    }

    static async removeTought(req, res){
        const toughId = req.body.id;
        const userId = req.session.userid;

        try
        {
            await Tought.destroy({ where: {id: toughId, UserId: userId}});

            req.flash('message', 'Pensamento removido!');
            req.session.save(() => {
                res.redirect('/toughts/dashboard');
            })

        }
        catch(error){
            console.log(error);
        }

        
    }
}