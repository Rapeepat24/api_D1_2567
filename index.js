const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const expressFileupload = require('express-fileupload')
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'member'
  }
})
app.use(cors())
app.use(bodyParser.json())// ใช้ได้ทุก url
const port = 7000

app.post('/listid', async(req, res) => {
  console.log('email=', req.boby)
  

})


app.post("/login", async (req, res) => {
  console.log(req.body);
  // check require
  if (req.body.email == "" || req.body.passwd == "") {
    return res.send({
      message: "กรุณาตรวจสอบ User และ Password",
      status: "fail",
    });
  }
  console.log("Next step2");
  // check value in database
  let ids = await knex("users").where({
    email: req.body.email,
    password: req.body.passwd,
  });
  console.log(ids.length);
  if (ids.length == 0) {
    return res.send({
      message: "กรุณาตรวจสอบ User และ Password ให้ถูกต้อง",
      status: "error_user",
    });
  }
  console.log("Next step 3");
  res.send({
    message: "Login สำเร็จ",
    status: "ok",
    row: ids,
  });
});



app.get('/', (req, res) => {
  //http://localhost:7000?name=oak
  console.log(req.query) //get ใช้ query
  res.send({
    status: 'chaiyaphum',
    data: req.query
  })
})

app.post('/insert', async (req, res) => {
  console.log(req.body)  //post ใช้ body
  let username = req.body.username;
  let passwd = req.body.password;
  let email = req.body.email;
  let status = req.body.status;
  let picture = req.body.picture;

  try {
    let ids = await knex("users").insert({
        username: username,
        password: passwd,
        email: email,
        status: status,
        picture: picture
      });
    res.send({
      status: "ok",
      id: ids[0],
    });
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }
});

app.get('/delete', async (req, res) => {
  console.log(req.query)
  try {
      let ids = await knex("users")
      .where({id: req.query.id})
      .delete()
      res.send({
      status: 'ok',
      id : ids
      })
      } catch (e) {
          res.send({
          ok : 0,
          error : e.message
          })
      }
});
app.post('/update', async (req, res) => {
  console.log(req.body)
  let id = req.body.id
  let username = req.body.username
  let passwd = req.body.password
  let email = req.body.email
  try {
      let ids = await knex('users').where({ id: id }).update({ username: username, password: passwd, email: email });
      res.send({
          ok: 'yes',
          id: ids
      })
  } catch (error) {
      res.send({
          ok: '0',
          error: error.message
      })
  }
})

app.post('/search', async (req, res) => {
  console.log(req.body)
  let id = req.body.id
  try {
      let row = await knex('users').where({ id: id }).select()
      res.send({
          ok: 'yes',
          rows: row
      })
  } catch (error) {
      res.send({
          ok: '0',
          error: error.message
      })
  }
})

app.get('/list', async (req, res) => {
  try {
    let row = await knex('users')
    res.send({
      ok: 'yes',
      rows: row
    })
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }
})

app.get('/register', function (req, res) {
  res.send('ลงทะเบียน')
})
app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})