import React from "react"
import { format } from "d3-format"
import { timeFormat } from "d3-time-format"
import {
  elderRay,
  ema,
  discontinuousTimeScaleProviderBuilder,
  Chart,
  ChartCanvas,
  CurrentCoordinate,
  BarSeries,
  CandlestickSeries,
  ElderRaySeries,
  LineSeries,
  HoverTooltip,
  OHLCTooltip,
  mouseBasedZoomAnchor,
  XAxis,
  YAxis,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  ZoomButtons,
} from "react-financial-charts"

interface OHLCDataType {
  open: number
  close: number
  high: number
  low: number
  volume: number
  date: string
}

function CandleChart({ initialData }: any) {
  const ScaleProvider =
    discontinuousTimeScaleProviderBuilder().inputDateAccessor(
      (d) => new Date(d.date)
    )
  const width = 800
  const height = 560
  const margin = { left: 0, right: 72, top: 0, bottom: 24 }

  const ema12 = ema()
    .id(1)
    .options({ windowSize: 12 })
    .merge((d: any, c: any) => {
      d.ema12 = c
    })
    .accessor((d: any) => d.ema12)

  const ema26 = ema()
    .id(2)
    .options({ windowSize: 26 })
    .merge((d: any, c: any) => {
      d.ema26 = c
    })
    .accessor((d: any) => d.ema26)

  const elder = elderRay()

  const calculatedData = elder(ema26(ema12(initialData ?? [])))
  const { data, xScale, xAccessor, displayXAccessor } = ScaleProvider(
    initialData ?? []
  )
  const pricesDisplayFormat = format(".2f")
  const max = xAccessor(data[data.length - 1])
  const min = xAccessor(data[Math.max(0, data.length - 100)])
  const xExtents = [min, max + 5]

  const gridHeight = height - margin.top - margin.bottom

  const elderRayHeight = 100
  const elderRayOrigin = (_: number, h: number) => [0, h - elderRayHeight]
  const barChartHeight = gridHeight / 4
  const barChartOrigin = (_: number, h: number) => [
    0,
    h - barChartHeight - elderRayHeight,
  ]
  const chartHeight = gridHeight - elderRayHeight

  const dateTimeFormat = "%y-%m-%d"
  const timeDisplayFormat = timeFormat(dateTimeFormat)

  const barChartExtents = (data: OHLCDataType) => {
    return data.volume
  }

  const candleChartExtents = (data: OHLCDataType) => {
    return [data.high, data.low]
  }

  const yEdgeIndicator = (data: OHLCDataType) => {
    return data.close
  }

  const volumeColor = (data: OHLCDataType) => {
    return data.close > data.open ? "#ff00004c" : "rgba(38, 76, 166, 0.3)"
  }

  const volumeSeries = (data: OHLCDataType) => {
    return data.volume
  }

  const openCloseColor = (data: OHLCDataType) => {
    return data.close > data.open ? "#E74848" : "#487EE7"
  }

  return (
    <>
      <ChartCanvas
        height={height}
        ratio={2}
        width={width}
        margin={margin}
        data={data}
        displayXAccessor={displayXAccessor}
        seriesName="Data"
        xScale={xScale}
        xAccessor={xAccessor}
        xExtents={xExtents}
        zoomAnchor={mouseBasedZoomAnchor}
        onLoadBefore={(el) => console.log(el)}
      >
        <Chart
          id={2}
          height={barChartHeight}
          origin={barChartOrigin}
          yExtents={barChartExtents}
        >
          <BarSeries fillStyle={volumeColor} yAccessor={volumeSeries} />
        </Chart>
        <Chart id={3} height={chartHeight} yExtents={candleChartExtents}>
          <XAxis showGridLines showTickLabel={false} />
          <YAxis showGridLines tickFormat={pricesDisplayFormat} />
          <CandlestickSeries
            fill={openCloseColor}
            wickStroke={openCloseColor}
          />
          <LineSeries
            yAccessor={ema26.accessor()}
            strokeStyle={ema26.stroke()}
          />
          <CurrentCoordinate
            yAccessor={ema26.accessor()}
            fillStyle={ema26.stroke()}
          />
          <LineSeries
            yAccessor={ema12.accessor()}
            strokeStyle={ema12.stroke()}
          />
          <CurrentCoordinate
            yAccessor={ema12.accessor()}
            fillStyle={ema12.stroke()}
          />
          <MouseCoordinateY
            rectWidth={margin.right}
            displayFormat={pricesDisplayFormat}
          />
          <EdgeIndicator
            itemType="last"
            rectWidth={margin.right}
            fill={openCloseColor}
            lineStroke={openCloseColor}
            displayFormat={pricesDisplayFormat}
            yAccessor={yEdgeIndicator}
          />
          <ZoomButtons zoomMultiplier={2} />
          <OHLCTooltip origin={[8, 16]} />
          <HoverTooltip
            yAccessor={ema12.accessor()}
            tooltip={{
              content: ({ currentItem, xAccessor }) => ({
                x: timeDisplayFormat(xAccessor(currentItem)),
                y: [
                  {
                    label: "open",
                    value:
                      currentItem.open && pricesDisplayFormat(currentItem.open),
                  },
                  {
                    label: "high",
                    value:
                      currentItem.high && pricesDisplayFormat(currentItem.high),
                  },
                  {
                    label: "low",
                    value:
                      currentItem.low && pricesDisplayFormat(currentItem.low),
                  },
                  {
                    label: "close",
                    value:
                      currentItem.close &&
                      pricesDisplayFormat(currentItem.close),
                  },
                ],
              }),
            }}
          />
          <XAxis showGridLines gridLinesStrokeStyle="#e0e3eb" />
        </Chart>
      </ChartCanvas>
    </>
  )
}

export default React.memo(CandleChart)
