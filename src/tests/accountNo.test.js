const { AccountHelper } = require("../helpers")
const assert = require("assert")
describe("Wallet Test", () => {
    test("account number must be 10 digits", () => {
        const accNo = AccountHelper.generateAccNo()
        assert.equal(`${accNo}`.length, 10)
    })
})