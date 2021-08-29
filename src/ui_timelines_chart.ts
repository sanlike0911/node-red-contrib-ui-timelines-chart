import { NodeInitializer, Node } from "node-red";
import statusChart from "./type";
import path from "path";
import util from "./util";
// import moment from 'moment';
// import TimelinesChart from 'timelines-chart';

const nodeInit: NodeInitializer = (RED): void => {

    // const parameters
    const DEFAULT_WIDGET_WIDTH: number = 6;
    const DEFAULT_WIDGET_HEIGHT: number = 8;
    const DEFAULT_EMIT_ONLY_NEW_VALUES: boolean = false;
    const DEFAULT_FWD_IN_MESSAGES: boolean = false;
    const DEFAULT_STORE_OUT_MESSAGES: boolean = false;

    const BLANK_STRING: string = '';
    const DEFAULT_X_TICK_FORMAT: string = 'YYYY-MM-DD HH:mm:ss';
    const DEFAULT_LINE_HEIGHT: number = 60;
    const DEFALUT_ENABLE_ANIMATIONS: boolean = true;
    const DEFALUT_ENABLE_DATE_MARKER: boolean = false;
    const DEFALUT_X_AXIS_LABELS_FONT_SIZE = 16;
    const DEFALUT_X_AXIS_LABELS_COLOR: string = "lightslategray";
    const DEFALUT_Y_AXIS_LABELS_FONT_SIZE: number = 12;
    const DEFALUT_Y_AXIS_LABELS_COLOR: string = "lightslategray";
    const DEFALUT_RESET_ZOOM_LABEL_FONT_SIZE: number = 24;
    const DEFALUT_RESET_ZOOM_LABEL_COLOR: string = "bule";
    const DEFAULT_LINE_CORLOS: object[] = [];

    const DEFALUT_MAKE_GRAPH_BASE: statusChart.makeGraphBase = {
        result: false,
        id: "",
        data: [],
        configs: {
            xTickFormat: DEFAULT_X_TICK_FORMAT,
            maxLineHeight: DEFAULT_LINE_HEIGHT,
            startDateTime: BLANK_STRING,
            endDateTime: BLANK_STRING,
            zColorScale: { range:[], domain:[] },
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
    let ui: any = undefined;

    /**
     *
     *
     * @param {Node} _node
     * @param {statusChart.nodeConf} _config
     * @returns
     */
    function checkConfig(_node: Node, _config: statusChart.nodeConf) {
        const _util: util = util.getInstance();

        // group
        if (!_config || !_config.hasOwnProperty("group")) {
            _node.error(RED._("ui_timelines_chart.error.no-group"));
            return false;
        }

        // [xAxis]tick format
        {
            const _propertyName: string = "xTickFormat";
            if (!_config.hasOwnProperty(_propertyName) || !_util.isRegExp(_config.xTickFormat?.toLowerCase(), _util.REG_EXPRESSTION_TO_MATCH_ONLY.DATETIME_FORMAT_AND_NOT_EMPTY)) {
                _node.warn(`Incorrect ${_propertyName} value :"${_config.xTickFormat}". This ${_propertyName} was corrected with the default value. "${DEFAULT_X_TICK_FORMAT}".`);
                _config.xTickFormat = DEFAULT_X_TICK_FORMAT;
            }
        }

        // [xAxis]start date time
        {
            const _propertyName: string = "startDateTime";
            if (!_config.hasOwnProperty(_propertyName) || (BLANK_STRING !== _config.startDateTime && !_util.isRegExp(_config.startDateTime, _util.REG_EXPRESSTION_TO_MATCH_ONLY.ISO8601_AND_NOT_EMPTY))) {
                _node.error(`Incorrect ${_propertyName} value :"${_config.startDateTime}".`);
                return false;
            }
        }

        // [xAxis]end date time
        {
            const _propertyName: string = "endDateTime";
            if (!_config.hasOwnProperty(_propertyName) || (BLANK_STRING !== _config.endDateTime && !_util.isRegExp(_config.endDateTime, _util.REG_EXPRESSTION_TO_MATCH_ONLY.ISO8601_AND_NOT_EMPTY))) {
                _node.error(`Incorrect ${_propertyName} value :"${_config.endDateTime}".`);
                return false;
            }
        }

        // [xAxis]labels font size
        {
            const _propertyName: string = "xAxisLabelsFontSize";
            if (!_config.hasOwnProperty(_propertyName) || !_util.isRegExp(_config.xAxisLabelsFontSize, _util.REG_EXPRESSTION_TO_MATCH_ONLY.HALF_NUMBER_AND_NOT_EMPTY)) {
                _node.warn(`Incorrect ${_propertyName} value :"${_config.xAxisLabelsFontSize}". This ${_propertyName} was corrected with the default value. "${DEFALUT_X_AXIS_LABELS_FONT_SIZE}".`);
                _config.xAxisLabelsFontSize = DEFALUT_X_AXIS_LABELS_FONT_SIZE;
            }
        }

        // [xAxis]labels color
        if (!_config.hasOwnProperty("xAxisLabelslColor")) _config.xAxisLabelslColor = DEFALUT_X_AXIS_LABELS_COLOR;

        // [yAxis]labels font size
        {
            const _propertyName: string = "yAxisLabelsFontSize";
            if (!_config.hasOwnProperty(_propertyName) || !_util.isRegExp(_config.yAxisLabelsFontSize, _util.REG_EXPRESSTION_TO_MATCH_ONLY.HALF_NUMBER_AND_NOT_EMPTY)) {
                _node.warn(`Incorrect ${_propertyName} value :"${_config.yAxisLabelsFontSize}". This ${_propertyName} was corrected with the default value. "${DEFALUT_Y_AXIS_LABELS_FONT_SIZE}".`);
                _config.yAxisLabelsFontSize = DEFALUT_Y_AXIS_LABELS_FONT_SIZE;
            }
        }

        // [yAxis]labels color
        if (!_config.hasOwnProperty("yAxisLabelslColor")) _config.yAxisLabelslColor = DEFALUT_Y_AXIS_LABELS_COLOR;

        // [reset zoom]label font size
        {
            const _propertyName: string = "resetZoomLabelFontSize";
            if (!_config.hasOwnProperty(_propertyName) || !_util.isRegExp(_config.resetZoomLabelFontSize, _util.REG_EXPRESSTION_TO_MATCH_ONLY.HALF_NUMBER_AND_NOT_EMPTY)) {
                _node.warn(`Incorrect ${_propertyName} value :"${_config.resetZoomLabelFontSize}". This ${_propertyName} was corrected with the default value. "${DEFALUT_RESET_ZOOM_LABEL_FONT_SIZE}".`);
                _config.resetZoomLabelFontSize = DEFALUT_RESET_ZOOM_LABEL_FONT_SIZE;
            }
        }

        // [reset zoom]label color
        if (!_config.hasOwnProperty("resetZoomLabelColor")) _config.resetZoomLabelColor = DEFALUT_RESET_ZOOM_LABEL_COLOR;

        // [options]enable animations
        if (!_config.hasOwnProperty("enableAnimations")) _config.enableAnimations = DEFALUT_ENABLE_ANIMATIONS;

        // [options]enable date marker
        if (!_config.hasOwnProperty("enableDateMarker")) _config.enableDateMarker = DEFALUT_ENABLE_DATE_MARKER;

        // line height
        {
            const _propertyName: string = "maxLineHeight";
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
    function getUniqueId(digits: number = 1000): string {
        var strong = typeof digits !== 'undefined' ? digits : 1000;
        return Date.now().toString(16) + Math.floor(strong * Math.random()).toString(16);
    };

    /**
     * make html
     *
     * @param {statusChart.nodeConf} _config
     * @returns {string}
     */
    function makeHTML(_config: statusChart.nodeConf): string {
        // debug
        // console.log(`makeHTML id:${_config.graphItems.uniqueId}`);
        // debug

        const _configAsJson = JSON.stringify(_config);

        // const _loadScripts = String.raw`
        // <script src='http://localhost:1880/libs/timelines-chart.min.js'></script>
        // <script src='http://localhost:1880/libs/moment.js'></script>
        // <script src='http://localhost:1880/libs/locale/ja.js'></script>
        // `;

        const _html = String.raw`
        <div class='container-${_config.uniqueId}' align='center'>
            <!-- タイトル表示 -->
            <div class='graph-title-${_config.uniqueId}'>${_config.label}</div>
            <!-- グラフ表示 -->
            <div ng-init='init(${_configAsJson})' id='${_config.uniqueId}'></div>
        </div>
        `;

        const _css = String.raw`
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

        return String.raw`
            ${_html}
            ${_css}
        `
    }

    /**
     * Node initialization function
     *
     * @param {Node} this
     * @param {statusChart.nodeConf} _config
     */
    function initWidget(this: Node, _config: statusChart.nodeConf): void {
        const _node: Node = this;
        let _done: any = null;
        let _graphObjects:statusChart.makeGraphBase = DEFALUT_MAKE_GRAPH_BASE;
        try {

            if(ui === undefined) {
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

                let _group: any = RED.nodes.getNode(_config.group);
                // console.log(`config.width: ${config.width}, config.height: ${config.height}`);

                let _width: number = DEFAULT_WIDGET_WIDTH;  //default
                if(0 < Number(_config.width)) {
                    _width = Number(_config.width);
                } else if(0 < Number(_group.config.width)){
                    _width = Number(_group.config.width);
                }

                let _height: number = DEFAULT_WIDGET_HEIGHT;  //default
                if(0 < Number(_config.height)) {
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
                    node: _node,              // controlling node
                    format: _html,            // HTML/Angular code
                    group: _config.group,     // belonging Dashboard group
                    width: _width,            // width of widget
                    height: _height,          // height of widget
                    templateScope: "local",   // scope of HTML/Angular(local/global)*
                    order: _config.order,      // order
                    emitOnlyNewValues: DEFAULT_EMIT_ONLY_NEW_VALUES,  // send message if changed
                    forwardInputMessages: DEFAULT_FWD_IN_MESSAGES,    // forward input messages to output
                    storeFrontEndInputAsState: DEFAULT_STORE_OUT_MESSAGES,    // store received message
                    convertBack: function (_value: statusChart.graphData) { // callback to convert value to front-end
                        return _value;
                    },
                    beforeEmit: function(_msg: statusChart.inputNodeMsg, _value: statusChart.graphData): { msg: statusChart.makeGraphBase } {
                        _graphObjects = makeGraph(_node, _config, _msg);
                        return { msg: _graphObjects };
                    },
                    beforeSend: function (_msg: statusChart.inputNodeMsg, _original: {msg:statusChart.inputNodeMsg}) {
                        if(_msg) {
                            _msg.payload = <any>_graphObjects;
                            return _msg;
                        }
                        // if (_original) { return _original.msg; }
                    },
                    initController: function($scope: any, events: any) {
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
                        function update(msg: statusChart.makeGraphBase): boolean {
                            // console.log('update');
                            try {

                                // Script load completed
                                const _scriptTimelinesChart = document.getElementById('timelines-chart')?.getAttribute('data-inited') || "false";
                                const _scriptMomentChart = document.getElementById('moment')?.getAttribute('data-inited') || "false";
                                if( "true" !== _scriptTimelinesChart || "true" !== _scriptMomentChart ){
                                    // console.log(`script not loaded. id:${msg.id}`);
                                    // console.log(`_scriptTimelinesChart: ${_scriptTimelinesChart}`);
                                    // console.log(`_scriptMomentChart: ${_scriptMomentChart}`);
                                    return false;
                                }

                                if( undefined !== msg ) {
                                    const _uniqueId = msg.id;

                                    // get: parent div(timelines chart)
                                    const _parent: HTMLElement | null = document.getElementById(_uniqueId);
                                    if( null === _parent ){
                                        return false;
                                    }

                                    // timelines chart: static script
                                    {
                                        const _staticScriptID: string = "script_static_" + _uniqueId;
                                        const _staticScript = document.getElementById(_staticScriptID);
                                        if( null === _staticScript ){
                                            // console.log(`create static timelines-chart id:${_staticScriptID}`);
                                            const _createStatcScript = document.createElement('script');
                                            _createStatcScript.type = 'text/javascript';
                                            _createStatcScript.id = _staticScriptID;
                                            _createStatcScript.innerHTML = String.raw`
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
                                        const _dynamicScriptID: string ="script_dynamic_" + _uniqueId;
                                        const _dynamicScript = document.getElementById(_dynamicScriptID);
                                        if( null !== _dynamicScript ){
                                            // console.log(`update dynamic timelines-chart id:${_dynamicScriptID}`);
                                            _dynamicScript.remove();
                                        }
                                        const _createDynamicScript = document.createElement('script');
                                        _createDynamicScript.type = 'text/javascript';
                                        _createDynamicScript.id = _dynamicScriptID;
                                        _createDynamicScript.innerHTML = String.raw`
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
                            } catch (error) {
                                console.log(error);
                                return false;
                            }
                        }

                        function loadScript(_id: string, _path: string): void {
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
                                } catch (error) {
                                    console.log(error);
                                }
                            }
                        }

                        $scope.init = function (config: statusChart.nodeConf): void {
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

                        }

                        $scope.$watch('msg', function (msg: statusChart.makeGraphBase): void {
                            // console.log('$scope.$watch');
                            if (!msg) {
                                return
                            }
                            if (msg.result === true) {
                                update(msg)
                            }
                        })

                        $scope.$on('$destroy', function () {
                            if ($scope.hold) {
                            }
                        })
                    }
                });
            } else {
                throw new Error(`The "config" is incorrect.`);
            }
        }
        catch (_error) {
            _node.status({fill:"red", shape:"ring", text:"resources.message.error"});
            _node.error(_error);
        }
        _node.on("close", function() {
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
    function makeGraph(_node: Node, _config: statusChart.nodeConf, _msg: statusChart.inputNodeMsg): statusChart.makeGraphBase {
        try {

            // 処理開始
            _node.status({fill:"blue", shape:"dot", text:"resources.message.connect"});

            // グラフ描画用データ
            if(typeof _msg.payload.dataItems !== 'object' || 0 >= _msg.payload?.dataItems?.length ) {
                throw new Error("data not found.");
            }
            const _graphData: statusChart.graphData[] = _msg.payload.dataItems;

            // configs(priority: input > node property)
            const _createConf = {
            /*  values                  node-in: msg.payload.settings                          node-property                       default                          */
                xTickFormat:            _msg.payload?.settings?.xAxis?.xTickFormat          ?? _config.xTickFormat              ?? DEFAULT_X_TICK_FORMAT,
                xAxisLabelsFontSize:    _msg.payload?.settings?.xAxis?.labelsFontSize       ?? _config.xAxisLabelsFontSize      ?? DEFALUT_X_AXIS_LABELS_FONT_SIZE,
                xAxisLabelslColor:      _msg.payload?.settings?.xAxis?.labelsColor          ?? _config.xAxisLabelslColor        ?? DEFALUT_X_AXIS_LABELS_COLOR,
                startDateTime:          _msg.payload?.settings?.xAxis?.startDateTime        ?? _config.startDateTime            ?? BLANK_STRING,
                endDateTime:            _msg.payload?.settings?.xAxis?.startDateTime        ?? _config.endDateTime              ?? BLANK_STRING,
                yAxisLabelsFontSize:    _msg.payload?.settings?.yAxis?.labelsFontSize       ?? _config.yAxisLabelsFontSize      ?? DEFALUT_Y_AXIS_LABELS_FONT_SIZE,
                yAxisLabelslColor:      _msg.payload?.settings?.yAxis?.labelsColor          ?? _config.yAxisLabelslColor        ?? DEFALUT_Y_AXIS_LABELS_COLOR,
                resetZoomLabelFontSize: _msg.payload?.settings?.resetZoom?.labelFontSize    ?? _config.resetZoomLabelFontSize   ?? DEFALUT_RESET_ZOOM_LABEL_FONT_SIZE,
                resetZoomLabelColor:    _msg.payload?.settings?.resetZoom?.labelColor       ?? _config.resetZoomLabelColor      ?? DEFALUT_RESET_ZOOM_LABEL_COLOR,
                maxLineHeight:          _msg.payload?.settings?.chart?.height               ?? _config.maxLineHeight            ?? DEFAULT_LINE_HEIGHT,
                lineColors:             _msg.payload?.settings?.chart?.lineColors           ?? _config.lineColors               ?? DEFAULT_LINE_CORLOS,
                enableAnimations:       _msg.payload?.settings?.options?.enableAnimations   ?? _config.enableAnimations         ?? DEFALUT_ENABLE_ANIMATIONS,
                enableDateMarker:       _msg.payload?.settings?.options?.enableDateMarker   ?? _config.enableDateMarker         ?? DEFALUT_ENABLE_DATE_MARKER,
            }
            /* debug */
            // for (const [key, value] of Object.entries(_createConf)) {
            //     console.log(`[config] ${key}: ${value}`);
            // }
            /* debug */

            // 設定：開始日時(X軸)
            let _startDateTime:string = _createConf.startDateTime;
            if( BLANK_STRING === _startDateTime ){
                let _min = "";
                _graphData.forEach((_ele, _idx) => {
                    _ele.data.forEach((_ele, _idx) => {
                        let _temp = _ele.data.reduce(function (a, b) { return a.timeRange[0] < b.timeRange[0] ? a : b; }).timeRange[0];
                        _min = (( "" === _min || _min > _temp) ? _temp : _min);
                    })
                })
                _startDateTime = _min;
            }
            // console.log(`_startDateTime: in:${_createConf.startDateTime} out:${_startDateTime}`);

            // 設定： 終了日時(X軸)
            let _endDateTime:string = _createConf.endDateTime;
            if( BLANK_STRING === _endDateTime ){
                let _max = "";
                _graphData.forEach((_ele, _idx) => {
                    _ele.data.forEach((_ele, _idx) => {
                        let _temp = _ele.data.reduce(function (a, b) { return a.timeRange[1] > b.timeRange[1] ? a : b; }).timeRange[1];
                        _max = (( "" === _max || _max < _temp) ? _temp : _max);
                    });
                });
                _endDateTime = _max;
            }
            // console.log(`_endDateTime: in:${_createConf.endDateTime} out:${_endDateTime}`);

            // 設定：グラフ凡例
            let _zColorScale: statusChart.zColorScaleObject = { range:[], domain:[] };
            if( 0 < _createConf.lineColors.length ){
                _createConf.lineColors.forEach((_ele, _idx) => {
                    _zColorScale.range.push(_ele.statusColor);
                    _zColorScale.domain.push(_ele.statusValue);
                });
            }

            // 処理完了
            _node.status({fill:"green", shape:"dot", text:"resources.message.complete"});

            return {
                result : true,
                id : _config.uniqueId,
                data : _graphData,
                configs:{
                    xTickFormat:            _createConf.xTickFormat,
                    xAxisLabelsFontSize:    _createConf.xAxisLabelsFontSize,
                    xAxisLabelslColor:      _createConf.xAxisLabelslColor,
                    startDateTime:          _startDateTime,
                    endDateTime:            _endDateTime,
                    yAxisLabelsFontSize:    _createConf.yAxisLabelsFontSize,
                    yAxisLabelslColor:      _createConf.yAxisLabelslColor,
                    resetZoomLabelFontSize: _createConf.resetZoomLabelFontSize,
                    resetZoomLabelColor:    _createConf.resetZoomLabelColor,
                    maxLineHeight:          _createConf.maxLineHeight,
                    zColorScale:            _zColorScale,
                    enableAnimations:       _createConf.enableAnimations,
                    enableDateMarker:       _createConf.enableDateMarker,
                }
            };
        } catch (_error) {
            _node.status({fill:"red", shape:"ring", text:"resources.message.error"});
            _node.error(_error);
            return DEFALUT_MAKE_GRAPH_BASE;
        }
    }

    RED.nodes.registerType('ui_timelines_chart', initWidget);

    let _uipath = 'ui'
    if (RED.settings.ui) {
        _uipath = RED.settings.ui.path
    }

    let _fullPath = path.join('/', _uipath, '/ui-timelines-chart/*').replace(/\\/g, '/')
    RED.httpNode.get(_fullPath, function (req, res) {
        var options = {
            root: __dirname + '/lib/',
            dotfiles: 'deny'
        }
        res.sendFile(req.params[0], options)
    })
};

export = nodeInit;
