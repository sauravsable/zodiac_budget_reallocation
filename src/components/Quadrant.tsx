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


const QuadrantChart = ({ data, name, unit }) => {
    console.log(data, "QuadrantChart component rendered with data:");


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
                    domain={[0, 100]}
                    label={{ value: name, position: "insideBottom", offset: -20, }}
                />
                <YAxis
                    type="number"
                    dataKey="y"
                    name="Efficiency"
                    domain={[0, 100]}
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

                <Scatter name="Products" data={data} fill="#8884d8">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}

                </Scatter>
                {/* Quadrant lines */}
                <ReferenceLine x={0} stroke="#000000" />
                <ReferenceLine y={0} stroke="#000000" />
            </ScatterChart>
        </div>
    );
};

export default QuadrantChart;
