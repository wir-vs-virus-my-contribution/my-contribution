import * as React from "react"
import { Steps, Button } from "antd"
import {
  Checkbox,
  Select,
  InputNumber,
  Input,
  Slider,
  Radio,
} from "formik-antd"
import { Formik } from "formik"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { AimOutlined, SendOutlined } from "@ant-design/icons"

const { Step } = Steps

export function RegisterView() {
  const [current, setCurrent] = React.useState(0)
  const navigate = useNavigate()
  return (
    <div style={{ margin: 60, width: 700 }}>
      <Formik
        initialValues={{
          experience: 1,
          radius: 10,
          sex: null,
        }}
        onSubmit={() => {}}
      >
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
              <Row>
                <Label>
                  In welchen Bereich kannst du Unterstützung anbieten?
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
                  <Select.Option value={4}>Fachkrankenschwester</Select.Option>
                  <Select.Option value={5}>Altenpfleger</Select.Option>
                  <Select.Option value={6}>Pflegefachhelfer</Select.Option>
                </Select>
              </Row>
              <Row>
                <Label>Wieviele Jahre Beruferfahrung hast du insgesamt?</Label>
                <InputNumber size="large" name="experience" />
              </Row>
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
              <Row>
                <Label>Wie lautet deine ungefähre Adresse?</Label>
                <Input
                  name="adress"
                  suffix={
                    <Button>
                      <AimOutlined />
                    </Button>
                  }
                />
              </Row>
              <Row>
                <Label>In welchem Umkreis (km) bist du einsatzbereit?</Label>
                <div style={{ display: "flex" }}>
                  <Slider name="radius" style={{ flex: 1, marginRight: 15 }} />
                  <InputNumber
                    name="radius"
                    formatter={value => `${value} km`}
                  />
                </div>
              </Row>

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
                    Bitte hinterlasse uns Deine Kontaktdaten, damit wir uns bei
                    Dir melden können.
                  </Label>
                  <Field>
                    <Radio.Group name="sex">
                      <Radio name="sex" value="m">
                        M
                      </Radio>
                      <Radio name="sex" value="f">
                        W
                      </Radio>
                      <Radio name="sex" value="d">
                        D
                      </Radio>
                    </Radio.Group>
                  </Field>
                  <Field>
                    <Input name="firstName" placeholder="Vorname" />
                  </Field>
                  <Field>
                    <Input name="lastName" placeholder="Nachname" />
                  </Field>
                  <Field>
                    <Input name="Telefon" placeholder="Telefon" />
                  </Field>
                  <Field>
                    <Input name="Email" placeholder="Email" />
                  </Field>
                </Row>
                <Row>
                  <Checkbox name="privacyThing">
                    Ich erkläre hiermit meine Einwilligung in die Verarbeitung
                    meiner Daten gemäß der datenschutzrechtlichen
                    Einwilligungserklärung. Ich erkläre mich einverstanden, über
                    What's App, per Telefon oder E-Mail kontaktiert zu werden.
                    Mit der Kontaktaufnahme nehme ich die Datenschutzerklärung
                    zur Kenntnis.
                  </Checkbox>
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
                  Absenden
                  <SendOutlined />
                </Button>
              </ButtonRow>
            </Content>
          )}
        </div>
      </Formik>
    </div>
  )
}

const Content = styled.div`
  padding: 24px;
  height: 400px;
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
`
