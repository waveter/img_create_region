<template>
  <b-modal id="bv-size-modification-dialog" hide-footer @hidden="closeDialog">
    <template v-slot:modal-title>Select Image Size</template>
    <div class="modal-body">
      <b-form-group id="input-group-width" label="Image width:" label-for="input-width">
        <b-form-input
          id="input-width"
          @input="handleChangeWidth($event)"
          v-model="imgWidth"
          required
          placeholder="Input width"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-height" label="Image height:" label-for="input-height">
        <b-form-input
          id="input-height"
          @input="handleChangeHeight($event)"
          v-model="imgHeight"
          required
          placeholder="Input height"
        ></b-form-input>
      </b-form-group>
    </div>
    <div class="modal-footer">
      <b-button class="close-btn" variant="primary" @click="handleClickOkBtn()">Ok</b-button>
      <b-button class="close-btn" @click="closeDialog">Cancel</b-button>
    </div>
  </b-modal>
</template>
<script>
export default {
  name: "SizeModificationDialog",
  data: () => {
    return {
      imgWidth: 0,
      imgHeight: 0,
      originalWidth: 0,
      originalHeight: 0,
      isWidthChanged: false,
      isHeightChanged: false
    };
  },
  methods: {
    closeDialog() {
      this.$store.dispatch("setSizeModificationDialog", {
        width: 0,
        height: 0,
        show: false,
        callback: null
      });
      this.$bvModal.hide("bv-size-modification-dialog");
    },
    handleClickOkBtn() {
      this.$store.getters.sizeModificationDialog.callback(
        Number(this.imgWidth),
        Number(this.imgHeight)
      );
      this.closeDialog();
    },
    handleChangeWidth(event) {
      if (this.isHeightChanged) {
        return;
      }
      this.isWidthChanged = true;
      if (this.isValidSize(event)) {
        this.imgHeight = Math.round(
          (Number(event) / this.originalWidth) * this.originalHeight
        );
      }
    },
    handleChangeHeight(event) {
      if (this.isWidthChanged) {
        return;
      }
      this.isHeightChanged = true;
      if (this.isValidSize(event)) {
        this.imgWidth = Math.round(
          (Number(event) / this.originalHeight) * this.originalWidth
        );
      }
    },
    isValidSize(n) {
      return !isNaN(parseFloat(n)) && isFinite(n) && Number(n) !== 0;
    }
  },
  created() {
    this.$store.watch(
      state => state.sizeModificationDialog,
      value => {
        if (value.show) {
          this.imgWidth = value.width;
          this.imgHeight = value.height;
          this.originalWidth = value.width;
          this.originalHeight = value.height;
          this.$bvModal.show("bv-size-modification-dialog");
        } else {
          this.$bvModal.hide("bv-size-modification-dialog");
        }
      }
    );
  }
};
</script>
<style scoped>
.close-btn {
  min-width: 6em;
}
</style>