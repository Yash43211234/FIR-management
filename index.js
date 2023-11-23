var con = require('./connection');
var express = require("express");
const multer = require('multer');
const path = require('path');
const { error } = require('console');

var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// EJS setup
app.set('views', path.join(__dirname, 'views')); // Specify the path to your views directory
app.set('view engine', 'ejs');

app.use(express.static('public'));


app.get('/home',function(req,res){
  res.render('Home');
})

app.get('/register', (req, res)=> {
  res.render('register');
});


app.post('/register', upload.single('image'),function (req, res) {

  var name = req.body.name;
  var gender = req.body.gender;
  var age = req.body.age;
  var address1 = req.body.address1;
  var address2 = req.body.address2;
  var place = req.body.place;
  var country = req.body.country;
  var pin = req.body.pin;
  var phone = req.body.phone;
  var mobile = req.body.mobile;
  var email = req.body.email;
  var adhaar = req.body.adhaar;
  var pan = req.body.pan;
  var title = req.body.title;
  var complaint = req.body.complaint;
  const { filename } = req.file;

  con.connect(function (error) {
    if (error) throw error;

    var sql = "INSERT INTO complaints(name,gender,age,address1,address2,place,country,pin,phone,mobile,email,adhaar,pan,title,complaint,filename) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    con.query(sql,[name,gender,age,address1,address2,place,country,pin,phone,mobile,email,adhaar,pan,title,complaint,filename] ,function (error, result) {

      if (error) throw error;
      res.send('regsiter succeefully.');
    });
  });
});


app.use('/uploads', express.static('uploads'));

app.get('/complaints', function (req, res) {
  con.connect(function (error) {
    if (error) console.log(error);

    var sql = "select * from complaints";
 
    con.query(sql, function (error, result) {
      if (error){
        console.log(error);
        
      } 
      const uploadedImage = result.length > 0 ? result[0].filename : null;
      res.render("complaints", { complaints: result,uploadedImage });
    });
  });
});


//delete data from my sql
app.get('/delete-row', function (req, res) {
  con.connect(function (error) {
    if (error) console.log(error);

    var sql = " delete from complaints where id=?";
    var id = req.query.id;

    con.query(sql, [id], function (error, result) {
      if (error) console.log(error);
      res.redirect('/complaints');
    });
  });
});


//update data to send ejs file into update-complaints url
app.get('/update-complaints', function (req, res) {
  con.connect(function (error) {
    if (error) console.log(error);

    var sql = "select * from complaints where id=?";
    var id = req.query.id;

    con.query(sql, [id], function (error, result) {
      if (error) console.log(error);
      res.render(__dirname + '/update-complaints', { complaints: result });
    });
  });
});


// //final update data submittedin the final server list
app.post('/update-complaints', function (req, res) {
  var id = req.body.id;
  var name = req.body.name;
  var gender = req.body.gender;
  var age = req.body.age;
  var address1 = req.body.address1;
  var address2 = req.body.address2;
  var place = req.body.place;
  var country = req.body.country;
  var pin = req.body.pin;
  var phone = req.body.phone;
  var mobile = req.body.mobile;
  var email = req.body.email;
  var adhaar = req.body.adhaar;
  var pan = req.body.pan;
  var title = req.body.title;
  var complaint = req.body.complaint;
  

  //post data in complaints url.
  con.connect(function (error) {
    if (error) console.log(error);

    var sql = "UPDATE complaints set name=?,gender=?,age=?,address1=?, address2=?, place=?,country=?,pin=?,phone=?,mobile=?,email=?,adhaar=?,pan=?,title=?,complaint=?  where id=?";

    con.query(sql, [name, gender, age, address1, address2, place, country, pin, phone, mobile, email,adhaar,pan, title, complaint, id], function (error, result) {
      if (error) console.log(error);

      res.redirect("/complaints");

    });
  });
});


// //get data in search-complaints url 
app.get('/search-complaints', function (req, res) {
  con.connect(function (error) {
    if (error) console.log(error);

    var sql = " select * from complaints";

    con.query(sql, function (error, result) {
      if (error) console.log(error);
      res.render(__dirname + "/search-complaints", { complaints: result });
    });
  });
});


// //get data after search in the same url i.e search
app.get('/search', function (req, res) {
  const name = req.query.name;
  const adhaar = req.query.adhaar;
  const email = req.query.email;
  const mobile = req.query.mobile;


  con.connect(function (error) {
    if (error) console.log(error);
    var sql = "select * from complaints where name LIKE '%"+name+"%'  AND adhaar LIKE  '%"+adhaar+"%'  AND email LIKE  '%"+email+"%'  AND mobile LIKE  '%"+mobile+"%' ";
    con.query(sql, function (error, result) {
      if (error) console.log(error);

      res.render(__dirname + "/search-complaints", { complaints: result });
    });
  });
});


// Routes
app.get('/profile', (req, res) => {
 
  const sql = 'SELECT * FROM complaints where id=?';
  var id = req.query.id;
 
  con.query(sql,[id],(err, result) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    const uploadedImage = result.length > 0 ? result[0].filename : null;
     
    res.render('profile', {complaints:result,uploadedImage});
    
  });
});


//listen in port address
app.listen(2000,()=>{
  console.log(`Server started at http://localhost:2000/home`)
});