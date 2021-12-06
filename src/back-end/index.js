const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"),
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, crossDomain"),
  next()
});

app.get('/count', (req, res) =>{
  //var image = req.body.image;
  console.log("BACKEND")
  console.log(req);
  console.log(req.params);
  return res.status(200).json({ status: 'success', image: 'hello' });
  // res.json({ status: 'success', image: 'hello' });
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});