const expect = require('chai').expect;
const sinon = require('sinon');
const Helper = require('../src/Helper.js');

describe('#checkForConfData', function() {
  it('Can be called', function() {
    checkForConfDataSpy = sinon.spy(Helper, 'checkForConfData');
    Helper.checkForConfData();
    expect(checkForConfDataSpy.calledOnce).to.equal(true);
  })
})