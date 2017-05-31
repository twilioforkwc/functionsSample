/**
 *  受付サンプル - Redirect
 *
 *  CallingからGather経由で呼ばれ、担当者に電話をかける。
 */
const got = require('got');

exports.handler = function(context, event, callback) {
  let twiml = new Twilio.twiml.VoiceResponse();
  let sayParams = {};
  sayParams.language = "ja-JP";
  sayParams.voice = "alice";
  let dialParams = {};
  dialParams.callerId = context.CALLER_ID;
  let result = event.SpeechResult || '';  // 音声認識結果を取得
  if (result !== '') {  // 音声認識に成功したら、担当者情報を検索
    let options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        'result': result
      }
    }
    let url = context.DOMAIN+'/employee?checkEmployee';
    got.post(url, options)
      .then(response => {
        callTo = JSON.parse(response.body);
        if (callTo === '') {
          twiml.say(sayParams, "該当する社員はいません。");
        } else {
          twiml.say(sayParams, callTo.name+"におつなぎ致しますので、このままお待ち下さい。");
          twiml.dial(dialParams, callTo.number);
        }
        callback(null, twiml);
      })
      .catch(error => {
        callback(error);
      });
  } else {
    twiml.say(sayParams, "音声認識ができませんでした。");
    callback(null, twiml);
  }
};
