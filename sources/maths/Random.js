/**
 * @class
 * @classdesc Random number generator
 * @param {number} seed Generation seed
 */
VVGL.Random = function (seed) {
    if (seed === undefined) {
        seed = new Date().getTime();
    }

    this.seed = [
        (seed >> 10) & 0xFFFF,
        seed & 0xFFFF
    ];
    this.mult = [
        0xE66D,
        0xDEEC
    ];

    for (var i = 0; i < 10; ++i) {
        this.randomInt();
    }
};

/**
 * Generate a random 16-bit Integer
 *
 * @return {number} Random number
 */
VVGL.Random.prototype.randomInt = function () {
    var accu = (this.mult[0] * this.seed[0]) & 0xFFFF;
    var temp = accu;

    accu = (accu << 0x10) >>> 0;
    accu += this.mult[0] * this.seed[1] +
            this.mult[1] * this.seed[0];
    this.seed[0] = temp;
    this.seed[1] = accu & 0xFFFF;

    return (this.seed[1]);
};

/**
 * Generate a random float number between 0 and 1.
 *
 * @return {number} Random number
 */
VVGL.Random.prototype.randomFloat = function () {
    return (this.randomInt() / 0xFFFF);
};
