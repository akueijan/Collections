/**
 * @constructor
 * @classdesc 管理會員相關資訊。
 * @param {string} name 姓名
 * @param {date} birth 生日
 * @throws {InvalidArgumentsException} birth不為生日格式。
 * @author Yoshihiro Yamada
 * @version 1.0.0
 */
var Person = function(name, birth) {
  this._name = name;
  this._birth = birth;
};

/**
 * 顯示會員相關資訊。
 * @param {Boolean} 是否顯示isDetails 進階資訊
 * @return {String} 會員進階資訊
 * @deprecated {@link Person#toString}請改用方法。
 */
Person.prototype.show = function(isDetails) {
．．．省略．．．
};


/**
 * 將Person類別的內容轉換成字串。
 * @return {String} 會員進階資訊
 */
Person.prototype.toString = function() {
．．．省略．．．
};
