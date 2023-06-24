const { Router } = require('express')
const UserController = require('../Controllers/UserController')
const SessionController = require('../Controllers/SessionController')
const ProductController = require('../Controllers/ProductController')
const ProductPjController = require('../Controllers/ProductPjController')
const ConversationController = require('../Controllers/ConversationController')



const multer = require('multer');
const routes = Router()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });





//User 
routes.post('/user', UserController.create)
routes.get('/user/', UserController.index)
routes.delete('/user/:user_id', UserController.deletedUser);
routes.get('/user/:user_id', UserController.findUser) 
routes.put('/user/:user_id', UserController.update);
routes.put('/user/password/:user_id', UserController.updatePassword);
routes.post('/user/:user_id/favorites/:product_id', UserController.addToFavorites);
routes.get('/user/:user_id/favorites', UserController.getFavorites);
routes.delete('/user/:user_id/favorites/:product_id', UserController.removeFromFavorites);

//Product 
routes.post('/:user_id/product', upload.single('src'), ProductController.create)
routes.put('/users/:user_id/products/:product_id',upload.single('src'), ProductController.update);
routes.delete('/:user_id/product/:product_id', ProductController.deletedProduct)
routes.get('/product/cords', ProductController.indexCords)
routes.get('/product', ProductController.indexAll)
routes.get('/product/:user_id', ProductController.indexByUser)
routes.get('/product/this/:product_id', ProductController.indexProd)
//Session 
routes.post('/session', SessionController.create)

//PruductPj
routes.post('/:user_id/productPj', upload.single('src'), ProductPjController.create)
routes.delete('/:user_id/productPj/:productPj_id', ProductPjController.deletedProductPj)
routes.delete('/:user_id/productPj/:productPj_id', ProductPjController.update)
routes.get('/productPj/cords', ProductPjController.indexCords)
routes.get('/productPj', ProductPjController.indexAll)
routes.get('/productPj/:user_id', ProductPjController.indexByUser)
routes.get('/productPj/this/:productPj_id', ProductPjController.indexProd)


//chat

// Rota para obter todas as conversas
routes.get('/conversations', ConversationController.getAllChats);

routes.get('/conversations/find/:idProduct/:receiverId/:senderId', ConversationController.getChatByIdPorProducAndUser);

// Rota para criar uma nova conversa
routes.post('/conversations', ConversationController.createChat);
routes.post('/chat', ConversationController.createOrAddMessageToChat)

routes.post('/conversations/:chatId', ConversationController.addMessageToChat);

// Rota para obter uma conversa por ID
routes.get('/conversations/:id', ConversationController.getChatById);


// Rota para obter uma conversa por ID do Sender Ou Reciever
routes.get('/conversations/users/:id', ConversationController.getChatBySenderIdOrReceiverId);

routes.get('/conversations/users/:senderId/:receiverId', ConversationController.findChatsBySenderAndReceiver);
// Rota para excluir uma conversa por ID
routes.delete('/conversations/:id', ConversationController.deleteChatById);

module

module.exports = routes