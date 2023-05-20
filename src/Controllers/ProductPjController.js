const ProductPj = require('../Models/ProductPj')
const User = require('../Models/User')

     const create = async(req, res) => {
        const { name, price, author, category, synopsis,year, dateLocal = new Date(dateUTC).toLocaleString('pt-BR', { timeZone: 'UTC' })} = req.body

        const { user_id } = req.params

        const { auth } = req.headers
        

        if(user_id !== auth) return res.status(400).send({ message: 'nao autorizando'})
       
        
        try{
            const userInfo = await User.findById(user_id)
            
            const {location} = userInfo
            const latitude = location.coordinates[0]
            const longitude = location.coordinates[1]

            const setLocation = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            const createdProductPj = await ProductPj.create({name, price, user: user_id, location: setLocation, author, category, synopsis, year,  src: req.file.path, dateLocal})
            const populatedProductPj = await ProductPj.findById(createdProductPj._id).populate('user')
           

            return res.status(201).send(populatedProductPj)
        }catch(err){
            console.log('foi aqui')
            return res.status(400).send(err)
        }
    }

   const deletedProductPj = async(req, res) => {
        

        const { productPj_id, user_id} = req.params 
        const { auth } = req.headers
       

        if(user_id !== auth) return res.status(400).send({ message: 'nao autorizando' })
       


        try{
            const deletedProduct = await ProductPj.findByIdAndDelete(productPj_id)
            return res.status(200).send({ status: "deleted", user: deletedProduct })  
        }catch (err){
            return res.status(400).send(err)
        }
    }
   
    const indexByUser = async(req, res) =>{
        const { user_id }= req.params

        try{
            const allProductsOfAUser = await ProductPj.find({ user: user_id })
            return res.status(200).send(allProductsOfAUser)
        }catch(err){
        return res.status(400).send(err)
        }
    }

   const indexCords  = async(req, res) => {
        const { latitude, longitude  } = req.query
        const maxDistance = 10000

    try{
        const allProducts = await ProductPj.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [latitude , longitude ]
                    },
                    $maxDistance: maxDistance
                }
            }
        }).populate('user')

        return res.status(200).send(allProducts)
    }
    catch (err){
        return res.sendStatus(400).send(err)
    }
    }

    const indexAll = async(req, res) => {
        
    try{
        const allProducts = await ProductPj.find({
        }).populate('user')

        return res.status(200).send(allProducts)
    }
    catch (err){
        return res.sendStatus(400).send(err)
    }
    }

    const indexProd = async(req, res) => {
        const {product_id }= req.params

        try{
            const allProducts = await ProductPj.findById(product_id)
            return res.status(200).send(allProducts)
        }catch(err){
        return res.status(400).send(err)
        }
    }

   const update =  async(req, res) => {
        const { name, price, author, category, synopsis, year } = req.body;
        const { user_id, productPj_id } = req.params;
        const { auth } = req.headers;
      
        if (user_id !== auth) {
          return res.status(401).send({ message: 'Não autorizado' });
        }
      
        try {
          const userInfo = await User.findById(user_id);
          const { location } = userInfo;
          const latitude = location.coordinates[0];
          const longitude = location.coordinates[1];
          const setLocation = {
            type: 'Point',
            coordinates: [longitude, latitude],
          };
      
          const updatedProductPJ = await Product.findByIdAndUpdate(
            productPj_id,
            {
              name,
              price,
              user: user_id,
              location: setLocation,
              author,
              category,
              synopsis,
              year,
              src: req.file.path,
            },
            { new: true }
          ).populate('user');
      
          return res.status(200).send(updatedProductPJ);
        } catch (err) {
          console.log('Erro:', err);
          return res.status(400).send({ message: 'Erro ao atualizar o produto' });
        }
      }


module.exports = {
    create,
    deletedProductPj,
    indexByUser,
    indexCords,
    indexAll,
    indexProd,
    update

}
