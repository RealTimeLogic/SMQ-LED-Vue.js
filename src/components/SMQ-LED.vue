<template>
  <div class="hello">
     <el-row>
       	<el-col>
       		<!-- Start Iot Bot -->
          	<div class="bot">

          		<!-- Devices tab start -->
            	<el-tabs type="border-card" v-model="activeName" tab-position="left" v-if="connection">

            		<!-- Static Details tab start -->
              		<el-tab-pane name="first">
                    	<span slot="label" title="Introduction">Introduction</span>
                     	<div class="col-xs-12">
                       		<h3>SMQ LED Demo Introduction</h3>
	                        <p> The SMQ LED Demo shows how to design a cloud based IoT solution for controlling LEDs in devices connected to an SMQ broker. The demo uses the <a href="https://realtimelogic.com/products/simplemq/" target="_blank"> SMQ protocol</a> and enables GUI clients to control all LEDs in each connected device. See the <a href="https://makoserver.net/blog/2014/12/Browser-to-Device-LED-Control-using-SimpleMQ" target="_blank"> Browser to Device LED Control using SMQ</a> tutorial for more information on how this demo functions.</p>

                        	<h2>Connect Your Own Device</h2>

	                        <p>By downloading a ready to use demo or compiling and running the source code, you will be able to control your own (simulated) device from your computer or from your own device. The (simulated) device will show up as a new tab on this page with the IP address of your network.</p>

	                        <b>Download:</b>
	                        <p>The SMQ device C source code can be downloaded from the <a href="https://realtimelogic.com/products/simplemq/src/">SMQ source code page</a>.
	                        </p>
                     	</div>
                	</el-tab-pane><!-- Static Details tab end -->
            		
            		<!-- Devices tab start -->
	                <el-tab-pane
	                    :key="conect.ptid"
	                    v-for="conect in connection"
	                    :name="connectionToString(conect.ptid)"
	                    @tab-click="clickConnection"
	                >	
	                	<!-- Device Ip Address -->
	              		<span slot="label" :title="conect.devname"> {{ conect.ipaddr }} </span>

	              		<!-- Device Devname Start -->
						<el-row>
							<div class="p-b-20">
							     <div class="tag">{{ getLabel }}</div>
							</div>
						</el-row><!-- Device Devname End -->
						
						<!-- LED list start -->
						<el-row :key="b" v-for="(chunkBulb, b) in chunkBulbToRow">
							<table>
								<tbody>

									<!-- Render LED -->
									<tr :key="key" v-for="(leds, key) in chunkBulb">

										<!-- Led Name -->
										<td class="led-font">{{ leds.name }}</td><!-- Led Name -->

										<!-- Led Color-->
										<td>
											<div :class="leds.on ? stringColor(leds.color) : 'gray'" class="eggs m-l-20">
											</div>
										</td><!-- Led Color-->

										<!-- LED Switch -->
										<td>
											<div class="onoffswitch m-l-20">
									          <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" v-model="leds.on" :id="'switch' + leds.key" checked=""  @change="changeItem(leds.on, leds.key, Number(activeName))">
									          <label class="onoffswitch-label" :for="'switch' + leds.key">
									            <span class="onoffswitch-inner"></span>
									            <span class="onoffswitch-switch"></span>
									          </label>
									        </div>
										</td><!-- LED Switch -->
									</tr><!-- Render LED -->

								</tbody>
							</table>
							<br>
						</el-row><!-- LED list end -->

            		</el-tab-pane><!-- Devices tab end -->

            	</el-tabs><!-- Devices tab end -->

				<!-- Start Connecting Loading -->
            	<div v-loading.fullscreen.lock="connecting"></div><!-- Start Connecting Loading -->

          	</div><!-- End Iot Bot -->
       	</el-col>
     </el-row>
  </div>
</template>

<script>
export default {
  name: 'smq_led',
  data () {
    return {
      activeName: '',
      start: 0,
      connecting: true,
      connection: [],
      colorCode: {
        red: '#FF0000',
        green: '#FFFF00',
        yellow: '#008000',
        blue: '#0000FF'
      }
    }
  },
  computed: {
    getBulb() {
     let index = -1
     this.connection.forEach((item, key) => {
      	if (item.ptid.toString() == this.activeName) {
      		index = key
      	}
     })
     if(this.connection && this.activeName != 'first' && index > -1) {
        return this.connection.filter((item) => {
          return item.ptid.toString() == this.activeName
        })[0].leds
      }
      return []
    },
    chunkBulbToRow() {
      var chunks = [],
      i = 0,
      n = this.getBulb.length;

      while (i < n) {
        chunks.push(this.getBulb.slice(i, i += 1));
      }

      let b = 1;

      chunks.forEach((item) => {
        item.forEach((bulb) => {
          bulb.key = b++
        })
      })

      return chunks;
    },
    getLabel() {
    	let index = -1
	     this.connection.forEach((item, key) => {
	      	if (item.ptid.toString() == this.activeName) {
	      		index = key
	      	}
	     })
      if(this.connection && this.activeName != 'first' && index > -1) {
        return this.connection.filter((item) => {
          return item.ptid.toString() == this.activeName
        })[0].devname
      }
      return ''
    }
  },
  methods: {
    // Change LED status
    changeItem(event, key, ptid) {
      var data = new Uint8Array(2);
      data[0] = key;
      data[1] = event ? 1 : 0;
      smq.publish(data,ptid);
    },
    stringColor(color) {
      return color.toString()
    },
    checkColorCode(color) {
      return this.colorCode[color];
    },
    connectionToString(ptid) {
      return ptid.toString();
    },
    clickConnection(event) {
  
    },
    // Check Device length
    statusPTid(ptid) {
      return this.connection.filter((item) => {
        return item.ptid === ptid;
      }).length ? false : true;
    },
    // Subscribe device info as like previous app
    devInfo(info, ptid) {
      var loading = this.$loading({
        lock: true,
        text: 'Try to connect device',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      info.ptid = ptid

      if(! this.start) {
        this.activeName = this.connectionToString(ptid)
        this.start++
      }
      if(this.statusPTid(ptid)) {

        /**
         * this.connection will store the upcoming
         * unique devices 
         */
        this.connection.push(info)
      }

      this.connecting = false

      loading.close();

      smq.observe(ptid, () => {
          this.deviceRemove(ptid)
          play("pong");
        });
    },
    // Called when device disconnects
    deviceRemove(ptid) {
      var index = -1
      this.connection.forEach((item, key) => {
        if(item.ptid == ptid) {
          index = key
        }
      })

      if(index > -1) {
      	this.connection = this.connection.filter((item) => {
      		return item.ptid !== ptid
      	})
        this.activeName = ''
        this.start = 0
        smq.publish("Hello", "/m2m/led/display");
      }
    },
    // Set a LED on/off
    onLED(data, ptid) {
      this.connection.forEach((item) => {
        if(item.ptid == ptid.toString()) {
          item.leds[data[0] - 1].on = data[1] ? true : false;
        }
      });
      play("switch");
    },
    onTemp() {
      
    },
    connect() {
        play("pong");
        smq.publish("Hello", "/m2m/led/display");
    },
    reconnect() {
        play("pong");
      smq.publish("Hello", "/m2m/led/display");
    },
    onclose(message, canreconnect) {
        this.connection = []
        if(canreconnect) return 3000;
    }

  },
  mounted() {

      /*
        What we do here is to dynamically load the SMQ JavaScript
        stack. The JavaScript library is fetched from the online SMQ
        test broker (simplemq.com) if we are in development mode and
        from the local server if the code has been deployed.
       */
      const deployd = process.env.NODE_ENV == "production";
      let script = document.createElement('script');
      script.src = deployd ? "/rtl/smq.js" : "https://simplemq.com/rtl/smq.js";
      document.head.append(script);
      script.onload = () => {
          // Connect to local broker if deployed or to online test broker if in development mode
  	  window.smq = SMQ.Client(deployd ? SMQ.wsURL("/smq.lsp") : "wss://simplemq.com/smq.lsp");
          smq.subscribe("/m2m/led/device", "devinfo", {"datatype":"json", "onmsg":this.devInfo})
          smq.subscribe("self", "devinfo", {"datatype":"json", "onmsg":this.devInfo});
          //When a device publishes LED state change.
          smq.subscribe("/m2m/led/device", "led", {"onmsg":this.onLED});
          //When a device publishes a new temperature.
          smq.subscribe("/m2m/temp", {"onmsg":this.onTemp});
          //Broadcast to all connected devices.
          //Device will then send 'info' to our ptid ("self"), sub-tid: "devinfo".
          smq.publish("Hello", "/m2m/led/display");
          // Connection start it will call connect method
          smq.onconnect = this.connect;
          // Connection try to reconnect it will call reconnect method
          smq.reconnect = this.reconnect;
          // Connection Close then it will call onclose method
          smq.onclose = this.onclose;
      };
      script.onerror = function() {
          alert("Error loading " + this.src);
      };
  },
  updated() {
      // Fix UI Kit css issue
      if(document.getElementsByClassName('el-card__body').length > 1) {
          Array.from(document.getElementsByClassName('el-card__body')).forEach((item) => {
              item.style.padding = "0px";
          })
      }
  }
}

//;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
 /*
 	add Style CSS
 	assets/css/style.css
  */
 @import '../assets/css/style.css';
</style>
