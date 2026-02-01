// const { Applicant } = require('../../elJ-front/src/components/main/applicant/Applicant');
const IncorrectData_400 = require('../errors/400-incorrectData');
const NoDate_404 = require('../errors/404-noDate');
const ConflictData_409 = require('../errors/409-conflictData');
const Departure = require('../models/departure');
const Victim = require('../models/victim');
const Applicant = require('../models/applicant');
const Group = require('../models/group');
const Message = require('../models/message');

const {
  mesErrNoMessage404,
  mesErrValidationMessage400,
  mesErrConflictMessage409,
  mesErrIdMessage400,
  mesErrFixUpdateMessage404,
  mesErrNoVictim404,
  mesErrNoApplicant404,
  mesErrConflict409,
  mesErrValidation400,
  mesErrNoRiding404,
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
    team, arw, message, landmark, applicant, victim, city, street, house, porch, corpus, floor, flat, intercomCode,
    timeReceivingDeparture, dateReceivingDeparture, timeTransfer, dateTransfer,
    timeDeparture, dateDeparture, timeArrival, dateArrival, timeEnd, dateEnd, timeReturn, dateReturn,
    reasonDelay, reasonChallenge, natureChallenge, checkOutResult, elderPSG, textWorkDescription,
    assistance, participation, note, psd
  } = req.body;

  const dateUnix = (date, time) => Math.floor(new Date(`${date}, ${time}`).getTime());

  let victimArrIdMongo = [];
  let aplicantIdMongo = '';
  let groupIdMongo = '';
  // let messageIdMongo = '';
  let messageMongo = {};

  Victim.find({})
    // .then((victims) => {
    //   if (victims.length === 0) {
    //     throw new NoDate_404(mesErrNoVictim404);
    //   }
    //   return victims;
    // })
    .then((victims) => {
      victims.length > 0 &&
        victims.map((item) =>
          victim.map((el) =>
            (el?.text ?
              ((String(item.countVictim) === el?.text?.split(' ')[0]) &&
                (victimArrIdMongo = [...victimArrIdMongo, item._id])
              ) :
              ((String(item.countVictim) === el.split(' ')[0]) &&
                (victimArrIdMongo = [...victimArrIdMongo, item._id])
              )
            )
          )
        );
    })
    .then(() => {
      Applicant.find({countApplicant: Number(applicant.split(' ')[0])})
        .then((appl) => {
          if (appl.length === 0) {
            return applicant;
          }
          aplicantIdMongo = appl[0]._id
          return aplicantIdMongo;
        })
        .then((aplicantIdMongo) => {
          Group.find({countGroup: Number(team.split(' ')[0])})
            .then((gr) => {
              if (gr.length === 0) {
                return team;
              };
              groupIdMongo = gr[0]._id;
              return groupIdMongo;
            })
            .then((groupIdMongo) => {
              Message.find({countMessage: Number(message.split(' ')[0])})
                .then((mes) => {
                  if (mes.length === 0) {
                    return team;
                  }
                  messageMongo = mes[0]
                  console.log(messageMongo)
                  return messageMongo;
                })
                .then((messageMongo) => {
                  // создание вызова
                  Departure.find({})
                    .then((departures) => {
                      console.log(departures)
                      return departures.length <= 0 ? 0 : departures[departures.length - 1].countDeparture
                    })
                    .then((numberLastDeparture) => {
                      Departure.create({
                        countDeparture: numberLastDeparture + 1,
                        messageDeparture: messageMongo._id !== '' ? messageMongo._id : undefined,
                        isDeletedDeparture: false,
                        content: [{
                          // date: dateUnix,
                          dateActually: Date.now(),
                          team: groupIdMongo !== '' ? groupIdMongo : undefined,
                          arw,
                          message: Number(message.split(' ')[0]),
                          landmark,
                          applicant: aplicantIdMongo !== '' ? aplicantIdMongo : undefined,
                          victim: victimArrIdMongo.length > 0 ? victimArrIdMongo : undefined,
                          address: {city, street, house, porch, corpus, floor, flat, intercomCode},
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
                          nameUser: req.user._id
                        }],
                      })
                        .then((departure) => {
                          console.log(messageMongo)
                          messageMongo.updateOne(
                            { $set: { isCreateDeparture: true }},
                            { new: true, runValidators: true }
                          )
                            .then((messageNew) => {
                              console.log(messageNew)
                              if (messageNew.acknowledged === true
                                // && messageNew.modifiedCount > 0
                              ) {
                                res.send(departure);
                              } else {
                                throw new NoDate_404(mesErrFixUpdateMessage404);
                              }
                            })
                          // messageMongo.isCreateDeparture = true;
                          // const departureRes = {
                            // name: user.name,
                            // password: user.password,
                          // };
                          // res.send(departure);
                        })
                        .catch((err) => {
                          console.log(err);

                          if (err.name === 'ValidationError') {
                            next(new IncorrectData_400(mesErrValidation400));
                            return;
                          }
                          if (err.code === 11000) {
                            next(new ConflictData_409(mesErrConflict409));
                            return;
                          }
                          next(err);
                        });
                    })
                    .catch(next); // departure find
                })
                .catch(next); // message find
            })
            .catch(next); // group find
        })
        .catch(next); // applicant find
    })
    .catch(next); // victim find
};

module.exports.fixDeparture = (req, res, next) => {
  const {
    team, arw, message, landmark, applicant, victim, city, street, house, porch, corpus, floor, flat, intercomCode,
    timeReceivingDeparture, dateReceivingDeparture, timeTransfer, dateTransfer,
    timeDeparture, dateDeparture, timeArrival, dateArrival, timeEnd, dateEnd, timeReturn, dateReturn,
    reasonDelay, reasonChallenge, natureChallenge, checkOutResult, elderPSG, textWorkDescription,
    assistance, participation, note, psd
  } = req.body;
  // console.log(req.body);
  const dateUnix = (date, time) => Math.floor(new Date(`${date}, ${time}`).getTime());
  // const dateUnix = Math.floor(new Date(`${date}, ${time}`).getTime());

  let victimArrIdMongo = [];
  let aplicantIdMongo = '';
  let groupIdMongo = '';
  let messageIdMongoNew = '';
  let messageMongoNew = {};
  let messageMongoIdOld = '';
  let messageMongoOld = {};

  Victim.find({})
    .then((victims) => {
      // if (victims.length === 0) {
      //   throw new NoDate_404(mesErrNoVictim404);
      // }
      return victims;
    })
    .then((victims) => {
      // console.log(victims)
      // console.log(victim);
      // console.log(victim[0].text.split(' ')[0]);
      // console.log(victim[0]?.split(' ')[0]);
      // console.log(typeof victim[0].text.split(' ')[0]);
      // console.log(victims[0].countVictim)
      victims.map((item) =>
        victim.map((el) =>
          (el?.text ?
            ((String(item.countVictim) === el?.text?.split(' ')[0]) &&
              (victimArrIdMongo = [...victimArrIdMongo, item._id])
            ) :
            ((String(item.countVictim) === el.split(' ')[0]) &&
              (victimArrIdMongo = [...victimArrIdMongo, item._id])
            )
          )
        )
      );
    })
    .then(() => {
      // console.log(victimArrIdMongo)
      Applicant.find({countApplicant: Number(applicant.split(' ')[0])})
        .then((appl) => {
          if (appl.length === 0) {
            return applicant;
          }
          aplicantIdMongo = appl[0]._id;
          return aplicantIdMongo;
        })
        .then((aplicantIdMongo) => {
          Group.find({countGroup: Number(team.split(' ')[0])})
            .then((gr) => {
              // console.log(aplicantIdMongo)
              if (gr.length === 0) {
                return;
              }
              groupIdMongo = gr[0]._id
              return groupIdMongo;
            })
            .then((groupIdMongo) => {
              Message.find({countMessage: Number(message.split(' ')[0])})
                .then((mes) => {
                  // console.log(groupIdMongo)
                  if (mes.length === 0) {
                    return;
                  }
                  messageIdMongoNew = mes[0]._id;
                  messageMongoNew = mes[0]
                  return messageIdMongoNew;
                })
                .then((messageIdMongoNew) => {
                  // console.log(messageIdMongo)
                  // изменение сообщения
                  const newDeparture = {
                    dateActually: Date.now(),
                    team: groupIdMongo !== '' ? groupIdMongo : undefined,
                    arw,
                    message: Number(message.split(' ')[0]),
                    landmark,
                    applicant: aplicantIdMongo !== '' ? aplicantIdMongo : undefined,
                    victim: victimArrIdMongo.length > 0 ? victimArrIdMongo : undefined,
                    address: {city, street, house, porch, corpus, floor, flat, intercomCode},
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
                    nameUser: req.user._id
                  };
                  // console.log(newDeparture)
                  Departure.findById(
                    req.params.id,
                    // {content: [newMessage]},
                    // {content: [content,...newMessage]},
                    // { new: true, runValidators: true }
                  )
                    .then((departure) => {
                      // console.log(departure);
                      messageMongoIdOld = departure.messageDeparture
                      if (departure === null) {
                        throw new NoDate_404(mesErrNoRiding404);
                      }
                      departure.updateOne(
                        {
                          $set: { messageDeparture: messageIdMongoNew },
                          $push: { content: newDeparture }
                        },
                        { new: true, runValidators: true }
                      )
                        .then((departureNew) => {
                          // console.log(departureNew)
                          if (departureNew.acknowledged === true && departureNew.modifiedCount > 0) {
                            if (messageIdMongoNew !== messageMongoIdOld) {
                              Message.findById(messageMongoIdOld)
                                .then((mesOld) => {
                                  mesOld.updateOne(
                                    {$set: {isCreateDeparture: false}},
                                    { new: true, runValidators: true }
                                  )
                                    .then((mesOldFix) => {
                                      if (mesOldFix.acknowledged === true && mesOldFix.modifiedCount > 0) {
                                        messageMongoNew.updateOne(
                                          {$set: {isCreateDeparture: true}},
                                          { new: true, runValidators: true }
                                        )
                                          .then((mesNewFix) => {
                                            if (mesNewFix.acknowledged === true && mesNewFix.modifiedCount > 0) {
                                              res.send(departure)
                                            } else {
                                              throw new NoDate_404(mesErrFixUpdateMessage404);
                                            }
                                          })
                                      } else {
                                        throw new NoDate_404(mesErrFixUpdateMessage404);
                                      }
                                    })
                                })
                            } else {
                              res.send(departure);
                            }
                            // res.send(departure)
                          } else {
                            throw new NoDate_404(mesErrFixUpdateMessage404);
                          }
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
                          if (err.code === 11000) {
                            next(new ConflictData_409(mesErrConflict409));
                            return;
                          }
                          next(err);
                        });
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
                })
                .catch(next); // message find
            })
            .catch(next); // group find
        })
        .catch(next); // applicant find
    })
    .catch(next); // victim find
};
