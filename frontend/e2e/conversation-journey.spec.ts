import { test, expect } from "@playwright/test";

const TEST_EMAIL = "hello@bouchonlyonnais.com";
const TEST_PASSWORD = "Password123!";

test.describe("Conversation journey", () => {
  test("restaurant user can login, contact a supplier and send a message", async ({
    page,
  }) => {
    // Arrange
    const TEST_MESSAGE = `Test E2E - ${Date.now()}`;
    await page.goto("/login");

    // Act : login
    await page.getByLabel("Adresse e-mail").fill(TEST_EMAIL);
    await page.locator("#password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Se connecter" }).click();

    // Assert : redirected to home page
    await expect(page).toHaveURL("/");
    await expect(page.getByTestId("supplier-card").first()).toBeVisible();

    // Act : click on first supplier card
    await page.getByTestId("supplier-card").first().click();

    // Assert : on supplier detail page
    await expect(page).toHaveURL(/\/suppliers\/\d+/);

    // Act : click contact button
    await page
      .getByRole("button", { name: "Contacter le fournisseur" })
      .click();

    // Assert : redirected to conversation page
    await expect(page).toHaveURL(/\/conversations\/\d+/);

    // Act : type and send a message
    await page
      .getByRole("textbox", { name: "Écrire un message" })
      .fill(TEST_MESSAGE);
    await page.getByRole("button", { name: "Envoyer" }).click();

    // Assert : message appears in the conversation
    await expect(page.getByText(TEST_MESSAGE)).toBeVisible();
  });
});
