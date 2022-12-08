const { workerData, parentPort } = require('worker_threads');
const stripTags = require('striptags');
const stringSimilarity = require('string-similarity');
const PesertaLogin = require('../models/PesertaLoginModel');
const PesertaTest = require('../models/PesertaTestModel');

Object.keys(workerData.data).forEach(i => {
  const v = workerData.data[i];
  PesertaTest.findByPk(i)
    .then(test => {
      let nilai = 0;
      let benar = 0;
      if (test.type === 'PG' || test.type === 'PGK' || test.type === 'BS' || test.type === 'JD') {
        Object.keys(test.corrects).forEach(k => {
          if (test.corrects[k] === v.jawaban.corrects[k]) {
            benar++;
          }
        })
        nilai = benar / Object.keys(test.corrects).length * test.bobot;
        if (test.type === 'PG' && nilai != test.bobot) {
          nilai = 0;
        }
      } else if (test.type === 'IS' || test.type === 'U') {
        const n = stringSimilarity.compareTwoStrings(stripTags(v.jawaban.answer).toLowerCase(), stripTags(test.answer).toLowerCase());
        nilai = n * test.bobot;
      }
      test.update({ nilai: parseFloat(nilai).toFixed(2), jawaban: v.jawaban });
      PesertaLogin.findByPk(workerData.loginId)
        .then(login => {
          login.update({ current_number: v.num });
        });
    });
});

parentPort.postMessage(null);