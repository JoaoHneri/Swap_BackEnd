const User = require('../Models/User');
const bcrypt  = require('bcrypt');


    const create = async(req, res) => {
        const {email, password} = req.body;


        try{
           const userExists = await User.findOne({email});


            if(!userExists) return res.status(400).send({message: 'User already exists'})
     
            const validPassword = await bcrypt.compare(password, userExists.password )

            if(!validPassword) return res.status(400).send({message: 'Invalid password'})

            return res.status(200).send(userExists)
        }catch(err){
            return res.status(400).send(err)
        }


    }





module.exports = { create };