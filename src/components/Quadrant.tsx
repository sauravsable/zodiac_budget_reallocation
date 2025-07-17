import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    Cell
} from "recharts";



const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];


const QuadrantChart = ({ rawData }) => {
    const data = rawData.map((d) => ({
        x: d.allocation,   // Budget
        y: d.efficiency,   // Efficiency
        name: d.name
    }));
    return (
        <div style={{ padding: "20px" }}>
            <h3>Efficiency vs Budget Quadrant</h3>
            <ScatterChart
                width={600}
                height={400}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
                <CartesianGrid />
                <XAxis
                    type="number"
                    dataKey="x"
                    name="Budget"
                    unit=" ₹"
                    label={{ value: "Budget", position: "insideBottomRight", offset: -10 }}
                />
                <YAxis
                    type="number"
                    dataKey="y"
                    name="Efficiency"
                    label={{ value: "Efficiency", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(value, name) => {
                        if (name === "x") return [`${value}`, "Budget"];
                        if (name === "y") return [`${value}`, "Efficiency"];
                        return [value, name];
                    }}
                    labelFormatter={(label, payload) => {
                        return payload && payload[0]?.payload?.name;
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
