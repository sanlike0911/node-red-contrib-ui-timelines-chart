"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("./util"));
// import TimelinesChart from 'timelines-chart';
const nodeInit = (RED) => {
    // const parameters
    const DEFAULT_WIDGET_WIDTH = 6;
    const DEFAULT_WIDGET_HEIGHT = 8;
    const DEFAULT_STRING = '';
    // Holds a reference to node-red-dashboard module.
    // Initialized at #1.
    let ui = undefined;
    /**
     *
     *
     * @param {Node} _node
     * @param {statusChart.nodeConf} _conf
     * @returns
     */
    function checkConfig(_node, _conf) {
        if (!_conf || !_conf.hasOwnProperty("group")) {
            _node.error(RED._("ui_timelines_chart.error.no-group"));
            return false;
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
        // console.log(`makeHTML id:${_config.uniqueId}`);
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
            .container-${_config.uniqueId} { width:100%; padding: 0; margin: 0; font-size: 24px; }
            .graph-title-${_config.uniqueId} { padding: 10px 0 10px 0; font-size:32px; /*background-color: rgba(180,180,180,0.2); border-radius: 5px; border: 1px solid rgb(70,70,70,0.17);*/ }
            .timelines-chart .reset-zoom-btn { font-size: 16px !important; color: rgb(255, 255, 255) !important; }
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
                    emitOnlyNewValues: false,
                    forwardInputMessages: _config.fwdInMessages,
                    storeFrontEndInputAsState: _config.storeOutMessages,
                    convertBack: function (_value) {
                        return _value;
                    },
                    beforeEmit: function (_msg, _value) {
                        let _makeMsg = makeGraph(_node, _config, _msg);
                        return { msg: _makeMsg };
                    },
                    beforeSend: function (_msg, _original) {
                        if (_original) {
                            return _original.msg;
                        }
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
                         * @returns
                         */
                        function update(msg) {
                            // console.log('update');
                            // if( $scope.inited['timelines-chart'] !== true || $scope.inited['moment'] !== true ){
                            //     console.log('script not loaded.');
                            //     return;
                            // }
                            if (msg.graphItems !== undefined) {
                                // get: parent div(timelines chart)
                                const _parent = document.getElementById(msg.graphItems.id);
                                if (_parent === null) {
                                    return;
                                }
                                while (_parent.lastChild) {
                                    _parent.removeChild(_parent.lastChild);
                                }
                                // delete: char-tooltip
                                let _chartTooltip = document.getElementsByClassName('chart-tooltip');
                                console.log(_chartTooltip);
                                if (_chartTooltip !== null) {
                                    Array.from(_chartTooltip).forEach(_element => { console.log(_element); _element.remove(); });
                                }
                                // create: chart script
                                const _childScript = document.createElement('script');
                                _childScript.type = 'text/javascript';
                                _childScript.id = 'script_' + msg.graphItems.id;
                                _childScript.innerHTML = String.raw `
                                    TimelinesChart()(document.getElementById('${msg.graphItems.id}'))
                                    .data(${JSON.stringify(msg.graphItems.data)})
                                    .zScaleLabel('My Scale Units')
                                    .width(${_parent.clientWidth})
                                    // .maxHeight(${_parent.clientHeight})
                                    .maxLineHeight(${msg.graphItems.maxLineHeight})
                                    .topMargin(60)
                                    .rightMargin(90)
                                    .leftMargin(90)
                                    .bottomMargin(40)
                                    // .minSegmentDuration(100)
                                    .xTickFormat(n => moment(n).format('${msg.graphItems.xTickFormat}'))
                                    .timeFormat('%Y-%m-%d %H:%M:%S')
                                    .zQualitative(true)
                                    .enableOverview(true)
                                    .enableAnimations(true)
                                    // .dateMarker(new Date() - 365 * 24 * 60 * 60 * 1000)
                                    .zoomX([moment('${msg.graphItems.startDate}'), moment('${msg.graphItems.endDate}')])
                                    .overviewDomain([moment('${msg.graphItems.startDate}'), moment('${msg.graphItems.endDate}')])
                                    .zColorScale().range(${JSON.stringify(msg.graphItems.zColorScale.range)}).domain(${JSON.stringify(msg.graphItems.zColorScale.domain)})
                                `;
                                _parent.appendChild(_childScript);
                            }
                            return;
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
            const _util = util_1.default.getInstance();
            // 処理結果
            let _makeMsg = { result: false, graphItems: undefined };
            // 処理開始
            _node.status({ fill: "blue", shape: "dot", text: "resources.message.connect" });
            // グラフ描画用データ
            let _graphData = _msg.payload;
            // グラフ高さ
            const _maxLineHeight = _util.getSafeObject(_config.maxLineHeight, "60");
            // console.log(`_maxLineHeight: in:${_config.maxLineHeight} out:${_maxLineHeight}`);
            /* 入力値判定処理 */
            if (!_util.isRegExp(_maxLineHeight, _util.REG_EXPRESSTION_TO_MATCH_ONLY.HALF_NUMBER_AND_NOT_EMPTY))
                throw new Error(`the "max line height: ${_maxLineHeight}" is a format error. `);
            // 設定：日時フォーマット(X軸)
            const _xTickFormat = _util.getSafeObject(_config.dateformat, "YYYY-MM-DD HH:mm:ss");
            // console.log(`_xTickFormat: in:${_config.dateformat} out:${_xTickFormat}`);
            /* 入力値判定処理 */
            if (!_util.isRegExp(_xTickFormat.toLowerCase(), _util.REG_EXPRESSTION_TO_MATCH_ONLY.DATETIME_FORMAT_AND_NOT_EMPTY))
                throw new Error(`the "x tick format: ${_xTickFormat}" is a format error. `);
            // 設定：開始日時(X軸)
            let _startDate = _util.getSafeObject(_config.startDate, DEFAULT_STRING);
            // console.log(`_startDate: in:${_config.startDate} out:${_startDate}`);
            if (DEFAULT_STRING !== _startDate) {
                /* 入力値判定処理 */
                if (!_util.isRegExp(_startDate, _util.REG_EXPRESSTION_TO_MATCH_ONLY.ISO8601_AND_NOT_EMPTY))
                    throw new Error(`the "start date: ${_startDate}" is a format error. `);
            }
            else {
                let _min = "";
                _graphData.forEach((_ele, _idx) => {
                    _ele.data.forEach((_ele, _idx) => {
                        let _temp = _ele.data.reduce(function (a, b) { return a.timeRange[0] < b.timeRange[0] ? a : b; }).timeRange[0];
                        _min = (("" === _min || _min > _temp) ? _temp : _min);
                    });
                });
                _startDate = _min;
                // console.log(`update _startDate: ${_min}`);
            }
            // 設定： 終了日時(X軸)
            let _endDate = _util.getSafeObject(_config.endDate, DEFAULT_STRING);
            // console.log(`_endDate: in:${_config.endDate} out:${_endDate}`);
            if (DEFAULT_STRING !== _endDate) {
                /* 入力値判定処理 */
                if (!_util.isRegExp(_endDate, _util.REG_EXPRESSTION_TO_MATCH_ONLY.ISO8601_AND_NOT_EMPTY))
                    throw new Error(`the "end date:  ${_endDate}" is a format error.`);
            }
            else {
                let _max = "";
                _graphData.forEach((_ele, _idx) => {
                    _ele.data.forEach((_ele, _idx) => {
                        let _temp = _ele.data.reduce(function (a, b) { return a.timeRange[1] > b.timeRange[1] ? a : b; }).timeRange[1];
                        _max = (("" === _max || _max < _temp) ? _temp : _max);
                    });
                });
                _endDate = _max;
                // console.log(`update _endDate: ${_max}`);
            }
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
                    graphItems: {
                        id: _config.uniqueId,
                        data: _graphData,
                        xTickFormat: _xTickFormat,
                        maxLineHeight: _maxLineHeight,
                        startDate: _startDate,
                        endDate: _endDate,
                        zColorScale: _zColorScale,
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
            return { result: false, graphItems: undefined };
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