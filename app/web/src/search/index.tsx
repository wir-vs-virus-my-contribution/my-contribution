import * as React from "react"
import { PageHeader, Input as I, Table, Button, Checkbox } from "antd"
import { Input, Form, Select } from "formik-antd"
import { AimOutlined, SendOutlined } from "@ant-design/icons"
import { Formik } from "formik"
import {
  getLocation,
  HighlightableRow,
  ErrorBanner,
  getAddress,
  useFields,
  info,
} from "../utils"
import styled from "styled-components"
import { useNavigate, Outlet } from "react-router-dom"
import { useQuery } from "react-query"
import { Offer } from "../models/helpers/Offer"
import { Field } from "../models/helpers/Field"

const getData: any = async (v: any, keys: any) => {
  const response = await fetch("/api/offer/search", {
    method: "POST",
    body: JSON.stringify(keys),
    headers: { "content-type": "application/json" },
  })
  if (response.ok) {
    const data = (await response.json()) as Offer[]
    return data
  } else {
    throw new Error(response.statusText)
  }
}

export function Search() {
  const [selectedField, setSelectedField] = React.useState<string | null>(null)
  const [selectedSkills, setSelectedSkills] = React.useState<string[] | null>(
    null,
  )

  const navigate = useNavigate()
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
  const { data, error } = useQuery(
    ["offer", { selectedField, skills: selectedSkills }],
    getData,
    { retry: 1 },
  )

  const [searchResult, setSearchResult] = React.useState<Offer[]>([])

  React.useEffect(() => {
    if (data) {
      setSearchResult(data as any)
    }
  }, [data])

  return (
    <Page>
      <ErrorBanner message={error} />

      <PageHeader title="Suche">
        <Formik initialValues={{}} onSubmit={() => {}}>
          {f => (
            <Form>
              <SearchBar>
                <Input
                  name="address"
                  placeholder="Adresse Einsatzort"
                  style={{ width: "250px" }}
                  suffix={
                    <AimOutlined
                      onClick={async () => {
                        try {
                          const location = await getLocation()
                          const address = await getAddress(location)
                          f.setFieldValue("address", address)
                          f.setFieldValue("location", location)
                        } catch (E) {}
                      }}
                    />
                  }
                />
                <Select
                  placeholder="Bereich"
                  name="domain"
                  style={{ width: "150px", marginLeft: 5 }}
                  onChange={(value, option) => {
                    setSelectedField(value)
                  }}
                >
                  {fields
                    ? fields.map((v: Field) => (
                        <Select.Option key={v.id} value={v.id}>
                          {v.title}
                        </Select.Option>
                      ))
                    : []}
                </Select>
                <Select
                  mode="multiple"
                  placeholder="Fähigkeiten"
                  name="skills"
                  style={{ width: "400px", marginLeft: 5 }}
                  onChange={(value, option) => {
                    setSelectedSkills(value)
                  }}
                >
                  {skills
                    ? skills.map(v => (
                        <Select.Option key={v.id} value={v.id}>
                          {v.title}
                        </Select.Option>
                      ))
                    : []}
                </Select>
              </SearchBar>
            </Form>
          )}
        </Formik>
        <div>
          <Table<Offer>
            style={{ marginTop: 24 }}
            bordered={false}
            indentSize={0}
            components={{
              body: {
                row: (props: any) => (
                  <HighlightableRow path="/search/" {...props} />
                ),
              },
            }}
            onRow={record => ({
              onClick: () => navigate(`/search/${record.id}`),
            })}
            rowKey="id"
            size="small"
            loading={{ spinning: !Boolean(searchResult) && !error, delay: 50 }}
            dataSource={searchResult ? searchResult : []}
            columns={[
              {
                render: (v, r) => <div>{r.distance.toFixed(2)} km</div>,
                title: "Entfernung",
              },
              {
                render: (v, r) => (
                  <span>
                    {r.fields
                      ? r.fields.map(v => v.field.title).join(", ")
                      : "n/a"}
                  </span>
                ),
                title: "Beruf",
              },
              {
                render: (v, r) => (
                  <span>
                    {r.skills
                      ? r.skills.map(v => v.skill.title).join(", ")
                      : "n/a"}
                  </span>
                ),
                title: "Fähigkeiten",
              },
              {
                render: (v, r) => (
                  <Checkbox checked={r.coronaPassed}></Checkbox>
                ),
                title: "Imun",
              },
              { render: (v, r) => r.experience, title: "Erfahrung" },
              { render: (v, r) => r.gender, title: "Geschlecht" },
              { render: (v, r) => "30", title: "Alter" },
              { render: (v, r) => r.availableFrom, title: "Verfügbarkeit" },
              {
                render: () => <Button type="link">Details</Button>,
              },
            ]}
            pagination={{ pageSize: 15 }}
          />
        </div>
        <Button
          type="primary"
          size="large"
          icon={<SendOutlined />}
          style={{ marginTop: 48 }}
        >
          Anfragen senden
        </Button>
      </PageHeader>
      <Outlet />
    </Page>
  )
}

const SearchBar = styled.div`
  display: flex;
`

const Page = styled.div`
  width: 1200px;
`

// const ListItem = styled(List.Item)`
//   transition: 0.1s all ease-out;
//   background: ${(props: { showAsSelected: boolean }) =>
//     props.showAsSelected ? "#a7e3ff" : undefined};

//   &:hover {
//     background: #e6f7ff;
//     cursor: pointer;
//   }
// `
