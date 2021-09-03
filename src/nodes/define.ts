export module myConst {
    export const items = {
        widgetWidth: {
            type: "number",
            default: 6,
            minNum : 0,
            maxNum : 16,
        },
        widgetHeight: {
            type: "number",
            default: 6,
            minNum : 0,
            maxNum : 16,
        },
        emitOnlyNewValues: {
            type: "boolean",
            default: false,
        },
        forwardInputMessages: {
            type: "boolean",
            default: false,
        },
        storeFrontEndInputAsState: {
            type: "boolean",
            default: false,
        },
        xTickFormat: {
            type: "string",
            default: 'YYYY-MM-DD HH:mm:ss',
            maxLen : 32,
        },
        startDateTime: {
            type: "string",
            default: '',
            maxLen : 32,
        },
        endDateTime: {
            type: "string",
            default: '',
            maxLen : 32,
        },
        maxLineHeight: {
            type: "number",
            default: 60,
            minNum : 1,
            maxNum : 255,
        },
        enableAnimations: {
            type: "boolean",
            default: false,
        },
        enableDateMarker: {
            type: "boolean",
            default: false,
        },
        xAxisLabelsFontSize: {
            type: "number",
            default: 16,
            minNum : 0,
            maxNum : 64,
        },
        xAxisLabelslColor: {
            type: "string",
            default: "lightslategray",
            maxLen : 32,
        },
        yAxisLabelsFontSize: {
            type: "number",
            default: 16,
            minNum : 0,
            maxNum : 64,
        },
        yAxisLabelslColor: {
            type: "string",
            default: "lightslategray",
            maxLen : 32,
        },
        resetZoomLabelFontSize: {
            type: "number",
            default: 24,
            minNum : 0,
            maxNum : 64,
        },
        resetZoomLabelColor: {
            type: "string",
            default: "blue",
            maxLen : 32,
        },
        lineColors: {
            type: "object",
            default: [
                {
                    statusColor: "#000000",
                    statusValue: "",
                },
            ]
        },
        zColorScale: {
            type: "object",
            default :{
                range:[],
                domain:[],
            }
        },
    }
}
// export default myConst;