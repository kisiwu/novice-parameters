/**
 * @description Storing strings, number and boolean in one instance
 * @param {object=} config unresolved parameters (key, value)
 */
function ParameterBag(config) {

  // VARIABLES //

  /**
   * @description contains the unresolved parameters
   */
  config = config && typeof config === "object" ? config : {};

  /**
   * @description contains the resolved parameters
   */
  var parameters = {};

  /**
   * @description set to true when 'resolveAll' is called
   */
  var resolved = false;

  var instance = this;

  /**
   * @description resolve a parameter
   * @param {string} value 
   * @param {string=} key
   */
  var resolve = function resolve(value, key) {
    // check if it should be resolved
    if (!(typeof value === "string" )) {
      return value;
    }

    // get the escaped (resolved) value
    var escapedValue = value.replace(/%%|%([^%\s]+)%/g, function(
      match,
      contents,
      offset,
      s
    ) {
      //skip %%
      if (typeof contents === "undefined") {
        return "%%";
      }

      if (contents === key) {
        throw new Error(
          'Circular reference in parameter "' +
            key +
            '" of value "' +
            value +
            '".'
        );
      }

      var param = instance.get(contents);

      if (typeof param === 'undefined' || param === null) {
        throw new Error(
          'Cannot resolve "' +
            value +
            '".'
        );
      }

      if (['string', 'number', 'boolean'].indexOf(typeof param) > -1) {
        return param.toString();
      } else {
        throw new Error(
          'Expected a string, number or boolean ' +
            'but found parameter "' +
            contents +
            '" of type ' +
            typeof param +
            ' inside string value "' +
            value +
            '".'
        );
      }
    });

    // replace '%%' by '%'
    return escapedValue.replace(/%%/g, "%");
  };

  /**
   * @description resolve all parameters
   */
  var resolveAll = function resolveAll() {
    if (resolved) {
      return;
    }

    resolved = true;

    Object.keys(parameters).forEach(
      p => this.set(p, resolve(parameters[p], p))
    );

    Object.keys(config).forEach(
      p => this.set(p, resolve(config[p], p))
    );
  };

  // METHODS //

  /**
   * @description resolve a parameter
   */
  this.resolve = resolve;

  /**
   * @description resolve all parameters
   */
  this.resolveAll = resolveAll;

  /**
   * @description set a parameter
   * @param {string} name the parameter's name
   * @param {any} value the parameter's value
   */
  this.set = function set(name, value) {
    parameters[name] = value;
  };

  /**
   * @description get a parameter's value
   * @param {string} name the parameter's name
   */
  this.get = function get(name) {
    if (typeof parameters[name] === "undefined") {
      if (typeof config[name] === "undefined") {
        return config[name];
      } else {
        this.set(name, resolve(config[name], name));
      }
    }

    return parameters[name];
  };
};

module.exports = ParameterBag;
