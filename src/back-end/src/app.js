const express = require('express')
const app = express.Router()


app.get('/count', (req, res) =>{
    console.log("BACKEND")
    console.log(req)
    var image = req.body.image;
    console.log(image)
    return res.status(200).json({ status: 'success', image });
})

app.listen(5000);