# Calliv v2

A calibration-curve tool for biological sciences.

Upload the plate-reader results of an assay as a CSV. Calliv organizes the readings and plots the standards, then fits a linear regression so you can read unknown samples off the curve.

> This repository is **version 2.0**, the NuxtJS rewrite I started in May 2021. Version 1.0, a pure front-end Vue 2 app, is kept in its own repository as it was.

## Why Calliv

I'm a biotechnology student aiming to work with AI and deep learning in the biological sciences. Calliv combines the two: a real lab workflow, solved with machine-learning tooling.

## What it does

In biological assays it's common to find the value of a property of a sample by interpolation. A property such as absorbance, fluorescence, radiation, electrical resistance or temperature is measured for a set of standards, which gives a calibration curve. The unknown sample is then measured and its value read off that curve.

Calliv:

1. **Reads** a CSV with the measured value of each well.
2. **Organizes** the data: subtracts the background, averages repeated readings per well and lays the results out as a plate matrix.
3. **Plots** the standards so you can spot outliers.
4. **Fits** a linear regression, by gradient descent with TensorFlow.js or by exact least squares, and shows the line's equation.

## Tech stack

- **NuxtJS 2** (Vue 2) for pages and routing, generated as a static site
- **Vuex** for shared state, saved to the browser with `vuex-persistedstate`
- **TensorFlow.js** (`tfjs-core` + CPU backend) to fit the line by gradient descent, loaded only when a fit runs
- **Highcharts** (`highcharts-vue`) to draw the points and the fitted line
- **PapaParse** (`vue-papa-parse`) to read the CSV
- **Bootstrap-Vue** for styling
- **Cloudflare Workers** static assets for hosting

## Getting started

Requirements: [Node.js](https://nodejs.org/) 26 LTS (see `.nvmrc`) and [pnpm](https://pnpm.io/) (version pinned in `package.json` → `packageManager`).

```bash
pnpm install
```

Start the development server at http://localhost:3000:

```bash
pnpm dev
```

Generate the static site into `dist/`:

```bash
pnpm generate
```

Two settings in `pnpm-workspace.yaml` keep Nuxt 2 working with current tooling:

- `nodeLinker: hoisted` gives a flat `node_modules`, where Nuxt 2 expects to find `vue`, `vuex` and the rest.
- `nodeOptions: --openssl-legacy-provider` lets webpack 4 run on Node 17+. Running `nuxt` outside pnpm needs `NODE_OPTIONS=--openssl-legacy-provider`.

## CSV format

The format follows a plate-reader export:

- Values separated by **semicolons** (`;`). Decimal **commas** (`-1530,5`) are accepted.
- The **first row** is a header.
- Each following row is one reading of one well:

| Column | Content | Example |
| --- | --- | --- |
| 1 | Well ID | `A1` |
| 2 | Reading cycle (not used in calculations) | `1` |
| 3 | Measured signal | `22002,5` |
| 4 | Background | `2944` |

The net value is `signal − background`. Rows with the same well ID are treated as repeated readings and averaged. The plate layout comes from the well IDs: each letter is a row and each number a column. The **standards go in column 1** (`A1`, `B1`, `C1`, …), one per plate row, and the lowest negative value in column 1 is subtracted as the blank.

## How it works, screen by screen

The landing page (`/`) links to the upload screen. From there, the top bar links the four screens: **Upload**, **Tables**, **Matrixes** and **Linear Regression**. All results are kept in a Vuex store that is saved to the browser's `localStorage`, so they survive a reload.

### 1. Upload (`/upload`)

Where the data comes in.

- **Browse** picks the CSV.
- **Process** reads it in the browser with PapaParse (decimal commas become dots) and runs every processing step at once. The raw readings then appear in a table below.
- **Reset** clears the file and everything saved in `localStorage`.
- **Download sample CSV** downloads [`raw_data.csv`](src/static/raw_data.csv), also served at `/raw_data.csv`.

### 2. Tables (`/tables`)

Two tabs show the readings:

| Tab | What it shows | How it's calculated |
| --- | --- | --- |
| **Sorted Data** | The readings, sorted by well | Rows sorted by well ID, so the repeated readings of a well are grouped together |
| **Data Average** | One row per well: the net value of each reading (**Lecture 1, 2, 3**), then their **Average** | `signal − background` for each reading (column 3 − column 4), averaged per well |

### 3. Matrixes (`/matrixes`)

Two tabs lay the averages out like the plate:

| Tab | What it shows | How it's calculated |
| --- | --- | --- |
| **Native Matrix** | The averages, one row per plate letter | Rows `A`–`H`, columns `1`–`4` for the sample plate |
| **Zero Matrix** | The plate after the blank is removed | The lowest negative average in column 1 is the blank. It's subtracted from every well, and any result below 0 is shown as 0 |

With the sample data, A1 is the blank (`−1827.1`), so A1 becomes 0. B1 (`−940.1`) reads above the blank and becomes `887.0`. A2 (`−2205.6`) reads below the blank, so its result is clamped to 0.

The zero matrix is what the regression fits.

### 4. Linear Regression (`/graphs`)

Fits a line to the standards and plots it.

- **The data points:** the standards are the zero-adjusted values in **column 1**. Each plate row has an input for its standard's x value (its concentration). They default to `0, 4.2, 9.7, 14.6, 22, 33.3, 50, 100`.
- **Method:**
  - **Gradient descent (TensorFlow):** starts from random coefficients and minimizes the mean squared error. **Learning rate** (default `0.0001`) and **Iterations** (default `999`, up to 100,000) can be changed.
  - **Least squares (exact):** the closed-form best-fit line. Same result every time.
- **The steps:** a hint under the form guides you:
  1. **Lock** saves the standard values.
  2. **Graph** runs the selected method and draws the line.
  3. **Reset** unlocks everything to try other values or another method.
- **Under the form:** the fitted equation, `y = m · x + b`, with its slope and intercept.
- **The graph:** the standards are red dots and the fitted line is blue. A dot far from the line is a likely outlier.

Gradient descent with x values up to 100 converges slowly, so with the default settings its line sits close to, but not exactly on, the least-squares line. A learning rate above about `0.00055` makes it diverge, and no line is drawn.

## Try it with the sample data

[`src/static/raw_data.csv`](src/static/raw_data.csv) is a real plate read: 32 wells (`A1`–`H4`), each read over 3 cycles.

1. Start the app with `pnpm dev` and open http://localhost:3000/upload.
2. Click **Download sample CSV**, then **Browse** and select the file.
3. Click **Process**. The raw readings appear in a table.
4. Open **Tables** and **Matrixes** in the top bar and go through their tabs.
5. Open **Linear Regression**. Click **Lock**, choose a method, then click **Graph**.

What to check:

- The blue line passes close to the red dots.
- **Least squares** gives the same equation every time. **Gradient descent** changes slightly on each run, because it starts from random values.
- Raising the learning rate (for example to `0.0005`) and the iterations (for example to `10000`) brings gradient descent close to the least-squares result.

To start over with a clean state, click **Reset** on the upload screen and process the file again.

## Current status and limitations

- Only a **linear** fit is implemented, with two methods: gradient descent and least squares.
- The standards must be in **column 1** of the plate, one per row.
- Interpolating the value of an **unknown sample is not implemented** yet; the app stops at fitting the line.
- Data is kept in the browser's `localStorage`, so it stays on your machine.

## From v1 to v2: a Vuex store

The biggest change from v1 is where the data lives. In v1, every screen saved its own results to `localStorage` by hand and the next screen parsed them back. In v2, a single Vuex store holds everything: **state** holds the data, **mutations** change it, **actions** run the processing steps in order, and **getters** let any component read it.

### Sharing data between screens

**v1** saved every value under its own `localStorage` key and also passed data through route params (`views/Main.vue`):

```js
localStorage.setItem("filename", JSON.stringify(this.filename));
localStorage.setItem("csvdata", JSON.stringify(this.csvdata));
...
this.$router.push({
  name: "Procesados",
  params: { data: [this.filename, this.tableConfig, this.csvdata] }
});
```

The next screen needed two code paths, one for data from the route and one for a reload (`views/Procesados.vue`):

```js
if (routeRows && routeRows.length) {
  this.csvdata = this.$route.params.data[2].sort();
  localStorage.setItem("csvdata", JSON.stringify(this.csvdata));
  ...
} else {
  this.csvdata = JSON.parse(localStorage.getItem("csvdata")).sort();
  this.Wells = JSON.parse(localStorage.getItem("Wells"));
  ...
}
```

**v2** saves and restores the whole store with one plugin (`src/plugins/persistedState.js`). No component reads or writes `localStorage` for its data, and no data travels through routes:

```js
export default ({ store }) => {
  createPersistedState({
    key: "calliv",
  })(store);
};
```

### State: all the data in one place

In v1 the data was spread over each view's `data()` and copied between them: `Procesados.vue` held `curveBy4`, and `Drawing.vue` loaded it again to build its own `xs` and `ys`. In v2, `src/store/data/state.js` declares everything once, with its starting value:

```js
export default () => ({
  fileName: "",
  rawData: [],
  groupedbyWellData: {},
  rawAdjustedValues: [],
  adjustedValuesAverage: [],
  matrixNative: [],
  matrixZero: [],
  standardVals: [0, 4.2, 9.7, 14.6, 22, 33.3, 50, 100],
  standardLectures: [],
  fitLinear: [],
  regressionMethod: "gradientDescent",
  learningRate: 0.0001,
  iterations: 999,
  ...
});
```

Adding the regression settings took three lines here, and they're saved across reloads with no extra code.

### Mutations: every change has a name

In v1 the calculations ran inside a view's `created()` hook, mixed with saving and loading:

```js
this.rawAdjusted = Object.entries(this.groupByCSV).map(e => {
  return e[1].map(f => {
    return f[2] - f[3];
  });
});
localStorage.setItem("rawAdjusted", JSON.stringify(this.rawAdjusted));
```

In v2 each step is a small, named mutation, the only place that piece of state can change (`src/store/data/mutations.js`):

```js
ADJUST_RAW_VALUES(state) {
  state.rawAdjustedValues = Object.entries(state.groupedbyWellData).map(
    (e) => {
      return e[1].map((f) => {
        return f[2] - f[3];
      });
    }
  );
},
```

Vue DevTools records each mutation by name with its before and after state, so you can follow how the data was built step by step.

### Actions: the processing pipeline

In v1 the steps only ran when **Process Data** was opened; without visiting it, the curve page had nothing to fit. In v2, actions chain the steps, and one action at upload runs the whole pipeline (`src/store/data/actions.js`):

```js
changeRawData: ({ commit, dispatch }, payload) => {
  if (payload && payload.length > 0 && payload.constructor === Array) {
    commit("CHANGE_RAW_DATA", payload);
    dispatch("getTableHeader");
    dispatch("sortData");
  }
},
sortData: ({ commit, dispatch }) => {
  commit("SORT_DATA");
  dispatch("groupByWellData");
},
```

Actions can also be async, which mutations can't. That's what lets the fit load TensorFlow only when it's needed and switch between methods:

```js
async fitLinear({ commit, dispatch, state }) {
  const { standardVals, standardLectures, regressionMethod } = state;
  if (standardLectures && standardVals) {
    let fit;
    if (regressionMethod === "leastSquares") {
      fit = this.$fitLeastSquares(standardVals, standardLectures);
    } else {
      fit = await this.$fitLinear(standardVals, standardLectures, {
        learningRate: state.learningRate,
        iterations: state.iterations,
      });
    }
    commit("FIT_LINEAR", fit);
    dispatch("regressionGraph");
  }
},
```

### Getters: components read what they need

In v1 the parent view passed every value down as a prop, and sibling components talked through the root as an event bus (`this.$root.$emit('emitCoefficientsLinear', this.mbs)`):

```html
<TableByWell
  :csvdata="csvdata"
  :tableConfig="tableConfig"
  :groupByCSV="groupByCSV"
  :adjustedHeader="adjustedHeader"
  :Wells="Wells"
  :rawAdjusted="rawAdjusted"
  :adjustedAverage="adjustedAverage"
/>
```

In v2 each component takes only what it needs with `mapGetters` (`src/components/graphs/Linear.vue`):

```js
computed: {
  ...mapGetters("data", ["tableConfig"]),
},
```

So a page is just layout (`src/pages/graphs/index.vue`):

```html
<Header />
<StandardInput />
<Linear />
```

Getters are reactive: when the fit writes the new line to the store, the chart redraws and the equation line updates, with no events or props.

### Modules: data apart from UI state

The store is split into namespaced modules:

- `data`: the readings and every calculation.
- `tables`: UI state, such as the active tab and whether the standard and the regression are locked.
- `matrixes`: the active tab on the matrix page.

v1 kept UI flags such as `showactive: [true, false, false]` next to `csvdata` in the same `data()`.

### What could still improve

- **Step order is implicit.** `chunkAdjustedValues` dispatches `matrixNative`, which builds the zero matrix, before `getMinimumMeasureNoise`, which computes the blank. On the first **Process**, the blank isn't subtracted yet.
- **Some mutations calculate**, such as `SORT_DATA` and `CREATE_MATRIX_ZERO`. Moving the math into plain functions would leave mutations only assigning values, and let the math be tested on its own.
- **The chart config lives in the store** (`tableConfig`), so display settings are saved along with the data. A getter that builds it from `standardGraph` and `fitLinear` would keep the saved state to data only.
- **Many getters return state as is** (`rawData: (state) => state.rawData`). `mapState` covers those, leaving getters for calculated values.

## What I learned

- Moving a Vue single-page app to NuxtJS: file-based routing, plugins and static generation
- Managing shared state with Vuex and saving it across reloads
- Fitting regression models with TensorFlow.js, and when an exact formula is the better tool
- Array and multidimensional-array manipulation, handling and rendering
- Thinking about user interface and user experience (UI/UX)

## Contact

If you're a recruiter or interested in the idea, see my portfolio at [iasisalomon.pages.dev](https://iasisalomon.pages.dev).

## License

MIT. See [LICENSE](LICENSE).
