const moment = require('moment-timezone');
const User = require('../Models/User')
const Product = require('../Models/Product')
const bcrypt = require('bcrypt')
const currentDateTime = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');

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
      location,
      createdAt: currentDateTime
    })

    req.body.createdAt = currentDateTime;

    return res.status(201).send(createdUser)
  } catch (err) {
    return res.status(400).send(err)
  }
}

const deletedUser = async (req, res) => {
  const { user_id } = req.params

  const { auth } = req.headers

  if (user_id !== auth) return res.status(400).send({ message: 'nao autorizando' })


  try {
    const deletedUser = await User.findByIdAndDelete(user_id)
    return res.status(200).send({ status: "deleted", user: deletedUser })
  } catch (err) {
    return res.status(400).send(err)
  }
}
const findUser = async (req, res) => {
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
  };


const addToFavorites = async (req, res) => {
  const { user_id, product_id } = req.params;

  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.favorites.includes(product_id)) {
      return res.status(400).json({ message: 'Product already in favorites' });
    }

    user.favorites.push(product_id);
    await user.save();

    return res.status(200).json({ message: 'Product added to favorites' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getFavorites = async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await User.findById(user_id).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user.favorites);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const removeFromFavorites = async (req, res) => {
  const { user_id, product_id } = req.params;

  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.favorites.includes(product_id)) {
      return res.status(400).json({ message: 'Product is not in favorites' });
    }
    user.favorites = user.favorites.filter((favorite) => favorite.toString() !== product_id);
    await user.save();

    return res.status(200).json({ message: 'Product removed from favorites' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  create,
  deletedUser,
  findUser,
  index,
  update,
  addToFavorites,
  getFavorites,
  removeFromFavorites
}
