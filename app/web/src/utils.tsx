import { notification, Alert } from "antd"
import * as React from "react"
import styled from "styled-components"
import { Field } from "./models/helpers/Field"
import { useQuery } from "react-query"

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

export async function fetchJson(url: string) {
  const response = await fetch(url)
  if (response.ok) {
    const data = await response.json()
    return data
  } else {
    throw new Error(response.statusText)
  }
}

export function info(message: string) {
  notification.info({ message })
}

export function useFields() {
  const query = useQuery("fields", () => getFields())
  return query
}

export function useFieldsAndSkills() {
  const [selectedField, setSelectedField] = React.useState<string | null>(null)
  const [selectedSkills, setSelectedSkills] = React.useState<string[] | null>(
    null,
  )
  const { data: fields } = useFields()
  const skills = React.useMemo(() => {
    if (fields) {
      const skills = fields
        .flatMap(v => v.skills)
        .filter(v => v.fieldId == selectedField)
      return skills
    } else {
      return null
    }
  }, [selectedField, fields])

  return {
    selectedField,
    setSelectedField,
    selectedSkills,
    setSelectedSkills,
    fields,
    skills,
  }
}

export function TestSystemNotification() {
  return (
    <Alert
      type="info"
      message={
        <div>
          Test Modus. Bitte nur Daten zu Testzwecken eingeben. Daten werden
          automatisch regelmäßig zurückgesetzt. Wenn sie jetzt schon
          Unterstützen möchten klicken sie{" "}
          <b>
            <a href="http://corona-helden.net/anmelden" target="blank">
              hier
            </a>
          </b>
        </div>
      }
      banner={true}
    />
  )
}

export async function getFields() {
  const response = (await fetchJson("/api/offer/fields")) as Field[]
  return response
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
