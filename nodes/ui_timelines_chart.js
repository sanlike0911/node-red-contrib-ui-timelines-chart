"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("./util"));
// import moment from 'moment';
// import TimelinesChart from 'timelines-chart';
const nodeInit = (RED) => {
    // const parameters
    const DEFAULT_WIDGET_WIDTH = 6;
    const DEFAULT_WIDGET_HEIGHT = 8;
    const DEFAULT_EMIT_ONLY_NEW_VALUES = false;
    const DEFAULT_FWD_IN_MESSAGES = false;
    const DEFAULT_STORE_OUT_MESSAGES = false;
    const BLANK_STRING = '';
    const DEFAULT_X_TICK_FORMAT = 'YYYY-MM-DD HH:mm:ss';
    const DEFAULT_LINE_HEIGHT = 60;
    const DEFALUT_ENABLE_ANIMATIONS = true;
    const DEFALUT_ENABLE_DATE_MARKER = false;
    const DEFALUT_X_AXIS_LABELS_FONT_SIZE = 16;
    const DEFALUT_X_AXIS_LABELS_COLOR = "lightslategray";
    const DEFALUT_Y_AXIS_LABELS_FONT_SIZE = 12;
    const DEFALUT_Y_AXIS_LABELS_COLOR = "lightslategray";
    const DEFALUT_RESET_ZOOM_LABEL_FONT_SIZE = 24;
    const DEFALUT_RESET_ZOOM_LABEL_COLOR = "bule";
    const DEFAULT_LINE_CORLOS = [];
    const DEFALUT_MAKE_GRAPH_BASE = {
        result: false,
        id: "",
        data: [],
        configs: {
            xTickFormat: DEFAULT_X_TICK_FORMAT,
            maxLineHeight: DEFAULT_LINE_HEIGHT,
            startDateTime: BLANK_STRING,
            endDateTime: BLANK_STRING,
            zColorScale: { range: [], domain: [] },
            enableAnimations: DEFALUT_ENABLE_ANIMATIONS,
            enableDateMarker: DEFALUT_ENABLE_DATE_MARKER,
            xAxisLabelsFontSize: DEFALUT_X_AXIS_LABELS_FONT_SIZE,
            xAxisLabelslColor: DEFALUT_X_AXIS_LABELS_COLOR,
            yAxisLabelsFontSize: DEFALUT_Y_AXIS_LABELS_FONT_SIZE,
            yAxisLabelslColor: DEFALUT_Y_AXIS_LABELS_COLOR,
            resetZoomLabelFontSize: DEFALUT_RESET_ZOOM_LABEL_FONT_SIZE,
            resetZoomLabelColor: DEFALUT_RESET_ZOOM_LABEL_COLOR
        }
    };
    // Holds a reference to node-red-dashboard module.
    // Initialized at #1.
    let ui = undefined;
    /**
     *
     *
     * @param {Node} _node
     * @param {statusChart.nodeConf} _config
     * @returns
     */
    function checkConfig(_node, _config) {
        var _a;
        const _util = util_1.default.getInstance();
        // group
        if (!_config || !_config.hasOwnProperty("group")) {
            _node.error(RED._("ui_timelines_chart.error.no-group"));
            return false;
        }
        // [xAxis]tick format
        {
            const _propertyName = "xTickFormat";
            if (!_config.hasOwnProperty(_propertyName) || !_util.isRegExp((_a = _config.xTickFormat) === null || _a === void 0 ? void 0 : _a.toLowerCase(), _util.REG_EXPRESSTION_TO_MATCH_ONLY.DATETIME_FORMAT_AND_NOT_EMPTY)) {
                _node.warn(`Incorrect ${_propertyName} value :"${_config.xTickFormat}". This ${_propertyName} was corrected with the default value. "${DEFAULT_X_TICK_FORMAT}".`);
                _config.xTickFormat = DEFAULT_X_TICK_FORMAT;
            }
        }
        // [xAxis]start date time
        {
            const _propertyName = "startDateTime";
            if (!_config.hasOwnProperty(_propertyName) || (BLANK_STRING !== _config.startDateTime && !_util.isRegExp(_config.startDateTime, _util.REG_EXPRESSTION_TO_MATCH_ONLY.ISO8601_AND_NOT_EMPTY))) {
                _node.error(`Incorrect ${_propertyName} value :"${_config.startDateTime}".`);
                return false;
            }
        }
        // [xAxis]end date time
        {
            const _propertyName = "endDateTime";
            if (!_config.hasOwnProperty(_propertyName) || (BLANK_STRING !== _config.endDateTime && !_util.isRegExp(_config.endDateTime, _util.REG_EXPRESSTION_TO_MATCH_ONLY.ISO8601_AND_NOT_EMPTY))) {
                _node.error(`Incorrect ${_propertyName} value :"${_config.endDateTime}".`);
                return false;
            }
        }
        // [xAxis]labels font size
        {
            const _propertyName = "xAxisLabelsFontSize";
            if (!_config.hasOwnProperty(_propertyName) || !_util.isRegExp(_config.xAxisLabelsFontSize, _util.REG_EXPRESSTION_TO_MATCH_ONLY.HALF_NUMBER_AND_NOT_EMPTY)) {
                _node.warn(`Incorrect ${_propertyName} value :"${_config.xAxisLabelsFontSize}". This ${_propertyName} was corrected with the default value. "${DEFALUT_X_AXIS_LABELS_FONT_SIZE}".`);
                _config.xAxisLabelsFontSize = DEFALUT_X_AXIS_LABELS_FONT_SIZE;
            }
        }
        // [xAxis]labels color
        if (!_config.hasOwnProperty("xAxisLabelslColor"))
            _config.xAxisLabelslColor = DEFALUT_X_AXIS_LABELS_COLOR;
        // [yAxis]labels font size
        {
            const _propertyName = "yAxisLabelsFontSize";
            if (!_config.hasOwnProperty(_propertyName) || !_util.isRegExp(_config.yAxisLabelsFontSize, _util.REG_EXPRESSTION_TO_MATCH_ONLY.HALF_NUMBER_AND_NOT_EMPTY)) {
                _node.warn(`Incorrect ${_propertyName} value :"${_config.yAxisLabelsFontSize}". This ${_propertyName} was corrected with the default value. "${DEFALUT_Y_AXIS_LABELS_FONT_SIZE}".`);
                _config.yAxisLabelsFontSize = DEFALUT_Y_AXIS_LABELS_FONT_SIZE;
            }
        }
        // [yAxis]labels color
        if (!_config.hasOwnProperty("yAxisLabelslColor"))
            _config.yAxisLabelslColor = DEFALUT_Y_AXIS_LABELS_COLOR;
        // [reset zoom]label font size
        {
            const _propertyName = "resetZoomLabelFontSize";
            if (!_config.hasOwnProperty(_propertyName) || !_util.isRegExp(_config.resetZoomLabelFontSize, _util.REG_EXPRESSTION_TO_MATCH_ONLY.HALF_NUMBER_AND_NOT_EMPTY)) {
                _node.warn(`Incorrect ${_propertyName} value :"${_config.resetZoomLabelFontSize}". This ${_propertyName} was corrected with the default value. "${DEFALUT_RESET_ZOOM_LABEL_FONT_SIZE}".`);
                _config.resetZoomLabelFontSize = DEFALUT_RESET_ZOOM_LABEL_FONT_SIZE;
            }
        }
        // [reset zoom]label color
        if (!_config.hasOwnProperty("resetZoomLabelColor"))
            _config.resetZoomLabelColor = DEFALUT_RESET_ZOOM_LABEL_COLOR;
        // [options]enable animations
        if (!_config.hasOwnProperty("enableAnimations"))
            _config.enableAnimations = DEFALUT_ENABLE_ANIMATIONS;
        // [options]enable date marker
        if (!_config.hasOwnProperty("enableDateMarker"))
            _config.enableDateMarker = DEFALUT_ENABLE_DATE_MARKER;
        // line height
        {
            const _propertyName = "maxLineHeight";
            if (!_config.hasOwnProperty(_propertyName) || !_util.isRegExp(_config.maxLineHeight, _util.REG_EXPRESSTION_TO_MATCH_ONLY.HALF_NUMBER_AND_NOT_EMPTY)) {
                _node.warn(`Incorrect ${_propertyName} value :"${_config.maxLineHeight}". This ${_propertyName} was corrected with the default value. "${DEFAULT_LINE_HEIGHT}".`);
                _config.maxLineHeight = DEFAULT_LINE_HEIGHT;
            }
        }
        return true;
    }
    /**
     *
     *
     * @param {number} [digits=1000]
     * @returns {string}
     */
    function getUniqueId(digits = 1000) {
        var strong = typeof digits !== 'undefined' ? digits : 1000;
        return Date.now().toString(16) + Math.floor(strong * Math.random()).toString(16);
    }
    ;
    /**
     * make html
     *
     * @param {statusChart.nodeConf} _config
     * @returns {string}
     */
    function makeHTML(_config) {
        // debug
        // console.log(`makeHTML id:${_config.graphItems.uniqueId}`);
        // debug
        const _configAsJson = JSON.stringify(_config);
        // const _loadScripts = String.raw`
        // <script src='http://localhost:1880/libs/timelines-chart.min.js'></script>
        // <script src='http://localhost:1880/libs/moment.js'></script>
        // <script src='http://localhost:1880/libs/locale/ja.js'></script>
        // `;
        const _html = String.raw `
        <div class='container-${_config.uniqueId}' align='center'>
            <!-- タイトル表示 -->
            <div class='graph-title-${_config.uniqueId}'>${_config.label}</div>
            <!-- グラフ表示 -->
            <div ng-init='init(${_configAsJson})' id='${_config.uniqueId}'></div>
        </div>
        `;
        const _css = String.raw `
        <!-- <style title="${_config.uniqueId}"> -->
        <style>
        .container-${_config.uniqueId} {
            width:100%;
            padding: 0;
            margin: 0;
            font-size: 24px;
        }
        .container-${_config.uniqueId} .graph-title-${_config.uniqueId} {
            padding: 10px 0 10px 0;
            font-size:32px;
        }
        .container-${_config.uniqueId} .timelines-chart .reset-zoom-btn {
            font-size: ${_config.resetZoomLabelFontSize}px !important;
            fill: ${_config.resetZoomLabelColor} !important;
        }
        .container-${_config.uniqueId} .timelines-chart .axises .x-axis text,
        .container-${_config.uniqueId} .brusher .tick text {
            font-size: ${_config.xAxisLabelsFontSize}px !important;
            fill: ${_config.xAxisLabelslColor} !important;
        }
        .container-${_config.uniqueId} .timelines-chart .axises .y-axis text,
        .container-${_config.uniqueId} .timelines-chart .axises .grp-axis text {
            font-size: ${_config.yAxisLabelsFontSize}px !important;
            fill: ${_config.yAxisLabelslColor} !important;
        }
        <\style>
        `;
        return String.raw `
            ${_html}
            ${_css}
        `;
    }
    /**
     * Node initialization function
     *
     * @param {Node} this
     * @param {statusChart.nodeConf} _config
     */
    function initWidget(_config) {
        const _node = this;
        let _done = null;
        let _graphObjects = DEFALUT_MAKE_GRAPH_BASE;
        try {
            if (ui === undefined) {
                // #1: Load node-red-dashboard module.
                // Should use RED.require API to cope with loading different
                // module.  And it should also be executed at node
                // initialization time to be loaded after initialization of
                // node-red-dashboard module.
                // 
                ui = RED.require("node-red-dashboard")(RED);
            }
            // Initialize node
            RED.nodes.createNode(this, _config);
            if (checkConfig(_node, _config)) {
                let _group = RED.nodes.getNode(_config.group);
                // console.log(`config.width: ${config.width}, config.height: ${config.height}`);
                let _width = DEFAULT_WIDGET_WIDTH; //default
                if (0 < Number(_config.width)) {
                    _width = Number(_config.width);
                }
                else if (0 < Number(_group.config.width)) {
                    _width = Number(_group.config.width);
                }
                let _height = DEFAULT_WIDGET_HEIGHT; //default
                if (0 < Number(_config.height)) {
                    _height = Number(_config.height);
                }
                // Generate uniqueId
                _config.uniqueId = getUniqueId();
                // Generate HTML/Angular code
                let _html = makeHTML(_config);
                //console.log("config:", _config);
                // Initialize Node-RED Dashboard widget
                // see details: https://github.com/node-red/node-red-ui-nodes/blob/master/docs/api.md
                //  #  name[*-optioal] ----------- description --------------------------------------
                //  1. node*                       制御ノード。スコープが「グローバル」の場合はオプション。
                //  2. format                      ウィジェットのHTMLコード。テンプレートダッシュボードウィジェットノードと同じHTMLを受け入れます。
                //  3. group*                      ィジェットが属するグループノードオブジェクト
                //  4. width*                      ウィジェットの幅
                //  5. height*                     ウィジェットの高さ
                //  6. templateScope               ウィジェットのスコープ（「グローバル」または「ローカル」）
                //  7. EmmitOnlyNewValues*         変更された場合はメッセージを送信する
                //  8. forwardInputMessages*       入力メッセージを出力に転送する
                //  9. storeFrontEndInputAsState*  受信したメッセージを保存する
                // 10. convert*                    値をフロントエンドに変換するためのコールバック
                // 11. beforeEmit*                 メッセージを準備するためのコールバック
                // 12. convertBack*                送信されたメッセージを変換するためのコールバック
                // 13. beforeSend*                 メッセージを準備するためのコールバック
                // 14. order                       グループで注文する
                // 15. initController*             コントローラで初期化するコールバック                
                _done = ui.addWidget({
                    node: _node,
                    format: _html,
                    group: _config.group,
                    width: _width,
                    height: _height,
                    templateScope: "local",
                    order: _config.order,
                    emitOnlyNewValues: DEFAULT_EMIT_ONLY_NEW_VALUES,
                    forwardInputMessages: DEFAULT_FWD_IN_MESSAGES,
                    storeFrontEndInputAsState: DEFAULT_STORE_OUT_MESSAGES,
                    convertBack: function (_value) {
                        return _value;
                    },
                    beforeEmit: function (_msg, _value) {
                        _graphObjects = makeGraph(_node, _config, _msg);
                        return { msg: _graphObjects };
                    },
                    beforeSend: function (_msg, _original) {
                        if (_msg) {
                            _msg.payload = _graphObjects;
                            return _msg;
                        }
                        // if (_original) { return _original.msg; }
                    },
                    initController: function ($scope, events) {
                        // Remark: all client-side functions should be added here!  
                        // If added above, it will be server-side functions which are not available at the client-side ...
                        // console.log('initController');
                        $scope.flag = true;
                        /**
                         * update: chart
                         *
                         * @param {statusChart.makeGraphBase} msg
                         * @returns {boolean}
                         */
                        function update(msg) {
                            var _a, _b;
                            // console.log('update');
                            try {
                                // Script load completed
                                const _scriptTimelinesChart = ((_a = document.getElementById('timelines-chart')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-inited')) || "false";
                                const _scriptMomentChart = ((_b = document.getElementById('moment')) === null || _b === void 0 ? void 0 : _b.getAttribute('data-inited')) || "false";
                                if ("true" !== _scriptTimelinesChart || "true" !== _scriptMomentChart) {
                                    // console.log(`script not loaded. id:${msg.id}`);
                                    // console.log(`_scriptTimelinesChart: ${_scriptTimelinesChart}`);
                                    // console.log(`_scriptMomentChart: ${_scriptMomentChart}`);
                                    return false;
                                }
                                if (undefined !== msg) {
                                    const _uniqueId = msg.id;
                                    // get: parent div(timelines chart)
                                    const _parent = document.getElementById(_uniqueId);
                                    if (null === _parent) {
                                        return false;
                                    }
                                    // timelines chart: static script
                                    {
                                        const _staticScriptID = "script_static_" + _uniqueId;
                                        const _staticScript = document.getElementById(_staticScriptID);
                                        if (null === _staticScript) {
                                            // console.log(`create static timelines-chart id:${_staticScriptID}`);
                                            const _createStatcScript = document.createElement('script');
                                            _createStatcScript.type = 'text/javascript';
                                            _createStatcScript.id = _staticScriptID;
                                            _createStatcScript.innerHTML = String.raw `
                                            // const styleSheet${_uniqueId} = utility.getStyleSheet('${_uniqueId}');
                                            const timelinesChart${_uniqueId} = {
                                                instance: TimelinesChart()(document.getElementById('${_uniqueId}')),
                                                currentZoomX: [],
                                                currentZoomY: [],
                                                ruleStylexAxisLabels: utility.getStyleRule('.container-${_uniqueId} .timelines-chart .axises .x-axis text, .container-${_uniqueId} .brusher .tick text'),
                                                ruleStyleyAxisLabels: utility.getStyleRule('.container-${_uniqueId} .timelines-chart .axises .y-axis text, .container-${_uniqueId} .timelines-chart .axises .grp-axis text'),
                                                ruleStyleResetZoomLabel: utility.getStyleRule('.container-${_uniqueId} .timelines-chart .reset-zoom-btn')
                                            }
                                            // console.log("styleSheet${_uniqueId}:", styleSheet${_uniqueId});
                                            // console.log("timelinesChart${_uniqueId}.ruleStylexAxisLabels :", timelinesChart${_uniqueId}.ruleStylexAxisLabels);
                                            // console.log("timelinesChart${_uniqueId}.ruleStyleyAxisLabels :", timelinesChart${_uniqueId}.ruleStyleyAxisLabels);
                                            // console.log("timelinesChart${_uniqueId}.ruleStyleResetZoomLabel :", timelinesChart${_uniqueId}.ruleStyleResetZoomLabel);
                                            `;
                                            _parent.appendChild(_createStatcScript);
                                        }
                                    }
                                    // timelines chart: dynamic script
                                    {
                                        const _dynamicScriptID = "script_dynamic_" + _uniqueId;
                                        const _dynamicScript = document.getElementById(_dynamicScriptID);
                                        if (null !== _dynamicScript) {
                                            // console.log(`update dynamic timelines-chart id:${_dynamicScriptID}`);
                                            _dynamicScript.remove();
                                        }
                                        const _createDynamicScript = document.createElement('script');
                                        _createDynamicScript.type = 'text/javascript';
                                        _createDynamicScript.id = _dynamicScriptID;
                                        _createDynamicScript.innerHTML = String.raw `
                                        {
                                            const _chartobj = timelinesChart${_uniqueId}
                                            if(_chartobj){
                                                /* css */
                                                _chartobj.ruleStylexAxisLabels.style.cssText    = 'font-size: ${msg.configs.xAxisLabelsFontSize}px !important; fill: ${msg.configs.xAxisLabelslColor} !important';
                                                _chartobj.ruleStyleyAxisLabels.style.cssText    = 'font-size: ${msg.configs.yAxisLabelsFontSize}px !important; fill: ${msg.configs.yAxisLabelslColor} !important';
                                                _chartobj.ruleStyleResetZoomLabel.style.cssText = 'font-size: ${msg.configs.resetZoomLabelFontSize}px !important; fill: ${msg.configs.resetZoomLabelColor} !important';
    
                                                /* chart */
                                                _chartobj.instance
                                                    .data(${JSON.stringify(msg.data)})
                                                    .width(${_parent.clientWidth})
                                                    // .maxHeight(${_parent.clientHeight})
                                                    .maxLineHeight(${msg.configs.maxLineHeight.toString()})
                                                    .topMargin(60)
                                                    .rightMargin(90)
                                                    .leftMargin(90)
                                                    .bottomMargin(40)
                                                    .xTickFormat(n => moment(n).format('${msg.configs.xTickFormat}'))
                                                    .timeFormat('%Y-%m-%d %H:%M:%S')
                                                    .zQualitative(true)
                                                    .enableOverview(true)
                                                    .enableAnimations(${msg.configs.enableAnimations})
                                                    .dateMarker(${msg.configs.enableDateMarker ? 'new Date()' : 'null'})
                                                    .zoomX((_chartobj.currentZoomX?.length) ? _chartobj.currentZoomX : [moment('${msg.configs.startDateTime}'), moment('${msg.configs.endDateTime}')])
                                                    .zoomY((_chartobj.currentZoomY?.length) ? _chartobj.currentZoomY : [])
                                                    .onZoom((x,y)=>{ _chartobj.currentZoomX=x; _chartobj.currentZoomY=y; })
                                                    .overviewDomain([moment('${msg.configs.startDateTime}'), moment('${msg.configs.endDateTime}')])
                                                    .zColorScale().range(${JSON.stringify(msg.configs.zColorScale.range)}).domain(${JSON.stringify(msg.configs.zColorScale.domain)})
                                            }
                                        }
                                        `;
                                        _parent.appendChild(_createDynamicScript);
                                    }
                                }
                                return true;
                            }
                            catch (error) {
                                console.log(error);
                                return false;
                            }
                        }
                        function loadScript(_id, _path) {
                            // console.log('loadscript', _path);
                            const _head = document.getElementsByTagName('head')[0];
                            const _script = document.createElement('script');
                            _script.type = 'text/javascript';
                            _script.id = _id;
                            _script.src = _path;
                            _script.async = false;
                            _head.appendChild(_script);
                            _script.onload = function () {
                                try {
                                    // console.log(`script loaded. id:${_id}`);
                                    _script.setAttribute('data-inited', "true");
                                }
                                catch (error) {
                                    console.log(error);
                                }
                            };
                        }
                        $scope.init = function (config) {
                            // console.log('$scope.init');
                            $scope.config = config;
                            // timelines-chart
                            if (!document.getElementById('timelines-chart')) {
                                // console.log(`loadScript timelines-chart id:${config.uniqueId}`);
                                loadScript('timelines-chart', 'ui-timelines-chart/js/timelines-chart.min.js');
                            }
                            // moment
                            if (!document.getElementById('moment')) {
                                // console.log(`loadScript moment id:${config.uniqueId}`);
                                loadScript('moment', 'ui-timelines-chart/js/moment.min.js');
                            }
                            // utility
                            if (!document.getElementById('utility')) {
                                // console.log(`loadScript moment id:${config.uniqueId}`);
                                loadScript('utility', 'ui-timelines-chart/js/utility.js');
                            }
                        };
                        $scope.$watch('msg', function (msg) {
                            // console.log('$scope.$watch');
                            if (!msg) {
                                return;
                            }
                            if (msg.result === true) {
                                update(msg);
                            }
                        });
                        $scope.$on('$destroy', function () {
                            if ($scope.hold) {
                            }
                        });
                    }
                });
            }
            else {
                throw new Error(`The "config" is incorrect.`);
            }
        }
        catch (_error) {
            _node.status({ fill: "red", shape: "ring", text: "resources.message.error" });
            _node.error(_error);
        }
        _node.on("close", function () {
            if (_done) {
                // finalize widget on close
                _done();
            }
        });
    }
    /**
     * makeGraph
     *
     * @param {Node} _node
     * @param {statusChart.nodeConf} _config
     * @param {statusChart.inputNodeMsg} _msg
     * @returns {statusChart.makeGraphBase}
     */
    function makeGraph(_node, _config, _msg) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42;
        try {
            // 処理開始
            _node.status({ fill: "blue", shape: "dot", text: "resources.message.connect" });
            // グラフ描画用データ
            if (typeof _msg.payload.dataItems !== 'object' || 0 >= ((_b = (_a = _msg.payload) === null || _a === void 0 ? void 0 : _a.dataItems) === null || _b === void 0 ? void 0 : _b.length)) {
                throw new Error("data not found.");
            }
            const _graphData = _msg.payload.dataItems;
            // configs(priority: input > node property)
            const _createConf = {
                /*  values                  node-in: msg.payload.settings                          node-property                       default                          */
                xTickFormat: (_g = (_f = (_e = (_d = (_c = _msg.payload) === null || _c === void 0 ? void 0 : _c.settings) === null || _d === void 0 ? void 0 : _d.xAxis) === null || _e === void 0 ? void 0 : _e.xTickFormat) !== null && _f !== void 0 ? _f : _config.xTickFormat) !== null && _g !== void 0 ? _g : DEFAULT_X_TICK_FORMAT,
                xAxisLabelsFontSize: (_m = (_l = (_k = (_j = (_h = _msg.payload) === null || _h === void 0 ? void 0 : _h.settings) === null || _j === void 0 ? void 0 : _j.xAxis) === null || _k === void 0 ? void 0 : _k.labelsFontSize) !== null && _l !== void 0 ? _l : _config.xAxisLabelsFontSize) !== null && _m !== void 0 ? _m : DEFALUT_X_AXIS_LABELS_FONT_SIZE,
                xAxisLabelslColor: (_s = (_r = (_q = (_p = (_o = _msg.payload) === null || _o === void 0 ? void 0 : _o.settings) === null || _p === void 0 ? void 0 : _p.xAxis) === null || _q === void 0 ? void 0 : _q.labelsColor) !== null && _r !== void 0 ? _r : _config.xAxisLabelslColor) !== null && _s !== void 0 ? _s : DEFALUT_X_AXIS_LABELS_COLOR,
                startDateTime: (_x = (_w = (_v = (_u = (_t = _msg.payload) === null || _t === void 0 ? void 0 : _t.settings) === null || _u === void 0 ? void 0 : _u.xAxis) === null || _v === void 0 ? void 0 : _v.startDateTime) !== null && _w !== void 0 ? _w : _config.startDateTime) !== null && _x !== void 0 ? _x : BLANK_STRING,
                endDateTime: (_2 = (_1 = (_0 = (_z = (_y = _msg.payload) === null || _y === void 0 ? void 0 : _y.settings) === null || _z === void 0 ? void 0 : _z.xAxis) === null || _0 === void 0 ? void 0 : _0.endDateTime) !== null && _1 !== void 0 ? _1 : _config.endDateTime) !== null && _2 !== void 0 ? _2 : BLANK_STRING,
                yAxisLabelsFontSize: (_7 = (_6 = (_5 = (_4 = (_3 = _msg.payload) === null || _3 === void 0 ? void 0 : _3.settings) === null || _4 === void 0 ? void 0 : _4.yAxis) === null || _5 === void 0 ? void 0 : _5.labelsFontSize) !== null && _6 !== void 0 ? _6 : _config.yAxisLabelsFontSize) !== null && _7 !== void 0 ? _7 : DEFALUT_Y_AXIS_LABELS_FONT_SIZE,
                yAxisLabelslColor: (_12 = (_11 = (_10 = (_9 = (_8 = _msg.payload) === null || _8 === void 0 ? void 0 : _8.settings) === null || _9 === void 0 ? void 0 : _9.yAxis) === null || _10 === void 0 ? void 0 : _10.labelsColor) !== null && _11 !== void 0 ? _11 : _config.yAxisLabelslColor) !== null && _12 !== void 0 ? _12 : DEFALUT_Y_AXIS_LABELS_COLOR,
                resetZoomLabelFontSize: (_17 = (_16 = (_15 = (_14 = (_13 = _msg.payload) === null || _13 === void 0 ? void 0 : _13.settings) === null || _14 === void 0 ? void 0 : _14.resetZoom) === null || _15 === void 0 ? void 0 : _15.labelFontSize) !== null && _16 !== void 0 ? _16 : _config.resetZoomLabelFontSize) !== null && _17 !== void 0 ? _17 : DEFALUT_RESET_ZOOM_LABEL_FONT_SIZE,
                resetZoomLabelColor: (_22 = (_21 = (_20 = (_19 = (_18 = _msg.payload) === null || _18 === void 0 ? void 0 : _18.settings) === null || _19 === void 0 ? void 0 : _19.resetZoom) === null || _20 === void 0 ? void 0 : _20.labelColor) !== null && _21 !== void 0 ? _21 : _config.resetZoomLabelColor) !== null && _22 !== void 0 ? _22 : DEFALUT_RESET_ZOOM_LABEL_COLOR,
                maxLineHeight: (_27 = (_26 = (_25 = (_24 = (_23 = _msg.payload) === null || _23 === void 0 ? void 0 : _23.settings) === null || _24 === void 0 ? void 0 : _24.chart) === null || _25 === void 0 ? void 0 : _25.height) !== null && _26 !== void 0 ? _26 : _config.maxLineHeight) !== null && _27 !== void 0 ? _27 : DEFAULT_LINE_HEIGHT,
                lineColors: (_32 = (_31 = (_30 = (_29 = (_28 = _msg.payload) === null || _28 === void 0 ? void 0 : _28.settings) === null || _29 === void 0 ? void 0 : _29.chart) === null || _30 === void 0 ? void 0 : _30.lineColors) !== null && _31 !== void 0 ? _31 : _config.lineColors) !== null && _32 !== void 0 ? _32 : DEFAULT_LINE_CORLOS,
                enableAnimations: (_37 = (_36 = (_35 = (_34 = (_33 = _msg.payload) === null || _33 === void 0 ? void 0 : _33.settings) === null || _34 === void 0 ? void 0 : _34.options) === null || _35 === void 0 ? void 0 : _35.enableAnimations) !== null && _36 !== void 0 ? _36 : _config.enableAnimations) !== null && _37 !== void 0 ? _37 : DEFALUT_ENABLE_ANIMATIONS,
                enableDateMarker: (_42 = (_41 = (_40 = (_39 = (_38 = _msg.payload) === null || _38 === void 0 ? void 0 : _38.settings) === null || _39 === void 0 ? void 0 : _39.options) === null || _40 === void 0 ? void 0 : _40.enableDateMarker) !== null && _41 !== void 0 ? _41 : _config.enableDateMarker) !== null && _42 !== void 0 ? _42 : DEFALUT_ENABLE_DATE_MARKER,
            };
            /* debug */
            // for (const [key, value] of Object.entries(_createConf)) {
            //     console.log(`[config] ${key}: ${value}`);
            // }
            /* debug */
            // 設定：開始日時(X軸)
            let _startDateTime = _createConf.startDateTime;
            if (BLANK_STRING === _startDateTime) {
                let _min = "";
                _graphData.forEach((_ele, _idx) => {
                    _ele.data.forEach((_ele, _idx) => {
                        let _temp = _ele.data.reduce(function (a, b) { return a.timeRange[0] < b.timeRange[0] ? a : b; }).timeRange[0];
                        _min = (("" === _min || _min > _temp) ? _temp : _min);
                    });
                });
                _startDateTime = _min;
            }
            // console.log(`_startDateTime: in:${_createConf.startDateTime} out:${_startDateTime}`);
            // 設定： 終了日時(X軸)
            let _endDateTime = _createConf.endDateTime;
            if (BLANK_STRING === _endDateTime) {
                let _max = "";
                _graphData.forEach((_ele, _idx) => {
                    _ele.data.forEach((_ele, _idx) => {
                        let _temp = _ele.data.reduce(function (a, b) { return a.timeRange[1] > b.timeRange[1] ? a : b; }).timeRange[1];
                        _max = (("" === _max || _max < _temp) ? _temp : _max);
                    });
                });
                _endDateTime = _max;
            }
            // console.log(`_endDateTime: in:${_createConf.endDateTime} out:${_endDateTime}`);
            // 設定：グラフ凡例
            let _zColorScale = { range: [], domain: [] };
            if (0 < _createConf.lineColors.length) {
                _createConf.lineColors.forEach((_ele, _idx) => {
                    _zColorScale.range.push(_ele.statusColor);
                    _zColorScale.domain.push(_ele.statusValue);
                });
            }
            // 処理完了
            _node.status({ fill: "green", shape: "dot", text: "resources.message.complete" });
            return {
                result: true,
                id: _config.uniqueId,
                data: _graphData,
                configs: {
                    xTickFormat: _createConf.xTickFormat,
                    xAxisLabelsFontSize: _createConf.xAxisLabelsFontSize,
                    xAxisLabelslColor: _createConf.xAxisLabelslColor,
                    startDateTime: _startDateTime,
                    endDateTime: _endDateTime,
                    yAxisLabelsFontSize: _createConf.yAxisLabelsFontSize,
                    yAxisLabelslColor: _createConf.yAxisLabelslColor,
                    resetZoomLabelFontSize: _createConf.resetZoomLabelFontSize,
                    resetZoomLabelColor: _createConf.resetZoomLabelColor,
                    maxLineHeight: _createConf.maxLineHeight,
                    zColorScale: _zColorScale,
                    enableAnimations: _createConf.enableAnimations,
                    enableDateMarker: _createConf.enableDateMarker,
                }
            };
        }
        catch (_error) {
            _node.status({ fill: "red", shape: "ring", text: "resources.message.error" });
            _node.error(_error);
            return DEFALUT_MAKE_GRAPH_BASE;
        }
    }
    RED.nodes.registerType('ui_timelines_chart', initWidget);
    let _uipath = 'ui';
    if (RED.settings.ui) {
        _uipath = RED.settings.ui.path;
    }
    let _fullPath = path_1.default.join('/', _uipath, '/ui-timelines-chart/*').replace(/\\/g, '/');
    RED.httpNode.get(_fullPath, function (req, res) {
        var options = {
            root: __dirname + '/lib/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
};
module.exports = nodeInit;
//# sourceMappingURL=ui_timelines_chart.js.map