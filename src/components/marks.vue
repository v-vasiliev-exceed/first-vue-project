<template>
  <div>
    <span v-on:click="open()" class="newLocation">
      +
    </span>

    <div class="popupAddingLocatin">
      <span v-on:click="close()" class="newLocation popupAddingLocatin-close"> &#215;</span>
      <input v-model="position" class="inputlocation" type="text" placeholder="Input position" />
      <input v-model="nameLocation" class="inputlocation" type="text" placeholder="Input name" />
      <input
        v-model="discription"
        class="inputlocation"
        type="text"
        placeholder="Input discription"
      /><br />
      <button v-on:click="addNewMark" class="btn">Add new mark</button>
    </div>
  </div>
</template>

<script>
  // import {mapActions, mapGetters} from 'vuex'
  export default {
  data() {
    return {
      position: '',
      nameLocation: '',
      discription: ''
    };
  },
  // computed :{
  //   ...mapGetters({name: 'getName',})

  // },
  methods: {
    // ...mapActions({nameUpdate: 'NAME_UPDATE'}),

    open(){
      document.querySelector('.popupAddingLocatin').style.display="block";
      document.querySelector('.newLocation').style.display="none";
    },
    close(){
      document.querySelector('.popupAddingLocatin').style.display="none";
      document.querySelector('.newLocation').style.display="block";
    },
    addNewMark(){
      
    }
  
  }
};
</script>

<style scoped>
.newLocation {
  display: none;
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