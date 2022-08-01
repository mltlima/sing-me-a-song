import recommendationFactory from './factories/recommendationFactory.js';

describe('Top /top', () => {
  beforeEach(() => {
    cy.resetDatabase();
  });

  it('Testing upvote rote', () => {
    const recommendation = recommendationFactory();
    cy.visit('localhost:3000');
    cy.intercept('POST', '/recommendations').as('getRecommendations');
    cy.insertRecommendation(recommendation);
    cy.contains(recommendation.name);
    cy.contains(recommendation.name)
      .get('article')
      .within(() => {
        cy.get('svg:first-of-type').click();
      });
    cy.intercept('GET', '/top').as('getTop');
    cy.visit('localhost:3000/top');
    cy.wait('@getTop');
    cy.contains(recommendation.name);
    cy.end();
  });
});