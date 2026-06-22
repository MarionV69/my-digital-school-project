import { test, expect } from '@playwright/test';

test.describe("Recherche et filtrage de fournisseurs", () => {
  test("un utilisateur peut rechercher par ville et filtrer par catégorie", async ({
    page,
  }) => {
    // -- Arrange --
    await page.goto("/");

    // -- Act : recherche par ville --
    await page.getByTestId("search-city-input").fill("Lyon");
    await page.getByTestId("search-submit-button").click();

    // -- Assert : au moins un résultat après la recherche --
    await expect(page.getByTestId("supplier-card").first()).toBeVisible();

    // --Act : application du filtre catégorie --
    await page
      .getByTestId("filter-category-poissons-produits-de-la-mer")
      .first()
      .click();

    // -- Assert : les résultats se mettent à jour --
    await expect(page.getByTestId("supplier-card").first()).toBeVisible();
  });
});
