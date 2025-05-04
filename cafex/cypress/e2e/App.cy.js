describe('App', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3334/txtBotao', {
      statusCode: 200,
      body: 'Clicou no Botao'
    }).as('getTxtBotao')

    cy.visit('/')
  })

  it('Renderiza o botao com o texto correto', () => {
    cy.get('button').should('have.text', 'Clique aqui')
  })

  it('Chama handleClick quando botao é clicado', () => {
    cy.window().then((win) => {
      cy.spy(win.console, 'log').as('consoleLog')
    })
    cy.get('button').click()
    cy.wait('@getTxtBotao')
    cy.get('@consoleLog').should('have.been.calledWith', 'Clicou no Botao')
  })
})
