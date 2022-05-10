import './App.css';
import {Component} from 'react';
import * as tf from '@tensorflow/tfjs';
// tf.ENV.set('WEBGL_PACK', false)
// import { CameraFeed } from './camera-feed';
var axios = require('axios');
var qs = require('qs');
const MODEL_URL = './model.json';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}


function updateState(value, url){
  console.log("URL CHECK :", url)
  this.setState( {value: value, display:true})
  this.setState({ image: URL.createObjectURL(url) })
}

  
class Count extends Component{
  constructor(props) {
    super(props);
    this.state ={
      value: null,
      display:false,
      image:null,
      model:null
    }
    this.useModel = this.useModel.bind(this)
  }

  async componentDidMount(){
    updateState = updateState.bind(this)
    var json = 'http://127.0.0.1:8080/model.json'     //"http-server -a 127.0.0.1 --cors -c60" from the backend/model
    console.log(json)
    const model = await tf.loadGraphModel(json)
    console.log(model)
    this.setState( {model: model} )
    // localStorage.setItem('json', JSON.parse(JSON.stringify(json)))
    // await require('./model/model.json').save('localstorage://json');

  }

  async onChange(e) {
    // console.log(e.target)
    var u = e.target.files[0]
    var url = URL.createObjectURL(u)
    console.log("U : ", u)
    console.log("url :", url)
    this.setState({ image: url, display:true })
    this.forceUpdate()
    var formData = new FormData();
    formData.append("image", u);
    console.log("IMAGE", u.name)

    var s = await getBase64(u).then(
      data => {
        console.log("DATA :", data)
        return data
      }
    );
    

    var data = qs.stringify({
      'image': s 
    });
    var config = {
      method: 'post',
      url: 'http://localhost:3000/count',
      headers: { },
      data:data
    };
    
    let x = await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data.value));
      return response.data.value
    })
    .catch(function (error) {
      console.log(error);
    });
    this.setState( {value: x, display:true})
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    console.log("HERE :", file)

    const base64url = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

    var data = qs.stringify({
      'image': base64url
    });
    var config = {
      method: 'post',
      url: 'http://localhost:3000/count',
      headers: { },
      data:data
    };
    
    let x = await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data.value));
      return response.data.value
    })
    .catch(function (error) {
      console.log(error);
    });
    console.log("END :", x)
    
    updateState(x, file)
  }

  async useModel(e){
    tf.setBackend('cpu')
    var u = e.target.files[0]
    var url = URL.createObjectURL(u)

    console.log("MODEL : ", this.state.model)
    console.log(u)
    var model = this.state.model

    const image = new Image()
    image.src = url
    // var canvas = document.createElement('canvas');
    // var context = canvas.getContext('2d');
    // context.strokeStyle="#FFFFFF"
    // context.drawImage(image, 700, 700);
    
    // console.log("+++++++++++++++", context.getImageData(700,700,124,124).data)

    this.setState({image: url, display:true})
    this.forceUpdate()
    setTimeout( () => {
      var tensor = tf.browser.fromPixels(image);
      var tensor3 = tensor.transpose().expandDims(0).toFloat();
      tensor3.print()
      var val = model.predict(tensor3);
      console.log(val);
      (val.sum()).print()
    } , 2000)
    // var tensor = tf.browser.fromPixels(image)
    // var tensor2 = tensor.transpose([2,0,1]).expandDims(0).toFloat()
    // var tensor3 = tensor.transpose().expandDims(0).toFloat()
    
    const warmup = tf.zeros([1,3,124,124])
    // warmup.print()
    // console.log("WARMUP")

    // tensor.print()

    // var val = await model.executeAsync(warmup)
    // var val = model.predict(tensor2, 1, true);
    // (val.sum()).print()
    // val.print()


    // const context = document.createElement('canvas').getContext('2d');
    // context.drawImage(u, 0, 0);
    // const {
    //   data
    // } = context.getImageData(10, 10, 1, 1);
    // console.log(data)
    console.log("END")
  }


  render() {
    var val = this.state.value
    var image = this.state.image
    var display = this.state.display
    console.log(display)
    console.log(image)
    return (
      display ?
      <div>
        <div>
          <h1>Live counting: select an image !</h1>
          <input type="file" name="file" onChange={this.useModel} />
        </div>
        <div> 
          <img src={image}/>
          <p> There are {val} persons on the picture </p>
        </div>
      </div>
      :
      <div>
        <h1>Live counting: select an image or take a picture ! </h1>
        <input type="file" name="file" onChange={(e) => this.useModel(e)}/>
        <CameraFeed uploadImage={() => this.uploadImage}/>
      </div>
    )
  }
}





class CameraFeed extends Component {
  constructor(props) {
      super(props);
    }
  /**
   * Processes available devices and identifies one by the label
   * @memberof CameraFeed
   * @instance
   */
  processDevices(devices) {
      devices.forEach(device => {
          console.log(device.label);
          this.setDevice(device);
      });
  }

  /**
   * Sets the active device and starts playing the feed
   * @memberof CameraFeed
   * @instance
   */
  async setDevice(device) {
      const { deviceId } = device;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { deviceId } });
      this.videoPlayer.srcObject = stream;
      this.videoPlayer.play();
  }

  /**
   * On mount, grab the users connected devices and process them
   * @memberof CameraFeed
   * @instance
   * @override
   */
  async componentDidMount() {
      const cameras = await navigator.mediaDevices.enumerateDevices();
      this.processDevices(cameras);
  }

  /**
   * Handles taking a still image from the video feed on the camera
   * @memberof CameraFeed
   * @instance
   */
  takePhoto = () => {
      console.log("TAKE PICTURE 1")
      const { uploadImage } = this.props;
      var canvas = document.createElement('canvas');
      canvas.width = 680;
      canvas.height = 360;
      const context = canvas.getContext('2d');
      context.drawImage(this.videoPlayer, 0, 0, 680, 360);
      console.log("CONTEXT : ", context)
      console.log("CONTEXT : ", uploadImage)
      canvas.toBlob(this.props.uploadImage());
      // this.props.sendFile(context)
      console.log("TAKE PICTURE 2 : ")
  };

  render() {
      return (
          <div className="c-camera-feed">
              <div className="c-camera-feed__viewer">
                  <video ref={ref => (this.videoPlayer = ref)} width="680" heigh="360" />
              </div>
              <button onClick={this.takePhoto}>Take photo!</button>
              {/* <div className="c-camera-feed__stage">
                  <canvas width="680" height="360" ref={ref => (this.canvas = ref)} />
              </div> */}
          </div>
      );
  }
}

export default Count;
