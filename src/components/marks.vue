<template>
  <div v-if="logged">
    <span  v-on:click="open()" class="newLocation">
      +
    </span>

    <div class="popupAddingLocatin">
      <span v-on:click="close()" class="newLocation popupAddingLocatin-close"> &#215;</span>
      <p>Input position</p>
      <input v-model="position" class="inputlocation" type="text" placeholder="[10][10]" />
      <p>Input name</p>
      <input v-model="nameLocation" class="inputlocation" type="text" placeholder='Ship Avrora' />
      <p>Input discription</p>
      <input
        v-model="discription"
        class="inputlocation"
        type="text"
        placeholder="Popular ship in Russia"
      /><br />
      <button v-on:click="addNewMark" class="btn">Add new mark</button>
    </div>
  </div>
</template>

<script>
  export default {
    computed:{
    logged() {
      return this.$store.state.activeUser
    }
  },
  data() {
    return {
      position: '',
      nameLocation: '',
      discription: ''
    };
  },
  methods: {
    open(){
      document.querySelector('.popupAddingLocatin').style.display="block";
      document.querySelector('.newLocation').style.display="none";
    },
    close(){
      document.querySelector('.popupAddingLocatin').style.display="none";
      document.querySelector('.newLocation').style.display="block";
    },
    addNewMark(){
      const userData = JSON.parse(localStorage.getItem(this.$store.state.userName));

      const metkaData = {
          uID: userData.userID,
          position: this.position,
          nameLocation: this.nameLocation,
          discription: this.discription,
        };
        console.log(metkaData);
      const userID = userData.userID;
        const oldMarker = JSON.parse(localStorage.getItem('userID: ' + userID));  
        if (oldMarker){
          localStorage.setItem('userID: ' + userID,  JSON.stringify(oldMarker + ',' + this.nameLocation));  
        }
        else{
          localStorage.setItem('userID: ' + userID,JSON.stringify(this.nameLocation));
        }
        localStorage.setItem('nameLocation:' + this.nameLocation , JSON.stringify(metkaData));
        console.log(JSON.parse(localStorage.getItem('userID: ' + userID,)).split(','));
        console.log(metkaData);
        //localStorage.setItem('userID: ' + userData.userID, JSON.stringify(metkaData));

        this.position = '';
        this.nameLocation = '';
        this.discription = '';
    }
  
  },
  mounted() {
    console.log(this.logged);
  }
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
  font-size: 40px;
  text-align: center;
  z-index: 99;
  cursor: pointer;
}
.popupAddingLocatin {
  display: none;
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
  border: 1px solid black;
  padding: 5px;
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
  font-size: 16px;
  width: 20px;
  height: 20px;
  top: 5px;
  right: 5px;
}
</style>