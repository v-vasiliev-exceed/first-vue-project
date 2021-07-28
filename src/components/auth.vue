<template>
  <div class="">
    <div class="log form-user-date">
      <p class="popup-title">Authorization form</p>

      <form>
        <v-text-field
          v-model="inputedName"
          :error-messages="nameErrors"
          :counter="10"
          label="Name"
          required
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
        ></v-text-field>
        <v-text-field
          type="password"
          v-model="email"
          label="Password"
          required
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
        ></v-text-field>
        <a class="linkChangePopup" v-on:click="goToRegistration()"
          >Registration form</a
        >
        <v-checkbox
          v-model="checkbox"
          :error-messages="checkboxErrors"
          label="Do you agree?"
          required
          @change="$v.checkbox.$touch()"
          @blur="$v.checkbox.$touch()"
        ></v-checkbox>

        <v-btn class="mr-4 btn-submit" @click="login">
          submit
        </v-btn>
        <v-btn @click="clear">
          clear
        </v-btn>
      </form>
    </div>
    <div class="reg form-user-date">
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
          v-model="email"
          label="Password"
          required
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
        ></v-text-field>
        <a class="linkChangePopup" v-on:click="goToAuthorization()"
          >Authorization form</a
        >
        <v-checkbox
          v-model="checkbox"
          :error-messages="checkboxErrors"
          label="Do you agree?"
          required
          @change="$v.checkbox.$touch()"
          @blur="$v.checkbox.$touch()"
        ></v-checkbox>

        <v-btn class="mr-4 btn-submit" @click="registrtion()">
          submit
        </v-btn>
        <v-btn @click="clear">
          clear
        </v-btn>
      </form>
    </div>
  </div>
</template>
<style scoped>
.linkChangePopup {
  cursor: pointer;
  color: blue;
}
.form-user-date {
  position: fixed;
  left: 40%;
  top: 30%;
  background-color: #fff;
  min-width: 300px;
  min-height: 250px;
  text-align: center;
  padding: 20px;
  padding-top: 50px;
  font-family: sans-serif;
}
.log {
  display: none;
}
.popup-title {
  font-family: sans-serif;
  font-size: 16px;
}
.btn-submit {
  margin-right: 20px;
}
</style>

<script>
import { validationMixin } from "vuelidate";
import { mapActions, mapGetters} from 'vuex'
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

  data() {
   return {
    name: "",
    email: "",
    userID: "",
    select: null,
    checkbox: false,
    haveAccount: 1,
  } 
  },

  computed: {
    ...mapGetters(['myForm','newForm']),
    inputedName: {
      get() {
        return this.name;
      },
      set(value) {
        this.name = value;
      }
    },
    // name: {
    //   get() {
    //     console.log(this.myForm);
    //     return this.myForm.name
    //   },
    //   set(value) {
    //     console.log("before", this.name);
    //     console.log(this.newForm);
    //     this.nameUpdate(value)
    //     console.log("after", this.name);
    //   }
    // },
    checkboxErrors() {
      const errors = [];
      if (!this.$v.checkbox.$dirty) return errors;
      !this.$v.checkbox.checked && errors.push("You must agree to continue!");
      return errors;
    },
    selectErrors() {
      const errors = [];
      if (!this.$v.select.$dirty) return errors;
      !this.$v.select.required && errors.push("Item is required");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Name must be at most 10 characters long");
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
  },
  methods: {
    ...mapActions({nameUpdate: 'NAME_UPDATE'}),

    submit() {
      this.$v.$touch();
    },
    registrtion() {
      const { uuid } = require("uuidv4");
      const userID = uuid();
      this.userID = userID;

      if (localStorage.getItem(this.name) !== null) {
        alert("User with the same name already exists!");
      } else {
        const userData = {
          name: this.name,
          Password: this.email,
          userID: userID,
        };
        localStorage.setItem(this.name, JSON.stringify(userData));
        document.querySelector(".reg").style.display = "none";
        document.querySelector(".newLocation").style.display = "block";
        console.log(this.name);

        console.log("before", this.name);
        this.nameUpdate("John")
        console.log("AFTER", this.name);
      }
    },
    login() {
      const userName = this.name,
        userPW = this.email;
      if (localStorage.getItem(userName) !== null) {
        if (JSON.parse(localStorage.getItem(userName)).Password === userPW) {
          document.querySelector(".log").style.display = "none";
          document.querySelector(".newLocation").style.display = "block";
        } else {
          alert("Password is wrong!");
        }
      } else {
        alert("No user with that name!");
      }
    },
    clear() {
      this.$v.$reset();
      this.name = "";
      this.email = "";
      this.select = null;
      this.checkbox = false;
    },
    goToAuthorization() {
      document.querySelector(".reg").style.display = "none";
      document.querySelector(".log").style.display = "block";
      this.name = "";
      this.email = "";
    },
    goToRegistration() {
      document.querySelector(".reg").style.display = "block";
      document.querySelector(".log").style.display = "none";
      this.name = "";
      this.email = "";
    },
  },
};
</script>
