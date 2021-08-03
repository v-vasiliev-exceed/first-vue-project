<template>
  <div>
    <v-btn
      v-if="this.$store.state.newLocation"
      v-on:click="open()"
      class="newLocation"
      color="secondary"
      fab
      ><v-icon dark>
        mdi-plus
      </v-icon></v-btn
    >

    <div v-if="this.$store.state.popupAddingLocatin" class="popupAddingLocatin">
      <template>
        <form @submit.prevent="submit">
          <v-btn
            v-on:click="close()"
            class="newLocation popupAddingLocatin-close"
            x-small
            color="secondary"
            fab
            ><v-icon dark>
              mdi-close
            </v-icon></v-btn
          >

          <v-alert color="blue" text 
            ><div>Please enter correct data.</div>
            <div>The first number must be between -180 and 180.</div>
            <div>The second number must be between -85 and 85.</div></v-alert
          >

          <v-text-field
            v-model="positionFirst"
            class="inputlocation inputPosition"
            oninput="javascript: if ((this.value > 180) || (this.value < -180)) this.value = '';"
            type="number"
            placeholder="54"
            label="Position first"
            required
          ></v-text-field>

          <v-text-field
            v-model="positionSecond"
            class="inputlocation inputPosition"
            oninput="javascript: if ((this.value > 85) || (this.value < -85)) this.value = ''; "
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

          <v-btn class="mr-4 btn" v-on:click="snackbar = true">
            {{ this.$store.state.titleBtn }}
          </v-btn>
        </form>
      </template>
    </div>

    <v-snackbar v-model="snackbar" centered timeout="-1"> <!-- :multi-line="multiLine"  -->
      Do you really want {{ this.$store.state.titleBtn }}?

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          No
        </v-btn>

        <v-btn color="red" text v-bind="attrs" @click="addNewMark">
          Yes
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { v4 as uuid_v4 } from "uuid";

export default {
  data() {
    return {
      nameLocation: "",
      discription: "",
      positionFirst: "",
      positionSecond: "",
      newLocation: this.$store.state.newLocation,
      AddLocation: this.$store.state.popupAddingLocatin,
      snackbar: false,
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
        const markerID = uuid_v4();
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
      this.snackbar = false;
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
