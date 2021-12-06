import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import axios from 'axios';
const qs = require('qs');

class SubmitComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: ''
    }
  }

  onChange(e) {
    let file = e.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(file[0]);
    console.log(typeof reader)

    reader.onload = (e) => {

      const url = "http://localhost:3001/count"

      var image = e.target.result;
      console.warn("image", image)
      var data = qs.stringify({
        'image': image,
      });
      var config = {
        method: 'get',
        url: url,
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'crossDomain': true
        },
        data: data
      };
      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
    }

  }
  render() {
    return (
      <div onSubmit={this.onFormSubmit}>
        <h1>Live counting: select an image !</h1>
        <input type="file" name="file" onChange={(e) => this.onChange(e)} />
      </div>
    )
  }
}

export default SubmitComponent
