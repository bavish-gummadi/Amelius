import React, { Component } from 'react';
import logo from './logo.svg';
import MetaTags from 'react-meta-tags';
import './App.css';

var fpp = require('face-plus-plus');
var fs = require('fs');
fpp.setApiKey("8ixqIjxhFK2Fg_z8L-xmGRItPZxZNVa_");
fpp.setApiSecret('q-lhBuleOsN3QKsNPI1Z7wA8uuIsQ0hN');
var parameters = {
        attribute: 'gender,age',
        img : {
            value: fs.readFileSync('./images/BhavishOCI.jpg'),
            meta: {filename:'BhavishOCI.jpg'}
        }
    };
fpp.post('detection/detect', parameters, function(err, res) {
        console.log(res);
});
var track;
var constraints = { video: { facingMode: "user" }, audio: false };
var cameraView = document.querySelector("#camera--view"),
      cameraOutput = document.querySelector("#camera--output"),
      cameraSensor = document.querySelector("#camera--sensor"),
      cameraTrigger = document.querySelector("#camera--trigger")
function cameraStart() {
          navigator.mediaDevices
              .getUserMedia(constraints)
              .then(function(stream) {
              track = stream.getTracks()[0];
              document.querySelector("#camera--view").srcObject = stream;
          })
          .catch(function(error) {
              console.error("Oops. Something is broken.", error);
          });
      }

var UserAction = () => {
    console.log("HERE");
    fetch("https://api-us.faceplusplus.com/facepp/v3/detect",
          {
              headers: {
                'Content-Type': 'text/plain'
              },
              method: "POST",
              body: JSON.stringify(
                            {
                              api_key: "8ixqIjxhFK2Fg_z8L-xmGRItPZxZNVa_",
                              api_secret: "q-lhBuleOsN3QKsNPI1Z7wA8uuIsQ0hN",
                              image_file: "@images/BhavishOCI.jpg",
                              return_landmark: 1,
                              return_attributes: "gender,age"
                            }
                          )
          })
          .then(function(res){ console.log(res) })
          .catch(function(res){ console.log(res) })
}
window.addEventListener("load", cameraStart, false);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <MetaTags>
            <meta name="description" content="Some description." />
            <meta property="og:title" content="MyApp" />
            <meta charSet="utf-8"/>
            <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
          </MetaTags>
          <div>
            <main id="camera">
              <video id="camera--view" autoPlay playsInline></video>

              <canvas id="camera--sensor"></canvas>
              <img src="//:0" alt="" id="camera--output"/>
              <button id="camera--trigger">Take a picture</button>
            </main>
          </div>
          <button type="submit" onClick={UserAction()}>Search</button>
        </header>
      </div>
    );
  }
}


export default App;
