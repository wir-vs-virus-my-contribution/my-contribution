import * as React from "react"
import { PageHeader, Input as I, Table, Button, Checkbox } from "antd"
import { Input, Form, FormikDebug, Select } from "formik-antd"
import { AimOutlined, SendOutlined } from "@ant-design/icons"
import { Formik } from "formik"
import {
  getLocation,
  HighlightableRow,
  ErrorBanner,
  getAddress,
} from "../utils"
import styled from "styled-components"
import { useNavigate, Outlet } from "react-router-dom"
import { useQuery } from "react-query"
import { Offer } from "../models/helpers/Offer"

export function Search() {
  const navigate = useNavigate()
  const { status, data, error } = useQuery("todos", () =>
    fetch("/api/offer/search", {
      method: "POST",
      body: JSON.stringify({
        selectedField: "3f9bfdd3-6f79-4301-aa26-dd6e3b92a420",
        skills: ["1b02ca8b-9858-426c-8c7c-0d88cd2bb94d"],
      }),
      headers: { "content-type": "application/json" },
    }).then(v => v.json()),
  )

  return (
    <Page>
      <ErrorBanner message={error} />
      <PageHeader title="Suche">
        <Formik initialValues={{}} onSubmit={() => {}}>
          {f => (
            <Form>
              <SearchBar>
                <I.Group>
                  <Input
                    name="address"
                    placeholder="Adresse Einsatzort"
                    style={{ width: "200px" }}
                    disabled={true}
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
                    style={{ width: "150px" }}
                  >
                    <Select.Option key={1} value="1">
                      Krankenhaus
                    </Select.Option>
                    <Select.Option key={2} value="2">
                      Pflege
                    </Select.Option>
                    <Select.Option key={3} value="3">
                      Botendienst
                    </Select.Option>
                    <Select.Option key={4} value="4">
                      Sonstiges
                    </Select.Option>
                  </Select>
                  <Select
                    mode="multiple"
                    placeholder="Fähigkeiten"
                    name="skills"
                    style={{ width: "200px" }}
                  >
                    <Select.Option key={1} value="1">
                      Sanitäter
                    </Select.Option>
                    <Select.Option key={2} value="2">
                      Krankenpfleger
                    </Select.Option>
                    <Select.Option key={3} value="3">
                      Seelsorger
                    </Select.Option>
                  </Select>
                </I.Group>
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
            loading={status === "loading"}
            dataSource={data ? data : []}
            columns={[
              { dataIndex: "name", title: "Name" },
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
              { dataIndex: "availability", title: "Verfügbarkeit" },
              {
                render: () => <Button type="link">Details</Button>,
              },
            ]}
            pagination={false}
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
  width: 1000px;
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
