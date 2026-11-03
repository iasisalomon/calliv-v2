<template>
  <div>
    <b-table striped hover :items="matrixNative" :fields="fields"></b-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  data() {
    return {
      fields: [
        {
          key: "0",
          label: "Well",
          sortable: true,
        },
        {
          key: "1",
          sortable: true,
        },
        {
          key: "2",
          sortable: true,
        },
        {
          key: "3",
          sortable: true,
        },
        {
          key: "4",
          sortable: true,
        },
      ],
    }
  },
  computed: {
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
    ]),
  },
}
</script>
