describe('Config files error handling', () => {
  it('it handles multiple config files', () => {
    cy.openModeSystemTest('pristine-with-config-file')
    cy.visitLaunchpad()

    cy.get('[data-cy-testingType=e2e]').click()

    cy.withCtx((ctx) => {
      ctx.actions.file.writeFileInProject('cypress.config.ts', 'export default {}')
    })

    cy.get('[data-cy-testingType=e2e]').click()

    cy.get('body')
    .should('contain.text', 'Cypress Configuration Error')
    .and('contain.text', 'There is both a `cypress.config.js` and a `cypress.config.ts` at the location below')

    cy.withCtx((ctx) => {
      ctx.actions.file.removeFileInProject('cypress.config.ts')
    })

    cy.get('[data-testid=error-retry-button]').click()
    cy.get('body')
    .should('not.contain.text', 'Cypress Configuration Error')

    cy.get('h1').should('contain', 'Choose a Browser')
  })

  it('it handles legacy config file', () => {
    cy.openModeSystemTest('pristine-with-config-file')
    cy.visitLaunchpad()

    cy.get('[data-cy-testingType=e2e]').click()

    cy.withCtx((ctx) => {
      ctx.actions.file.writeFileInProject('cypress.json', '{}')
      ctx.actions.file.removeFileInProject('cypress.config.js')
    })

    cy.get('[data-cy-testingType=e2e]').click()

    cy.get('body').should('contain.text', 'Cypress Configuration Error')

    cy.get('body')
    .should('contain.text', 'Cypress Configuration Error')
    .and('contain.text', 'There is a cypress.json file at the location below:')

    cy.withCtx((ctx) => {
      ctx.actions.file.removeFileInProject('cypress.json')
    })

    cy.get('[data-testid=error-retry-button]').click()
    cy.get('body')
    .should('contain.text', 'Cypress Configuration Error')
    .and('contain.text', 'Could not find a Cypress configuration file, exiting.')

    cy.withCtx((ctx) => {
      ctx.actions.file.writeFileInProject('cypress.config.js', 'module.exports = {}')
    })

    cy.get('[data-testid=error-retry-button]').click()
    cy.get('body')
    .should('not.contain.text', 'Cypress Configuration Error')

    cy.get('h1').should('contain', 'Choose a Browser')
  })

  it('it handles config files with legacy config file in same project', () => {
    cy.openModeSystemTest('pristine-with-config-file')
    cy.visitLaunchpad()

    cy.get('[data-cy-testingType=e2e]').click()

    cy.withCtx((ctx) => {
      ctx.actions.file.writeFileInProject('cypress.json', '{}')
    })

    cy.get('[data-cy-testingType=e2e]').click()

    cy.get('body').should('contain.text', 'Cypress Configuration Error')

    cy.get('body')
    .should('contain.text', 'Cypress Configuration Error')
    .and('contain.text', 'There is both a `cypress.config.js` and a cypress.json file at the location below')

    cy.withCtx((ctx) => {
      ctx.actions.file.removeFileInProject('cypress.json')
    })

    cy.get('[data-testid=error-retry-button]').click()
    cy.get('body')
    .should('not.contain.text', 'Cypress Configuration Error')

    cy.get('h1').should('contain', 'Choose a Browser')
  })

  it('creates config file if it do not exist', () => {
    cy.openModeSystemTest('pristine')
    cy.visitLaunchpad()

    cy.get('[data-cy-testingType=e2e]').click()

    cy.get('body').should('contain.text', 'Configuration Files')

    cy.get('button').contains('Continue').click()

    cy.get('body')
    .should('contain.text', 'Initializing Config')

    cy.withCtx((ctx) => {
      ctx.actions.file.checkIfFileExists('cypress.config.js')
    })
  })
})
