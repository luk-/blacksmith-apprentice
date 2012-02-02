var mysql  = require('mysql')
  , events = require('events')
  , mkdirp = require('mkdirp')
  , fs     = require('fs');

  
var migrate_steps = new events.EventEmitter()
  , migration = {};

migrate_steps.on('db_config', function (msg) {
  console.log('database configured...\n')
  migration.create_query();
});

migrate_steps.on('query_ready', function (msg) {
  migration.migrate();
});

migration.configure_db = function () {
  fs.readFile('config.json', encoding='utf8', function (err, data) {
    if (err) throw err;
    try {
      var config = JSON.parse(data);
    }
    catch (e) {
      console.error("error parsing config.json \n\n" + e);
    }

    migration.db_config = config;
    migrate_steps.emit('db_config', config);
  });
}

migration.create_query = function () {
  fs.readFile('blogs.json', encoding='utf8', function (err, data) {
  if (err) throw err;
  try {
    var blogs = JSON.parse(data);
  }
  catch (e) {
    console.error("error parsing blogs.json \n\n" + e);
  }

  migration.query = blogs[migration.db_config.engine].replace(/\[PREFIX\]/g, migration.db_config.table_prefix);
  migrate_steps.emit('query_ready', migration.query);

  });

}

migration.configure_db();

migration.migrate = function () {
  
  var client = mysql.createClient({
    user: migration.db_config.db_user,
    password: migration.db_config.db_pass,
  });

  client.query('use ' + migration.db_config.db_name, function (err) {
    if (err) throw err;

    client.query(migration.query, function (err, res) {
      if (err) throw err;

      res.forEach (function (val, key) {
        
        var dir_title = val.title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');

        mkdirp('./output/' + dir_title, function (err) {
          if (err) throw err;

          var page = {
            "title": val.title,
            "author": val.author,
            "date": new Date(val.date * 1000).toISOString()
          };


          page = JSON.stringify(page);

	  var content = val.body.replace("<!--more-->", "##");

          fs.writeFile('./output/' + dir_title + '/content.md', content, function (err) {
            if (err) throw err;
            fs.writeFile('./output/' + dir_title + '/page.json', page, function (err) {
              if (err) throw err;
            });
          });
        });
      });
      client.end();
    });
  });

}
