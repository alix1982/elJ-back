// перевод даты из UNIX в человеческую
const calcDate = (dateUnix) => {
  const month = new Date(dateUnix).getMonth() < 9 ? '0' + (new Date(dateUnix).getMonth() + 1) : new Date(dateUnix).getMonth() + 1;
  const day = new Date(dateUnix).getDate() < 10 ? '0' + new Date(dateUnix).getDate() : new Date(dateUnix).getDate();
  return day + '.' + month + '.' + new Date(dateUnix).getFullYear();
};

module.exports = calcDate;

// module.exports.calcDate = (dateUnix) => {
//   const month = new Date(dateUnix).getMonth() < 9 ? '0' + (new Date(dateUnix).getMonth() + 1) : new Date(dateUnix).getMonth() + 1;
//   const day = new Date(dateUnix).getDate() < 10 ? '0' + new Date(dateUnix).getDate() : new Date(dateUnix).getDate();
//   return day + '.' + month + '.' + new Date(dateUnix).getFullYear();
// };

// module.exports.calcDateMongo = (dateUnix) => {
//   const month = new Date(dateUnix).getMonth() < 9 ? '0' + (new Date(dateUnix).getMonth() + 1) : new Date(dateUnix).getMonth() + 1;
//   const day = new Date(dateUnix).getDate() < 10 ? '0' + new Date(dateUnix).getDate() : new Date(dateUnix).getDate();

//   return new Date(dateUnix).getFullYear() + '-' + month + '-' + day;
// };
