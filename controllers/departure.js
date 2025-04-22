const IncorrectData_400 = require('../errors/400-incorrectData');
const NoDate_404 = require('../errors/404-noDate');
const ConflictData_409 = require('../errors/409-conflictData');
const Departure = require('../models/departure');
const {
  mesErrNoMessage404,
  mesErrValidationMessage400,
  mesErrConflictMessage409,
  mesErrIdMessage400,
  mesErrFixUpdateMessage404,
} = require('../utils/messageServer');

module.exports.getDepartures = (req, res, next) => {
  Departure.find({})
    .then((departures) => {
      if (departures.length === 0) {
        throw new NoDate_404(mesErrNoMessage404);
      }
      res.send(departures);
    })
    .catch(next);
};

module.exports.createDeparture = (req, res, next) => {
  const {
    team, arw, message, landmark, street, house, porch, corpus, floor, flat, intercomCode,
    timeReceivingDeparture, dateReceivingDeparture, timeTransfer, dateTransfer,
    timeDeparture, dateDeparture, timeArrival, dateArrival, timeEnd, dateEnd, timeReturn, dateReturn,
    reasonDelay, reasonChallenge, natureChallenge, checkOutResult, elderPSG, textWorkDescription,
    assistance, participation, note, psd
  } = req.body;

  const dateUnix = (date, time) => Math.floor(new Date(`${date}, ${time}`).getTime());

  // создание сообщения
  Departure.find({})
    .then((departures) => {
      return departures.length <= 0 ? 0 : departures[departures.length - 1].countDeparture
      // return messages.length
    })
    .then((numberLastDeparture) => {
      // console.log(numberLastMessage);
      Departure.create({
        countDeparture: numberLastDeparture + 1,
        content: [{
          // date: dateUnix,
          dateActually: Date.now(),
          team, arw, message, landmark,
          address: {street, house, porch, corpus, floor, flat, intercomCode},
          time: {
            dateReceivingDeparture: dateUnix(dateReceivingDeparture, timeReceivingDeparture),
            dateTransfer: dateUnix(dateTransfer, timeTransfer),
            dateDeparture: dateUnix(dateDeparture, timeDeparture),
            dateArrival: dateUnix(dateArrival, timeArrival),
            dateEnd: dateUnix(dateEnd, timeEnd),
            dateReturn: dateUnix(dateReturn, timeReturn),
          },
          reasonDelay, reasonChallenge, natureChallenge, checkOutResult, elderPSG, textWorkDescription,
          assistance, participation,
          note, psd,
          // receipts, text,
          // typeMessage: {psychological: psychological, social: social, fire: fire, emergencyTrees: emergencyTrees, chemistry: chemistry},
          // textBlackList,
          // note, psd, binding, nameUser,
          // phone: {aon: phoneAON, feedback: phoneFeedback},
          // typeProcessing: {typeProcessingWhom, typeProcessingHow},
          nameUser: req.user._id
        }],
      })
        .then((departure) => {
          const departureRes = {
            // name: user.name,
            // password: user.password,
          };
          res.send(departure);
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

module.exports.fixDeparture = (req, res, next) => {
  const {
    team, arw, message, landmark, street, house, porch, corpus, floor, flat, intercomCode,
    timeReceivingDeparture, dateReceivingDeparture, timeTransfer, dateTransfer,
    timeDeparture, dateDeparture, timeArrival, dateArrival, timeEnd, dateEnd, timeReturn, dateReturn,
    reasonDelay, reasonChallenge, natureChallenge, checkOutResult, elderPSG, textWorkDescription,
    assistance, participation, note, psd
  } = req.body;
  // console.log(req.body);
  const dateUnix = (date, time) => Math.floor(new Date(`${date}, ${time}`).getTime());

  // const dateUnix = Math.floor(new Date(`${date}, ${time}`).getTime());

  const newDeparture = {
        dateActually: Date.now(),
        team, arw, message, landmark,
        address: {street, house, porch, corpus, floor, flat, intercomCode},
        time: {
          dateReceivingDeparture: dateUnix(dateReceivingDeparture, timeReceivingDeparture),
          dateTransfer: dateUnix(dateTransfer, timeTransfer),
          dateDeparture: dateUnix(dateDeparture, timeDeparture),
          dateArrival: dateUnix(dateArrival, timeArrival),
          dateEnd: dateUnix(dateEnd, timeEnd),
          dateReturn: dateUnix(dateReturn, timeReturn),
        },
        reasonDelay, reasonChallenge, natureChallenge, checkOutResult, elderPSG, textWorkDescription,
        assistance, participation,
        note, psd,
        // receipts, text,
        // typeMessage: {psychological: psychological, social: social, fire: fire, emergencyTrees: emergencyTrees, chemistry: chemistry},
        // textBlackList,
        // note, psd, binding, nameUser,
        // phone: {aon: phoneAON, feedback: phoneFeedback},
        // typeProcessing: {typeProcessingWhom, typeProcessingHow},
        nameUser: req.user._id
      };

  // console.log(newMessage);
  Departure.findById(
    req.params.id,
    // {content: [newMessage]},
    // {content: [content,...newMessage]},
    // { new: true, runValidators: true }
  )
    .then((departure) => {
      if (departure === null) {
        throw new NoDate_404(mesErrNoMessage404);
      }

      departure.updateOne(
        { $push: { content: newDeparture }},
        { new: true, runValidators: true }
      )
      .then((departureNew) => {
        // console.log(messegeNew)
        if (departureNew.acknowledged === true && departureNew.modifiedCount > 0) {
          res.send(departureNew)
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
