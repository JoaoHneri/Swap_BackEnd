const Chat = require('../Models/Chat');

const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate('sender', 'username')
      .populate('receiver', 'username');
      
    res.json(chats);
  } catch (error) {
    console.error('Erro ao obter os chats:', error);
    res.status(500).json({ error: 'Erro ao obter os chats' });
  }
};

const createChat = async (req, res) => {
  const { senderId, receiverId, messages } = req.body;

  try {
    const newChat = await Chat.create({
      sender: senderId,
      receiver: receiverId,
      messages,
    });

    res.json(newChat);
  } catch (error) {
    console.error('Erro ao criar o chat:', error);
    res.status(500).json({ error: 'Erro ao criar o chat' });
  }
};


const getChatById = async (req, res) => {
  const chatId = req.params.id;

  try {
    const chat = await Chat.findById(chatId)
      .populate('sender', 'username')
      .populate('receiver', 'username');
      
    if (!chat) {
      return res.status(404).json({ error: 'Chat não encontrado' });
    }

    res.json(chat);
  } catch (error) {
    console.error('Erro ao obter o chat:', error);
    res.status(500).json({ error: 'Erro ao obter o chat' });
  }
};


const deleteChatById = async (req, res) => {
  const chatId = req.params.id;

  try {
    const deletedChat = await Chat.findByIdAndDelete(chatId);

    if (!deletedChat) {
      return res.status(404).json({ error: 'Chat não encontrado' });
    }

    res.json({ message: 'Chat excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir o chat:', error);
    res.status(500).json({ error: 'Erro ao excluir o chat' });
  }
};

const getChatBySenderIdOrReceiverId = async (req, res) => {
  try {
    const { id } = req.params;

    const chats = await Chat.find({
      $or: [{ sender: id }, { receiver: id }]
    })
      .populate('sender', 'username')
      .populate('receiver', 'username');

    res.json(chats);
  } catch (error) {
    console.error('Erro ao obter a conversa:', error);
    res.status(500).json({ error: 'Erro ao obter a conversa' });
  }
};

const addMessageToChat = async (req, res) => {
  const { chatId } = req.params;
  const { userId, content } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat não encontrado' });
    }

    chat.messages.push({ userId, content });

    const updatedChat = await chat.save();

    res.json(updatedChat);
  } catch (error) {
    console.error('Erro ao adicionar mensagem ao chat:', error);
    res.status(500).json({ error: 'Erro ao adicionar mensagem ao chat' });
  }
};







module.exports = {
  getAllChats,
  createChat,
  getChatById,
  deleteChatById,
  getChatBySenderIdOrReceiverId,
  addMessageToChat
};
