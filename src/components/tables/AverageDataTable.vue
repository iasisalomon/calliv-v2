<template>
  <div>
    <b-table striped hover :items="averageTableObject" :fields="fields"></b-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  data() {
    return {
      fields: [
        {
          key: "Well",
          sortable: true,
        },
        {
          key: "0",
          label: "Lecture 1",
          sortable: true,
        },
        {
          key: "1",
          label: "Lecture 2",
          sortable: true,
        },
        {
          key: "2",
          label: "Lecture 3",
          sortable: true,
        },
        {
          key: "Average",
          sortable: true,
          variant: "warning",
        },
      ],
    }
  },
  computed: {
    ...mapGetters("data", [
      "rawData",
      "tableHeader",
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
    ]),
  },
}
</script>

<style scoped>
tr:hover {
  background-color: rgba(23, 162, 184, 0.3) !important;
  cursor: pointer;
}
</style>
