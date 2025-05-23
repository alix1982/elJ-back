const IncorrectData_400 = require('../errors/400-incorrectData');
const NoDate_404 = require('../errors/404-noDate');
const NotAcceptable_406 = require('../errors/406-notAcceptable');
const ConflictData_409 = require('../errors/409-conflictData');
const Programm = require('../models/programm');
const Group = require('../models/group');
const User = require('../models/user');
const Questionnaire = require('../models/questionnaire');

const {
  mesErrValidationGroup400,
  mesErrConflictGroup409,
  mesErrNoGroup404,
  mesErrDeleteGroup406,
  mesErrIdGroup400,
  mesErrValidationProgramm400,
  mesErrConflictProgramm409,
  mesErrNoProgramm404,
  mesErrIdProgramm400,
  mesErrNoUsers404,
  mesErrNoUsersInGroup404,
  mesErrNoQuestionnaire404,
  mesErrIdQuestionnaire400,
  mesErrValidationQuestionnaire400,
  mesErrConflictQuestionnaire409,
  mesErrValidation400,
  mesErrConflict409,
  mesErrFixUpdate404,
  mesErrId400,
} = require('../utils/messageServer');
const questionnaire = require('../models/questionnaire');

module.exports.getGroups = (req, res, next) => {
  // поиск групп
  Group.find({})
    .then((groups) => {
      if (groups.length === 0) {
        throw new NoDate_404(mesErrNoGroup404);
      }
      res.send(groups);
    })
    .catch(next);
};

module.exports.createGroup = (req, res, next) => {
  // console.log('1')
  const { nameGroup, timeStartGroup, dateStartGroup, timeEndGroup, dateEndGroup, groupDescription, elderPSG, technicPSO } = req.body;

  const dateUnix = (date, time) => Math.floor(new Date(`${date}, ${time}`).getTime());
  // создание сообщения
  Group.find({})
    .then((groups) => {
      // console.log(groups);
      // console.log(groups.length <= 0 ? 0 : groups[groups.length - 1].countGroup)
      return groups.length <= 0 ? 0 : groups[groups.length - 1].countGroup
      // return messages.length
    })
    .then((numberLastGroup) => {
      // console.log(numberLastGroup);
      Group.create({
        countGroup: numberLastGroup + 1,
        content: [{
          dateActually: Date.now(),
          nameGroup,
          groupDescription,
          time: {
            dateStartGroup: dateUnix(dateStartGroup, timeStartGroup),
            dateEndGroup: dateUnix(dateEndGroup, timeEndGroup),
          },
          elderPSG,
          technicPSO,
          nameUser: req.user._id
        }],
      })
        .then((group) => {
          // const departureRes = {
            // name: user.name,
            // password: user.password,
          // };
          res.send(group);
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



  // // изменение статуса использования программы
  // Programm.findOneAndUpdate({ name: programmName }, { applies: true }, { new: true, runValidators: true }).then((prog) => {
  //   if (prog === null) {
  //     throw new NoDate_404(mesErrNoProgramm404);
  //   }
  //   Group.create({
  //     name,
  //     assigned: false,
  //     dateStart,
  //     dateEnd,
  //     programm: prog,
  //   })
  //     .then((group) => {
  //       res.send(group);
  //     })
  //     .catch((err) => {
  //       console.log(err.name);

  //       if (err.name === 'ValidationError') {
  //         next(new IncorrectData_400(mesErrValidationGroup400));
  //         return;
  //       }
  //       if (err.code === 11000) {
  //         next(new ConflictData_409(mesErrConflictGroup409));
  //         return;
  //       }
  //       next(err);
  //     });
  // });
};

module.exports.fixGroup = (req, res, next) => {
  const { nameGroup, timeStartGroup, dateStartGroup, timeEndGroup, dateEndGroup, groupDescription, elderPSG, technicPSO } = req.body;
  // console.log(req.body);
  const dateUnix = (date, time) => Math.floor(new Date(`${date}, ${time}`).getTime());

  // const dateUnix = Math.floor(new Date(`${date}, ${time}`).getTime());

  const newGroup = {
    dateActually: Date.now(),
    nameGroup,
    groupDescription,
    time: {
      dateStartGroup: dateUnix(dateStartGroup, timeStartGroup),
      dateEndGroup: dateUnix(dateEndGroup, timeEndGroup),
    },
    elderPSG,
    technicPSO,
    nameUser: req.user._id
  };

  // console.log(newMessage);
  Group.findById(
    req.params.id,
    // {content: [newMessage]},
    // {content: [content,...newMessage]},
    // { new: true, runValidators: true }
  )
    .then((group) => {
      if (group === null) {
        throw new NoDate_404(mesErrNoGroup404);
      }

      group.updateOne(
        { $push: { content: newGroup }},
        { new: true, runValidators: true }
      )
      .then((groupNew) => {
        // console.log(messegeNew)
        if (groupNew.acknowledged === true && groupNew.modifiedCount > 0) {
          res.send(groupNew)
        } else {
          throw new NoDate_404(mesErrFixUpdate404);
        }
      })
      // res.send(message)
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

module.exports.getGroup = (req, res, next) => {
  let usersSortSnils = []; // массив со снилсами пользователей и статусом прохождения программы
  let questionnaireSortGroup = []; // массив со анкетными данными пользователей и статусом прохождения программы
  User.find({})
    .then((users) => {
      if (users === null) {
        throw new NoDate_404(mesErrNoUsers404);
      }
      // формирование массива со снилсами пользователей и статусом прохождения программы (по результатам итогового теста)
      users.map((user) =>
        user.education.map(
          (usEd) =>
            String(usEd.group) === String(req.params._id) &&
            (usersSortSnils = [...usersSortSnils, { snils: user.snils, test: usEd.programm.finallyTest.passed }])
        )
      );
      if (usersSortSnils.length === 0) {
        throw new NoDate_404(mesErrNoUsersInGroup404);
      } else {
        return usersSortSnils;
      }
    })
    .then((usersSortSnils) => {
      usersSortSnils.map((userSnils) => {
        // поиск анкетных данных пользователей по снилсам для ответа на запрос
        Questionnaire.find({ snils: userSnils.snils })
          .then((questionnaireUser) => {
            if (questionnaireUser === null) {
              throw new NoDate_404(mesErrNoQuestionnaire404);
            }
            return (questionnaireSortGroup = [
              ...questionnaireSortGroup,
              { questionnaire: questionnaireUser[0], test: userSnils.test },
            ]);
          })
          .then((questionnaireSortGroup) => {
            if (questionnaireSortGroup.length === usersSortSnils.length) {
              res.send(questionnaireSortGroup);
            }
          })
          .catch((err) => {
            console.log(err.name);
            if (err.name === 'CastError') {
              next(new IncorrectData_400(mesErrIdQuestionnaire400));
              return;
            }
            if (err.name === 'ValidationError') {
              return next(new IncorrectData_400(mesErrValidationQuestionnaire400));
            }
            if (err.code === 11000) {
              return next(new ConflictData_409(mesErrConflictQuestionnaire409));
            }
            next(err);
          });
      });
    })
    .catch(next);
};

module.exports.deleteGroup = (req, res, next) => {
  Group.findById(req.params._id)
    .then((group) => {
      if (group === null) {
        throw new NoDate_404(mesErrNoGroup404);
      }
      // запрет удаления группы назначенной пользователям
      if (group.assigned) {
        throw new NotAcceptable_406(mesErrDeleteGroup406);
      }
      return group.remove();
    })
    .then((group) => {
      Group.find({})
        .then((groups) => {
          if (groups.length === 0) {
            throw new NoDate_404(mesErrNoGroup404);
          }
          // формирование массива групп в которых используется такая же программа
          let groupsProgramm = [];
          groups.map(
            (groupProgramm) =>
              String(groupProgramm.programm) === String(group.programm) && (groupsProgramm = [...groupsProgramm, groupProgramm])
          );
          if (groupsProgramm.length <= 0) {
            // изменение статуса applies у программы если она никому не назначена
            Programm.findByIdAndUpdate(group.programm, { applies: false }, { new: true, runValidators: true })
              .then((programm) => {
                if (programm === null) {
                  throw new NoDate_404(mesErrNoProgramm404);
                }
                res.send(group);
              })
              .catch((err) => {
                console.log(err.name);
                if (err.name === 'TypeError') {
                  next(new NoDate_404(mesErrNoProgramm404));
                  return;
                }
                if (err.name === 'CastError') {
                  next(new IncorrectData_400(mesErrIdProgramm400));
                  return;
                }
                if (err.name === 'ValidationError') {
                  next(new IncorrectData_400(mesErrValidationProgramm400));
                  return;
                }
                if (err.code === 11000) {
                  next(new ConflictData_409(mesErrConflictProgramm409));
                  return;
                }
                next(err);
              });
          } else {
            res.send(group);
          }
        })
        .catch((err) => {
          console.log(err.name);
          next(err);
        });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        next(new IncorrectData_400(mesErrIdGroup400));
        return;
      }
      next(err);
    });
};
