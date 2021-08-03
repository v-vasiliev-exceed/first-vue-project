<template>
  <div>
    <vl-map
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      data-projection="EPSG:4326"
      style="height: 100vh"
    >
      <vl-layer-vector v-if="userMarks.length">
        <vl-source-cluster :distance="200">
          <vl-source-vector
            v-for="(mark, idx) in userMarks"
            :key="idx"
            id="overlay"
          >
            <vl-overlay :position="mark">
              <template>
                <div class="overlay-content">
                  <img
                    v-on:click="openDelChange(idx)"
                    class="position-tag"
                    src="../media/marker.png"
                    alt="marker"
                  />
                </div>
              </template>
            </vl-overlay>
          </vl-source-vector>

          <vl-style-func />
        </vl-source-cluster>
      </vl-layer-vector>

      <vl-layer-tile id="osm">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>
    </vl-map>
    <template v-if="this.$store.state.currentTag">
      <v-dialog v-model="dialog" width="500"
        ><v-card>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-title class="text-h5 grey lighten-2">
            Name location: {{ this.$store.state.currentTag.nameLocation }}
          </v-card-title>
          <v-card-text>
            Discription: {{ this.$store.state.currentTag.discription }}
          </v-card-text>
          <v-card-text>
            Position: {{ this.$store.state.currentTag.position }}
          </v-card-text>
          <v-card-text
            class="linkToVideo-div"
            v-if="this.$store.state.currentTag.link !== '-'"
            v-on:click="dialogVideo = true"
          >
            Video:
            <span class="linkToVideo">{{
              this.$store.state.currentTag.link
            }}</span>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn
              elevation="2"
              v-if="this.$store.state.currentTag.link === '-'"
              v-on:click="attachVideo = true"
            >
              Attach a video</v-btn
            >
            <v-btn color="secondary" elevation="2" v-on:click="changeMarks()"
              >Change</v-btn
            >

            <v-btn color="error" elevation="5" v-on:click="dialogDel = true"
              >Delete</v-btn
            >
          </v-card-actions>
          <v-card-actions v-if="attachVideo">
            <div class="inputLink">
              <template v-if="this.$store.state.currentTag.link === '-'">
                <span>Input Link</span>
                <input v-model="link" type="text" />
                <v-btn elevation="2" v-on:click="addLink"> Add link</v-btn>
              </template>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <template v-if="this.$store.state.currentTag">
      <div class="text-center">
        <v-dialog v-model="dialogVideo" width="500">
          <v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialogVideo = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-actions>

            <v-card-actions class="flex-center-selector">
              <video
                class="video"
                controls
                v-bind:src="this.$store.state.currentTag.link"
              ></video>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>

    <template>
      <div class="text-center">
       <v-snackbar v-model="dialogDel"  centered timeout="-1">  <!-- :multi-line="multiLine" -->
          Are your sure ?

          <template>
            <v-btn
              class="sure-btn"
              color="secondary"
              elevation="2"
              v-on:click="dialogDel = false"
              >Cancel</v-btn
            >

            <v-btn class="sure-btn" color="error" elevation="5" v-on:click="delMarkNow()"
              >Delete</v-btn
            >
          </template>
        </v-snackbar>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      zoom: 2,
      center: [0, 0],
      rotation: 0,
      geolocPosition: undefined,
      markers: null,
      position: null,
      DelChange: null,
      idx: null,
      attachVideo: null,
      link: null,
      dialog: false,
      dialogVideo: false,
      dialogDel: false,
    };
  },

  methods: {
    close() {
      this.DelChange = false;
      this.attachVideo = false;
      this.watchVideo = false;
    },
    openDelChange(idx) {
      this.$store.state.popupAddingLocatin = false;
      this.$store.state.newLocation = true;
      this.dialog = true;
      this.idx = idx;
      this.$store.state.currentTag = this.$store.state.currentUser.marks[
        this.idx
      ];
    },
    changeMarks() {
      this.DelChange = false;
      this.$store.state.popupAddingLocatin = true;
      this.dialog = false;
      this.$store.state.titleBtn = "Change marker";
    },
    delMarkNow() {
      this.$store.state.currentUser.marks.splice(this.idx, 1);
      localStorage.setItem(
        "curentUser",
        JSON.stringify(this.$store.state.currentUser)
      );
      const users = JSON.parse(localStorage.getItem("users"));
      users.forEach((element, idx) => {
        if (element.name == this.$store.state.currentUser.name) {
          users[idx] = this.$store.state.currentUser;
        }
      });
      localStorage.setItem("users", JSON.stringify(users));
      this.dialog = false;
      this.dialogDel = false;
    },
    addLink() {
      this.$store.state.currentTag.link = this.link;
      this.attachVideo = false;

      this.$store.state.currentUser.marks.forEach((element, idx) => {
        if (element.markerID === this.$store.state.currentTag.markerID) {
          this.$store.state.currentUser.marks[
            idx
          ] = this.$store.state.currentTag;
          localStorage.setItem(
            "curentUser",
            JSON.stringify(this.$store.state.currentUser)
          );
        }
      });
      const userData = JSON.parse(localStorage.getItem("users"));
      userData.forEach((element, idx) => {
        if (element.userID === this.$store.state.currentUser.userID) {
          userData[idx] = this.$store.state.currentUser;
        }
      });
      localStorage.setItem("users", JSON.stringify(userData));
    },
    
  },
  computed: {
    userMarks() {
      const currentUser = this.$store.state.currentUser;
      return currentUser ? currentUser.marks.map((mark) => mark.position) : [];
    },
  },
};
</script>

<style scoped>
.position-tag {
  width: 20px;
  cursor: pointer;
}

.del-change {
  position: fixed;
  left: 50%;
  top: 50%;
  text-align: center;
  background-color: #37474f;
  margin-left: -150px;
  margin-top: -150px;
  padding: 20px;
  width: 300px;
}
.btn-select {
  padding: 10px;
  margin-right: 10px;
  margin-top: 20px;
  text-align: center;
  border-radius: 10px;
}
.btn-select:last-child {
  margin-right: 0;
}
.btn-del {
  background: #da0707;
}
.btn-cheange {
  background-color: #98ce66;
}
.AreYourSure {
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -100px;
  margin-top: -50px;
  text-align: center;
  background-color: #1e1e1e;
  width: 200px;
  padding: 10px;
}
.AreYourSure-btn {
  margin-top: 10px;
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
  margin-right: 15px;
}
.AreYourSure-btn:last-child {
  margin-right: 0;
}
.btn-close {
  cursor: pointer;
  z-index: 999;
  position: absolute;
  font-size: 30px;
  width: 20px;
  height: 20px;
  top: 5px;
  right: 5px;
}
.linkToVideo {
  cursor: pointer;
  color: #00f2ff;
}
.popup-video {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.video {
  text-align: center;
  max-width: 300px;
}

.btn-close-video {
  cursor: pointer;
  z-index: 999;
  position: absolute;
  font-size: 30px;
  width: 20px;
  height: 20px;
  right: 5px;
  color: wheat;
  font-size: 30px;
}
.btn-chageTag {
  border: 1px solid rgb(131, 126, 126);
  margin-top: 10px;
  margin-right: 10px;
}
.btn-chageTag:last-child {
  margin-right: 0;
}
.btn-delTag {
  border: 1px solid rgb(131, 126, 126);
  margin-top: 10px;
}
.inputLink {
  display: block;
  margin-top: 20px;
  color: #fff;
}
.inputLink input {
  padding: 5px;
  border: 1px solid rgb(139, 139, 139);
  border-radius: 5px;
  color: #000;
  margin-right: 15px;
}
.inputLink span {
  margin-right: 10px;
  color: rgb(139, 139, 139);
}
.flex-center-selector {
  justify-content: center;
}
.sure-btn{
  margin-left: 10px;
}

</style>
