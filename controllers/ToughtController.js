const Tought = require('../models/Tought');
const User = require('../models/User');
const { Op 

} = require('sequelize');

module.exports = class ToughtController {

    static async showToughts(req, res){
        console.log(req.query)

    // check if user is searching
    let search = ''

    if (req.query.search) {
      search = req.query.search
    }

    // order results, newest first
    let order = 'DESC'

    if (req.query.order === 'old') {
      order = 'ASC'
    } else {
      order = 'DESC'
    }

    Tought.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [['createdAt', order]],
    })
      .then((data) => {
        let toughtsQty = data.length

        if (toughtsQty === 0) {
          toughtsQty = false
        }

        const toughts = data.map((result) => result.get({ plain: true }))

        res.render('toughts/home', { toughts, toughtsQty, search })
      })
      .catch((err) => console.log(err))
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

    static async updateTought(req, res){

        const toughtId = req.params.id;

        const tought = await Tought.findOne({ where: {id: toughtId}, raw: true});

        console.log(tought);

        res.render('toughts/edit', { tought });
    }

    static async updateToughtPost(req, res){

        const id = req.body.id;
        const tought = {
            title: req.body.title
        }

        try
        {
            await Tought.update(tought, { where: {id: id}});
            req.flash('message', 'Pensamento atualizado com sucesso!');

            req.session.save(() => {
                res.redirect('/toughts/dashboard');
            })
        }
        catch(error)
        {
            console.log(error);
        }

        
    }

    static info(req, res){
        res.render('toughts/info')
    }

}