const selectCommitRef = state => {
  return state.getIn(['version', 'commitRef']);
};
const selectBuildNumber = state => {
  return state.getIn(['version', 'buildNo']);
};
const selectVersionStatus = state => {
  return state.getIn(['version', 'contensisVersionStatus']);
};

var versionSelectors = /*#__PURE__*/Object.freeze({
  __proto__: null,
  selectCommitRef: selectCommitRef,
  selectBuildNumber: selectBuildNumber,
  selectVersionStatus: selectVersionStatus
});

export { selectBuildNumber as a, selectCommitRef as b, selectVersionStatus as s, versionSelectors as v };
//# sourceMappingURL=selectors-0213acd7.js.map
