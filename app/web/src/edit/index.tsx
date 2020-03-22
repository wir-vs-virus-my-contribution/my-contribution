import * as React from "react"
import { Steps, Button, notification, Card, Modal, Alert } from "antd"
import {
  Checkbox,
  Select,
  InputNumber,
  Input,
  Slider,
  Radio,
  SubmitButton,
  Form,
} from "formik-antd"
import { Formik } from "formik"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { AimOutlined, SendOutlined } from "@ant-design/icons"
import { OfferRequest } from "../models/helpers/OfferRequest"
import { Offer } from "../models/helpers/Offer"
import { useQuery } from "react-query"
import { useParams } from "react-router"
import { getLocation, getAddress } from "../utils"

const labelCol = { xs: 5 }

export function EditView() {
  const [current, setCurrent] = React.useState(0)
  const navigate = useNavigate()
  const { id } = useParams()
  const [showSuccess, setShowSuccess] = React.useState<null | Offer>(null)
  const { data, error } = useQuery(id, async () => {
    const response = await fetch(`/api/offer/${id}`)
    const data = await response.json()
    console.log(data)
    console.log(response)
    return data
  })

  return (
    <Card style={{ margin: 60, width: 700 }}>
      <Formik<OfferRequest>
        initialValues={data}
        enableReinitialize={true}
        onSubmit={async values => {
          notification.info({ message: "submitting" })
          const response = await fetch("/api/offer/edit?api-version=1.0", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(values),
          })
          if (response.ok) {
            const data = (await response.json()) as Offer
            //setShowSuccess(data)
            Modal.success({
              title: "Danke für deine Teilnahme!",
              content: (
                <div>
                  Dein Profil ist über folgenden Link erreichbar. Bitte teile
                  diesen Link nicht mit anderen.
                </div>
              ),
              okButtonProps: { type: "link" },
              okText: "Zum Profil",
              onOk: () => navigate(`/edit/${data.id}`),
            })
          } else {
            const text = await response.text()
            notification.error({
              description: text,
              message: response.statusText,
            })
          }
        }}
      >
        {f => (
          <Form>
            <div>
              <Content>
                <div>
                  <Row>
                    <Label style={{ fontSize: "1rem", fontWeight: "bold" }}>
                      Qualifikation
                    </Label>
                    <Checkbox.Group
                      name="domains"
                      options={[
                        { label: "Krankenhaus", value: "1" },
                        { label: "Pflege", value: "2" },
                        { label: "Botendienste", value: "3" },
                        { label: "Seelsorge", value: "4" },
                        { label: "Sonstige", value: "5" },
                      ]}
                    />
                  </Row>
                  <Row>
                    <Label>Welche Qualifikationen hast du?</Label>
                    <Select
                      size="large"
                      name="qualifications"
                      style={{ width: "100%" }}
                      placeholder="Mehrfachauswahl"
                      mode="multiple"
                    >
                      <Select.Option value={1}>Santitäter</Select.Option>
                      <Select.Option value={2}>
                        Gesundheits & Krankenpfleger
                        </Select.Option>
                      <Select.Option value={3}>
                        Gesundheits- & Kinderkrankenpfleger 3
                        </Select.Option>
                      <Select.Option value={4}>
                        Fachkrankenschwester
                        </Select.Option>
                      <Select.Option value={5}>Altenpfleger</Select.Option>
                      <Select.Option value={6}>
                        Pflegefachhelfer
                        </Select.Option>
                    </Select>
                  </Row>
                  <Row>
                    <Label>
                      Wieviele Jahre Berufserfahrung hast du insgesamt?
                      </Label>
                    <InputNumber
                      size="large"
                      style={{ width: "400px" }}
                      min={-1}
                      name="experience"
                    />
                  </Row>
                </div>
                <div>
                  <Label style={{ fontSize: "1rem", fontWeight: "bold" }}>
                    Einsatzbereich
                    </Label>
                  <Row>
                    <Label>Wie lautet deine ungefähre Adresse?</Label>
                    <Input
                      name="address"
                      suffix={
                        <Button
                          onClick={async () => {
                            try {
                              const location = await getLocation()
                              const address = await getAddress(location)

                              f.setFieldValue("address", address)
                              f.setFieldValue("location", location)
                            } catch { }
                          }}
                        >
                          <AimOutlined />
                        </Button>
                      }
                    />
                  </Row>
                  <Row>
                    <Label>
                      In welchem Umkreis (km) bist du einsatzbereit?
                      </Label>
                    <div style={{ display: "flex" }}>
                      <Slider
                        name="radius"
                        style={{ flex: 1, marginRight: 15 }}
                      />
                      <InputNumber
                        name="radius"
                        formatter={value => `${value} km`}
                      />
                    </div>
                  </Row>
                </div>
                <div>
                  <Row>
                    <Label style={{ fontSize: "1rem", fontWeight: "bold" }}>
                      Kontaktdaten
                    </Label>
                    <Field>
                      <Form.Item
                        labelCol={labelCol}
                        name="gender"
                        label="Geschlecht"
                        required={true}
                      >
                        <Radio.Group name="gender">
                          <Radio name="gender" value="m">
                            M
                            </Radio>
                          <Radio name="gender" value="f">
                            W
                            </Radio>
                          <Radio name="gender" value="d">
                            D
                            </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Field>
                    <Field>
                      <Form.Item name="nameLabel" label="Name" labelCol={labelCol}>
                        <Input
                          name="name"
                          placeholder="Vorname Nachname"
                        />
                      </Form.Item>
                    </Field>
                    <Field>
                      <Form.Item
                        name="phone"
                        label="Telefon"
                        labelCol={labelCol}
                      >
                        <Input name="phone" placeholder="Telefon" />
                      </Form.Item>
                    </Field>
                    <Field>
                      <Form.Item
                        name="email"
                        required={true}
                        label="Email"
                        labelCol={labelCol}
                      >
                        <Input name="email" placeholder="Email" />
                      </Form.Item>
                    </Field>
                  </Row>
                </div>
                <ButtonRow>
                  <Button size="large" onClick={() => setCurrent(0)}>
                    Abbrechen
                    </Button>
                  <SubmitButton
                    type="primary"
                    size="large"
                    onClick={() => f.submitForm()}
                  >
                    Speichern
                      <SendOutlined />
                  </SubmitButton>
                </ButtonRow>
              </Content>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  )
}

const Content = styled.div`
  padding: 24px;
  height: 800px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Field = styled.div`
  margin-top: 10px;
`

const Row = styled.div`
  margin-top: 20px;
`

const ButtonRow = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
`
