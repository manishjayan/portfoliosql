var express = require('express');
var router = express.Router();
var mysql=require('mysql');
var multer = require('multer');
var uploads = multer ({dest : './public/images/portfolio'});

var connection=mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'portfolio'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query('select *from projects',function(err,rows,fields){
    if (err) throw err;
    res.render('dashboard',{
      "rows" : rows,
      layout : 'layout2'
    });
  });
});

router.get('/new', function(req, res, next) {
  res.render('new');
});

router.post('/new', uploads.single('projectimage') ,function(req, res, next){

  var title       = req.body.title;
  var description = req.body.description;
  var service     = req.body.service;
  var client      = req.body.client;
  var projectdate = req.body.projectdate;

// Check Image
  if(req.file){
    var projectImageName         = req.file.fieldname;
  }
  else{
    var projectImageName         = 'noimage.jpg';
  }

  // Form Field Validation
  req.checkBody('title', 'Title field is required').notEmpty();
  req.checkBody('service', 'Service field is required').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    res.render('new', {
      errors: errors,
      title: title,
      description: description,
      service: service,
      client: client
    });
  } else {
      var project= {
        title: title,
        description: description,
        service: service,
        clients: client,
        date: projectdate,
        image: projectImageName
      };
      var query = connection.query('INSERT INTO projects SET ?', project, function(err, result){
        // Project Inserted
      });
      req.flash('success', 'Project Added');
      res.location('/admin');
      res.redirect('/admin');

      }
  });
  // SHOW EDIT FORM
router.get('/edit/:id', function(req, res, next) {
  connection.query('SELECT * FROM projects WHERE id ='+req.params.id, function(err, row, fields){
    if(err) throw err;
    res.render('edit', {
      "row": row[0],
      layout: 'layout2'
    });
  });
});

// Update Project
router.post('/edit/:id', uploads.single('projectimage') , function(req, res, next){

  var title       = req.body.title;
  var description = req.body.description;
  var service     = req.body.service;
  var client      = req.body.client;
  var projectdate = req.body.projectdate;

// Check Image
console.log(req.file);
if(req.file){
  var projectImageName         = req.file.fieldname;
}
else{
  var projectImageName         = 'noimage.jpg';
}


// Form Field Validation
req.checkBody('title', 'Title field is required').notEmpty();
req.checkBody('service', 'Service field is required').notEmpty();

var errors = req.validationErrors();

if(errors){
res.render('new', {
  errors: errors,
  title: title,
  description: description,
  service: service,
  client: client
});
} else {
  var project= {
    title: title,
    description: description,
    service: service,
    clients: client,
    date: projectdate,
    image: projectImageName
  };

  var query = connection.query('UPDATE projects SET ? WHERE id ='+req.params.id, project, function(err, result){
      // Project Inserted

  });

  req.flash('success', 'Project Updated');

  res.location('/admin');
  res.redirect('/admin');

}
});

router.delete('/delete/:id', function(req, res){
  connection.query('DELETE FROM projects WHERE id='+req.params.id, function(err, results){
      if(err) throw err;
  });

  req.flash('success', 'Project Deleted');
  res.location('/admin');
  res.redirect('/admin');

});

module.exports = router;
