<template>
  <div id="app">
    <v-app>
      <Map />
      <Auth />
      <AddingMarker />
    </v-app>
  </div>
</template>

<script>
import Map from './components/map.vue';
import Auth from './components/auth.vue';
import AddingMarker from './components/marker.vue';

export default {
  components: {
    Map, Auth, AddingMarker,
  },
};
</script>
