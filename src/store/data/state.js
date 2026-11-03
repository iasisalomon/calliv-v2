export default () => ({
  fileName: "",
  rawData: [],
  tableHeader: [],
  sortedData: [],
  groupedbyWellData: {},
  repetitionCount: null,
  extractedWells: [],
  rawAdjustedValues: [],
  chunkAdjustedValues: [],
  getMinimumMeasureNoise: null,
  adjustedValuesAverage: [],
  wellRows: [],
  wellCols: [],
  chunkNumber: null,
  rawDataObject: [],
  averageTableObject: [],
  matrixNative: [],
  matrixZero: [],
  standardVals: [0, 4.2, 9.7, 14.6, 22, 33.3, 50, 100],
  standardLectures: [],
  fitLinear: [],
  standardGraph: [],
  tableConfig: {
    chart: {
      height: "45%",
    },
    title: {
      text: "Linear Regression of the data",
    },
    xAxis: {
      title: {
        enabled: true,
        text: "Standard Concentration",
      },
      startOnTick: true,
      endOnTick: true,
      showLastLabel: true,
    },
    yAxis: {
      title: {
        text: "Net absorbance/fluorescence",
      },
    },
    legend: {
      layout: "vertical",
      align: "left",
      verticalAlign: "top",
      x: 100,
      y: 70,
      floating: true,
      borderWidth: 1,
    },
    series: [
      {
        type: "scatter",
        name: "Data points",
        color: "rgba(223, 83, 83, .5)",
        data: [
          [1, 1],
          [2, 2],
          [3, 3],
        ],
      },
      {
        name: "Linear regression",
        color: "rgba(119, 152, 191, .5)",
        type: "line",
        data: [
          [1, 1],
          [2, 2],
          [3, 3],
        ],
      },
    ],
  },
});
