<template>
  <div class="row justify-content-center">
    <div class="col-12"><highcharts :options="tableConfig"></highcharts></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("data", [
      "matrixZero",
      "getMinimumMeasureNoise",
      "getStandardVals",
      "getStandardLectures",
      "getStandardGraph",
      "getFitLinear",
      "tableConfig",
    ]),
  },
};
</script>

<style lang="scss" scoped></style>
