const helper = require("node-red-node-test-helper");
const tagetNode = require("../../../dist/ui_timelines_chart.js");
const d = require("../../../dist/define.js");

helper.init(require.resolve('node-red'), { 
  // functionGlobalContext: { fs:require('fs') }
});

describe("ui_timelines_chart Node", function () {

  before(function(done) {
    // runs once before the first test in this block
    helper.startServer(done);
  });

  after(function(done) {
    // runs once after the last test in this block
    helper.stopServer(done);
  }); 

  beforeEach(function () {
    // runs before each test in this block
  });

  afterEach(function () {
    // runs after each test in this block
    helper.unload();
  });

  // test results
  const TEST_CASE_NG = "TEST_CASE_NG";
  const TEST_CASE_OK = "TEST_CASE_OK";

  // enable tests
  const BASIC_TEST_PROPERTY = 1;
  const BASIC_TEST_BOOLEAN = 1;
  const BASIC_TEST_NUMBER = 1;
  const BASIC_TEST_STRING = 1;
  const BASIC_TEST_DATETIME = 1;

  const defaultFlow = [
    {
      id: "n1",
      type: "ui_timelines_chart",
      name: "test name",
      group: "",
      startDateTime: d.myConst.items.startDateTime.default,
      endDateTime: d.myConst.items.endDateTime.default,
    }
  ];

  /* --------------------------------------------------------------------------------------- */
  // start: basic test property
  /* --------------------------------------------------------------------------------------- */
  if( BASIC_TEST_PROPERTY ){
    describe("test node property", function () {

      it('should be loaded', function (done) {
        var flow = [{ id: "n1", type: "ui_timelines_chart", name: "test name" }];
        helper.load(tagetNode, flow, function () {
          var n1 = helper.getNode("n1");
          try {
            n1.should.have.property('name', 'test name');
            done();
          } catch(err) {
            done(err);
          }
        });
      });

    });
  }

  /* --------------------------------------------------------------------------------------- */
  // start: basic test boolean
  /* --------------------------------------------------------------------------------------- */
  if( BASIC_TEST_BOOLEAN ){
    function basicTestBoolean(_valueName, _default, _testValue, _testCase){
      it(`${_valueName} test case: ${_testCase} value:"${_testValue}"`, function (done) {
        let _flow = defaultFlow;
        _flow[0][_valueName] = _testValue;
        helper.load(tagetNode, _flow, function () {
          const _n1 = helper.getNode("n1");
          try {
            const _warnText = `Incorrect ${_valueName} value :"${_testValue}". This ${_valueName} was corrected with the default value: "${_default}".`;
            switch(_testCase){
              case TEST_CASE_OK: /* case: TEST_CASE_OK */
                _n1._flow.flow.configs.n1[_valueName].should.have.equal(_testValue);
                _n1.warn.should.be.not.calledWithExactly(_warnText); /* not warning */
                break;
              case TEST_CASE_NG: /* case: TEST_CASE_NG */
                switch(_testValue){
                  case undefined:
                  case null:
                    if( _testValue !== _n1._flow.flow.configs.n1[_valueName]) throw new Error("test ng.");
                    break;
                  default:
                    _n1._flow.flow.configs.n1[_valueName].should.have.equal(_testValue);
                    break;
                }
                _n1.warn.should.be.calledWithExactly(_warnText);  /* warning */
                break;
              default:
                throw new Error("test case no not found.");
              }
            done();
          } catch(err) {
            // console.log(err);
            done(err);
          }
        });
      });
    }

    // basic test
    describe("basic test numbar", function () {
      this.timeout(10000);
      // enableAnimations
      basicTestBoolean('enableAnimations', d.myConst.items.enableAnimations.default, true, TEST_CASE_OK);
      basicTestBoolean('enableAnimations', d.myConst.items.enableAnimations.default, false, TEST_CASE_OK);
      basicTestBoolean('enableAnimations', d.myConst.items.enableAnimations.default, "true", TEST_CASE_OK);
      basicTestBoolean('enableAnimations', d.myConst.items.enableAnimations.default, "false", TEST_CASE_OK);
      basicTestBoolean('enableAnimations', d.myConst.items.enableAnimations.default, "", TEST_CASE_NG);
      basicTestBoolean('enableAnimations', d.myConst.items.enableAnimations.default, 0, TEST_CASE_NG);
      basicTestBoolean('enableAnimations', d.myConst.items.enableAnimations.default, undefined, TEST_CASE_NG);
      basicTestBoolean('enableAnimations', d.myConst.items.enableAnimations.default, null, TEST_CASE_NG);

      // enableDateMarker
      basicTestBoolean('enableDateMarker', d.myConst.items.enableDateMarker.default, true, TEST_CASE_OK);
      basicTestBoolean('enableDateMarker', d.myConst.items.enableDateMarker.default, false, TEST_CASE_OK);
      basicTestBoolean('enableDateMarker', d.myConst.items.enableDateMarker.default, "true", TEST_CASE_OK);
      basicTestBoolean('enableDateMarker', d.myConst.items.enableDateMarker.default, "false", TEST_CASE_OK);
      basicTestBoolean('enableDateMarker', d.myConst.items.enableDateMarker.default, "", TEST_CASE_NG);
      basicTestBoolean('enableDateMarker', d.myConst.items.enableDateMarker.default, 0, TEST_CASE_NG);
      basicTestBoolean('enableDateMarker', d.myConst.items.enableDateMarker.default, undefined, TEST_CASE_NG);
      basicTestBoolean('enableDateMarker', d.myConst.items.enableDateMarker.default, null, TEST_CASE_NG);

      // forwardInputMessages
      basicTestBoolean('forwardInputMessages', d.myConst.items.forwardInputMessages.default, true, TEST_CASE_OK);
      basicTestBoolean('forwardInputMessages', d.myConst.items.forwardInputMessages.default, false, TEST_CASE_OK);
      basicTestBoolean('forwardInputMessages', d.myConst.items.forwardInputMessages.default, "true", TEST_CASE_OK);
      basicTestBoolean('forwardInputMessages', d.myConst.items.forwardInputMessages.default, "false", TEST_CASE_OK);
      basicTestBoolean('forwardInputMessages', d.myConst.items.forwardInputMessages.default, "", TEST_CASE_NG);
      basicTestBoolean('forwardInputMessages', d.myConst.items.forwardInputMessages.default, 0, TEST_CASE_NG);
      basicTestBoolean('forwardInputMessages', d.myConst.items.forwardInputMessages.default, undefined, TEST_CASE_NG);
      basicTestBoolean('forwardInputMessages', d.myConst.items.forwardInputMessages.default, null, TEST_CASE_NG);
    });
  }

  /* --------------------------------------------------------------------------------------- */
  // start: basic test number
  /* --------------------------------------------------------------------------------------- */
  if( BASIC_TEST_NUMBER ){

    const testCaseMin = 1;
    const testCaseMax = 9;

    /**
     * basicTestNumber
     *
     * @param {*} _valueName
     * @param {*} _default
     * @param {*} _valueMin
     * @param {*} _valueMax
     * @param {*} _testCase
     */
    function basicTestNumber(_valueName, _default, _valueMin, _valueMax, _testCase){

      // test case
      const _testCaseNumber = [
        _valueMin,
        Math.round((_valueMax - _valueMin)/2),
        _valueMax,
        _valueMin - 1,
        _valueMax + 1,
        "",
        "string",
        null,
        undefined
      ];

      const _testValue = _testCaseNumber[_testCase - testCaseMin];
      it(`${_valueName} test case:${_testCase} value:${_testValue}`, function (done) {
        let _flow = defaultFlow;
        _flow[0][_valueName] = _testValue;
        helper.load(tagetNode, _flow, function () {
          const _n1 = helper.getNode("n1");
          try {
            const _warnText = `Incorrect ${_valueName} value :"${_testValue}". This ${_valueName} was corrected with the default value: "${_default}".`;
            switch(_testCase){
              case 1: /* case: min */
              case 2: /* case: middle */
              case 3: /* case: max */
                _n1._flow.flow.configs.n1[_valueName].should.have.equal(_testValue);
                _n1.warn.should.be.not.calledWithExactly(_warnText); /* not warning */
                break;
              case 4: /* case: min - 1 */
              case 5: /* case: max + 1 */
              case 6: /* case: "" blank */
              case 7: /* case: "string" */
                _n1._flow.flow.configs.n1[_valueName].should.have.equal(_testValue);
                _n1.warn.should.be.calledWithExactly(_warnText);  /* warning */
                break;
              case 8: /* case: null */
              case 9: /* case: undefined */
                if( _testValue !== _n1._flow.flow.configs.n1[_valueName]) throw new Error("test ng.");
                _n1.warn.should.be.calledWithExactly(_warnText);  /* warning */
              break;
              default:
                throw new Error("test case no not found.");
              }
            done();
          } catch(err) {
            // console.log(err);
            done(err);
          }
        });
      });
    }

    // basic test
    describe("basic test numbar", function () {
      this.timeout(10000);
      for(let _testCase = testCaseMin ; _testCase <= testCaseMax ; ++_testCase){
        basicTestNumber('xAxisLabelsFontSize',    d.myConst.items.xAxisLabelsFontSize.default, d.myConst.items.xAxisLabelsFontSize.minNum, d.myConst.items.xAxisLabelsFontSize.maxNum, _testCase);
        basicTestNumber('yAxisLabelsFontSize',    d.myConst.items.yAxisLabelsFontSize.default, d.myConst.items.yAxisLabelsFontSize.minNum, d.myConst.items.yAxisLabelsFontSize.maxNum, _testCase);
        basicTestNumber('resetZoomLabelFontSize', d.myConst.items.resetZoomLabelFontSize.default, d.myConst.items.resetZoomLabelFontSize.minNum, d.myConst.items.resetZoomLabelFontSize.maxNum, _testCase); 
        basicTestNumber('maxLineHeight',          d.myConst.items.maxLineHeight.default, d.myConst.items.maxLineHeight.minNum, d.myConst.items.maxLineHeight.maxNum, _testCase);
      }
    });
  }

  /* --------------------------------------------------------------------------------------- */
  // start: basic test string
  /* --------------------------------------------------------------------------------------- */
  if( BASIC_TEST_STRING ){
    // xTickFormat, xAxisLabelslColor, yAxisLabelslColor, resetZoomLabelColor
    function basicTestString(_valueName, _default, _testValue, _testCase){
      it(`${_valueName} test case: ${_testCase} value:"${_testValue}"`, function (done) {
        let _flow = defaultFlow;
        _flow[0][_valueName] = _testValue;
        helper.load(tagetNode, _flow, function () {
          const _n1 = helper.getNode("n1");
          try {
            const _warnText = `Incorrect ${_valueName} value :"${_testValue}". This ${_valueName} was corrected with the default value: "${_default}".`;
            switch(_testCase){
              case TEST_CASE_OK: /* case: TEST_CASE_OK */
                _n1._flow.flow.configs.n1[_valueName].should.have.equal(_testValue);
                _n1.warn.should.be.not.calledWithExactly(_warnText); /* not warning */
                break;
              case TEST_CASE_NG: /* case: TEST_CASE_NG */
                switch(_testValue){
                  case undefined:
                  case null:
                    if( _testValue !== _n1._flow.flow.configs.n1[_valueName]) throw new Error("test ng.");
                    break;
                  default:
                    _n1._flow.flow.configs.n1[_valueName].should.have.equal(_testValue);
                    break;
                }
                _n1.warn.should.be.calledWithExactly(_warnText);  /* warning */
                break;
              default:
                throw new Error("test case no not found.");
              }
            done();
          } catch(err) {
            // console.log(err);
            done(err);
          }
        });
      });
    }

    // basic test
    describe("basic test string", function () {
      this.timeout(10000);
      // xTickFormat
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, d.myConst.items.xTickFormat.default ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "ss" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "s" ,TEST_CASE_NG);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "mm" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "m" ,TEST_CASE_NG);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "ss:mm" ,TEST_CASE_NG); 
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "s:m" ,TEST_CASE_NG); 
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "HH" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "H" ,TEST_CASE_NG);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "HH:ss" ,TEST_CASE_NG);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "HH:mm" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "HH:mm:ss" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "DD HH:mm:ss" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "MM HH:mm:ss" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "MM-DD HH:mm:ss" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YYYY HH:mm:ss" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YYYY-DD HH:mm:ss" ,TEST_CASE_NG);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YYYY-MM HH:mm:ss" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YYYY-MM-DD HH:mm:ss" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YYYY-MM-DD hh:mm:ss" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YYYY-MM-DD ss" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YYYY-MM-DD mm" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YYYY-MM-DD mm:ss" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YYYY-MM-DD hh" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YYYY-MM-DD hh:ss" ,TEST_CASE_NG);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YYYY-MM-DD hh:mm" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "yyyy-mm-dd HH:mm:ss" ,TEST_CASE_NG);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YYYY/MM/DD HH:mm:ss" ,TEST_CASE_NG);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "DD" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "MM" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "MM-DD" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YYYY" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YYY" ,TEST_CASE_NG);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YY" ,TEST_CASE_NG);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "Y" ,TEST_CASE_NG);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YYYY-DD" ,TEST_CASE_NG);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YYYY-MM" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "YYYY-MM-DD" ,TEST_CASE_OK);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "" ,TEST_CASE_NG);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, "0" ,TEST_CASE_NG);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, null ,TEST_CASE_NG);
      basicTestString('xTickFormat', d.myConst.items.xTickFormat.default, undefined ,TEST_CASE_NG);

      // xAxisLabelslColor
      basicTestString('xAxisLabelslColor', d.myConst.items.xAxisLabelslColor.default, d.myConst.items.xAxisLabelslColor.default ,TEST_CASE_OK);
      basicTestString('xAxisLabelslColor', d.myConst.items.xAxisLabelslColor.default, "#000000" ,TEST_CASE_OK);
      basicTestString('xAxisLabelslColor', d.myConst.items.xAxisLabelslColor.default, "#FFFFFF" ,TEST_CASE_OK);
      basicTestString('xAxisLabelslColor', d.myConst.items.xAxisLabelslColor.default, "#AAAAAA" ,TEST_CASE_OK);
      basicTestString('xAxisLabelslColor', d.myConst.items.xAxisLabelslColor.default, "red" ,TEST_CASE_OK);
      basicTestString('xAxisLabelslColor', d.myConst.items.xAxisLabelslColor.default, "mediumslateblue" ,TEST_CASE_OK);
      basicTestString('xAxisLabelslColor', d.myConst.items.xAxisLabelslColor.default, "black" ,TEST_CASE_OK);
      basicTestString('xAxisLabelslColor', d.myConst.items.xAxisLabelslColor.default, "" ,TEST_CASE_NG);
      basicTestString('xAxisLabelslColor', d.myConst.items.xAxisLabelslColor.default, null ,TEST_CASE_NG);
      basicTestString('xAxisLabelslColor', d.myConst.items.xAxisLabelslColor.default, undefined ,TEST_CASE_NG);

      // yAxisLabelslColor
      basicTestString('yAxisLabelslColor', d.myConst.items.yAxisLabelslColor.default, d.myConst.items.yAxisLabelslColor.default ,TEST_CASE_OK);
      basicTestString('yAxisLabelslColor', d.myConst.items.yAxisLabelslColor.default, "#000000" ,TEST_CASE_OK);
      basicTestString('yAxisLabelslColor', d.myConst.items.yAxisLabelslColor.default, "#FFFFFF" ,TEST_CASE_OK);
      basicTestString('yAxisLabelslColor', d.myConst.items.yAxisLabelslColor.default, "#AAAAAA" ,TEST_CASE_OK);
      basicTestString('yAxisLabelslColor', d.myConst.items.yAxisLabelslColor.default, "red" ,TEST_CASE_OK);
      basicTestString('yAxisLabelslColor', d.myConst.items.yAxisLabelslColor.default, "mediumslateblue" ,TEST_CASE_OK);
      basicTestString('yAxisLabelslColor', d.myConst.items.yAxisLabelslColor.default, "black" ,TEST_CASE_OK);
      basicTestString('yAxisLabelslColor', d.myConst.items.yAxisLabelslColor.default, "" ,TEST_CASE_NG);
      basicTestString('yAxisLabelslColor', d.myConst.items.yAxisLabelslColor.default, null ,TEST_CASE_NG);
      basicTestString('yAxisLabelslColor', d.myConst.items.yAxisLabelslColor.default, undefined ,TEST_CASE_NG);

      // resetZoomLabelColor
      basicTestString('resetZoomLabelColor', d.myConst.items.resetZoomLabelColor.default, d.myConst.items.resetZoomLabelColor.default ,TEST_CASE_OK);
      basicTestString('resetZoomLabelColor', d.myConst.items.resetZoomLabelColor.default, "#000000" ,TEST_CASE_OK);
      basicTestString('resetZoomLabelColor', d.myConst.items.resetZoomLabelColor.default, "#FFFFFF" ,TEST_CASE_OK);
      basicTestString('resetZoomLabelColor', d.myConst.items.resetZoomLabelColor.default, "#AAAAAA" ,TEST_CASE_OK);
      basicTestString('resetZoomLabelColor', d.myConst.items.resetZoomLabelColor.default, "red" ,TEST_CASE_OK);
      basicTestString('resetZoomLabelColor', d.myConst.items.resetZoomLabelColor.default, "mediumslateblue" ,TEST_CASE_OK);
      basicTestString('resetZoomLabelColor', d.myConst.items.resetZoomLabelColor.default, "black" ,TEST_CASE_OK);
      basicTestString('resetZoomLabelColor', d.myConst.items.resetZoomLabelColor.default, "" ,TEST_CASE_NG);
      basicTestString('resetZoomLabelColor', d.myConst.items.resetZoomLabelColor.default, null ,TEST_CASE_NG);
      basicTestString('resetZoomLabelColor', d.myConst.items.resetZoomLabelColor.default, undefined ,TEST_CASE_NG);

      // timeFormat https://github.com/d3/d3-time-format#locale_format
      basicTestString('timeFormat', d.myConst.items.timeFormat.default, d.myConst.items.timeFormat.default ,TEST_CASE_OK);
      basicTestString('timeFormat', d.myConst.items.timeFormat.default, "%Y-%m-%d %H:%M:%S", TEST_CASE_OK);
      basicTestString('timeFormat', d.myConst.items.timeFormat.default, "%Y-%m-%d", TEST_CASE_OK);
      basicTestString('timeFormat', d.myConst.items.timeFormat.default, "%H", TEST_CASE_OK);
      basicTestString('timeFormat', d.myConst.items.timeFormat.default, "%H:%M", TEST_CASE_OK);
      basicTestString('timeFormat', d.myConst.items.timeFormat.default, "%H:%M:%S", TEST_CASE_OK);
      basicTestString('timeFormat', d.myConst.items.timeFormat.default, "%M", TEST_CASE_OK);
      basicTestString('timeFormat', d.myConst.items.timeFormat.default, "%M:%S", TEST_CASE_OK);
      basicTestString('timeFormat', d.myConst.items.timeFormat.default, "%S", TEST_CASE_OK);
      basicTestString('timeFormat', d.myConst.items.timeFormat.default, "%Y-%m-%d %-I:%M:%S %p", TEST_CASE_OK);
      basicTestString('timeFormat', d.myConst.items.timeFormat.default, "", TEST_CASE_NG);
      basicTestString('timeFormat', d.myConst.items.timeFormat.default, null ,TEST_CASE_NG);
      basicTestString('timeFormat', d.myConst.items.timeFormat.default, undefined ,TEST_CASE_NG);

    });

  }

  /* --------------------------------------------------------------------------------------- */
  // start: basic test datetime
  /* --------------------------------------------------------------------------------------- */
  if( BASIC_TEST_DATETIME ){
    // startDateTime, endDateTime
    function basicTestDateTime(_valueName, _testValue, _testCase){
      it(`${_valueName} test case: ${_testCase} value:"${_testValue}"`, function (done) {
        let _flow = defaultFlow;
        _flow[0][_valueName] = _testValue;
        helper.load(tagetNode, _flow, function () {
          const _n1 = helper.getNode("n1");
          try {
            const _warnText = `Incorrect ${_valueName} value :"${_testValue}".`;
            switch(_testCase){
              case TEST_CASE_OK: /* case: TEST_CASE_OK */
                _n1._flow.flow.configs.n1[_valueName].should.have.equal(_testValue);
                _n1.error.should.be.not.calledWithExactly(_warnText); /* not error */
                break;
              case TEST_CASE_NG: /* case: TEST_CASE_NG */
                switch(_testValue){
                  case undefined:
                  case null:
                    if( _testValue !== _n1._flow.flow.configs.n1[_valueName]) throw new Error("test ng.");
                    break;
                  default:
                    _n1._flow.flow.configs.n1[_valueName].should.have.equal(_testValue);
                    break;
                }
                _n1.error.should.be.calledWithExactly(_warnText);  /* error */
                break;
              default:
                throw new Error("test case no not found.");
              }
            done();
          } catch(err) {
            // console.log(err);
            done(err);
          }
        });
      });
    }

    // basic test
    describe("basic test datetime", function () {
      this.timeout(10000);
      // startDateTime
      basicTestDateTime('startDateTime', "" ,TEST_CASE_OK);
      basicTestDateTime('startDateTime', "1-1-1 0:0:0" ,TEST_CASE_OK);
      basicTestDateTime('startDateTime', "9999-12-31 23:59:59" ,TEST_CASE_OK);
      basicTestDateTime('startDateTime', "10000-12-31 23:59:59" ,TEST_CASE_OK);
      basicTestDateTime('startDateTime', "9999-13-31 23:59:59" ,TEST_CASE_NG);
      basicTestDateTime('startDateTime', "9999-12-32 23:59:59" ,TEST_CASE_NG);
      basicTestDateTime('startDateTime', "9999-12-31 24:59:59" ,TEST_CASE_NG);
      basicTestDateTime('startDateTime', "9999-12-31 23:60:59" ,TEST_CASE_NG);
      basicTestDateTime('startDateTime', "9999-12-31 23:59:60" ,TEST_CASE_NG);
      basicTestDateTime('startDateTime', "2021-09-03 12:00:00" ,TEST_CASE_OK);
      basicTestDateTime('startDateTime', "2021/09/03 12:00:00" ,TEST_CASE_OK);
      basicTestDateTime('startDateTime', "2021/09/03" ,TEST_CASE_OK);
      basicTestDateTime('startDateTime', "12:00:00" ,TEST_CASE_NG);
      basicTestDateTime('startDateTime', "09/03" ,TEST_CASE_OK);
      basicTestDateTime('startDateTime', "09" ,TEST_CASE_OK);
      basicTestDateTime('startDateTime', "0" ,TEST_CASE_OK);
      basicTestDateTime('startDateTime', null ,TEST_CASE_NG);
      basicTestDateTime('startDateTime', undefined ,TEST_CASE_NG);
      basicTestDateTime('startDateTime', d.myConst.items.startDateTime.default ,TEST_CASE_OK);
      /* endDateTimeをチェックするにはstartDateTimeが正常である必要がある */

      // endDateTime
      basicTestDateTime('endDateTime', "" ,TEST_CASE_OK);
      basicTestDateTime('endDateTime', "1-1-1 0:0:0" ,TEST_CASE_OK);
      basicTestDateTime('endDateTime', "9999-12-31 23:59:59" ,TEST_CASE_OK);
      basicTestDateTime('endDateTime', "10000-12-31 23:59:59" ,TEST_CASE_OK);
      basicTestDateTime('endDateTime', "9999-13-31 23:59:59" ,TEST_CASE_NG);
      basicTestDateTime('endDateTime', "9999-12-32 23:59:59" ,TEST_CASE_NG);
      basicTestDateTime('endDateTime', "9999-12-31 24:59:59" ,TEST_CASE_NG);
      basicTestDateTime('endDateTime', "9999-12-31 23:60:59" ,TEST_CASE_NG);
      basicTestDateTime('endDateTime', "9999-12-31 23:59:60" ,TEST_CASE_NG);
      basicTestDateTime('endDateTime', "2021-09-03 12:00:00" ,TEST_CASE_OK);
      basicTestDateTime('endDateTime', "2021/09/03 12:00:00" ,TEST_CASE_OK);
      basicTestDateTime('endDateTime', "2021/09/03" ,TEST_CASE_OK);
      basicTestDateTime('endDateTime', "12:00:00" ,TEST_CASE_NG);
      basicTestDateTime('endDateTime', "09/03" ,TEST_CASE_OK);
      basicTestDateTime('endDateTime', "09" ,TEST_CASE_OK);
      basicTestDateTime('endDateTime', "0" ,TEST_CASE_OK);
      basicTestDateTime('endDateTime', null ,TEST_CASE_NG);
      basicTestDateTime('endDateTime', undefined ,TEST_CASE_NG);
      basicTestDateTime('endDateTime', d.myConst.items.endDateTime.default ,TEST_CASE_OK);

      for(let _i = 0 ; _i < 128 ; ++_i){
        let _Y = Math.floor( Math.random() * ( 2200 - 2000 ) + 2000 );
        let _M = Math.floor( Math.random() * (   12 - 1 ) + 1 );
        let _D = Math.floor( Math.random() * (   31 - 1 ) + 1 );
        let _h = Math.floor( Math.random() * (   23 - 0 ) + 0 );
        let _m = Math.floor( Math.random() * (   59 - 0 ) + 0 );
        let _s = Math.floor( Math.random() * (   59 - 0 ) + 0 );
        const _testValue = `${_Y}-${_M}-${_D} ${_h}:${_m}:${_s}`;
        // console.log(_test);
        basicTestDateTime('startDateTime', _testValue ,TEST_CASE_OK);
        basicTestDateTime('endDateTime', _testValue ,TEST_CASE_OK);
      }

    });

  }

});