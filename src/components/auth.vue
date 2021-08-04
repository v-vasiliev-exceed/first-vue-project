<template>
  <div>
    <div
      v-if="!$store.state.currentUser"
      id="popup_auth"
    >
      <div
        v-if="log"
        class="log form-user-date"
      >
        <p class="popup-title">
          Authorization form
        </p>

        <form>
          <v-alert
            v-if="nameNotFound"
            type="warning"
          >
            User with same name not found
          </v-alert>
          <v-text-field
            v-model="name"
            :counter="10"
            label="Name"
            required
            @input="nameNotFound = false"
          />
          <v-alert
            v-if="passwordIsWrong"
            type="error"
          >
            Password is wrong
          </v-alert>
          <v-text-field
            v-model="password"
            type="password"
            label="Password"
            required
            @input="passwordIsWrong = false"
          />
          <a
            class="linkChangePopup"
            @click="goToRegistration()"
          >Registration form</a>
          <v-btn
            class="mr-4"
            @click="login"
          >
            submit
          </v-btn>
          <v-btn @click="clear">
            clear
          </v-btn>
        </form>
      </div>
      <div
        v-if="reg"
        class="reg form-user-date"
      >
        <p class="popup-title">
          Registration form
        </p>
        <form>
          <v-alert
            v-if="hasName"
            type="warning"
          >
            User with same name exist
          </v-alert>
          <v-alert
            v-if="invalidData"
            type="warning"
          >
            Please fill in all fields
          </v-alert>
          <v-text-field
            v-model="name"
            class="form-input"
            :counter="10"
            label="Name"
            required
            @input="hasName = false;invalidData = false"
          />
          <v-text-field
            v-model="password"
            type="password"
            label="Password"
            required
            @input="invalidData = false"
          />
          <a
            class="linkChangePopup"
            @click="goToAuthorization()"
          >Authorization form</a>
          <v-btn
            class="mr-4"
            @click="registrtion()"
          >
            submit
          </v-btn>
          <v-btn @click="clear">
            clear
          </v-btn>
        </form>
      </div>
    </div>

    <v-btn
      v-if="$store.state.currentUser"
      color="secondary"
      elevation="10"
      rounded
      class="logOut"
      @click="logOut()"
    >
      Log out
    </v-btn>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, maxLength, email } from 'vuelidate/lib/validators';
import { uuid } from 'uuidv4';

export default {
  mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(10) },
    email: { required, email },
    checkbox: {
      checked(val) {
        return val;
      },
    },
  },

  data: () => ({
    name: '',
    password: '',
    userID: '',
    reg: null,
    log: true,
    newLocation: null,
    passwordIsWrong: false,
    hasName: false,
    invalidData: false,
    nameNotFound: false,
  }),
  methods: {
    registrtion() {
      if (this.name !== '' && this.password !== '') {
        const userID = uuid();
        this.userID = userID;
        const userData = {
          name: this.name,
          Password: this.password,
          userID,
          marks: [],
        };
        const oldUsers = JSON.parse(localStorage.getItem('users'));
        const allName = [];

        if (oldUsers) {
          oldUsers.forEach((element, idx) => {
            allName[idx] = element.name;
          });
          if (allName.includes(userData.name)) {
            this.hasName = true;
          } else {
            oldUsers.push(userData);
            localStorage.setItem('users', JSON.stringify(oldUsers));
            this.reg = false;
            this.$store.state.newLocation = true;
            this.$store.state.userName = this.name;
            this.$store.state.currentUser = userData;
            localStorage.setItem('curentUser', JSON.stringify(userData));
          }
        } else {
          localStorage.setItem('users', JSON.stringify([userData]));
          this.reg = false;
          this.$store.state.newLocation = true;
          localStorage.setItem('curentUser', JSON.stringify(userData));
        }
        this.name = '';
        this.password = '';
      } else {
        this.invalidData = true;
      }
    },
    login() {
      const userName = this.name;
      const userPW = this.password;
      const users = JSON.parse(localStorage.getItem('users'));

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
          localStorage.setItem('curentUser', JSON.stringify(userData));
        } else {
          this.passwordIsWrong = true;
        }
      } else {
        this.nameNotFound = true;
      }
    },
    clear() {
      this.$v.$reset();
      this.name = '';
      this.password = '';
      this.checkbox = false;
    },
    goToAuthorization() {
      this.reg = false;
      this.log = true;
      this.name = '';
      this.password = '';
    },
    goToRegistration() {
      this.reg = true;
      this.log = false;
      this.name = '';
      this.password = '';
    },
    logOut() {
      this.$store.state.currentUser = null;
      localStorage.removeItem('curentUser');
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
.logOut{
  position: fixed;
  top: 10px;
  left: 50px;
}
</style>
