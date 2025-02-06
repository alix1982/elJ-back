const IncorrectData_400 = require('../errors/400-incorrectData');
const NoDate_404 = require('../errors/404-noDate');
const NotAcceptable_406 = require('../errors/406-notAcceptable');
const ConflictData_409 = require('../errors/409-conflictData');
const Programm = require('../models/programm');

const {
  mesErrValidationProgramm400,
  mesErrCreateProgramm406,
  mesErrConflictProgramm409,
  mesErrIdProgramm400,
  mesErrNoProgramm404,
  mesErrDeleteProgramm406,
} = require('../utils/messageServer');

module.exports.getProgramms = (req, res, next) => {
  Programm.find({})
    .then((programms) => {
      if (programms.length === 0) {
        throw new NoDate_404(mesErrNoProgramm404);
      }
      res.send(programms);
    })
    .catch(next);
};

module.exports.createProgramm = (req, res, next) => {
  // на вход передаем обьект данных
  // {
  //   name: "программа", название программы
  //   blockCount: 3, количество блоков
  //   themaCount: [1, 2, 3] количество тем в блоках (длина массива равна blockCount)
  // }

  const { name, blockCount, themaCount } = req.body;

  // проверка длины массива themaCount на равенство количеству блокв
  if (blockCount !== themaCount.length) {
    next(new NotAcceptable_406(mesErrCreateProgramm406));
    return;
  }

  // создание массива с блоками
  // const blocks = [...Array(blockCount)].map((block, index) =>
  //   block = {[`block${index+1}`]: [...Array(themaCount[index])].map(
  //       (thema, index)=> thema = {[`thema${index+1}`]: { timestart: 0, timeend: 0, passed: false }}
  //     )}
  // );

  // создание обьекта с блоками
  const createBlocks = () => {
    const blocksObj = {};

    const createThema = (i) => {
      const themesObj = {};
      for (let j = 0; j < themaCount[i]; j++) {
        themesObj[`thema${j + 1}`] = {
          timestart: 0,
          timeend: 0,
          passed: false,
          name: `thema${j + 1}`,
        };
      }
      return themesObj;
    };

    for (let i = 0; i < blockCount; i++) {
      blocksObj[`block${i + 1}`] = createThema(i);
      blocksObj[`block${i + 1}`].name = `block${i + 1}`;
      blocksObj[`block${i + 1}`].test = { time: 0, passed: false };
    }
    return blocksObj;
  };

  Programm.create({
    name: name,
    applies: false,
    startTest: { time: 0, passed: false },
    blocks: createBlocks(),
    finallyTest: { time: 0, passed: false },
  })
    .then((programm) => {
      res.send(programm);
    })
    .catch((err) => {
      console.log(err.name);

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
};

// ПРИ (applies = true) ЗАПРЕТ НА ИЗМЕНЕНИЕ И УДАЛЕНИЕ ПРОГРАММЫ
module.exports.deleteProgramm = (req, res, next) => {
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
