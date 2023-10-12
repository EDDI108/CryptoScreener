import React, { useLayoutEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useContext } from "react";
import { CryptoContext } from "./../context/CryptoContext";

function CustomTooltip({ payload, label, active, currency = "usd" }) {
  if (active && payload && payload.length > 0) {
    return (
      <div className="custom-tooltip">
        <p className="label text-sm text-cyan">{`${label} : ${new Intl.NumberFormat(
          "en-IN",
          {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 5,
          }
        ).format(payload[0].value)}`}</p>
      </div>
    );
  }

  return null;
}

const ChartComponent = ({ data, currency, type }) => {
  return (
    <ResponsiveContainer height={"90%"}>
      <LineChart width={400} height={400} data={data}>
        <Line
          type="monotone"
          dataKey={type}
          stroke="#14ffec"
          strokeWidth={"1px"}
        />
        <CartesianGrid stroke="#323232" />
        <XAxis dataKey="date" hide />
        <YAxis dataKey={type} hide domain={["auto", "auto"]} />
        <Tooltip content={<CustomTooltip />} currency={currency} cursor={false} wrapperStyle={{ outline: "none" }} />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
};

const Chart = ({ id }) => {
  const [chartData, setChartData] = useState();
  const { currency } = useContext(CryptoContext);
  const [type, setType] = useState("prices");
  const [days, setDays] = useState(7);

  useLayoutEffect(() => {
    const getChartData = async (id) => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        const convertedData = data[type].map((item) => {
          return {
            date: new Date(item[0]).toLocaleDateString(),
            [type]: item[1],
          };
        });

        setChartData(convertedData);
      } catch (error) {
        console.error(error);
      }
    };

    getChartData(id);
  }, [id, type, days]);

  const handleTypeChange = (newType) => {
    setType(newType);
  };

  const handleDaysChange = (newDays) => {
    setDays(newDays);
  };

  return (
    <div className="w-full h-[60%]">
      <ChartComponent data={chartData} currency={currency} type={type} />
      <div className="flex">
        {["prices", "market_caps", "total_volumes"].map((dataType) => (
          <button
            key={dataType}
            className={`text-sm py-0.5 px-1.5 ml-2 bg-opacity-25 rounded capitalize ${
              type === dataType ? "bg-cyan text-cyan" : "bg-gray-200 text-gray-100"
            }`}
            onClick={() => handleTypeChange(dataType)}
          >
            {dataType.replace("_", " ")}
          </button>
        ))}
        {[7, 14, 30].map((period) => (
          <button
            key={period}
            className={`text-sm py-0.5 px-1.5 ml-2 bg-opacity-25 rounded capitalize ${
              days === period ? "bg-cyan text-cyan" : "bg-gray-200 text-gray-100"
            }`}
            onClick={() => handleDaysChange(period)}
          >
            {period}d
          </button>
        ))}
      </div>
    </div>
  );
};

export default Chart;