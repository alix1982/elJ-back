// const { resolveContent } = require("nodemailer/lib/shared");
// const IncorrectData_400 = require("../errors/400-incorrectData");
// const NoDate_404 = require("../errors/404-noDate");
// const Group = require("../models/group");
// // const User = require("../models/user");
// const { mesErrNoUser404, mesErrIdUser400, mesErrNoGroup404, mesErrValidationUser400 } = require("./messageServer");

// const todayGroups = async (user) => {
//   let groupsFilter = [];
//   // формирование массива с id групп пользователя
//   let groupsUser = [];
//   user.education.map((item)=>
//     groupsUser = [...groupsUser, String(item.group)]
//   );
//   // поиск групп по массиву id групп пользователя
//   await Group.find({ _id: {$in : groupsUser}})
//     .then((groups) => {
//       const dataToday = Date.now();
//       groupsFilter = groups.filter((group)=> ((group.dateStart <= dataToday) && (group.dateEnd >= dataToday)) );
//       // return groupsFilter;
//       res.send(groupsFilter);
//     })
//     .catch((err) => {
//       console.log(err.name);
//       if (err.name === 'CastError') {
//         next(new IncorrectData_400(mesErrIdUser400));
//         return;
//       }
//       if (err.name === 'TypeError') {
//         next(new NoDate_404(mesErrNoGroup404));
//         return;
//       };
//       if (err.name === 'ValidationError') {
//         return next(new IncorrectData_400(mesErrValidationUser400));
//       }
//       next(err);
//     });
//   await console.log(groupsFilter);
//   return groupsFilter;
// }

// module.exports = todayGroups;
