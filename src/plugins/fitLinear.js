// 0 4,2 9,7 14,6 22 33,3 50 100
// Inject in Vue, context and store:
// $fitLinear(xVals, yVals, { learningRate, iterations }) -> gradient descent with TensorFlow
// $fitLeastSquares(xVals, yVals) -> exact ordinary least squares
// Both return [m, b] for y = m * x + b
// TensorFlow is loaded on first use, so it is not in the page bundle.
async function loadTf() {
  const tf = await import("@tensorflow/tfjs-core")
  // tfjs-core alone does not register these (the full @tensorflow/tfjs did):
  // tensor methods like M.mul(), and the gradients the optimizer needs
  await import("@tensorflow/tfjs-core/dist/public/chained_ops/register_all_chained_ops")
  await import("@tensorflow/tfjs-core/dist/register_all_gradients")
  await import("@tensorflow/tfjs-backend-cpu")
  await tf.setBackend("cpu")
  return tf
}

export default ({ app }, inject) => {
  inject("fitLinear", async (xVals, yVals, { learningRate, iterations } = {}) => {
    const tf = await loadTf()
    // initial random values
    const M = tf.variable(tf.scalar(Math.random()))
    const B = tf.variable(tf.scalar(Math.random()))
    // optimizer constants
    const LEARNING_RATE = learningRate || 0.0001
    const OPTIMIZER = tf.train.sgd(LEARNING_RATE)
    const ITERATIONS = iterations || process.env.ITERATIONS || 999
    // predict function
    function predict(xVals) {
      return tf.tidy(function () {
        return M.mul(xVals).add(B)
      })
    }
    function loss(pred, label) {
      const error = pred.sub(label).square().mean()
      return error
    }
    // adjustment
    for (let j = 0; j < ITERATIONS; j++) {
      OPTIMIZER.minimize(() => loss(predict(xVals), yVals))
    }

    const m = M.dataSync()[0]
    const b = B.dataSync()[0]
    M.dispose()
    B.dispose()
    return [m, b]
  })

  inject("fitLeastSquares", (xVals, yVals) => {
    const n = xVals.length
    let sumX = 0
    let sumY = 0
    let sumXY = 0
    let sumXX = 0
    for (let i = 0; i < n; i++) {
      sumX += xVals[i]
      sumY += yVals[i]
      sumXY += xVals[i] * yVals[i]
      sumXX += xVals[i] * xVals[i]
    }
    const denominator = n * sumXX - sumX * sumX
    // all x values equal (or no points): no single line fits
    if (n === 0 || denominator === 0) {
      return [NaN, NaN]
    }
    const m = (n * sumXY - sumX * sumY) / denominator
    const b = (sumY - m * sumX) / n
    return [m, b]
  })
}
