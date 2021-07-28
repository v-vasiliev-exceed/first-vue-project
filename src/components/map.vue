<template>
  <div>
    <vl-map
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      data-projection="EPSG:4326"
      style="height: 100vh"
    >
      <vl-overlay id="overlay" :position="[10, 10]">
        <template slot-scope="scope">
          <div class="overlay-content">Position: {{ scope.position }}</div>
        </template>
      </vl-overlay>

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
    };
  },
};
</script>
