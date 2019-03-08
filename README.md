# SMQ-LED-Vue.js

This example shows how to use modern web frameworks such as Vue.js with a non Node.js application server.

The example proposes the use of two application servers during development process. The released application can be stored as static assets on any web server and does not need Node.js, thus Node.js is only used during development.

A more in-depth introduction to the concept proposed in this example can be found in the article: [using modern frameworks with the Barracuda App Server](https://realtimelogic.com/articles/ReactJS-Angular-and-Vuejs-with-the-Barracuda-App-Server).

This example is designed for using the [SMQ IoT protocol](https://realtimelogic.com/products/simplemq/src/). The SMQ protocol can be used for browser to server communication; however, this example does not use SMQ for communicating with the server, but uses SMQ for communicating with devices. You do not need a device for running the example, but you need to download the [SMQ LED C Example](https://github.com/RealTimeLogic/SMQ) separately and compile this example if you intend to test the code in release mode. The example connects to the online SMQ broker when run in developer mode and you only need Node.js when testing the code in developer mode.

## Prerequisites:

Follow this guide if you do not have Node.js and/or Vue.js installed.

1. [Download and install Node.js](https://nodejs.org/en/download/)
2. Open a command window and run the command: npm install -g @vue/cli

## Download and run the LED Vue.JS Example:

Note, if you do not have git installed as a command line program, simply download and unzip the example by clicking the above "Clone or download" button instead of running the git clone command below.

Download, configure, and start the SMQ-LED-Vue.js example as follows:
```
git clone https://github.com/RealTimeLogic/SMQ-LED-Vue.js.git
cd SMQ-LED-Vue.js
npm install
npm run dev
``` 
The above commands, downloads the example using git, changes to the example directory, installs all required dependencies, and runs the Node.js server and Vue.js in developer mode.

## Testing the example in developer mode:

You can now navigate to your local Node.js server by navigating to: http://localhost:8080.

The Vue.js LED SPA example replicates the functionality in the JQuery powered SPA found at: [simplemq.com/m2m-led/](https://simplemq.com/m2m-led/). You can see how the JQuery SPA and Vua.js SPA are synchronized by opening two browser windows, one for http://localhost:8080, and one for simplemq.com/m2m-led/. Notice how the two application's internal states are synchronized when clicking a button in any of the browser windows.

## Package example for release (production) mode:

Enter Ctrl-C in the command window running the Node.js server. Enter the following command for releasing the Vue.js example:
```
npm run build
```
The production ready Vua.js SPA code is put in the 'dist' sub directory.

You may now run a local Barracuda App Server and load the LED SPA example using the Barracuda App Server. We also need to install the server side LED example code. Install the LED server side example code as follows:

```
wget http://makoserver.net/download/IoT-LED-Broker.tar.gz
cd dist
tar xvzf ../IoT-LED-Broker.tar.gz
cd ..
```
You may download and unzip the IoT-LED-Broker file in the 'dist' directory using your browser and another unzip tool if you do not have the wget or tar command line programs.

Note that we put the server side code in the same directory as the released SPA code.

The web site Mako Server provides a pre-compiled Barracuda App Server. [Download Mako Server](https://makoserver.net/download/) for your platform and start the Mako Server as follows:

```
mako -l::dist
```
The above command instructs the Mako Server to use the 'dist' directory as the server's 'www' directory. Note that the above command assumes you have the Mako Server in your path. You may specify the path to the mako executable on the command line. Should you get any 'command not found' errors, see the Mako Server site for details on running Mako Server from the command line.

Pay attention to the port number used by the Mako Server (printed in the console) . The port number will most likely be 9357. Navigate to the http://localhost:portno (http://localhost:9357) to open the released Vue.js LED example.

You should see a spinning icon. This is a small glitch in the Vua.js SPA. It basically means that you have no devices connected to your local computer. Connect a device as follows:

```
git clone https://github.com/RealTimeLogic/SMQ.git
cd SMQ
make
./led-smq -blocalhost:9357/smq.lsp
```


