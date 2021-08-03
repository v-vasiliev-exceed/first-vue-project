<template>
  <div>
    <div id="popup_auth" v-if="!this.$store.state.currentUser">
      <div v-if="log" class="log form-user-date">
        <p class="popup-title">Authorization form</p>

        <form>
          <v-text-field
            v-model="name"
            :error-messages="nameErrors"
            :counter="10"
            label="Name"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          ></v-text-field>
          <div class="notificationPasswordIsWrong" v-if="PassworIsWrong">
            Password is wrong
          </div>
          <v-text-field
            type="password"
            v-model="password"
            label="Password"
            required
            @input="$v.email.$touch()"
            @blur="$v.email.$touch()"
          ></v-text-field>
          <a class="linkChangePopup" v-on:click="goToRegistration()"
            >Registration form</a
          >
          <v-btn class="mr-4 btn-submit" @click="login">
            submit
          </v-btn>
          <v-btn @click="clear">
            clear
          </v-btn>
        </form>
      </div>
      <div v-if="reg" class="reg form-user-date">
        <p class="popup-title">Registration form</p>
        <form>
          <v-text-field
            class="form-input"
            v-model="name"
            :error-messages="nameErrors"
            :counter="10"
            label="Name"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          ></v-text-field>
          <v-text-field
            type="password"
            v-model="password"
            label="Password"
            required
            @input="$v.email.$touch()"
            @blur="$v.email.$touch()"
          ></v-text-field>
          <a class="linkChangePopup" v-on:click="goToAuthorization()"
            >Authorization form</a
          >
          <v-btn class="mr-4 btn-submit" @click="registrtion()">
            submit
          </v-btn>
          <v-btn @click="clear">
            clear
          </v-btn>
        </form>
      </div>
    </div>

    <v-btn
      color="secondary"
      elevation="10"
      rounded
      class="logOut"
      v-if="this.$store.state.currentUser"
      v-on:click="logOut()"
      >Log out</v-btn>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(10) },
    email: { required, email },
    select: { required },
    checkbox: {
      checked(val) {
        return val;
      },
    },
  },

  data: () => ({
    name: "",
    password: "",
    userID: "",
    select: null,
    checkbox: false,
    haveAccount: 1,
    reg: null,
    log: true,
    newLocation: null,
    addNL: null,
    PassworIsWrong: null,
  }),

  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Name must be at most 10 characters long");
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
  },

  methods: {
    submit() {
      this.$v.$touch();
    },
    registrtion() {
      if (this.name !== "" && this.password !== "") {
        const { uuid } = require("uuidv4");
        const userID = uuid();
        this.userID = userID;
        const userData = {
          name: this.name,
          Password: this.password,
          userID: userID,
          marks: [],
        };
        const oldUsers = JSON.parse(localStorage.getItem("users"));
        const allName = [];

        if (oldUsers) {
          oldUsers.forEach((element, idx) => {
            allName[idx] = element.name;
          });
          if (allName.includes(userData.name)) {
            alert("user with same name exist");
          } else {
            oldUsers.push(userData);
            localStorage.setItem("users", JSON.stringify(oldUsers));
            this.reg = false;
            this.$store.state.newLocation = true;
            this.$store.state.userName = this.name;
            this.$store.state.currentUser = userData;
            localStorage.setItem("curentUser", JSON.stringify(userData));
          }
        } else {
          localStorage.setItem("users", JSON.stringify([userData]));
          this.reg = false;
          this.$store.state.newLocation = true;
          localStorage.setItem("curentUser", JSON.stringify(userData));
        }
        this.name = "";
        this.password = "";
      } else {
        alert("Input correct data");
      }
    },
    login() {
      const userName = this.name,
        userPW = this.password,
        users = JSON.parse(localStorage.getItem("users"));

      let userData = null;

      users.forEach((element) => {
        if (element.name === userName) {
          userData = element;
        }
      });
      if (userData) {
        if (userData.Password === userPW) {
          this.log = false;
          this.$store.state.newLocation = true;
          this.$store.state.userName = this.name;
          this.$store.state.currentUser = userData;
          localStorage.setItem("curentUser", JSON.stringify(userData));
        } else {
          alert("Password is wrong");
        }
      } else {
        alert("user with same name not found");
      }
    },
    clear() {
      this.$v.$reset();
      this.name = "";
      this.password = "";
      this.select = null;
      this.checkbox = false;
    },
    goToAuthorization() {
      this.reg = false;
      this.log = true;
      this.name = "";
      this.password = "";
    },
    goToRegistration() {
      this.reg = true;
      this.log = false;
      this.name = "";
      this.password = "";
    },
     logOut(){
      this.$store.state.currentUser = null;
      localStorage.removeItem('curentUser');
      console.log(this.$store.state.currentUser);

    },
  },
};
</script>

<style scoped>
.linkChangePopup {
  display: block;
  cursor: pointer;
  color: blue;
  margin-bottom: 30px;
}
.form-user-date {
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -100px;
  margin-top: -140px;
  background-color: #fff;
  max-height: 400px;
  max-width: 400px;
  text-align: center;
  padding: 20px;
  padding-top: 50px;
  font-family: sans-serif;
}

.popup-title {
  font-family: sans-serif;
  font-size: 16px;
}
.btn-submit {
  margin-right: 20px;
}
.logOut{
  position: fixed;
  top: 10px;
  left: 50px;
}
</style>
