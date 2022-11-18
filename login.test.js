const {Builder, By, Key, until} = require('selenium-webdriver');
const by = require('selenium-webdriver/lib/by');
const { Logs } = require('selenium-webdriver/lib/webdriver');
jest.setTimeout(60000);

describe ("Cek Login Page", function(){
    let driver;
    beforeAll(async () => {
        jest.setTimeout(60000);
        driver = await new Builder().forBrowser('chrome').build();
        driver.manage().window().maximize();
        await driver.get('https://stagingsushi-hiro-cms.member.design/login/');
        // console.log("ini before All");
      });
      
      afterAll(async () => {
        //await driver.quit();
        // console.log("ini after each");
      });


      async function inputEmailInputElement(driver, sendKeys) {
        const inputEmail = await driver.findElements(By.css('.v-text-field__slot > input[type="text"]'));
        inputEmail[0].sendKeys(sendKeys);

        // const labelEmail = await driver.findElements(By.css('.v-text-field__slot'));
        // const inputEmail = await labelEmail[0].findElements(By.css('.v-label.theme--light'));
        // const target = inputEmail[0];
        // await target.sendKeys(sendKeys);
      }

      async function clearEmailInputElement(driver) {
        const inputEmail = await driver.findElements(By.css('.v-text-field__slot > input[type="text"]'));
        const target = inputEmail[0];
        await target.sendKeys(Key.COMMAND + "a")
        await target.sendKeys(Key.DELETE)
      }

      async function inputPasswordElement(driver, sendKeys) {
        const inputPassword = await driver.findElements(By.css('.v-text-field__slot > input[type="password"]'));
        inputPassword[0].sendKeys(sendKeys);
      
      }

      async function clearPasswordElement(driver){
        const inputPassword = await driver.findElements(By.css('.v-text-field__slot > input[type="password"]'));
        const target = inputPassword[0];
        await target.sendKeys(Key.COMMAND + "a");
        await target.sendKeys(Key.DELETE);
      }

      test('Should Be Disabled Button Login',async () => {
        const buttonSubmitDisabled = await driver.findElement(By.css('button[disabled="disabled"]')).catch(()=> null);
        expect(buttonSubmitDisabled!=null).toBe(true);

      });

      test('Should Be error with Wrong format email',async () => {
        const errorShouldBe = "Email must contain “@” and ”.” in the right places";
        // await driver.wait(until.elementLocated(By.css('.v-label.theme--light')));
        await inputEmailInputElement(driver,"Rudi Kurnia");
        await driver.wait(until.elementsLocated(By.css(".v-messages__message.message-transition-enter-to")));
        const errorChar = await driver.findElement(By.css('.v-messages__message.message-transition-enter-to'));
        expect(await errorChar.getText()).toBe(errorShouldBe);
      });

      test('Should Be error with Email is Required',async () => {
        const errorShouldBe = "Email is required";
        await clearEmailInputElement(driver);
        await driver.wait(until.elementsLocated(By.css(".v-messages__message.message-transition-enter-to")));
        const errorChar = await driver.findElement(By.css('.v-messages__message.message-transition-enter-to'));
        expect(await errorChar.getText()).toBe(errorShouldBe);
      })

      test('Should Be error Password must be 8 char', async() => {
        const errorShouldBe = "Password must be at least of 8 character & max 100 , i.e : pass1234";
        await inputEmailInputElement(driver,"super.admin@member.id");
        await inputPasswordElement(driver,"12");
        await driver.wait(until.elementsLocated(By.css('.v-messages__wrapper > div[class="v-messages__message message-transition-enter-to"]')));
        const errorChar = await driver.findElement(By.css('.v-messages__wrapper > div[class="v-messages__message message-transition-enter-to"]'));
        expect(await errorChar.getText()).toBe(errorShouldBe);
      })

      test('Should Be error Password is required', async() => {
        const errorShouldBe = "Password is required";
        await clearPasswordElement(driver);
        await driver.wait(until.elementsLocated(By.css('.v-messages__wrapper > div[class="v-messages__message message-transition-enter-to"]')));
        const errorChar = await driver.findElement(By.css('.v-messages__wrapper > div[class="v-messages__message message-transition-enter-to"]'));
        expect(await errorChar.getText()).toBe(errorShouldBe);
      })
      
      // test('Should Be Invalid Password or Email', async() => {
      //   const errorShouldBe = "Invalid Email or Password, Please Try Again";
      //   await inputPasswordElement(driver,"rudi59979112");
      //   await driver.wait(until.elementsLocated(By.css('.v-btn.v-btn--block.v-btn--has-bg.theme--light.v-size--default.primary')));
      //   const buttonLogin = await driver.findElements(By.css('.v-btn.v-btn--block.v-btn--has-bg.theme--light.v-size--default.primary'));
      //   buttonLogin[0].click();
      //   await driver.wait(until.elementsLocated(By.css('.mt-4.text-caption.error--text > div')));
      //   const errorMessage = await driver.findElements(By.css('.mt-4.text-caption.error--text > div'));
      //   const errorChar = await errorMessage[0];
      //   // console.log(input);
      //   expect(await errorChar.getText()).toBe(errorShouldBe);

      // })

      test('Should Be user inactive', async() => {
        const errorShouldBe = "Your access has been revoked, please contact your team";
        await inputEmailInputElement(driver,"rudi@member.id");
        await inputPasswordElement(driver,"memberid123");
        await driver.wait(until.elementsLocated(By.css('.v-btn.v-btn--block.v-btn--has-bg.theme--light.v-size--default.primary')));
        const buttonLogin = await driver.findElements(By.css('.v-btn.v-btn--block.v-btn--has-bg.theme--light.v-size--default.primary'));
        buttonLogin[0].click();
        await driver.wait(until.elementsLocated(By.css('.mt-4.text-caption.error--text > div')));
        const errorMessage = await driver.findElements(By.css('.mt-4.text-caption.error--text > div'));
        const errorChar = await errorMessage[0];
        // console.log(errorMessage);
        expect(await errorChar.getText()).toBe(errorShouldBe);

      })
      
      test('Should Be Login ', async() => {
        await inputEmailInputElement(driver,"super.admin@member.id");
        await inputPasswordElement(driver,"memberid123");
        await driver.wait(until.elementsLocated(By.css('.v-btn.v-btn--block.v-btn--has-bg.theme--light.v-size--default.primary')));
        const buttonLogin = await driver.findElements(By.css('.v-btn.v-btn--block.v-btn--has-bg.theme--light.v-size--default.primary'));
        buttonLogin[0].click();
        await driver.wait(until.elementsLocated(By.css('a[href="/app/loyalty/member"')));
        const memberList = await driver.findElements(By.css('.text-h5'));
        const textShouldBe = "Member List";
        const textMemberList = await memberList[0].getText();
        expect(textMemberList.trim()).toBe(textShouldBe);

      })
});