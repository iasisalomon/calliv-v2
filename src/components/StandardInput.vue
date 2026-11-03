<template>
  <form class="row align-content-center justify-content-between m-0 p-0 py-3">
    <div
      v-for="(col, index) in wellRows"
      :key="index"
      class="col m-0 mr-2 p-0 align-items-center text-center"
      role="group"
    >
      <b-input-group>
        <template #prepend>
          <b-input-group-text>{{ col }}</b-input-group-text>
        </template>
        <b-form-input
          :id="'input-live' + col"
          v-model="validation[index]"
          :placeholder="validation[index]"
          :disabled="standardIsLocked"
        ></b-form-input>
        <!-- This will only be shown if the preceding input has an invalid state -->
        <!-- <b-form-invalid-feedback id="input-live-feedback">
        Enter a number greater or equal to 0
      </b-form-invalid-feedback> -->
      </b-input-group>
    </div>
    <div
      class="col mx-0 px-0 align-self-top text-right"
      style="max-width: 75px"
    >
      <b-button
        class="mr-1"
        type="submit"
        variant="primary"
        :disabled="standardIsLocked"
        @click="formClick"
      >
        {{ buttonText }}
      </b-button>
    </div>

    <div
      class="col mx-0 px-0 align-self-top text-right"
      style="max-width: 75px"
    >
      <b-button
        variant="success"
        :disabled="regressionIsLocked && standardIsLocked"
        @click="fitGraph"
      >
        Graph
      </b-button>
    </div>
    <div
      class="col mx-0 px-0 align-self-top text-right"
      style="max-width: 75px"
    >
      <b-button variant="danger" @click="resetForm"> Reset </b-button>
    </div>
  </form>
</template>

<script>
// 0 4,2 9,7 14,6 22 33,3 50 100
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      validation: [0, 4.2, 9.7, 14.6, 22, 33.3, 50, 100],
    };
  },
  computed: {
    validationState() {
      return this.validation.map((el) => {
        console.log(el);
        // el = el.replace(/,/g, ".");
        // el = Number(el);
        // if (el === null) {
        //   return null;
        // } else if (el >= 0) {
        //   return true;
        // } else {
        //   return false;
        // }
      });
    },
    buttonText() {
      if (this.standardIsLocked) {
        return "Locked";
      } else {
        return "Lock";
      }
    },
    ...mapGetters("data", [
      "rawData",
      "sortedData",
      "groupedbyWellData",
      "extractedWells",
      "rawAdjustedValues",
      "adjustedValuesAverage",
      "wellRows",
      "wellCols",
      "chunkNumber",
      "repetitionCount",
      "rawDataObject",
      "averageTableObject",
      "chunkAdjustedValues",
      "matrixNative",
      "matrixZero",
      "getMinimumMeasureNoise",
      "getStandardVals",
      "clearFit",
    ]),
    ...mapGetters("tables", ["standardIsLocked", "regressionIsLocked"]),
  },
  methods: {
    formClick() {
      this.$store.dispatch("data" + "/saveStandardVals", this.validation);
      this.$store.dispatch("tables" + "/standardLock", true);
    },
    fitGraph() {
      if (this.standardIsLocked) {
        this.$store.dispatch("data" + "/fitLinear");
        this.$store.dispatch("tables" + "/regressionLock", true);
      } else {
        alert("Please lock the standard first");
      }
    },
    resetForm() {
      this.$store.dispatch("tables" + "/standardLock", false);
      this.$store.dispatch("tables" + "/regressionLock", false);
      this.$store.dispatch("data" + "/clearFit");
      this.$store.dispatch(
        "data" + "/saveStandardVals",
        [0, 4.2, 9.7, 14.6, 22, 33.3, 50, 100]
      );
      this.validation = [0, 4.2, 9.7, 14.6, 22, 33.3, 50, 100];
    },
  },
};
</script>

<style scoped></style>
