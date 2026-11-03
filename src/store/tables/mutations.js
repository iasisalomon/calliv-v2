export default {
  CHANGE_ACTIVE_TABLE_NAV(state, payload) {
    state.activeTableNav = payload;
  },
  STANDARD_LOCK(state, payload) {
    state.standardIsLocked = payload;
  },
  REGRESSION_LOCK(state, payload) {
    state.regressionIsLocked = payload;
  },
};
