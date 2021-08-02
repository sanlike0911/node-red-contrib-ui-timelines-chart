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
        graphColors: graphColorsObject[],
        dateformat: string;
        startDate: string;
        endDate: string;
        maxLineHeight: string;
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

    // graph object
    type graphObject = {
        id: string;
        data: graphData[];
        xTickFormat: string;
        maxLineHeight: string;
        startDate: string;
        endDate: string;
        zColorScale: zColorScaleObject;
    }

    // base: graph object
    type makeGraphBase = {
        result: boolean;
        graphItems: graphObject | undefined;
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