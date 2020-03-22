import { notification, Alert } from "antd"
import * as React from "react"
import styled from "styled-components"

export function ErrorBanner({ message }: { message: any }) {
  return (
    message && (
      <Alert type="error" style={{ margin: 10 }} message={message.toString()} />
    )
  )
}

export interface Location {
  latitude: number
  longitude: number
}

export async function getAddress(location: Location): Promise<string> {
  const response = await fetch(
    `/api/locations/coordinates-to-address?longitude=${location.longitude}&latitude=${location.latitude}`,
  )
  if (!response.ok) {
    notification.error({
      message: response.statusText,
    })
    throw new Error(response.statusText)
  }
  const address = await response.text()
  return address
}

export function getLocation() {
  var promise = new Promise<Location>((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(location => {
        resolve({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
      })
    } else {
      notification.error({
        message: "Geolocation is not supported by this browser.",
      })
      reject("Geolocation is not supported by this browser.")
    }
  })
  return promise
}

const Tr = styled.tr<{ highlight: boolean }>`
  transition: all;
  transition-duration: 1s;
  &:hover {
    background: #efefef;
    cursor: pointer;
  }
  ${props => `background: ${props.highlight ? "#efefef" : undefined}`}
`

export function HighlightableRow(props: any & { path: string }) {
  return (
    // <Popover trigger={"contextMenu"} content={<div>hello world</div>}>
    <Tr
      {...props}
      highlight={window.location.pathname.startsWith(
        `${props.path}${props["data-row-key"]}`,
      )}
    />
    // </Popover>
  )
}
