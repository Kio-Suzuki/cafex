describe('Oficinas - CRUD', () => {
  const nomeOficina = 'Oficina Teste E2E'
  const nomeOficinaEditada = 'Oficina Editada E2E'
  const descricao = 'Descrição de teste'
  const descricaoEditada = 'Descrição editada'

  beforeEach(() => {
    cy.visit('/')
  })

  it('Cria uma nova oficina', () => {
    cy.get('[data-cy=btn-abrir-cadastro]').click()
    cy.get('[data-cy=input-nome]').type(nomeOficina)
    cy.get('[data-cy=input-descricao]').type(descricao)
cy.get('[data-cy=select-dia-semana] .v-input__control').click()

    cy.get('.v-list-item-title').should('contain', 'Segunda-feira')
    cy.get('.v-list-item-title').contains('Segunda-feira').click()
    cy.get('.v-list-item-title').contains('Quarta-feira').click()
    cy.get('[data-cy=btn-confirmar]').click()
    cy.contains('Oficina cadastrada com sucesso!').should('exist')
    cy.contains(nomeOficina).should('exist')
    cy.contains(descricao).should('exist')
  })

  it('Edita uma oficina existente', () => {
    cy.contains(nomeOficina).parents('tr').within(() => {
      cy.get('[data-cy=btn-editar]').first().click()
    })
    cy.get('[data-cy=input-nome]').clear().type(nomeOficinaEditada)
    cy.get('[data-cy=input-descricao]').clear().type(descricaoEditada)
    cy.get('[data-cy=btn-confirmar]').click()
    cy.contains('Oficina editada com sucesso!').should('exist')
    cy.contains(nomeOficinaEditada).should('exist')
    cy.contains(descricaoEditada).should('exist')
  })

  it('Exclui uma oficina', () => {
    cy.contains(nomeOficinaEditada).parents('tr').within(() => {
      cy.get('[data-cy=btn-excluir]').first().click()
    })
    cy.contains('Confirmar').click()
    cy.contains('Oficina excluída com sucesso!').should('exist')
    cy.contains(nomeOficinaEditada).should('not.exist')
  })
})