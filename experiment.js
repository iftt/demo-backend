const Datastore = require('nedb');
let db = new Datastore({ filename: './test.db', autoload: true });

// db.insert({ key: 'test' }, function (err, newDoc) {
//   db.insert({ key: 'test' }, function (err, newDoc) {
//     db.find({}, )
//   });
// });

db.update({ key: 'test'}, { key: 'test', value: 'who cares' }, { upsert: true }, (err, repDoc) => {
  console.log('err', err);
  console.log('repDoc', repDoc);
  db.update({ key: 'test'}, { key: 'test', value: 'who cares', anotherValue: 'who really cares' }, { upsert: true }, (err, repDoc) => {
    console.log('err', err);
    console.log('repDoc', repDoc);
    db.findOne({key: 'test'}, (err, doc) => {
      console.log('err', err);
      console.log('doc', doc);
    });
  });
});

// db.findOne({key: 'test'}, (err, doc) => {
//   console.log('err', err);
//   console.log('doc', doc);
// });
