const validate = require(`./parser/validate`)
const render = require(`./renderer`)

module.exports = async steps => {
  const errors = []

  steps.map((stepMdx, i) => {
    const syntaxError = validate(stepMdx)
    if (syntaxError) {
      errors.push(syntaxError)
    }
  })

  const firstStepPlan = await render(steps[0])
  if (firstStepPlan.length) {
    errors.push({
      step: 0,
      validationError: `Resources should not be placed in the introduction step (0)`,
    })
  }

  return errors
}
