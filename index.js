const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5050
var app = express();

const {Pool} = require('pg');
var pool;
pool = new Pool({
  connectionString:process.env.DATABASE_URL
});
pool.connect();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req,res) =>{
  var create_table = `create table if not exists tokimon(id serial, name text, weight int, height int, flying int, fighting int, fire int, water int, electric int, frozen int, total int, tokimontrainer text)`
    pool.query(create_table, (error, result) => {
    });
    res.render('pages/home');
});

app.get('/add', (req, res) => res.render('pages/add'));
app.get('/home', (req, res) => res.render('pages/home'));

app.post('/submit', (req, res) =>{
  var addQuery = `insert into tokimon(name, weight, height, flying, fighting, fire, water, electric, frozen, total, tokimontrainer) values('${req.body.name}',${req.body.weight},${req.body.height},${req.body.flying},${req.body.fighting},${req.body.fire},${req.body.water},${req.body.electric},${req.body.frozen},${req.body.total},'${req.body.tokimontrainer}')`
  pool.query(addQuery, (error, result) => {
    if(error)
      res.end(error);
  });
  res.render('pages/submit')
});

app.get('/display', (req, res) =>{
  var displayQuery = `select * from tokimon`;
  pool.query(displayQuery, (error, result)=>{
    if(error)
      res.end(error);
    var results = {'rows': result.rows};
    res.render('pages/display', results);
    });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

