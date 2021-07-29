<template>
  <div>
    <vl-map
      v-on:click="open()"
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      data-projection="EPSG:4326"
      style="height: 100vh"
    >
      <vl-layer-vector>
        <vl-source-cluster :distance="200">
          <vl-source-vector>
              <vl-overlay v-for="(metka, idx) in userMarks" :key="idx" id="overlay" :position="[10, 10]">
                <template slot-scope="scope">
                  <div class="overlay-content">
                    <p>111</p>
                    Position: {{ scope.position }}
                  </div>
                </template>
              </vl-overlay>
          </vl-source-vector>
          <vl-style-func :factory="clusterStyleFunc" />
        </vl-source-cluster>
      </vl-layer-vector>


      <vl-layer-tile id="osm">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>
    </vl-map>
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
      userMarks:null,
    };
  },

  methods: {
    open() {
    
    },
  },
  mounted() {
      const userData = JSON.parse(
        localStorage.getItem(this.$store.state.userName)
      );
      console.log("@@@@@@",this.$store.state.userName);
      const uID = userData.userID;
      this.userMarks = JSON.parse(localStorage.getItem("userID: " + uID)).split(",");

      console.log(uID);
      console.log(this.userMarks);
      if (localStorage.getItem("userID: " + uID)) {
        this.userMarks.forEach((element) => {
          console.log(JSON.parse(localStorage.getItem('nameLocation:' + element)));
        });
      }
  }
};
</script>
