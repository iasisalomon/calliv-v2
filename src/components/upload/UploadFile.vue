<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-3 my-4">
        <h4 class="mt-2">
          Selected file: <b>{{ file ? file.name : "" }}</b>
        </h4>
      </div>
      <div class="col-3 my-4 px-0">
        <b-form-file ref="file-input" v-model="file" class=""></b-form-file>
      </div>
      <div class="col-3 my-4">
        <b-button class="mr-2" @click="clearFiles">Reset</b-button>
        <b-button v-if="!!file" class="mr-2 btn-success" @click="parseFile"
          >Process</b-button
        >
      </div>
    </div>
    <DisplayRawData />
  </div>
</template>

<script>
import DisplayRawData from "@/components/upload/DisplayRawData";
export default {
  components: {
    DisplayRawData,
  },
  data() {
    return {
      file: null,
    };
  },
  methods: {
    clearFiles() {
      this.$refs["file-input"].reset();
      localStorage.clear();
    },
    parseFile() {
      //  send file name to store
      this.$store.dispatch("data/changeFileName", this.file.name);
      //  select file from upload object
      const element = this.$refs["file-input"].files[0];
      // parse as nested array
      this.$papa.parse(element, {
        transform: (elem) => {
          return elem.replace(/,/g, ".");
        },
        complete: (result) => {
          const payload = result.data.filter((el) => el.length > 2);
          this.$store.dispatch("data/changeRawData", payload);
        },
      });
      // parse as array of objects
      this.$papa.parse(element, {
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          this.$store.dispatch("data/changeRawDataObject", result.data);
        },
      });
    },
  },
};
</script>
