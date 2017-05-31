/**
 *  従業員連絡先 - Employee
 *
 *  担当者の連絡先を管理する。
 */
const employeeList = {
  "高橋": "+81XXXXXXXXXX",
  "齋藤,斉藤,齊藤,斎藤": "+81XXXXXXXXXX",
  "青木": "+81XXXXXXXXXX",
  "伊藤,伊東": "+81XXXXXXXXXX",
  "金古,金子": "+81XXXXXXXXXX",
};

exports.handler = function(context, event, callback) {
  if (event.getHints !== undefined) { // Gather動詞のHintsパラメータを生成
    let hints = '';
    Object.keys(employeeList).forEach(function(employeeName) {
      hints += employeeName + ',';
    });
    callback(null, hints);
  } else if (event.checkEmployee !== undefined) { // 担当者を検索し、担当者名と連絡先を返す
    let result = event.result || '';
    let ret = ''
    Object.keys(employeeList).forEach(function(employeeName) {
      nameList = employeeName.split(",");
      nameList.forEach(function(name) {
        if (result.indexOf(name) !== -1) {
          ret = {'name': name, 'number': employeeList[employeeName]};
          callback(null, ret);
        }
      });
    });
    callback(null, ret);
  } else {
    callback(null, 'OK');
  }
};
