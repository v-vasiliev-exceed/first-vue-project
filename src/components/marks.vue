<template>
  <div>
    <span
      v-if="this.$store.state.newLocation"
      v-on:click="open()"
      class="newLocation"
    >
      +
    </span>

    <div v-if="this.$store.state.popupAddingLocatin" class="popupAddingLocatin">
      <template>
        <form @submit.prevent="submit">
          <span
            v-on:click="close()"
            class="newLocation popupAddingLocatin-close"
          >
            &#215;</span
          >

          <v-text-field
            v-model="positionFirst"
            class="inputlocation inputPosition"
            type="number"
            placeholder="54"
            label="Position first"
            required
          ></v-text-field>

          <v-text-field
            v-model="positionSecond"
            class="inputlocation inputPosition"
            type="number"
            placeholder="54"
            label="Position second"
            required
          ></v-text-field>

          <v-text-field
            v-model="nameLocation"
            class="inputlocation"
            type="text"
            placeholder="Ship Avrora"
            label="Name location"
            required
          ></v-text-field>

          <v-text-field
            v-model="discription"
            class="inputlocation"
            type="text"
            placeholder="Popular ship in Russia"
            label="Discription"
            required
          ></v-text-field>

          <v-btn class="mr-4 btn" v-on:click="addNewMark">
            {{ this.$store.state.titleBtn }}
          </v-btn>
        </form>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nameLocation: "",
      discription: "",
      positionFirst: "",
      positionSecond: "",
      newLocation: this.$store.state.newLocation,
      AddLocation: this.$store.state.popupAddingLocatin,
    };
  },
  methods: {
    open() {
      this.$store.state.newLocation = false;
      this.$store.state.popupAddingLocatin = true;
      this.positionFirst = "";
      this.positionSecond = "";
      this.nameLocation = "";
      this.discription = "";
      this.$store.state.titleBtn = "Add new location";
      this.$store.state.currentTag = null;
    },
    close() {
      this.$store.state.newLocation = true;
      this.$store.state.popupAddingLocatin = false;
      this.positionFirst = "";
      this.positionSecond = "";
      this.nameLocation = "";
      this.discription = "";
      this.$store.state.currentTag = null;
    },
    addNewMark() {
      const userData = JSON.parse(localStorage.getItem("curentUser"));

      if (this.$store.state.currentTag) {
        const userMarksID = this.$store.state.currentUser.marks.map(
          (mark) => mark.markerID
        );
        const currentTeg = this.$store.state.currentTag;

        currentTeg.discription = this.discription;
        currentTeg.nameLocation = this.nameLocation;
        const a = this.positionFirst;
        const b = this.positionSecond;
        currentTeg.position = [a, b];

        this.$store.state.currentUser.marks[
          userMarksID.indexOf(currentTeg.markerID)
        ] = currentTeg;
        this.$store.state.currentTag = currentTeg;

        localStorage.setItem(
          "curentUser",
          JSON.stringify(this.$store.state.currentUser)
        );

        const users = JSON.parse(localStorage.getItem("users"));

        users.forEach((element, idx) => {
          if (element.name === this.$store.state.currentUser.name) {
            users[idx] = this.$store.state.currentUser;
          }
        });
        localStorage.setItem("users", JSON.stringify(users));
      } else {
        const { uuid } = require("uuidv4");
        const markerID = uuid();
        const a = Number(this.positionFirst),
          b = Number(this.positionSecond);

        const markerData = {
          markerID: markerID,
          position: [a, b],
          nameLocation: this.nameLocation,
          discription: this.discription,
          link: "-",
        };

        userData.marks.push(markerData);
        localStorage.setItem("curentUser", JSON.stringify(userData));
        this.$store.state.currentUser = userData;
        let users = JSON.parse(localStorage.getItem("users"));

        users.forEach((element) => {
          if (userData.name === element.name) {
            element.marks.push(markerData);
          }
        });
        localStorage.setItem("users", JSON.stringify(users));
      }
      this.$store.state.popupAddingLocatin = false;
      this.$store.state.newLocation = true;
      this.positionFirst = "";
      this.positionSecond = "";
      this.nameLocation = "";
      this.discription = "";
      this.$store.state.currentTag = null;
    },
  },
  computed: {
    changeTag() {
      return this.$store.state.currentTag;
    },
    changeStatusAddLoaction() {
      return this.$store.state.popupAddingLocatin;
    },
    changeStatusNewLoaction() {
      return this.$store.state.newLocation;
    },
  },

  watch: {
    changeStatusAddLoaction: {
      handler() {
        this.AddLocation = this.changeStatusAddLoaction;
      },
    },
    changeStatusNewLoaction: {
      handler() {
        this.newLocation = this.changeStatusNewLoaction;
      },
    },
    changeTag: {
      handler() {
        if (this.changeTag) {
          this.nameLocation = this.changeTag.nameLocation;
          this.discription = this.changeTag.discription;
          this.positionFirst = this.changeTag.position[0];
          this.positionSecond = this.changeTag.position[1];
        }
      },
    },
  },
};
</script>

<style scoped>
.newLocation {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #000;
  color: #fff;
  font-size: 35px;
  text-align: center;
  z-index: 99;
  cursor: pointer;
}
.popupAddingLocatin {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 300px;
  padding: 20px;
  z-index: 999;
  background-color: #fff;
  text-align: center;
}
.inputlocation {
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px;
}
.inputPosition {
  display: inline-block;
  width: 48%;
  margin-right: 5px;
  text-align: center;
}
.btn {
  border-radius: 5px;
  border: 1px solid black;
  padding: 5px;
}
.popupAddingLocatin-close {
  display: block;
  z-index: 999;
  position: absolute;
  font-size: 14px;
  width: 20px;
  height: 20px;
  top: 5px;
  right: 5px;
}
</style>
