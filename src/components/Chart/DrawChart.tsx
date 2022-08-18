import React, { useEffect, useState } from "react"
import styled from "@emotion/styled"
import useSWR from "swr"

import CandleChart from "./CandleChart"

function DrawChart() {
  const [selectCoin, setSelectCoin] = useState("BTC")
  const [selectInterval, setSelectInterval] = useState("1m")
  const [initialData, setInitialData] = useState([])
  const url = `https://www.binance.com/api/v3/klines?symbol=${selectCoin}USDT&interval=${selectInterval}&limit=1000`

  const { data } = useSWR(
    url,
    (...args) => fetch(...args).then((res) => res.json()),
    { refreshInterval: 1000 }
  )

  // const DateConvert = (value: any) => {
  //   value = new Date(value)
  //   const ConvertDigit = (value: number) =>
  //     value > 9 ? value : 0 + value.toString()
  //   let year = value.getFullYear()
  //   let month = ConvertDigit(value.getMonth() + 1)
  //   let day = ConvertDigit(value.getDate())
  //   let hour = ConvertDigit(value.getHours())
  //   let minutes = ConvertDigit(value.getMinutes())
  //   let second = ConvertDigit(value.getSeconds())
  //   return `${year}-${month}-${day} ${hour}:${minutes}:${second}`
  // }
  useEffect(() => {
    const here = data?.map((el: string[]) => {
      return {
        date: new Date(el[0]),
        open: el[1],
        high: el[2],
        low: el[3],
        close: el[4],
        volume: el[5],
      }
    })
    setInitialData(here)
  }, [data])

  return (
    <>
      <div
        style={{
          margin: "40px 80px",
          padding: "20px",
          border: "2px solid black",
        }}
      >
        <select
          onChange={(e) => setSelectCoin(e.target.value)}
          value={selectCoin}
        >
          <option value="BTC">BTC</option>
          <option value="XRP">XRP</option>
          <option value="ADA">ADA</option>
          <option value="ETH">ETH</option>
        </select>
        <select
          onChange={(e) => setSelectInterval(e.target.value)}
          value={selectInterval}
        >
          <option value="1m">1분</option>
          <option value="3m">3분</option>
          <option value="5m">5분</option>
          <option value="30m">30분</option>
          <option value="1h">1시간</option>
          <option value="1d">1일</option>
        </select>
        <Price>{data ? Number(data[999][4]).toFixed(2) + " USD" : null}</Price>
        <Ticker>{selectCoin}/USD</Ticker>
        <CandleChart initialData={initialData} />
      </div>
    </>
  )
}
const Price = styled.div`
  float: right;
  font-size: 1.6rem;
  font-weight: 600;
`
const Ticker = styled.div`
  margin: 6px 0;
  font-size: 1.5rem;
  font-weight: 600;
`

export default DrawChart
