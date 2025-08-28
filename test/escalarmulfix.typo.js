const chai = require("chai");
const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const buildBabyjub = require("circomlibjs").buildBabyjub;
const Scalar = require("ffjavascript").Scalar;

const assert = chai.assert;

function print(circuit, w, s) {
    console.log(s + ": " + w[circuit.getSignalIdx(s)]);
}

describe("Escalarmul typo test", function () {
    let babyJub;
    let Fr;
    let circuit_246;
    let circuit_249;

    this.timeout(100000);


    before( async() => {
        babyJub = await buildBabyjub();
        Fr = babyJub.F;
        circuit_246 = await wasm_tester(path.join(__dirname, "circuits", "escalarmulfix_base246_test.circom"));
        circuit_250 = await wasm_tester(path.join(__dirname, "circuits", "escalarmulfix_base250_test.circom"));
    });

    it("Works with 246", async () => {
        // 246 bits
        const s = Scalar.e("90396094371498357045414364182740522155718664660661797819361378793041303239");
        const base8 = [
            Fr.e("5299619240641551281634865583518297030282874472190772894086521144482721001553"),
            Fr.e("16950150798460657717958625567821834550301663161624707787222815936182638968203")
        ];

        const w = await circuit_246.calculateWitness({"e": s}, true);

        await circuit_246.checkConstraints(w);

        const expectedRes = babyJub.mulPointEscalar(base8, s);

        await circuit_246.assertOut(w, {out: [Fr.toObject(expectedRes[0]), Fr.toObject(expectedRes[1])]});

    });

    it("Works with 250", async () => {
        // 250 bits
        const s = Scalar.e("1446337509943973712726629826923848354491498634570588765109782060688660851839");
        const base8 = [
            Fr.e("5299619240641551281634865583518297030282874472190772894086521144482721001553"),
            Fr.e("16950150798460657717958625567821834550301663161624707787222815936182638968203")
        ];

        const w = await circuit_250.calculateWitness({"e": s}, true);

        await circuit_250.checkConstraints(w);

        const expectedRes = babyJub.mulPointEscalar(base8, s);

        await circuit_250.assertOut(w, {out: [Fr.toObject(expectedRes[0]), Fr.toObject(expectedRes[1])]});
    });

    it("Doesn't work with 247", async () => {
        var did_fail = false;
        try {
            await wasm_tester(path.join(__dirname, "circuits", "escalarmulfix_base247_test.circom"));
        } catch (e) {
            did_fail = true;
        }
        chai.expect(did_fail).to.be.true;
    });

    it("Doesn't work with 248", async () => {
        var did_fail = false;
        try {
            await wasm_tester(path.join(__dirname, "circuits", "escalarmulfix_base248_test.circom"));
        } catch (e) {
            did_fail = true;
        }
        chai.expect(did_fail).to.be.true;
    });

    it("Doesn't work with 249", async () => {
        var did_fail = false;
        try {
            await wasm_tester(path.join(__dirname, "circuits", "escalarmulfix_base249_test.circom"));
        } catch (e) {
            did_fail = true;
        }
        chai.expect(did_fail).to.be.true;
    });


});

