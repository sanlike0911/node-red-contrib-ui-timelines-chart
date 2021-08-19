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
            enableDateMarker: DEFALUT_ENABLE_DATE_MARKER
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
        const _util = util_1.default.getInstance();
        // group
        if (!_config || !_config.hasOwnProperty("group")) {
            _node.error(RED._("ui_timelines_chart.error.no-group"));
            return false;
        }
        // [xAxis]tick format
        if (!_config.hasOwnProperty("xTickFormat"))
            _config.xTickFormat = DEFAULT_X_TICK_FORMAT;
        if (!_util.isRegExp(_config.xTickFormat.toLowerCase(), _util.REG_EXPRESSTION_TO_MATCH_ONLY.DATETIME_FORMAT_AND_NOT_EMPTY)) {
            _node.warn(`The "x tick format: ${_config.xTickFormat}" is an incorrect.`);
            _config.xTickFormat = DEFAULT_X_TICK_FORMAT;
            _node.warn(`Update "x tick format" with the default value "${_config.xTickFormat}".`);
        }
        // [xAxis]start date time
        if (!_config.hasOwnProperty("startDateTime"))
            _config.startDateTime = BLANK_STRING;
        if (BLANK_STRING !== _config.startDateTime && !_util.isRegExp(_config.startDateTime, _util.REG_EXPRESSTION_TO_MATCH_ONLY.ISO8601_AND_NOT_EMPTY)) {
            _node.error(`The "start date: ${_config.startDateTime}" is an incorrect.`);
            return false;
        }
        // [xAxis]end date time
        if (!_config.hasOwnProperty("endDateTime"))
            _config.endDateTime = BLANK_STRING;
        if (BLANK_STRING !== _config.endDateTime && !_util.isRegExp(_config.endDateTime, _util.REG_EXPRESSTION_TO_MATCH_ONLY.ISO8601_AND_NOT_EMPTY)) {
            _node.error(`The "end date: ${_config.endDateTime}" is an incorrect.`);
            return false;
        }
        // [xAxis]labels font size
        if (!_config.hasOwnProperty("xAxisLabelsFontSize"))
            _config.xAxisLabelsFontSize = DEFALUT_X_AXIS_LABELS_FONT_SIZE;
        if (!_util.isRegExp(_config.xAxisLabelsFontSize, _util.REG_EXPRESSTION_TO_MATCH_ONLY.HALF_NUMBER_AND_NOT_EMPTY)) {
            _node.warn(`The "x axis labels font size" is an incorrect.`);
            _config.xAxisLabelsFontSize = DEFALUT_X_AXIS_LABELS_FONT_SIZE;
            _node.warn(`Update "x axis labels font size" with the default value "${_config.xAxisLabelsFontSize}".`);
        }
        // [xAxis]labels color
        if (!_config.hasOwnProperty("xAxisLabelslColor"))
            _config.xAxisLabelslColor = DEFALUT_X_AXIS_LABELS_COLOR;
        // [yAxis]labels font size
        if (!_config.hasOwnProperty("yAxisLabelsFontSize"))
            _config.yAxisLabelsFontSize = DEFALUT_Y_AXIS_LABELS_FONT_SIZE;
        if (!_util.isRegExp(_config.yAxisLabelsFontSize, _util.REG_EXPRESSTION_TO_MATCH_ONLY.HALF_NUMBER_AND_NOT_EMPTY)) {
            _node.warn(`The "y axis labels font size" is an incorrect.`);
            _config.yAxisLabelsFontSize = DEFALUT_Y_AXIS_LABELS_FONT_SIZE;
            _node.warn(`Update "y axis labels font size" with the default value "${_config.yAxisLabelsFontSize}".`);
        }
        // [yAxis]labels color
        if (!_config.hasOwnProperty("yAxisLabelslColor"))
            _config.yAxisLabelslColor = DEFALUT_Y_AXIS_LABELS_COLOR;
        // [reset zoom]label font size
        if (!_config.hasOwnProperty("resetZoomLabelFontSize"))
            _config.resetZoomLabelFontSize = DEFALUT_RESET_ZOOM_LABEL_FONT_SIZE;
        if (!_util.isRegExp(_config.resetZoomLabelFontSize, _util.REG_EXPRESSTION_TO_MATCH_ONLY.HALF_NUMBER_AND_NOT_EMPTY)) {
            _node.warn(`The "reset zoom label font size" is an incorrect.`);
            _config.resetZoomLabelFontSize = DEFALUT_RESET_ZOOM_LABEL_FONT_SIZE;
            _node.warn(`Update "reset zoom label font size" with the default value "${_config.resetZoomLabelFontSize}".`);
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
        if (!_config.hasOwnProperty("maxLineHeight"))
            _config.maxLineHeight = DEFAULT_LINE_HEIGHT;
        if (!_util.isRegExp(_config.maxLineHeight, _util.REG_EXPRESSTION_TO_MATCH_ONLY.HALF_NUMBER_AND_NOT_EMPTY)) {
            _node.warn(`The "max line height" is an incorrect.`);
            _config.maxLineHeight = DEFAULT_LINE_HEIGHT;
            _node.warn(`Update "max line height" with the default value "${_config.maxLineHeight}".`);
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
                        // $scope.inited = {};
                        /**
                         * update: chart
                         *
                         * @param {statusChart.makeGraphBase} msg
                         * @returns {boolean}
                         */
                        function update(msg) {
                            // console.log('update');
                            try {
                                const CHART_TOOTIP_CLASSNAME = 'chart-tooltip';
                                // if( $scope.inited['timelines-chart'] !== true || $scope.inited['moment'] !== true ){
                                //     console.log('script not loaded.');
                                //     return;
                                // }
                                if (undefined !== msg) {
                                    const _uniqueId = msg.id;
                                    let _chartTooltip;
                                    // get: parent div(timelines chart)
                                    const _parent = document.getElementById(_uniqueId);
                                    if (null === _parent) {
                                        return false;
                                    }
                                    while (_parent.lastChild) {
                                        _parent.removeChild(_parent.lastChild);
                                    }
                                    // remove: char-tooltip
                                    _chartTooltip = document.getElementsByClassName(CHART_TOOTIP_CLASSNAME);
                                    if (null !== _chartTooltip) {
                                        let _idx = 0;
                                        Array.from(_chartTooltip).forEach(_element => {
                                            if (`${CHART_TOOTIP_CLASSNAME}-${_uniqueId}-${_idx}` === _element.id) {
                                                _element.remove();
                                                ++_idx;
                                            }
                                        });
                                    }
                                    // create: chart script
                                    const _childScript = document.createElement('script');
                                    _childScript.type = 'text/javascript';
                                    _childScript.id = 'script_' + _uniqueId;
                                    _childScript.innerHTML = String.raw `
                                        TimelinesChart()(document.getElementById('${_uniqueId}'))
                                        .data(${JSON.stringify(msg.data)})
                                        .zScaleLabel('My Scale Units')
                                        .width(${_parent.clientWidth})
                                        // .maxHeight(${_parent.clientHeight})
                                        .maxLineHeight(${msg.configs.maxLineHeight.toString()})
                                        .topMargin(60)
                                        .rightMargin(90)
                                        .leftMargin(90)
                                        .bottomMargin(40)
                                        // .minSegmentDuration(100)
                                        .xTickFormat(n => moment(n).format('${msg.configs.xTickFormat}'))
                                        .timeFormat('%Y-%m-%d %H:%M:%S')
                                        .zQualitative(true)
                                        .enableOverview(true)
                                        .enableAnimations(${msg.configs.enableAnimations})
                                        .dateMarker(${msg.configs.enableDateMarker ? 'new Date()' : 'null'})
                                        .zoomX([moment('${msg.configs.startDateTime}'), moment('${msg.configs.endDateTime}')])
                                        .overviewDomain([moment('${msg.configs.startDateTime}'), moment('${msg.configs.endDateTime}')])
                                        .zColorScale().range(${JSON.stringify(msg.configs.zColorScale.range)}).domain(${JSON.stringify(msg.configs.zColorScale.domain)})
                                    `;
                                    _parent.appendChild(_childScript);
                                    // set element-id: char-tooltip
                                    _chartTooltip = document.getElementsByClassName(CHART_TOOTIP_CLASSNAME);
                                    if (null !== _chartTooltip) {
                                        let _idx = 0;
                                        Array.from(_chartTooltip).forEach(_element => {
                                            if ("" === _element.id) {
                                                _element.id = `${CHART_TOOTIP_CLASSNAME}-${_uniqueId}-${_idx}`;
                                                ++_idx;
                                            }
                                        });
                                    }
                                }
                                return true;
                            }
                            catch (error) {
                                console.log(error);
                                return false;
                            }
                        }
                        /**
                         * load script
                         *
                         * @param {string} _id
                         * @param {string} _path
                         */
                        function loadScript(_id, _path) {
                            // console.log('loadscript', _path);
                            const _head = document.getElementsByTagName('head')[0];
                            const _script = document.createElement('script');
                            _script.type = 'text/javascript';
                            _script.id = _id;
                            _script.src = _path;
                            _head.appendChild(_script);
                            // _script.onload = function () {
                            //     try {
                            //         $scope.inited[_id] = true;
                            //         console.log(`script loaded. id:${_id} inited:${$scope.inited[_id]}`);
                            //     } catch (error) {
                            //         console.log(error);
                            //     }
                            // }
                        }
                        $scope.init = function (config) {
                            // console.log('$scope.init');
                            $scope.config = config;
                            // timelines-chart
                            if (!document.getElementById('timelines-chart')) {
                                loadScript('timelines-chart', 'ui-timelines-chart/js/timelines-chart.min.js');
                            }
                            // moment
                            if (!document.getElementById('moment')) {
                                loadScript('moment', 'ui-timelines-chart/js/moment.js');
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
        try {
            // 処理結果
            let _makeMsg = DEFALUT_MAKE_GRAPH_BASE;
            // 処理開始
            _node.status({ fill: "blue", shape: "dot", text: "resources.message.connect" });
            // グラフ描画用データ
            const _graphData = _msg.payload;
            // 設定：開始日時(X軸)
            let _startDateTime = _config.startDateTime;
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
            // console.log(`_startDateTime: in:${_config.startDateTime} out:${_startDateTime}`);
            // 設定： 終了日時(X軸)
            let _endDateTime = _config.endDateTime;
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
            // console.log(`_endDateTime: in:${_config.endDateTime} out:${_endDateTime}`);
            // 設定：グラフ凡例
            let _zColorScale = { range: [], domain: [] };
            _config.graphColors.forEach((_ele, _idx) => {
                _zColorScale.range.push(_ele.statusColor);
                _zColorScale.domain.push(_ele.statusValue);
            });
            // データ判定
            if (_graphData.length > 0) {
                // データ格納処理
                _makeMsg = {
                    result: true,
                    id: _config.uniqueId,
                    data: _graphData,
                    configs: {
                        xTickFormat: _config.xTickFormat,
                        maxLineHeight: _config.maxLineHeight,
                        startDateTime: _startDateTime,
                        endDateTime: _endDateTime,
                        zColorScale: _zColorScale,
                        enableAnimations: _config.enableAnimations,
                        enableDateMarker: _config.enableDateMarker
                    }
                };
                _node.status({ fill: "green", shape: "dot", text: "resources.message.complete" });
            }
            // debug
            // console.log(_makeMsg);
            // debug
            return _makeMsg;
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