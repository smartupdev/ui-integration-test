var Gun = require('gun/gun');

var gun = {};

var g = Gun();


gun.put = function() {
  g.put('mark').put({
    name: 'aaaaaa',
    email: 'eeeeeeeeeee',
  });
}

gun.get = function() {
  g.get('mark').get('name').once(function (data, key) {
    console.log('data = ', data);
    console.log('key = ', key);
  });
}

export{gun}
