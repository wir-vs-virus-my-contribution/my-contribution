import * as React from "react"
import { PageHeader, Input as I, Table, Button } from "antd"
import { Input, Form, FormikDebug, Select } from "formik-antd"
import { AimOutlined, SendOutlined } from "@ant-design/icons"
import { Formik } from "formik"
import { getLocation, HighlightableRow } from "../utils"
import styled from "styled-components"
<<<<<<< HEAD
import { useNavigate } from "react-router-dom"
=======
import { useNavigate, Outlet } from "react-router-dom"
>>>>>>> add search prototype

export function Search() {
  const navigate = useNavigate()
  return (
    <Page>
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
                    suffix={
                      <AimOutlined
                        onClick={async () => {
                          try {
                            var location = await getLocation()
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
          <Table
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
            dataSource={[
              {
                id: "1",
                name: "hans peter",
                distance: "1 km",
                profession: "Sanitäter",
                skills: ["Sanitäter", "Blut abnehmen"],
                experience: "10 Jahre",
                geneder: "m",
                age: "30",
                availability: "Fulltime",
              },
              {
                id: "2",
                name: "hans peter",
                distance: "1 km",
                profession: "Sanitäter",
                skills: ["Sanitäter", "Blut abnehmen"],
                experience: "10 Jahre",
                gender: "m",
                age: "30",
                availability: "Fulltime",
              },
            ]}
            columns={[
              { dataIndex: "name", title: "Name" },
              { dataIndex: "distance", title: "Name" },
              { dataIndex: "profession", title: "Name" },
              {
                render: (row, record) => (
                  <div>{JSON.stringify(record.skills)}</div>
                ),
                title: "Skills",
              },
              { dataIndex: "experience", title: "Name" },
              { dataIndex: "gender", title: "Name" },
              { dataIndex: "age", title: "Name" },
              { dataIndex: "availability", title: "Name" },
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
<<<<<<< HEAD
=======
      <Outlet />
>>>>>>> add search prototype
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
