import App from '../App.vue'

describe('App', () => {
  it('renders the button with correct label', () => {
    cy.mount(App)
    cy.get('button').should('have.attr', 'label', 'Clique aqui')
  })

  it('calls handleClick when button is clicked', () => {
    cy.mount(App)
    cy.window().then((win) => {
      cy.spy(win.console, 'log').as('consoleLog')
    })
    cy.get('button').click()
    cy.get('@consoleLog').should('have.been.calledWith', 'TAAAA')
  })
})
