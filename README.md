# SMQ-LED-Vue.js

This example shows how to use modern web frameworks such as Vue.js with a non Node.js application server.

The example proposes the use of two application servers during development process. The released application can be stored as static assets on any web server and does not need Node.js, thus Node.js is only used during development.

A more in-depth introduction to the concept proposed in this example can be found in the article: [using modern frameworks with the any web server](https://realtimelogic.com/articles/ReactJS-Angular-and-Vuejs-with-the-Barracuda-App-Server).

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

The Vue.js LED SPA example replicates the functionality in the JQuery powered SPA found at: [simplemq.com/m2m-led/](https://simplemq.com/m2m-led/). You can see how the JQuery SPA and Vue.js SPA are synchronized by opening two browser windows, one for http://localhost:8080, and one for simplemq.com/m2m-led/. Notice how the two application's internal states are synchronized when clicking a button in any of the browser windows.

## Package example for release (production) mode:

Enter Ctrl-C in the command window running the Node.js server. Enter the following command for releasing the Vue.js example:
```
npm run build
```
The production ready Vue.js SPA code is put in the 'dist' sub directory.

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

You should see a spinning icon. This is a small glitch in the Vue.js SPA. It basically means that you have no devices connected to your local computer. Connect a device as follows:

```
git clone https://github.com/RealTimeLogic/SMQ.git
cd SMQ
make
./led-smq -blocalhost:9357/smq.lsp
```

# How the Example Works

The example implements the same features as the JQuery powered JavaScript application. See the tutorial [Browser to Device LED Control using SMQ](https://makoserver.net/articles/Browser-to-Device-LED-Control-using-SimpleMQ) for information on the SMQ pub/sub messages used in this example.

The example's core can be found in src/components/SMQ-LED.vue. Open this file and scroll down to line 270. You should see the following code:

```javascript
const deployd = process.env.NODE_ENV == "production";
let script = document.createElement('script');
script.src = deployd ? "/rtl/smq.js" : "https://simplemq.com/rtl/smq.js";
document.head.append(script);
```

Vue.js tells us if the code is in developer mode or in production mode. As you can see from the above code, we load the SMQ JavaScript library from the online server simplemq.com if the code is in developer mode and from the origin server if the code is in production (release) mode. You may change the developer mode URL if you have a copy of the Mako Server running on your own computer.

We also need to specify the WebSocket connection end point when creating an SMQ JavaScript instance.

```javascript
window.smq = SMQ.Client(deployd ? SMQ.wsURL("/smq.lsp") : "wss://simplemq.com/smq.lsp");
```

The above code snippet sets the SMQ WebSocket URL to simplemq.com if the code is in developer mode and to the origin server if the code is in production mode.

## Layout

There are two main directories, namely 'src' and 'static'.

The 'src' directory contains three subdirectories: 'assets', 'components' and 'router', and two files 'app.vue' and 'main.js'.

'main.js' contains the Vue instances which will run in the whole app.

'app.vue' is like the basement of the whole component. In 'app.vue' the components are loaded dynamically though the router.

The 'assests' directory contains all the CSS for SMQ-LED components. The 'components' consists of the 'SMQ-LED.vue' file.

The 'router' directory contains the 'index.js' file. The 'index.js' file directs which router will load which component.

All the audios and images that are used for SMQ-LED are stored in the 'static' directory.

## Vue.js Info

Every Vue.js component has three sections:
i) Template
ii) Script
iii) Style

**Template:**

We used the Element UI kit for CSS and styling all components. This UI kit is based on the following: [https://element.eleme.io/](https://element.eleme.io/)

Tabs(el-tabs) are used to show all the connected devices which previews its LEDs.

```xml
<el-tab-pane
:key="conect.ptid"
	v-for="conect in connection"
	:name="connectionToString(conect.ptid)"
	@tab-click="clickConnection"
>
//Preview will be shown here
</el-tab-pane>
```

**Script:**

When the app starts, the Vue.js "mounted" method is called and this function sets up the app and subscribes to the defined SMQ topics. See the code for details.

