import { groupBy, chunk, min } from "lodash";

export default {
  CHANGE_FILE_NAME(state, payload) {
    state.fileName = payload;
  },
  CHANGE_RAW_DATA(state, payload) {
    state.rawData = payload;
  },
  CHANGE_RAW_DATA_OBJECT(state, payload) {
    //  remove empty values recursively
    const removeEmpty = (obj) => {
      Object.entries(obj).forEach(
        ([key, val]) =>
          (val && typeof val === "object" && removeEmpty(val)) ||
          ((val === null || val === "") && delete obj[key])
      );
      return obj;
    };
    let cleanPayload = removeEmpty(payload);
    //  remove empty objects
    cleanPayload = cleanPayload.filter(
      (value) => Object.keys(value).length !== 0
    );
    state.rawDataObject = cleanPayload;
  },
  CLEAR_FILE_NAME(state) {
    state.fileName = "";
  },
  CLEAR_RAW_DATA(state) {
    state.rawData = [];
    state.standardVals = [0, 4.2, 9.7, 14.6, 22, 33.3, 50, 100];
  },
  CLEAR_RAW_DATA_OBJECT(state) {
    state.rawDataObject = [];
  },
  CLEAR_FIT(state) {
    state.fitLinear = [];
    state.tableConfig.series[1].data = [];
  },
  SORT_DATA(state) {
    state.sortedData = state.rawData.sort();
  },
  GROUP_BY_WELL_DATA(state) {
    state.groupedbyWellData = groupBy(state.sortedData, 0);
  },
  EXTRACT_WELLS(state) {
    state.extractedWells = Object.keys(state.groupedbyWellData);
  },
  ADJUST_RAW_VALUES(state) {
    state.rawAdjustedValues = Object.entries(state.groupedbyWellData).map(
      (e) => {
        return e[1].map((f) => {
          return f[2] - f[3];
        });
      }
    );
  },
  GET_REPETITION_COUNT(state) {
    state.repetitionCount = state.rawAdjustedValues[0].map((el, index) => {
      return index + 1;
    });
  },
  ADJUST_VALUES_AVERAGE(state) {
    state.adjustedValuesAverage = state.rawAdjustedValues.map((e) => {
      return (
        e.reduce((a, b) => {
          return a + b;
        }) / e.length
      );
    });
  },
  CHUNK_VALUES_AVERAGE(state) {
    state.chunkAdjustedValues = chunk(
      state.adjustedValuesAverage,
      state.chunkNumber
    );
  },
  GET_MINIMUM_MEASURE_NOISE(state) {
    state.getMinimumMeasureNoise = state.chunkAdjustedValues.map((el) => {
      let a = 0;
      if (el[0] < a) {
        a = el[0];
      }
      return a;
    });
    state.getMinimumMeasureNoise = min(state.getMinimumMeasureNoise);
  },
  AVERAGE_TABLE_OBJECT(state) {
    const object = state.rawAdjustedValues.map((box, index) => {
      return {
        Well: state.extractedWells[index],
        ...box,
        Average: state.adjustedValuesAverage[index],
      };
    });
    state.averageTableObject = object;
  },
  CREATE_MATRIX_NATIVE(state) {
    const assignLetters = [];
    for (let i = 0; i < state.wellRows.length; i++) {
      const helper = state.chunkAdjustedValues[i];
      const brelper = [state.wellRows[i], ...helper];
      assignLetters.push(brelper);
    }
    state.matrixNative = assignLetters;
  },
  CREATE_MATRIX_ZERO(state) {
    // subtract min number from each average
    const arrayZero = state.adjustedValuesAverage.map((el) => {
      if (el - state.getMinimumMeasureNoise < 0) {
        return 0;
      } else {
        return el - state.getMinimumMeasureNoise;
      }
    });
    // chunk zero average
    const chunkArrayZero = chunk(arrayZero, state.chunkNumber);
    // create fields for table
    const assignLetters = [];
    for (let i = 0; i < state.wellRows.length; i++) {
      const helper = chunkArrayZero[i];
      const brelper = [state.wellRows[i], ...helper];
      assignLetters.push(brelper);
    }
    state.matrixZero = assignLetters;
  },
  GET_TABLE_HEADER(state) {
    state.tableHeader = state.rawData.shift();
  },
  CLEAR_TABLE_HEADER(state) {
    state.tableHeader = [];
  },
  OBTAIN_WELL_ROWS(state) {
    state.wellRows = state.extractedWells.map((el) => {
      return el.replace(/[^a-zA-Z]/, "");
    });
    state.wellRows = [...new Set(state.wellRows)];
  },
  OBTAIN_WELL_COLS(state) {
    state.wellCols = state.extractedWells.map((el) => {
      return el.replace(/[a-zA-Z]/, "");
    });
    state.wellCols = [...new Set(state.wellCols)];
  },
  GET_CHUNK_NUMBER(state) {
    state.chunkNumber = state.wellCols.length;
  },
  SAVE_STANDARD_VALS(state, payload) {
    // standard vals refers to x axis on graph
    if (payload !== undefined && payload !== null) {
      payload = payload.map((el) => {
        return Number(el);
      });
      state.standardVals = payload;
    }
  },
  SAVE_STANDARD_LECTURES(state) {
    // standard lectures refers to y axis on graph
    // assigning values from the matrixZero corresponding to standard
    const mtxZero = state.matrixZero;
    const standardLectures = mtxZero.map((el, index) => {
      return el[1];
    });
    state.standardLectures = standardLectures;
  },
  STANDARD_GRAPH(state) {
    const standardLectures = state.standardLectures;
    const standardVals = state.standardVals;
    const standardGraph = [];
    if (standardLectures && standardVals) {
      for (let i = 0; i < standardVals.length; i++) {
        standardGraph.push([standardVals[i], standardLectures[i]]);
      }
      state.standardGraph = standardGraph;
      state.tableConfig.series[0].data = standardGraph;
    }
  },
  FIT_LINEAR(state) {
    const standardLectures = state.standardLectures;
    const standardVals = state.standardVals;
    if (standardLectures && standardVals) {
      // 0 4,2 9,7 14,6 22 33,3 50 100
      const fitLinear = this.$fitLinear(standardVals, standardLectures);
      state.fitLinear = fitLinear;
    }
  },
  REGRESSION_GRAPH(state) {
    const M = state.fitLinear[0];
    const B = state.fitLinear[1];
    const Y100 = M * 100 + B;
    const regressionGraph = [
      [0, B],
      [100, Y100],
    ];
    state.tableConfig.series[1].data = regressionGraph;
  },
  PLOT_DATA(state) {
    state.chunkNumber = state.wellCols.length;
  },
};
