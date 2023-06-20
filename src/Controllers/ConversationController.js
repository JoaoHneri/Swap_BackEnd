const Conversation = require('../Models/Conversation');


const getAllConversations = (req, res) => {
  Conversation.find()
    .then(conversations => {
      res.json(conversations);
    })
    .catch(error => {
      console.error('Erro ao obter as conversas:', error);
      res.status(500).json({ error: 'Erro ao obter as conversas' });
    });
};


const createConversation = (req, res) => {
  const { conversationId, senderId, recipientId, message } = req.body;

  const newConversation = new Conversation({
    conversationId,
    senderId,
    recipientId,
    message,
  });ss
  newConversation.save()
    .then(savedConversation => {
      res.json(savedConversation);
    })
    .catch(error => {
      console.error('Erro ao criar a conversa:', error);
      res.status(500).json({ error: 'Erro ao criar a conversa' });
    });
};

const getConversationById = (req, res) => {
  const conversationId = req.params.id;

  Conversation.findById(conversationId)
    .then(conversation => {
      if (!conversation) {
        return res.status(404).json({ error: 'Conversa não encontrada' });
      }
      res.json(conversation);
    })
    .catch(error => {
      console.error('Erro ao obter a conversa:', error);
      res.status(500).json({ error: 'Erro ao obter a conversa' });
    });
};

const updateConversationById = (req, res) => {
  const conversationId = req.params.id;
  const { message } = req.body;

  Conversation.findByIdAndUpdate(conversationId, { message }, { new: true })
    .then(updatedConversation => {
      if (!updatedConversation) {
        return res.status(404).json({ error: 'Conversa não encontrada' });
      }
      res.json(updatedConversation);
    })
    .catch(error => {
      console.error('Erro ao atualizar a conversa:', error);
      res.status(500).json({ error: 'Erro ao atualizar a conversa' });
    });
};


const deleteConversationById = (req, res) => {
  const conversationId = req.params.id;

  Conversation.findByIdAndDelete(conversationId)
    .then(deletedConversation => {
      if (!deletedConversation) {
        return res.status(404).json({ error: 'Conversa não encontrada' });
      }
      res.json({ message: 'Conversa excluída com sucesso' });
    })
    .catch(error => {
      console.error('Erro ao excluir a conversa:', error);
      res.status(500).json({ error: 'Erro ao excluir a conversa' });
    });
};

module.exports = {
  getAllConversations,
  createConversation,
  getConversationById,
  updateConversationById,
  deleteConversationById
};
