<template>
  <div id="app">
    <Header />
    <RegionCreation />
    <Footer />
    <RingLoader :loading="$store.getters.loading"></RingLoader>
    <ErrorDialog />
    <SizeModificationDialog />
  </div>
</template>

<script>
import RegionCreation from "./components/RegionCreation.vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import RingLoader from "vue-spinner/src/RingLoader.vue";
import ErrorDialog from "./components/ErrorDialog.vue";
import SizeModificationDialog from "./components/SizeModificationDialog.vue";
export default {
  name: "App",
  components: {
    RegionCreation,
    Header,
    Footer,
    RingLoader,
    ErrorDialog,
    SizeModificationDialog
  }
};
</script>

<style>
.v-spinner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
}
</style>
