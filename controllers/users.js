const IncorrectData_400 = require('../errors/400-incorrectData');
const NoDate_404 = require('../errors/404-noDate');
const ConflictData_409 = require('../errors/409-conflictData');
const Group = require('../models/group');
const Questionnaire = require('../models/questionnaire');
const User = require('../models/user');
const {
  mesErrNoUser404,
  mesErrNoQuestionnaire404,
  mesAddProgrammUserCompleted,
  mesErrIdUser400,
  mesErrValidationUser400,
  mesErrNoGroup404,
  mesErrNoKeyFixProgrammUser400,
  mesErrNoDataFixProgrammUser400,
  mesErrFixUpdateProgrammUser,
  mesErrIdQuestionnaire400,
  mesErrValidationQuestionnaire400,
  mesErrConflictQuestionnaire409,
} = require('../utils/messageServer');
// const todayGroups = require('../utils/todayGroups');

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new NoDate_404(mesErrNoUser404);
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.getDataMe = (req, res, next) => {
  let userData = {};
  // поиск пользователя по id
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new NoDate_404(mesErrNoUser404);
      }
      return user;
    })
    .then((user) => {
      // формирование массива с id групп пользователя
      let groupsUser = [];
      user.education.map((item) => (groupsUser = [...groupsUser, String(item.group)]));
      // поиск групп по массиву id групп пользователя
      Group.find({ _id: { $in: groupsUser } })
        .then((groups) => {
          const dataToday = Date.now();
          const groupsFilter = groups.filter((group) => {
            return group.dateStart <= dataToday && group.dateEnd >= dataToday;
          });
          return groupsFilter;
        })
        .then((groupsFilter) => {
          // поиск анкеты пользователя
          Questionnaire.find({ snils: user.snils })
            .then((questionnaire) => {
              if (questionnaire === null) {
                throw new NoDate_404(mesErrNoQuestionnaire404);
              }
              // фильтрация по дате списка обучений пользователя для получения актуальных (действующих)
              const userEducationFilter = user.education.filter(
                (item) => groupsFilter.filter((group) => String(item.group) === String(group._id)).length > 0
              );
              user.education = userEducationFilter;
              userData = { user: user, questionnaire: questionnaire[0] };
              // вывод данных пользователя и его анкеты
              res.send(userData);
            })
            .catch((err) => {
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
        })
        .catch((err) => {
          console.log(err.name);
          if (err.name === 'CastError') {
            next(new IncorrectData_400(mesErrIdUser400));
            return;
          }
          if (err.name === 'TypeError') {
            next(new NoDate_404(mesErrNoGroup404));
            return;
          }
          if (err.name === 'ValidationError') {
            return next(new IncorrectData_400(mesErrValidationUser400));
          }
          next(err);
        });
    })
    .catch(next);
};

module.exports.getUserGroup = async (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new NoDate_404(mesErrNoUser404);
      }
      // const groupSort = todayGroups(user);
      // res.send(groupSort)

      // формирование массива с id групп пользователя
      let groupsUser = [];
      user.education.map((item) => (groupsUser = [...groupsUser, String(item.group)]));
      // поиск групп по массиву id групп пользователя
      Group.find({ _id: { $in: groupsUser } })
        .then((groups) => {
          const dataToday = Date.now();
          const groupsFilter = groups.filter((group) => {
            return group.dateStart <= dataToday && group.dateEnd >= dataToday;
          });
          res.send(groupsFilter);
          // res.send(groups)
        })
        .catch((err) => {
          console.log(err.name);
          if (err.name === 'CastError') {
            next(new IncorrectData_400(mesErrIdUser400));
            return;
          }
          if (err.name === 'TypeError') {
            next(new NoDate_404(mesErrNoGroup404));
            return;
          }
          if (err.name === 'ValidationError') {
            return next(new IncorrectData_400(mesErrValidationUser400));
          }
          next(err);
        });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        next(new IncorrectData_400(mesErrIdUser400));
        return;
      }
      if (err.name === 'TypeError') {
        next(new NoDate_404(mesErrNoGroup404));
        return;
      }
      if (err.name === 'ValidationError') {
        return next(new IncorrectData_400(mesErrValidationUser400));
      }
      next(err);
    });
  // .catch(next);
};

module.exports.patchUserProgramm = (req, res, next) => {
  const { thema, block, keyChange } = req.body;
  const { id } = req.params;

  // поиск пользователя по id
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new NoDate_404(mesErrNoUser404);
      }
      // поиск индекса группы в массиве групп пользователя
      const groupIndex = user.education.findIndex((item) => String(item.group) === id);
      if (groupIndex < 0) {
        throw new NoDate_404(mesErrNoGroup404);
      }
      // поиск id группы пользователя в списке групп пользователя
      const groupId = user.education.find((item) => String(item.group) === id).group;
      const time = new Date().getTime();
      // const educationUser = user.education[groupIndex].programm;
      // получение обьекта блоков обучения нужной программы пользователя
      const educationUserBlocks = user.education[groupIndex].programm.blocks;

      // начало темы пользователем
      if (keyChange === 'start') {
        try {
          educationUserBlocks[`block${block}`][`thema${thema}`].timestart = time;
        } catch (error) {
          throw new IncorrectData_400(mesErrNoDataFixProgrammUser400);
        }

        return user.updateOne(
          {
            $set: {
              'education.$[idGroup].programm.blocks': educationUserBlocks,
            },
          },
          {
            new: true,
            runValidators: true,
            arrayFilters: [{ 'idGroup.group': { $eq: groupId } }],
          }
        );
      } else if (keyChange === 'end') {
        // окончание темы пользователем
        try {
          educationUserBlocks[`block${block}`][`thema${thema}`].timeend = time;
          educationUserBlocks[`block${block}`][`thema${thema}`].passed = true;
        } catch (error) {
          throw new IncorrectData_400(mesErrNoDataFixProgrammUser400);
        }

        return user.updateOne(
          {
            $set: {
              'education.$[idGroup].programm.blocks': educationUserBlocks,
            },
          },
          {
            new: true,
            runValidators: true,
            arrayFilters: [{ 'idGroup.group': { $eq: groupId } }],
          }
        );
      } else if (keyChange === 'testBlock') {
        // успешное прохождение промежуточного теста (в блоке)

        try {
          educationUserBlocks[`block${block}`].test.passed = true;
          educationUserBlocks[`block${block}`].test.time = time;
        } catch (error) {
          throw new IncorrectData_400(mesErrNoDataFixProgrammUser400);
        }

        return user.updateOne(
          {
            $set: {
              'education.$[idGroup].programm.blocks': educationUserBlocks,
            },
          },
          {
            new: true,
            runValidators: true,
            arrayFilters: [{ 'idGroup.group': { $eq: groupId } }],
          }
        );
      } else if (keyChange === 'testStart') {
        // прохождение входного теста
        return user.updateOne(
          {
            $set: {
              'education.$[idGroup].programm.startTest.passed': true,
              'education.$[idGroup].programm.startTest.time': time,
            },
          },
          {
            new: true,
            runValidators: true,
            arrayFilters: [{ 'idGroup.group': { $eq: groupId } }],
          }
        );
      } else if (keyChange === 'testFinally') {
        // успешное прохождение финального теста
        return user.updateOne(
          {
            $set: {
              'education.$[idGroup].programm.finallyTest.passed': true,
              'education.$[idGroup].programm.finallyTest.time': time,
            },
          },
          {
            new: true,
            runValidators: true,
            arrayFilters: [{ 'idGroup.group': { $eq: groupId } }],
          }
        );
      } else {
        throw new IncorrectData_400(mesErrNoKeyFixProgrammUser400);
      }
    })
    .then((userNew) => {
      if (userNew.acknowledged === true) {
        // формирование ответа при положительном прохождении запроса
        User.findById(req.user._id).then((user) => {
          if (user === null) {
            throw new NoDate_404(mesErrNoUser404);
          }
          const groupIndex = user.education.findIndex((item) => String(item.group) === id);
          return res.send({
            message: mesAddProgrammUserCompleted,
            userGroup: user.education[groupIndex],
          });
        });
      } else {
        // формирование ответа при отрицательном прохождении запроса
        return res.send({
          userNew: userNew,
          message: mesErrFixUpdateProgrammUser,
        });
      }
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        next(new IncorrectData_400(mesErrIdUser400));
        return;
      }
      if (err.name === 'TypeError') {
        next(new NoDate_404(mesErrFixUpdateProgrammUser));
        return;
      }
      if (err.name === 'ValidationError') {
        return next(new IncorrectData_400(mesErrValidationUser400));
      }
      next(err);
    });
};
