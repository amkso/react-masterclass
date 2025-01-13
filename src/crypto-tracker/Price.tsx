import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";
import { IHistorical } from "./Chart";
import { useQuery } from "react-query";
import { fetchCoinHistory } from "./crypto-api";
import Apexchart from "react-apexcharts";

interface PriceProps {
  coinId: string;
}

function Price({ coinId }: PriceProps) {
  const isDark = useRecoilValue(isDarkAtom);
  const { isLoading, data } = useQuery<IHistorical[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    }
  );
  try {
    data?.at(0);
  } catch (error) {
    console.log(error);
    return <div>error</div>;
  }

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <>
          <Apexchart
            type="boxPlot" // candlestick
            series={[
              {
                name: "Price",
                data:
                  data?.map((price) => {
                    const start = parseFloat(price.low);
                    const end = parseFloat(price.high);
                    const gap = Math.floor(end - start) / 4;

                    return {
                      x: new Date(price.time_close * 1000).toUTCString(),
                      y: [
                        start,
                        start + gap,
                        start + 2 * gap,
                        start + 3 * gap,
                        end,
                      ],
                    };
                  }) ?? [],
              },
            ]}
            options={{
              theme: {
                mode: isDark ? "dark" : "dark",
              },
              chart: {
                height: 300,
                width: 500,
                toolbar: {
                  show: false,
                },
                background: "trasparent",
                zoom: { enabled: false },
              },
              grid: { show: false },
              stroke: {
                curve: "smooth",
                width: 1,
              },
              yaxis: { show: false },
              xaxis: {
                labels: { show: false },
                axisTicks: { show: false },
                axisBorder: { show: false },
              },
              fill: {
                type: "gradient",
                gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
              },
              colors: ["#0fbcf9"],
            }}
          />
        </>
      )}
    </div>
  );
}

export default Price;
