import { NodeDef } from "node-red";

declare namespace statusChart {

    // node-red configs
    type appConfig = {
        uniqueId: string;
        group: string;
        name: string;
        order: number;
        label: string;
        width: number;
        height: number;
        storeOutMessages: boolean;
        fwdInMessages: boolean;
        graphColors: graphColorsObject[];
        xTickFormat: string;
        startDateTime: string;
        endDateTime: string;
        maxLineHeight: number;
        enableAnimations: boolean;
        enableDateMarker: boolean;
        xAxisLabelsFontSize: number;
        xAxisLabelslColor: string;
        yAxisLabelsFontSize: number;
        yAxisLabelslColor: string;
        resetZoomLabelFontSize: number;
        resetZoomLabelColor: string;
    }

    // グラフ凡例設定
    type graphColorsObject = {
        statusColor: string;
        statusValue: string;
    }

    // graph data
    type graphData = {
        group: string;
        data: {
            label: string;
            data: {
                timeRange: string[];
                val: string;
            }[]
        }[]
    }

    // timelines-chart: zColorScaleObject
    type zColorScaleObject = {
        range: string[];
        domain: string[];
    }

    // graph configs
    type graphConfigsObject = {
        xTickFormat: string;
        maxLineHeight: number;
        startDateTime: string;
        endDateTime: string;
        zColorScale: zColorScaleObject;
        enableAnimations: boolean;
        enableDateMarker: boolean;
    }

    // base: graph object
    type makeGraphBase = {
        result: boolean;
        id: string;
        data: graphData[];
        configs: graphConfigsObject;
    }

    // input node 'msg' objects
    type inputNodeMsg = {
        [key: string]: any;
        _msgid: string;
        payload: graphData[];
        topic: string;
    }

    interface nodeConf extends NodeDef, appConfig {}
}

export default statusChart; 