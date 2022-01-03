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
        lineColors: lineColorsObject[];
        xTickFormat: string;
        startDateTime: string;
        endDateTime: string;
        maxLineHeight: number;
        topMargin: number;
        enableAnimations: boolean;
        enableDateMarker: boolean;
        forwardInputMessages: boolean;
        xAxisLabelsFontSize: number;
        xAxisLabelslColor: string;
        yAxisLabelsFontSize: number;
        yAxisLabelslColor: string;
        resetZoomLabelFontSize: number;
        resetZoomLabelColor: string;
    }

    // グラフ凡例設定
    type lineColorsObject = {
        statusColor: string;
        statusValue: string;
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
        topMargin: number;
        startDateTime: string;
        endDateTime: string;
        zColorScale: zColorScaleObject;
        enableAnimations: boolean;
        enableDateMarker: boolean;
        xAxisLabelsFontSize: number;
        xAxisLabelslColor: string;
        yAxisLabelsFontSize: number;
        yAxisLabelslColor: string;
        resetZoomLabelFontSize: number;
        resetZoomLabelColor: string;
    }

    // base: graph object
    type makeGraphBase = {
        result: boolean;
        data: graphData[];
        configs: graphConfigsObject;
    }

    // input: graph settings 
    type graphSettings = {
        xAxis:{
            xTickFormat: string;
            startDateTime: string;
            endDateTime: string;
            labelsFontSize: number;
            labelsColor: string;
        };
        yAxis:{
            labelsFontSize: number;
            labelsColor: string;
        };
        resetZoom:{
            labelFontSize: number;
            labelColor: string;
        };
        chart:{
            height: number;
            topMargin: number;
            lineColors: lineColorsObject[];
        };
        options:{
            enableAnimations: boolean;
            enableDateMarker: boolean;
        };
    }
    
    // input: graph data items
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

    // input: node 'msg' objects
    type inputNodeMsg = {
        [key: string]: any;
        _msgid: string;
        payload: {
            settings: graphSettings;
            dataItems: graphData[];
        };
        topic: string;
    }

    interface nodeConf extends NodeDef, appConfig {}
}

export default statusChart; 
