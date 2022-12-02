https://blogmarch.com/files-images-upload-with-nodejs-express/  



const express = require('express')
  const app = express()
	const bodyparser = require('body-parser')
  const fileUpload = require('express-fileupload')
	const mysql = require('mysql')
	var uuid = require('uuid')

  app.use(express.static("./public"))

  app.set('view engine', 'ejs')

  app.use(bodyparser.json())
	app.use(bodyparser.urlencoded({
  extended: true
	}))


  app.use(fileUpload())


  const db = mysql.createConnection({
     host : "localhost",
     user : "root",
     password : "password",
     database : "mypractice"
    })


    db.connect(function (err) {
      if (err){
        return console.error('error: ' + err.message);
      }
      console.log('Connected to the MySQL server.');
    })
      


    app.get("/", (req,res) =>{
      res.render('Home');
    })


    app.post("/post", (req, res) => {
      if (!req.files) {
       res.send("No file upload")
          } else {
      	         var file = req.files.image // here 'image' in Home.ejs form input name
                                         //for image upload
      	     if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
     	             var imageName = file.name
      	            console.log(imageName)
     	             var uuidname = uuid.v1(); // this is used for unique file name
     	             var imgsrc = 'D:/Practice/Files_Upload/public/images/' + uuidname + file.name
      	           var insertData = "INSERT INTO users_file(file_src)VALUES(?)"
                   db.query(insertData, [imgsrc], (err, result) => {
    	                 if (err) throw err
   	                 file.mv('public/images/' + uuidname + file.name)
     	                 res.send("Image upload successfully")
      	             })
            }
     	         // for any file like pdf,docs etc. upload
      	         else {
     	             var fileName = file.name;
      	             console.log(fileName);
                   var uuidname = uuid.v1(); // this is used for unique file name
                   var filesrc = 'D:/Practice/Files_Upload/public/images/' + uuidname + file.name
                   var insertData = "INSERT INTO users_file(file_src)VALUES(?)"
      	             db.query(insertData, [filesrc], (err, result) => {
      	                 if (err) throw err
     	                 file.mv('public/docs/' + uuidname + file.name)
   	                 res.send("Data successfully save")
      	             })
     	         }
      	     }
      })
      	
      	//create connection
      	const PORT = process.env.PORT || 3000
      	app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))
