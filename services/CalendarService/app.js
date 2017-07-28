var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// Set Up Database Connection
var Connection = require('tedious').Connection;
var config = {
  userName: 'test',
  password: 'test',
  server: '192.168.1.210',
  options: { encrypt: true }
};

var connection = new Connection(config);

connection.on('connect', function (err) {
    if (err) {
      console.log('error connection to database:', err);
    }
    else {
      console.log("successfully connected to database");
    }
  }
);

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Services
app.post('/userResponse', function (req, res) {
  try
  {
    if(!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.internOrManager)
    {
      res.send('50 - Failed to include required field');
    }
    else if (req.body.internOrManager=='I' && req.body.partnerManager)
    {
      res.send('100 - Type Intern Cannot Have Parameter partnerManager');
    }
    else
    {
      AddUserResponse(req.body.firstName, req.body.lastName, req.body.email, req.body.internOrManager, req.body.nbrInternsWanted, req.body.partnerManager, req.body.passions, req.body.dislikes, req.body.spiritAnimal, req.body.favTvMovBand, req.body.linkToResume, function (err) {
        if(err) {
          res.send('150 - Database Fail');
        }
        else
        {
          res.send('0 - Success');
        }
      });
    }
  }
  catch(ex)
  {
    res.send('200 - Unknown error: ' + ex);
  }
});

app.get('/nbrOfUsers', function(req, res) {
  try
  {
    GetNumberOfUsers(function(err, result) {
        if(err)
        {
          res.send(-1);
        }
        else
        {
          res.send(result);
        }
    });
  }
  catch(ex)
  {
    res.send(-1);
  }
});

app.get('/specificUser', function(req, res) {
  try
  {
    if(req.body.index && parseInt(req.body.index))
    {
      GetUserAt(req.body.index, function(err, result) {
        if(err)
        {
          var obj={};
          res.send(obj);
        }
        else
        {
          res.send(result);
        }
      });
    }
    else
    {
      var obj={};
      res.send(obj);
    }
  }
  catch(ex)
  {
    var obj={};
    res.send(obj);
  }
});

app.get('/specificUserCsv', function(req, res) {
  try
  {
    if(req.body.index && parseInt(req.body.index))
    {
      GetUserAt(req.body.index, function(err, result) {
        if(err)
        {
          var obj='';
          res.send(obj);
        }
        else
        {
          var toSend='firstName, lastName, email, internOrManager, nbrInternsWanted, partnerManager, passions, dislikes, spiritAnimal, favTvMovBand, linkToResume, resumeText\r\n';
          toSend+=result.firstName+','+result.lastName+","+ result.email+","+result.internOrManager+","+result.nbrInternsWanted+","+ result.partnerManager+","+result.passions+","+ result.dislikes+","+ result.spiritAnimal+","+result.favTvMovBand+","+ result.linkToResume+","+result.resumeText+"\r\n";
          res.send(toSend);
        }
      });
    }
    else
    {
      var obj='';
      res.send(obj);
    }
  }
  catch(ex)
  {
    var obj='';
    res.send(obj);
  }
});

app.get('/allUsers', function(req, res) {
  try
  {
    var startIndex=0;
    try
    {
      if(req.body.startIndex && parseInt(req.body.startIndex))
      {
        startIndex=parseInt(req.body.startIndex);
      }
    }
    catch(ex)
    {
      
    }
    GetNumberOfUsers(function(err, result) {
          if(err)
          {
            var obj = {};
            res.send(obj);
          }
          else
          {
            var endIndex = result-1;
            try
            {
              if(req.body.endIndex && parseInt(req.body.endIndex))
              {
                endIndex=parseInt(req.body.startIndex);
              }
            }
            catch(ex)
            {

            }
            GetMultipleUsers(startIndex, endIndex, function(err, results) {
              if(err)
              {
                var obj = {};
                res.send(obj);
              }
              else
              {
                res.send(results);
              }
            });
          }
      });
    }
    catch(ex)
    {
      var obj={};
      res.send(obj);
    }
});

app.get('/allUsersCsv', function(req, res) {
  try
  {
    var startIndex=0;
    try
    {
      if(req.body.startIndex && parseInt(req.body.startIndex))
      {
        startIndex=parseInt(req.body.startIndex);
      }
    }
    catch(ex)
    {
      
    }
    GetNumberOfUsers(function(err, result) {
          if(err)
          {
            res.send('');
          }
          else
          {
            var endIndex = result-1;
            try
            {
              if(req.body.endIndex && parseInt(req.body.endIndex))
              {
                endIndex=parseInt(req.body.startIndex);
              }
            }
            catch(ex)
            {

            }
            GetMultipleUsers(startIndex, endIndex, function(err, results) {
              if(err)
              {
                res.send('');
              }
              else
              {
                var toSend='firstName, lastName, email, internOrManager, nbrInternsWanted, partnerManager, passions, dislikes, spiritAnimal, favTvMovBand, linkToResume, resumeText\r\n';
                for(result in results)
                {
                    toSend+=result.firstName+','+result.lastName+","+ result.email+","+result.internOrManager+","+result.nbrInternsWanted+","+ result.partnerManager+","+result.passions+","+ result.dislikes+","+ result.spiritAnimal+","+result.favTvMovBand+","+ result.linkToResume+","+result.resumeText+"\r\n";
                }
                res.send(toSend);
              }
            });
          }
      });
    }
    catch(ex)
    {
      var obj='';
      res.send(obj);
    }
});

app.post('/resumeText', function(req, res) {
  try
  {
    if(!req.body.index || !req.body.resumeText)
    {
      res.send('50 - Failed to include required field.');
    }
    else if(!parseInt(req.body.index))
    {
      res.send('150 - Index is Not a Number');
    }
    else
    {
      UpdateResumeText(req.body.index, req.body.resumeText, function(err)
      {
        if(err)
        {
          res.send('100 - Database Fail');
        }
        else
        {
          res.send('0 - Success');
        }
      });
    }
  }
  catch(ex)
  {
    res.send('200 - Unknown error: '+ ex);
  }
});

app.post('/clearRecords', function(req, res) {
  try
  {
    ClearDatabase(function(err) {
      if(err)
      {
        res.send('50 - Database Fail');
      }
      else
      {
        res.send('0 - Success');
      }
    });
  }
  catch(ex)
  {
    res.send('100 - Unknown error: '+ ex);
  }
});


//Database Queries
function ClearDatabase(callback)
{
  var request = new Request("TRUNCATE TABLE UserResponses;", function(err) {
    callback(err);
  });

  connection.execSql(request);
}

function UpdateResumeText(index, resumeText, callback)
{
  var request = new Request("UPDATE UserResponses SET ResumeText = @resumeText WHERE UserNumber=@index;", function(err) {
    callback(err);
  });

  request.addParameter('resumeText', TYPES.NChar, resumeText);
  request.addParameter('index', TYPES.Int, index);

  connection.execSql(request);
}

function GetMultipleUsers(startIndex, endIndex, callback)
{
  var results = [];

  var request = new Request("SELECT * FROM UserResponses;", function (err) {
    callback(err, results);
  });

  request.on("row", function(rowObject) {
    if(rowObject.UserNumber>=startIndex && rowObject.UserNumber<=endIndex)
    {
      results.push(rowObject);
    }
  });

  connection.execSql(request);
}

function GetNumberOfUsers(callback)
{
  var answer = 0;

  var request = new Request("SELECT @count=COUNT(*) FROM UserResponses;", function (err) {
    callback(err, count);
  });

  request.addOutputParameter('count', TYPES.Int);

  request.on('returnValue', function(parameterName, value, metaData) {
    if(parameterName=='count')
    {
      answer=value;
    }
  });

  connection.execSql(request);
}

function GetUserAt(index, callback) {
  var results = [];

  var request = new Request("SELECT * FROM UserResponses WHERE UserNumber=@index;", function (err) {
    callback(err, results);
  });

  request.on("row", function(rowObject) {
      results.push(rowObject);
  });

  request.addParameter('index', TYPES.Int, index);

  connection.execSql(request);
}

AddUserResponse(firstName, lastName, email, internOrManager, nbrInternsWanted, partnerManager, passions, dislikes, spiritAnimal, favTvMovBand, linkToResume, callback)
{
  GetNumberOfUsers(function(err, count) {
    if(err)
    {
      callback(err);
    }
    else
    {
      var request = new Request("INSERT INTO UserResponses (FirstName, LastName, Email, InternOrManager, NbrInternsWanted, PartnerManager, Passions, Dislikes, SpiritAnimal, FavTvMovBand, LinkToResume, UserNumber) VALUES (@firstName, @lastName, @email, @internOrManager, @nbrInternsWanted, @partnerManager, @passions, @dislikes, @spiritAnimal, @favTvMovBand, @linkToResume, @userNumber);", function(err) {
        callback(err);
      });

      request.addParameter('firstName', TYPES.NChar, firstName);
      request.addParameter('lastName', TYPES.NChar, lastName);
      request.addParameter('email', TYPES.NChar, email);
      request.addParameter('internOrManager', TYPES.NChar, internOrManager);
      request.addParameter('nbrInternsWanted', TYPES.Int, nbrInternsWanted);
      request.addParameter('partnerManager', TYPES.NChar, partnerManager);
      request.addParameter('passions', TYPES.NChar, passions);
      request.addParameter('dislikes', TYPES.NChar, dislikes);
      request.addParameter('spiritAnimal', TYPES.NChar, spiritAnimal);
      request.addParameter('favTvMovBand', TYPES.NChar, favTvMovBand);
      request.addParameter('linkToResume', TYPES.NChar, linkToResume);
      request.addParameter('userNumber', count);
      connection.execSql(request);
    }
  });
}

module.exports = app;
