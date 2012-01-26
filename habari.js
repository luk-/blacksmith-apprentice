var mysql = require('mysql')
  , mkdirp = require('mkdirp')
  , fs = require('fs')
  , database = 'mtambo_habari';

var client = mysql.createClient({
  user: 'root',
  password: '',
});


client.query('use mtambo_habari');


var q = client.query('select title, pubdate, content from habari__posts order by pubdate', function(err, res, fields) {

  res.forEach (function (val, key, arr) {

    var dir_title = val.title.replace(/\s/g, '-').replace(/\'|\,|\./g, '');

    mkdirp('./output/' + dir_title, function (err) {
      if (err) {
	console.error(err);
      }
      else {
	var page = {
	  "title": val.title,
	  "author": "luke",
	  "date": new Date (val.pubdate * 1000).toISOString()
	}

	page = JSON.stringify (page);

	fs.writeFile('./output/' + dir_title + '/content.md', val.content, function () {});
	fs.writeFile('./output/' + dir_title + '/page.json', page, function () {});
      }
    });

  });

  //fs.writeFile('posts.json', JSON.stringify(res), function() {
  //  console.log('done');
  //  client.end();
  //});
});

