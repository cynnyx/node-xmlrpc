var vows       = require('vows')
  , path       = require('path')
  , fs         = require('fs')
  , assert     = require('assert')
  , Serializer = require('../lib/serializer')


vows.describe('deserialize').addBatch({

  'serializeMethodCall() called with': {

    'type': {

      'boolean' : {
        'with a true boolean param' : {
          topic: function () {
            var value = true
            return Serializer.serializeMethodCall('testMethod', [value])
          }
        , 'contains the value 1': assertXml('good_food/boolean_true_call.xml')
        }
      , 'with a false boolean param' : {
          topic: function () {
            var value = false
            return Serializer.serializeMethodCall('testMethod', [value])
          }
        , 'contains the value 0': assertXml('good_food/boolean_false_call.xml')
        }
      }

    , 'datetime' : {
        'with a regular datetime param' : {
          topic: function () {
            var value = new Date(2012, 05, 07, 11, 35, 10)
            return Serializer.serializeMethodCall('testMethod', [value])
          }
        , 'contains the timestamp': assertXml('good_food/datetime_call.xml')
        }
      }

    , 'base64' : {
        'with a base64 param' : {
          topic: function () {
            var value = new Buffer('dGVzdGluZw==', 'base64')
            return Serializer.serializeMethodCall('testMethod', [value])
          }
        , 'contains the base64 string': assertXml('good_food/base64_call.xml')
        }
      }

    , 'double' : {
        'with a positive double param' : {
          topic: function () {
            var value = 17.5
            return Serializer.serializeMethodCall('testMethod', [value])
          }
        , 'contains the positive double': assertXml('good_food/double_positive_call.xml')
        }
      , 'with a negative double param' : {
          topic: function () {
            var value = -32.7777
            return Serializer.serializeMethodCall('testMethod', [value])
          }
        , 'contains the negative double': assertXml('good_food/double_negative_call.xml')
        }
      }

    , 'integer' : {
        'with a positive integer param' : {
          topic: function () {
            var value = 17
            return Serializer.serializeMethodCall('testMethod', [value])
          }
        , 'contains the positive integer': assertXml('good_food/int_positive_call.xml')
        }
      , 'with a negative integer param' : {
          topic: function () {
            var value = -32
            return Serializer.serializeMethodCall('testMethod', [value])
          }
        , 'contains the negative integer': assertXml('good_food/int_negative_call.xml')
        }
      , 'with an integer param of 0' : {
          topic: function () {
            var value = 0
            return Serializer.serializeMethodCall('testMethod', [value])
          }
        , 'contains 0': assertXml('good_food/int_zero_call.xml')
        }
      }

    , 'nil' : {
        'with a null param' : {
          topic: function () {
            var value = null
            return Serializer.serializeMethodCall('testMethod', [value])
          }
        , 'contains the nil': assertXml('good_food/nil_call.xml')
        }
      }

    , 'string' : {
        'with a regular string param' : {
          topic: function () {
            var value = 'testString'
            return Serializer.serializeMethodCall('testMethod', [value])
          }
        , 'contains the string': assertXml('good_food/string_call.xml')
        }
      , 'with a string param that requires CDATA' : {
          topic: function () {
            var value = '<html><body>Congrats</body></html>'
            return Serializer.serializeMethodCall('testCDATAMethod', [value])
          }
        , 'contains the CDATA-wrapped string': assertXml('good_food/string_cdata_call.xml')
        }
      , 'with a multiline string param that requires CDATA' : {
          topic: function () {
            var value = '<html>\n<head><title>Go testing!</title></head>\n<body>Congrats</body>\n</html>'
            return Serializer.serializeMethodCall('testCDATAMethod', [value])
          }
        , 'contains the CDATA-wrapped string': assertXml('good_food/string_multiline_cdata_call.xml')
        }
      , 'with an empty string' : {
          topic: function () {
            var value = ''
            return Serializer.serializeMethodCall('testMethod', [value])
          }
        , 'contains the empty string': assertXml('good_food/string_empty_call.xml')
        }
      }

    }

  , 'compound': {

      'array' : {
        'with a simple array' : {
          topic: function () {
            var value = ['string1', 3]
            return Serializer.serializeMethodCall('testMethod', [value])
          }
        , 'contains the array': assertXml('good_food/array_simple_call.xml')
        }
      }

    , 'struct' : {
        'with a one-level struct' : {
          topic: function () {
            var value = {
              stringName: 'string1'
            , intName: 3
            }
            return Serializer.serializeMethodCall('testMethod', [value])
          }
        , 'contains the struct': assertXml('good_food/struct_simple_call.xml')
        }
      , 'with a one-level struct and an empty property name' : {
          topic: function () {
            var value = {
              stringName: ''
            , intName: 3
            }
            return Serializer.serializeMethodCall('testMethod', [value])
          }
        , 'contains the struct': assertXml('good_food/struct_empty_property_call.xml')
        }
      , 'with a two-level struct' : {
          topic: function () {
            var value = {
              stringName: 'string1'
            , objectName: {
                intName: 4
              }
            }
            return Serializer.serializeMethodCall('testMethod', [value])
          }
        , 'contains the struct': assertXml('good_food/struct_nested_call.xml')
        }
      }

    }

  }

, 'serializeMethodResponse() called with': {

    'type': {

      'boolean' : {
        'with a true boolean param' : {
          topic: function () {
            var value = true
            return Serializer.serializeMethodResponse('testMethod', [value])
          }
        , 'contains the value 1': assertXml('good_food/boolean_true_response.xml')
        }
      , 'with a false boolean param' : {
          topic: function () {
            var value = false
            return Serializer.serializeMethodResponse('testMethod', [value])
          }
        , 'contains the value 0': assertXml('good_food/boolean_false_response.xml')
        }
      }

    }

  }
}).export(module)


//==============================================================================
// Utilities
//==============================================================================

function assertXml(fileName) {
  return function(result) {
    var file = path.join(__dirname, 'fixtures', fileName)
    var xml = fs.readFileSync(file, 'utf8').trim()
    assert.strictEqual(result, xml)
  }
}

