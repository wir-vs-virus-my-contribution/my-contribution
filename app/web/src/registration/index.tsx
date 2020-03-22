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
import { useNavigate, Link } from "react-router-dom"
import { AimOutlined, SendOutlined } from "@ant-design/icons"
import { OfferRequest } from "../models/helpers/OfferRequest"
import { Offer } from "../models/helpers/Offer"
import { Profile } from "./profile"
import { getLocation, getAddress } from "../utils"
import * as Yup from "yup"

const { Step } = Steps

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email("Sieht nicht nach einer gültigen Email Addresse aus")
    .required("Email ist ein Pflichtfeld"),
  gender: Yup.string().required("Pflichtfeld"),
})

const labelCol = { xs: 5 }

export function RegisterView() {
  const [current, setCurrent] = React.useState(0)
  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = React.useState<null | Offer>(null)
  return (
    <Card style={{ margin: 60, width: 700 }}>
      <Formik<OfferRequest>
        validationSchema={SignupSchema}
        initialValues={{
          id: "",
          radius: 10,
          gender: "",
          address: "",
          availableFrom: "",
          lastWorked: "",
          skills: [],
          comment: "",
          coronaPassed: false,
          age: null,
          email: "",
          fields: [],
          name: "",
          phone: "",
          location: null,
          experience: 0,
        }}
        onSubmit={async values => {
          const response = await fetch("/api/offer/create?api-version=1.0", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(values),
          })
          if (response.ok) {
            const data = (await response.json()) as Offer

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
              <Steps
                type="navigation"
                size="small"
                className="site-navigation-steps"
                current={current}
                onChange={current => setCurrent(current)}
              >
                <Step title="Qualifikationen">Step 1</Step>
                <Step title="Einsatzort">Step 2</Step>
                <Step title="Kontakt" />
              </Steps>
              {current === 0 && (
                <Content>
                  <div>
                    <Row>
                      <Label>
                        In welchem Bereich kannst du Unterstützung anbieten?
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
                  <ButtonRow>
                    <Button size="large" onClick={() => navigate("/")}>
                      Zurück
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => setCurrent(1)}
                    >
                      Weiter
                    </Button>
                  </ButtonRow>
                </Content>
              )}
              {current === 1 && (
                <Content>
                  <div>
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
                              } catch {}
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
                  <ButtonRow>
                    <Button size="large" onClick={() => setCurrent(0)}>
                      Zurück
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => setCurrent(2)}
                    >
                      Weiter
                    </Button>
                  </ButtonRow>
                </Content>
              )}
              {current === 2 && (
                <Content>
                  <div>
                    <Row>
                      <Label>Wir finden eine Einsatzmöglichkeit für Dich</Label>
                      <Label style={{ fontSize: "1rem" }}>
                        Bitte hinterlasse uns Deine Kontaktdaten, damit wir uns
                        bei Dir melden können.
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
                        <Form.Item name="name" label="Name" labelCol={labelCol}>
                          <Input
                            name="firstName"
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
                    <Row>
                      Mit Betätigung des "Absende" Knopfes erkläre ich meine
                      Einwilligung in die Verarbeitung meiner Daten gemäß der
                      datenschutzrechtlichen Einwilligungserklärung. Ich erkläre
                      mich einverstanden, per Telefon oder E-Mail kontaktiert zu
                      werden. Mit der Kontaktaufnahme nehme ich die
                      Datenschutzerklärung zur Kenntnis.
                    </Row>
                  </div>
                  <ButtonRow>
                    <Button size="large" onClick={() => setCurrent(0)}>
                      Zurück
                    </Button>
                    <SubmitButton
                      type="primary"
                      size="large"
                      onClick={() => f.submitForm()}
                    >
                      Absenden
                      <SendOutlined />
                    </SubmitButton>
                  </ButtonRow>
                </Content>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  )
}

const Content = styled.div`
  padding: 24px;
  height: 550px;
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
  font-size: 1.5rem !important;
`
