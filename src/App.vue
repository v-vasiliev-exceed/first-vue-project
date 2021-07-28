<template>
<div>
  <Map/>
  <Auth/>
  <Marks/>
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



