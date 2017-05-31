/**
 *  受付サンプル - Calling
 *
 *  着信したら、誰につなぐかを聞いてredirectを呼び出す。
 */
const got = require('got');

exports.handler = function(context, event, callback) {
  const question = "お繋ぎする担当者の名前を教えてください。";

  let url = context.DOMAIN+'/employee?getHints';  // 担当者の苗字を抜き出してヒントを作成
  got.get(url)
    .then(response => {
      let twiml = new Twilio.twiml.VoiceResponse();
      let gatherParams = {};
      gatherParams.input = "speech";
      gatherParams.language = "ja-JP";
      gatherParams.timeout = "2";
      gatherParams.hints = response.body;
      gatherParams.action = '/redirect';
      gatherParams.method = "POST";
      let sayParams = {};
      sayParams.language = "ja-JP";
      sayParams.voice = "alice";
      twiml.gather(gatherParams).say(sayParams, question);

      // return the TwiML
      callback(null, twiml);
    })
    .catch(error => {
      callback(error);
    });

};
