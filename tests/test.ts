import { expect, test } from '@playwright/test';


test.describe("navigation", () => {
    test.beforeEach(async ({ context }) => {
    // Block any css requests for each test in this file.
    await context.route(/.css/, route => route.abort());
    });

    // Will Turn on when it's deployed
    test('homepage has HCM Calculator in title and get started link linking to the intro page', async ({ page }) => {
        // Block png and jpeg images.
        await page.route(/(png|jpeg)$/, route => route.abort());


        // await page.goto('http://localhost:5173');

        // Expect a title "to contain" a substring
        // await expect(page).toHaveTitle(/HCM Calculator/);
    });


    test('The main calculation of HCM chapter 15 is successfuly done', async ({ page }) => {
        await page.route(/(png|jpeg)$/, route => route.abort());

        // await page.goto('http://localhost:5173/hcm15');

        // create a locator
        const addSegment = page.getByText('ADD SEGMENT');
        const removeSegment = page.getByText('REMOVE SEGMENT');
        // const calculate = page.getByText('CALCULATE SEGMENT');

        // Click the add segment
        // await addSegment.click();
        // await removeSegment.click();
        // await calculate.click();

        // Expects the URL to contain hcm15
        await expect(page).toHaveURL(/hcm15/);

        // Check 0 and decimal value for initial values
        await page.locator('#Spl_input').type('0');
        await page.locator('#Spl_input').type('1.5');
        await page.locator('#LW_input').type('0');
        await page.locator('#LW_input').type('1.5');
        await page.locator('#SW_input').type('0');
        await page.locator('#SW_input').type('1.5');
        await page.locator('#APD_input').type('0');
        await page.locator('#APD_input').type('1.5');
        await page.locator('#PMHVFL_input').type('0');
        await page.locator('#PMHVFL_input').type('1.5');

        // Check 0 and decimal value for table values
        await page.locator('.seg_length').type('0');
        await page.locator('.seg_length').type('1.5');
        await page.locator('.seg_grade').type('0');
        await page.locator('.seg_grade').type('1.5');
        await page.locator('.vi_input').type('0');
        await page.locator('.vi_input').type('1.5');
        await page.locator('.vo_input').type('0');
        await page.locator('.vo_input').type('1.5');
        await page.locator('.PHF_input').type('0');
        await page.locator('.PHF_input').type('1.5');
        await page.locator('.PHV_input').type('0');
        await page.locator('.PHV_input').type('1.5');

        await page.locator('.is_hc').check();
        expect(await page.locator('.is_hc').isChecked()).toBeTruthy();
        await page.locator('.hc_param').check();
        expect(await page.locator('.hc_param').isChecked()).toBeTruthy();

        await page.locator('.passing_type').selectOption('Passing Constrained');
        await page.locator('.passing_type').selectOption('Passing Lane');
        await page.locator('.passing_type').selectOption('Passing Zone');

        // Check 0 and decimal value for sub table values
        await page.locator('#subseg_len').type('0');
        await page.locator('#subseg_len').type('1.5');
        await page.locator('#design_radius').type('0');
        await page.locator('#design_radius').type('1.5');
        await page.locator('#superelevation').type('0');
        await page.locator('#superelevation').type('1.5');

        // Expect input value
        // await expect(page.locator("input#Spl_input");

    });

    test('Users can access to Terms and Conditions', async ({ page }) => {
        // Block png and jpeg images.
        await page.route(/(png|jpeg)$/, route => route.abort());


        // await page.goto('http://localhost:5173/terms');

    });

});