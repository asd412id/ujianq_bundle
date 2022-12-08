const { workerData, parentPort } = require('worker_threads');
const { shuffle } = require("../utils/Helpers.js");
const items = [];
const data = JSON.parse(workerData.rows);
data.forEach(v => {
  if (v.shuffle) {
    v.options = [...(shuffle(v.options))];
    v.relations = [...(shuffle(v.relations))];
  }
  const itemdata = {
    type: v.type,
    num: v.num,
    text: v.text,
    options: v.options,
    labels: v.labels,
    corrects: v.corrects,
    relations: v.relations,
    answer: v.answer,
    bobot: v.bobot,
    soalItemId: v.id
  };
  items.push(itemdata);
});

parentPort.postMessage(items);