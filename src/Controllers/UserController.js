const User = require('../Models/User')
const bcrypt = require('bcrypt')

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10)
    const encryptedPassword = await bcrypt.hash(password, salt)
    return encryptedPassword
  } catch (err) {
    return err
  }
}


  const create = async (req, res) => {
    const { name, email, password, phone, dateBirth, gender, latitude, longitude } = req.body

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude]
    }

    try {
      const userAlreadyExists = await User.findOne({ email })
      if (userAlreadyExists)
        return res.status(400).send({ message: 'User already exists' })

      const hashedPassword = await hashPassword(password)
      const createdUser = await User.create({
        name,
        email,
        phone,
        dateBirth,
        gender,
        password: hashedPassword,
        location
      })

      return res.status(201).send(createdUser)
    } catch (err) {
      return res.status(400).send(err)
    }
  }

  const deletedUser = async (req, res) => {
    const { user_id } = req.params

    const { auth } = req.headers

    if(user_id !== auth) return res.status(400).send({ message: 'nao autorizando' })
   

    try {
      const deletedUser = await User.findByIdAndDelete(user_id)
      return res.status(200).send({ status: "deleted", user: deletedUser })
    } catch (err) {
      return res.status(400).send(err)
    }
  }
  const findUser = async(req, res) => {
    const { user_id } = req.params

    const { auth } = req.headers

    try {
      const UserFind = await User.findById(user_id)
      return res.status(200).send(UserFind)
    } catch (err) {
      return res.status(400).send(err)
    }
  }

  const index = async (req, res) => {
    try {
      const allUsers = await User.find()
      return res.status(200).send(allUsers)
    } catch (err) {
      return res.status(400).send(err)
    }
  }

  const update = async(req, res) => {
    const { user_id } = req.params;
    const { auth } = req.headers;
    const { name, email, password, phone, dateBirth, gender,} = req.body

  if (user_id !== auth) return res.status(400).send({ message: 'Não autorizado' });

  try {
    const updatedUser = await User.findByIdAndUpdate(user_id, req.body, { new: true });
    return res.status(200).send({ status: 'updated', user: updatedUser });
  } catch (err) {
    return res.status(400).send(err);
  }
  }


module.exports = {
  create,
  deletedUser,
  findUser,
  index,
  update
}
