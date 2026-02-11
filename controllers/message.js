const IncorrectData_400 = require('../errors/400-incorrectData');
const NoDate_404 = require('../errors/404-noDate');
const ConflictData_409 = require('../errors/409-conflictData');
const Message = require('../models/message');
const {
  mesErrNoMessage404,
  mesErrValidationMessage400,
  mesErrConflictMessage409,
  mesErrIdMessage400,
  mesErrFixUpdateMessage404,
} = require('../utils/messageServer');

module.exports.getMessages = (req, res, next) => {
  Message.find({})
    .then((messages) => {
      if (messages.length === 0) {
        throw new NoDate_404(mesErrNoMessage404);
      }
      res.send(messages);
    })
    .catch(next);
};

module.exports.createMessage = (req, res, next) => {
  const {
    date, time, receipts, phoneAON, phoneFeedback, text,
    criterion1, criterion2, criterion3, criterion4, criterion5, textBlackList,
    city, street, house, porch, corpus, floor, flat, intercomCode,
    typeProcessingWhom, typeProcessingHow, redirection, note, psd, binding, nameUser
  } = req.body;

  // psychological/social/fire/emergencyTrees/chemistry

  const dateUnix = Math.floor(new Date(`${date}, ${time}`).getTime());

  // создание сообщения
  Message.find({})
    .then((messages) => {
      return messages.length <= 0 ? 0 : messages[messages.length - 1].countMessage
      // return messages.length
    })
    .then((numberLastMessage) => {
      // console.log(numberLastMessage);
      Message.create({
        countMessage: numberLastMessage + 1,
        isDeletedMessage: false,
        content: [{
          date: dateUnix,
          dateActually: Date.now(),
          receipts, text,
          typeMessage: {criterion1: criterion1, criterion2: criterion2, criterion3: criterion3, criterion4: criterion4, criterion5: criterion5},
          textBlackList,
          note, psd, binding, nameUser,
          phone: {aon: phoneAON, feedback: phoneFeedback},
          address: {city, street, house, porch, corpus, floor, flat, intercomCode},
          typeProcessing: {typeProcessingWhom, typeProcessingHow, redirection},
          nameUser: req.user._id
        }],
        isCreateDeparture: false
      })
        .then((message) => {
          const messageRes = {
            // name: user.name,
            // password: user.password,
          };
          res.send(message);
        })
        .catch((err) => {
          console.log(err);

          if (err.name === 'ValidationError') {
            next(new IncorrectData_400(mesErrValidationMessage400));
            return;
          }
          if (err.code === 11000) {
            next(new ConflictData_409(mesErrConflictMessage409));
            return;
          }
          next(err);
        });
    })
    .catch(next);
};

module.exports.fixMessage = (req, res, next) => {
  const {
    date, time, receipts, phoneAON, phoneFeedback, text,
    criterion1, criterion2, criterion3, criterion4, criterion5, textBlackList,
    city, street, house, porch, corpus, floor, flat, intercomCode,
    typeProcessingWhom, typeProcessingHow, redirection, note, psd, binding, nameUser
  } = req.body;

  // psychological/social/fire/emergencyTrees/chemistry

  const dateUnix = Math.floor(new Date(`${date}, ${time}`).getTime());
  const newMessage = {
        date: dateUnix,
        dateActually: Date.now(),
        receipts: receipts,
        text: text,
        typeMessage: {
          criterion1: criterion1,
          criterion2: criterion2,
          criterion3: criterion3,
          criterion4: criterion4,
          criterion5: criterion5
        },
        // textBlackList,
        note: note,
        psd: psd,
        binding: binding,
        nameUser: req.user._id,
        phone: {aon: phoneAON, feedback: phoneFeedback},
        address: {
          city: city,
          street: street,
          house: house,
          porch: porch,
          corpus: corpus,
          floor: floor,
          flat: flat,
          intercomCode: intercomCode
        },
        typeProcessing: {typeProcessingWhom: typeProcessingWhom, typeProcessingHow: typeProcessingHow, redirection: redirection},
        // nameUser: 'ddd',
      };

  // console.log(newMessage);
  Message.findById(
    req.params.id,
    // {content: [newMessage]},
    // {content: [content,...newMessage]},
    // { new: true, runValidators: true }
  )
    .then((message) => {
      if (message === null) {
        throw new NoDate_404(mesErrNoMessage404);
      }

      message.updateOne(
        { $push: { content: newMessage }},
        { new: true, runValidators: true }
      )
      .then((messegeNew) => {
        // console.log(messegeNew)
        if (messegeNew.acknowledged === true && messegeNew.modifiedCount > 0) {
          res.send(message)
        } else {
          throw new NoDate_404(mesErrFixUpdateMessage404);
        }
      })
      // res.send(message)
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        next(new IncorrectData_400(mesErrIdMessage400));
        return;
      }
      if (err.name === 'TypeError') {
        next(new NoDate_404(mesErrFixUpdateMessage404));
        return;
      }
      if (err.name === 'ValidationError') {
        return next(new IncorrectData_400(mesErrValidationMessage400));
      }
      next(err);
    });
};
