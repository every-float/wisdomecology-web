<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

  export default {
    created () {
      this.getUserInfo();
    },
    computed: {
      
    },
    methods: {
      getUserInfo() {
        try {
          this.$store.dispatch('userinfo/getUserInfo', {})
        } catch (error) {

        }
      }
    },
  }
</script>

<style lang="scss">
#app {

  .page1, .page2, .page3{
    height: 100%;
  }
}
</style>
