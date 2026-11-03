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
        :disabled="(regressionIsLocked && standardIsLocked) || !settingsValid"
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
    <div class="col-12 p-0 pt-2 d-flex flex-wrap align-items-start">
      <b-input-group class="mr-2 mb-2 setting setting-method">
        <template #prepend>
          <b-input-group-text>Method</b-input-group-text>
        </template>
        <b-form-select
          v-model="method"
          :options="methodOptions"
          :disabled="regressionIsLocked"
        ></b-form-select>
      </b-input-group>
      <template v-if="method === 'gradientDescent'">
        <b-input-group class="mr-2 mb-2 setting">
          <template #prepend>
            <b-input-group-text>Learning rate</b-input-group-text>
          </template>
          <b-form-input
            v-model="learningRateInput"
            type="number"
            step="any"
            min="0"
            :state="learningRateState"
            :disabled="regressionIsLocked"
          ></b-form-input>
        </b-input-group>
        <b-input-group class="mr-2 mb-2 setting">
          <template #prepend>
            <b-input-group-text>Iterations</b-input-group-text>
          </template>
          <b-form-input
            v-model="iterationsInput"
            type="number"
            step="1"
            min="1"
            :max="maxIterations"
            :state="iterationsState"
            :disabled="regressionIsLocked"
          ></b-form-input>
        </b-input-group>
      </template>
    </div>
    <div class="col-12 p-0 pt-2">
      <b-form-text class="hint">{{ hintText }}</b-form-text>
    </div>
    <div v-if="coefficientsText" class="col-12 p-0 pt-1">
      <b-form-text class="coefficients">{{ coefficientsText }}</b-form-text>
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
      methodOptions: [
        { value: "gradientDescent", text: "Gradient descent (TensorFlow)" },
        { value: "leastSquares", text: "Least squares (exact)" },
      ],
      // upper bound so a typo can't freeze the browser
      maxIterations: 100000,
    };
  },
  computed: {
    method: {
      get() {
        return this.regressionMethod;
      },
      set(value) {
        this.$store.dispatch("data/saveRegressionSettings", {
          regressionMethod: value,
        });
      },
    },
    learningRateInput: {
      get() {
        return this.learningRate;
      },
      set(value) {
        this.$store.dispatch("data/saveRegressionSettings", {
          learningRate: Number(value),
        });
      },
    },
    iterationsInput: {
      get() {
        return this.iterations;
      },
      set(value) {
        this.$store.dispatch("data/saveRegressionSettings", {
          iterations: Number(value),
        });
      },
    },
    // null keeps the input neutral, false marks it invalid
    learningRateState() {
      return this.learningRate > 0 ? null : false;
    },
    iterationsState() {
      const valid =
        Number.isInteger(this.iterations) &&
        this.iterations > 0 &&
        this.iterations <= this.maxIterations;
      return valid ? null : false;
    },
    settingsValid() {
      if (this.method === "leastSquares") {
        return true;
      }
      return this.learningRateState !== false && this.iterationsState !== false;
    },
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
    hintText() {
      if (!this.standardIsLocked) {
        return "Step 1: set the standard concentrations and click Lock.";
      } else if (!this.regressionIsLocked) {
        return "Step 2: click Graph to draw the regression line.";
      } else {
        return "Regression drawn. Click Reset to change the standard.";
      }
    },
    coefficientsText() {
      // getFitLinear is [m, b] for y = m * x + b, empty until Graph is clicked
      if (!this.getFitLinear || this.getFitLinear.length !== 2) {
        return "";
      }
      const [m, b] = this.getFitLinear;
      if (!Number.isFinite(m) || !Number.isFinite(b)) {
        return "No line could be fitted with these values.";
      }
      const sign = b < 0 ? "−" : "+";
      return `y = ${m.toFixed(4)} · x ${sign} ${Math.abs(b).toFixed(4)}   (slope m = ${m.toFixed(4)}, intercept b = ${b.toFixed(4)})`;
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
      "getFitLinear",
      "clearFit",
      "regressionMethod",
      "learningRate",
      "iterations",
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

<style scoped>
.setting {
  width: 260px;
}

.setting-method {
  width: 340px;
}

.coefficients {
  font-size: 16px;
  font-family: monospace;
  white-space: pre-wrap;
}

.hint {
  font-size: 16px;
  font-weight: bold;
}
</style>
