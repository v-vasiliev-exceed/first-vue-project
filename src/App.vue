<template>
  <div id="app">
    <v-app>
      <Map/>
      <Auth/>
      <Marks/>
    </v-app>
  </div>
</template>


<script>
import Map from './components/map.vue'
import Auth from './components/auth.vue'
import Marks from './components/marks.vue'

export default {
	components: {
    Map, Auth, Marks
	}
}
</script>



