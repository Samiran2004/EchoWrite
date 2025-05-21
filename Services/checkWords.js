const Filter = require('bad-words');
module.exports = function checkWord(text) {
    const filter = new Filter();
    filter.isProfane(text) ? true : false;
}