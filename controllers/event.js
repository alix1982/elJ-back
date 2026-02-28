const IncorrectData_400 = require('../errors/400-incorrectData');
const NoDate_404 = require('../errors/404-noDate');
const NotAcceptable_406 = require('../errors/406-notAcceptable');
const ConflictData_409 = require('../errors/409-conflictData');
const Event = require('../models/event');
const Message = require('../models/message');

const {
  mesErrIdProgramm400,
  mesErrNoProgramm404,
  mesErrDeleteProgramm406,
  mesErrValidation400,
  mesErrConflict409,
  mesErrFixUpdate404,
  mesErrId400,
  mesErrNoEvent404,
  mesErrNoMessage404,
} = require('../utils/messageServer');

module.exports.getEvents = (req, res, next) => {
  Event.find({})
    .then((events) => {
      if (events.length === 0) {
        // throw new NoDate_404(mesErrNoProgramm404);
        res.send([])
      } else {
        res.send(events);
      }
    })
    .catch(next);
};

module.exports.createEvent = (req, res, next) => {

  const { timeEvent, dateEvent, nameEvent, descriptionEvent, listMessage } = req.body;

  const dateUnix = (date, time) => Math.floor(new Date(`${date}, ${time}`).getTime());

  // создание события
  Event.find({})
    .then((events) => {
      return events.length <= 0 ? 0 : events[events.length - 1].countEvent
    })
    .then((numberLastEvent) => {
      console.log(numberLastEvent)
      Event.create({
        countEvent: numberLastEvent + 1,
        isDeletedEvent: false,
        content: [{
          date: dateUnix(dateEvent, timeEvent),
          dateActually: Date.now(),
          nameEvent,
          descriptionEvent,
          listMessage,
          nameUser: req.user._id
        }],
      })
        .then((event) => {
          res.send(event);
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
    .catch(next);
};

module.exports.fixEvent = (req, res, next) => {
  const { timeEvent, dateEvent, nameEvent, descriptionEvent, listMessage } = req.body;
  // console.log(req.body);
  const dateUnix = (date, time) => Math.floor(new Date(`${date}, ${time}`).getTime());

  const listMessageFilter = listMessage.filter((item, index) => listMessage.indexOf(item) === index)
  // listMessage.forEach((mesFirst) => {

  // })
  // const dateUnix = Math.floor(new Date(`${date}, ${time}`).getTime());

  const newEvent = {
    date: dateUnix(dateEvent, timeEvent),
    dateActually: Date.now(),
    nameEvent,
    descriptionEvent,
    listMessage: listMessageFilter,
    nameUser: req.user._id
  };

  // console.log(newMessage);
  Event.findById(
    req.params.id,
    // {content: [newMessage]},
    // {content: [content,...newMessage]},
    // { new: true, runValidators: true }
  )
    .then((event) => {
      if (event === null) {
        throw new NoDate_404(mesErrNoEvent404);
      }

      event.updateOne(
        { $push: { content: newEvent }},
        { new: true, runValidators: true }
      )
      .then((eventNew) => {
        // console.log(eventNew)
        if (eventNew.acknowledged === true && eventNew.modifiedCount > 0) {
          res.send(eventNew)
        } else {
          throw new NoDate_404(mesErrFixUpdate404);
        }
      })
      // res.send(event)
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        next(new IncorrectData_400(mesErrId400));
        return;
      }
      if (err.name === 'TypeError') {
        next(new NoDate_404(mesErrFixUpdate404));
        return;
      }
      if (err.name === 'ValidationError') {
        return next(new IncorrectData_400(mesErrValidation400));
      }
      next(err);
    });
};

module.exports.fixMessageEvent = (req, res, next) => {
  const listEvent = req.body;

  Message.findById(req.params.idMes)
    .then((mes) => {
      if (mes === null) {
        throw new NoDate_404(mesErrNoMessage404);
      }
      return mes._id
    })
    .then((mesId) => {
      Event.find({})
        .then((events) => {
          events.forEach((event) => {
            let listMessage = event.content[event.content.length - 1].listMessage;
            const messageEvent = listMessage.find((mes) => String(mes) === String(mesId))
            const isEvent = listEvent.find((evId) => String(evId) === String(event._id))
            if (listMessage) {
              // delete mesId in event
              if (messageEvent && !isEvent) {
                listMessage = listMessage.filter((item) => String(item) !== String(mesId))
              };
              // add mesId in event
              if (!messageEvent && isEvent) {
                listMessage = [...listMessage, mesId]
              } 
            }
            // console.log(listMessage)
            const listMessageFilter = listMessage.filter((item, index) => listMessage.indexOf(item) === index)
            const newEvent = {
              date: event.content[event.content.length - 1].date,
              dateActually: Date.now(),
              nameEvent: event.content[event.content.length - 1].nameEvent,
              descriptionEvent: event.content[event.content.length - 1].descriptionEvent,
              listMessage: listMessageFilter,
              nameUser: req.user._id
            };
            // console.log(newEvent)
            // console.log('----------------------------------')
            event.updateOne(
              { $push: { content: newEvent }},
              { new: true, runValidators: true }
            )
            .then((eventNew) => {
              // console.log(eventNew)
              if (eventNew.acknowledged === true && eventNew.modifiedCount > 0) {
                // res.send(eventNew)
              } else {
                throw new NoDate_404(mesErrFixUpdate404);
              }
            })
            .catch((err) => {
              console.log(err);
              if (err.name === 'CastError') {
                next(new IncorrectData_400(mesErrId400));
                return;
              }
              if (err.name === 'TypeError') {
                next(new NoDate_404(mesErrFixUpdate404));
                return;
              }
              if (err.name === 'ValidationError') {
                return next(new IncorrectData_400(mesErrValidation400));
              }
              next(err);
            });

          })
        })
        .catch((err) => {
          console.log(err);
          if (err.name === 'CastError') {
            next(new IncorrectData_400(mesErrId400));
            return;
          }
          if (err.name === 'TypeError') {
            next(new NoDate_404(mesErrFixUpdate404));
            return;
          }
          if (err.name === 'ValidationError') {
            return next(new IncorrectData_400(mesErrValidation400));
          }
          next(err);
        });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        next(new IncorrectData_400(mesErrId400));
        return;
      }
      if (err.name === 'TypeError') {
        next(new NoDate_404(mesErrFixUpdate404));
        return;
      }
      if (err.name === 'ValidationError') {
        return next(new IncorrectData_400(mesErrValidation400));
      }
      next(err);
    });
  // })





  // listEvent.forEach((evId) => {
  //   Event.findById(evId)
  //     .then((event) => {
  //       let listMessage = event.content[event.content.length - 1].listMessage;

  //       if (!(listMessage.find((lmo) => String(lmo) === String(idMessage)))) {
  //         console.log('add');
  //         listMessage = [...listMessage, idMessage]
  //       }
  //       const newEvent = {
  //         date: event.content[event.content.length - 1].date,
  //         dateActually: Date.now(),
  //         nameEvent: event.content[event.content.length - 1].nameEvent,
  //         descriptionEvent: event.content[event.content.length - 1].descriptionEvent,
  //         listMessage: listMessage,
  //         nameUser: req.user._id
  //       };
  //       console.log(newEvent)
  //       console.log('----------------------------------')
  //       // const newEventNewList = newEvent.listMessage.push(idMessage)
  //       // console.log(newEventNewList)
  //       event.updateOne(
  //         { $push: { content: newEvent }},
  //         { new: true, runValidators: true }
  //       )
  //       .then((eventNew) => {
  //         // console.log(eventNew)
  //         if (eventNew.acknowledged === true && eventNew.modifiedCount > 0) {
  //           // res.send(eventNew)
  //         } else {
  //           throw new NoDate_404(mesErrFixUpdate404);
  //         }
  //       })
      //   .catch((err) => {
      //     console.log(err);
      //     if (err.name === 'CastError') {
      //       next(new IncorrectData_400(mesErrId400));
      //       return;
      //     }
      //     if (err.name === 'TypeError') {
      //       next(new NoDate_404(mesErrFixUpdate404));
      //       return;
      //     }
      //     if (err.name === 'ValidationError') {
      //       return next(new IncorrectData_400(mesErrValidation400));
      //     }
      //     next(err);
      //   });
      // })
  //     .catch((err) => {
  //       console.log(err);
  //       if (err.name === 'CastError') {
  //         next(new IncorrectData_400(mesErrId400));
  //         return;
  //       }
  //       if (err.name === 'TypeError') {
  //         next(new NoDate_404(mesErrFixUpdate404));
  //         return;
  //       }
  //       if (err.name === 'ValidationError') {
  //         return next(new IncorrectData_400(mesErrValidation400));
  //       }
  //       next(err);
  //     });
  // })
  res.send('Ok')
};

// ПРИ (applies = true) ЗАПРЕТ НА ИЗМЕНЕНИЕ И УДАЛЕНИЕ ПРОГРАММЫ
module.exports.deleteEvent = (req, res, next) => {
  Programm.findById(req.params._id)
    .then((programm) => {
      if (programm === null) {
        throw new NoDate_404(mesErrNoProgramm404);
      }
      if (programm.applies) {
        throw new NotAcceptable_406(mesErrDeleteProgramm406);
      }
      return programm.remove();
    })
    .then((programm) => res.send(programm))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        next(new IncorrectData_400(mesErrIdProgramm400));
        return;
      }
      next(err);
    });
};
