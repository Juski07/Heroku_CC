const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();




app.get('/count', (req, res) =>{
  //var image = req.body.image;
  console.log("BACKEND")
  console.log(req.data);
  console.log(req.params);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000")
  return res.status(200).json({ status: 'success', image: 'hello' });
  // res.json({ status: 'success', image: 'hello' });
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});