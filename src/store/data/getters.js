export default {
  rawData: (state) => {
    return state.rawData
  },
  tableHeader: (state) => {
    return state.tableHeader
  },
  sortedData: (state) => {
    return state.sortedData
  },
  groupedbyWellData: (state) => {
    return state.groupedbyWellData
  },
  extractedWells: (state) => {
    return state.extractedWells
  },
  rawAdjustedValues: (state) => {
    return state.rawAdjustedValues
  },
  adjustedValuesAverage: (state) => {
    return state.adjustedValuesAverage
  },
  wellRows: (state) => {
    return state.wellRows
  },
  wellCols: (state) => {
    return state.wellCols
  },
  chunkNumber: (state) => {
    return state.chunkNumber
  },
  repetitionCount: (state) => {
    return state.repetitionCount
  },
  rawDataObject: (state) => {
    return state.rawDataObject
  },
  fileName: (state) => {
    return state.fileName
  },
  averageTableObject: (state) => {
    return state.averageTableObject
  },
  chunkAdjustedValues: (state) => {
    return state.chunkAdjustedValues
  },
  matrixNative: (state) => {
    return state.matrixNative
  },
  matrixZero: (state) => {
    return state.matrixZero
  },
  getMinimumMeasureNoise: (state) => {
    return state.getMinimumMeasureNoise
  },
  getStandardVals: (state) => {
    return state.standardVals
  },
  getStandardLectures: (state) => {
    return state.standardLectures
  },
  getStandardGraph: (state) => {
    return state.standardGraph
  },
  getFitLinear: (state) => {
    return state.fitLinear
  },
  tableConfig: (state) => {
    return state.tableConfig
  },
}
