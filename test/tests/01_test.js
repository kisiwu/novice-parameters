var kaukau = require("kaukau");
var Parameters = kaukau.Parameters;
var Logger = kaukau.Logger;

var Params = require('../../index');

describe("Test", () => {

  it("should auto resolve init parameters", function() {
    var myParams = new Params({
      'greetings': 'Hello',
      'sentence': '%greetings% world!'
    });
    expect(myParams.get('greetings')).to.equal('Hello');
    expect(myParams.get('sentence')).to.equal('Hello world!');
  });

  it("should resolve", function() {
    var myParams = new Params({
      'greetings': 'Good evening'
    });

    var result = myParams.resolve('%greetings% everybody!');
    expect(result).to.equal('Good evening everybody!');
  });

  it("should set parameters and manually resolve all parameters", function() {
    var myParams = new Params();
    myParams.set('greetings', 'Hello');
    myParams.set('sentence', '%greetings% world!');

    expect(myParams.get('greetings')).to.equal('Hello');

    // unresolved
    expect(myParams.get('sentence')).to.equal('%greetings% world!');

    myParams.resolveAll();

    // resolved
    expect(myParams.get('sentence')).to.equal('Hello world!');
  });
});
