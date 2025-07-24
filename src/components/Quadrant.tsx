import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    Cell,
    LabelList
} from "recharts";



const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];
const getMedian = (arr) => {
    const total = [...arr].reduce((total, value) => total + value, 0);
    console.log("Total:", total, "Array Length:", arr.length);

    return total / arr.length;
};


const QuadrantChart = ({ data, name, unit }) => {
    const xMedian = getMedian(data.map((d) => d.x));
    return (
        <div style={{ padding: "10px" }}>
            <h3>Efficiency vs {name} Quadrant</h3>
            <ScatterChart
                width={1000}
                height={350}
                margin={{ top: 20, right: 20, bottom: 25, left: 20 }}

            >
                <CartesianGrid />
                <XAxis
                    type="number"
                    dataKey="x"
                    name={name}
                    unit={unit}
                    label={{ value: name, position: "insideBottom", offset: -20, }}
                />
                <YAxis
                    type="number"
                    dataKey="y"
                    name="Efficiency"
                    label={{ value: "Efficiency", angle: -90, position: "insideLeft", offset: -10 }}
                />
                <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ payload }) => {
                        if (!payload || payload.length === 0) return null;

                        const { x, y, name: campaignName } = payload[0].payload;

                        return (
                            <div
                                style={{
                                    background: "#fff",
                                    border: "1px solid #ccc",
                                    padding: "10px",
                                    fontSize: "14px",
                                }}
                            >
                                <strong>{campaignName}</strong>
                                <br />
                                {name}: {x.toFixed(2)}
                                <br />
                                Efficiency: {y.toFixed(2)}
                            </div>
                        );
                    }}
                />

                <Scatter name="Products" data={data} shape={(props) => (
                    <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={6} // radius of dot
                        fill={props.fill}
                    />
                )}>
                    {data.map((entry, index) => {
                        const isRight = entry.x >= xMedian;
                        const isTop = entry.y >= 50;

                        let fillColor;
                        if (isRight && isTop) fillColor = "#0088FE"; // top-right
                        else if (!isRight && isTop) fillColor = "#00C49F"; // top-left
                        else if (!isRight && !isTop) fillColor = "#FFBB28"; // bottom-left
                        else fillColor = "#FF8042"; // bottom-right

                        return <Cell key={`cell-${index}`} fill={fillColor} />;
                    })}
                </Scatter>

                {/* Quadrant lines */}
                <ReferenceLine x={xMedian} stroke="#000000" />
                <ReferenceLine y={50} stroke="#000000" />
            </ScatterChart>
        </div>
    );
};

export default QuadrantChart;
