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
            v-for="(mark, i) in userMarks"
            id="overlay"
            :key="i"
          >
            <vl-overlay :position="mark">
              <div class="overlay-content">
                <img
                  class="position-tag"
                  src="../media/marker.png"
                  alt="marker"
                  @click="openDelChange(i)"
                >
              </div>
            </vl-overlay>
          </vl-source-vector>
          <vl-style-func />
        </vl-source-cluster>
      </vl-layer-vector>

      <vl-layer-tile id="osm">
        <vl-source-osm />
      </vl-layer-tile>
    </vl-map>
    <template v-if="$store.state.currentTag">
      <v-dialog
        v-model="dialog"
        width="500"
      >
        <v-card>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              text
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-title class="text-h5 grey lighten-2">
            Name location: {{ $store.state.currentTag.nameLocation }}
          </v-card-title>
          <v-card-text>
            Discription: {{ $store.state.currentTag.discription }}
          </v-card-text>
          <v-card-text>
            Position: {{ $store.state.currentTag.position }}
          </v-card-text>
          <v-card-text
            v-if="$store.state.currentTag.link !== '-'"
            class="linkToVideo-div"
            @click="dialogVideo = true"
          >
            Video:
            <span class="linkToVideo">{{
              $store.state.currentTag.link
            }}</span>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-btn
              v-if="$store.state.currentTag.link === '-'"
              elevation="2"
              @click="attachVideo = true"
            >
              Attach a video
            </v-btn>
            <v-btn
              color="secondary"
              elevation="2"
              @click="changeMarks()"
            >
              Change
            </v-btn>

            <v-btn
              color="error"
              elevation="5"
              @click="dialogDel = true"
            >
              Delete
            </v-btn>
          </v-card-actions>
          <v-card-actions v-if="attachVideo">
            <div class="inputLink">
              <template v-if="$store.state.currentTag.link === '-'">
                <span>Input Link</span>
                <v-text-field
                  v-model="link"
                  type="text"
                />
                <v-btn
                  elevation="2"
                  @click="addLink"
                >
                  Add link
                </v-btn>
              </template>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <template v-if="$store.state.currentTag">
      <div class="text-center">
        <v-dialog
          v-model="dialogVideo"
          width="500"
        >
          <v-card>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                text
                @click="dialogVideo = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-actions>

            <v-card-actions class="flex-center-selector">
              <video
                class="video"
                controls
                :src="$store.state.currentTag.link"
              />
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>

    <div class="text-center">
      <v-snackbar
        v-model="dialogDel"
        centered
        timeout="-1"
      >
        <!-- :multi-line="multiLine" -->
        Are your sure ?

        <v-btn
          class="ml-3"
          color="secondary"
          elevation="2"
          @click="dialogDel = false"
        >
          Cancel
        </v-btn>

        <v-btn
          class="ml-3"
          color="error"
          elevation="5"
          @click="delMarkNow()"
        >
          Delete
        </v-btn>
      </v-snackbar>
    </div>
    <v-snackbar
      v-model="notificationAboutDel"
      top
    >
      You have removed the marker

      <template #action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="notificationAboutDel = false"
        >
          Ok
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      DelChange: null,
      idx: null,
      attachVideo: null,
      link: null,
      dialog: false,
      dialogVideo: false,
      dialogDel: false,
      notificationAboutDel: false,
    };
  },
  computed: {
    userMarks() {
      const { currentUser } = this.$store.state;
      return currentUser ? currentUser.marks.map((mark) => mark.position) : [];
    },
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
      this.$store.state.titleBtn = 'Change marker';
    },
    delMarkNow() {
      this.$store.state.currentUser.marks.splice(this.idx, 1);
      localStorage.setItem(
        'curentUser',
        JSON.stringify(this.$store.state.currentUser),
      );
      const users = JSON.parse(localStorage.getItem('users'));
      users.forEach((element, idx) => {
        if (element.name === this.$store.state.currentUser.name) {
          users[idx] = this.$store.state.currentUser;
        }
      });
      localStorage.setItem('users', JSON.stringify(users));
      this.dialog = false;
      this.dialogDel = false;
      this.notificationAboutDel = true;
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
            'curentUser',
            JSON.stringify(this.$store.state.currentUser),
          );
        }
      });
      const userData = JSON.parse(localStorage.getItem('users'));
      userData.forEach((element, idx) => {
        if (element.userID === this.$store.state.currentUser.userID) {
          userData[idx] = this.$store.state.currentUser;
        }
      });
      localStorage.setItem('users', JSON.stringify(userData));
    },

  },
};
</script>

<style scoped>
.position-tag {
  width: 20px;
  cursor: pointer;
}
.linkToVideo {
  cursor: pointer;
  color: #028d94;
}
.video {
  max-width: 300px;
}
.flex-center-selector {
  justify-content: center;
}

</style>
