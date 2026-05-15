"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var utils_1 = require("./utils");
describe('inBounds', function () {
    it('works for bounds', function () {
        var inBounds = (0, utils_1.createInBounds)({ sw: [-10, -10], ne: [10, 175] });
        (0, chai_1.expect)(inBounds([-11, 176])).to.be.false;
        (0, chai_1.expect)(inBounds([-9, 174])).to.be.true;
        (0, chai_1.expect)(inBounds([-9, 176])).to.be.false;
        (0, chai_1.expect)(inBounds([+9, -11])).to.be.false;
        (0, chai_1.expect)(inBounds([+9, -10])).to.be.true;
    });
    it('works for bounds crossing dateline', function () {
        var inBounds = (0, utils_1.createInBounds)({ sw: [-10, 175], ne: [10, -175] });
        (0, chai_1.expect)(inBounds([-11, 176])).to.be.false;
        (0, chai_1.expect)(inBounds([-9, 176])).to.be.true;
        (0, chai_1.expect)(inBounds([-9, -176])).to.be.true;
        (0, chai_1.expect)(inBounds([-9, -174])).to.be.false;
        (0, chai_1.expect)(inBounds([+9, -174])).to.be.false;
        (0, chai_1.expect)(inBounds([+9, -176])).to.be.true;
        (0, chai_1.expect)(inBounds([+11, -176])).to.be.false;
    });
});
