import * as React from "react"
import { Modal, Row, Button, Col } from "antd"
import { useParams } from "react-router"
import { useNavigate } from "react-router-dom"
import { useQuery } from "react-query"
import { ErrorBanner } from "../utils"
import { Offer } from "../models/helpers/Offer"
import { MailOutlined } from "@ant-design/icons"

export function Detail() {
  const { id } = useParams<{ id: string }>()
  const { data: offer, error } = useQuery(id, async () => {
    const response = await fetch(`/api/offer/${id}`)
    const data = (await response.json()) as Offer
    return data
  })
  const navigate = useNavigate()

  return (
    <Modal
      afterClose={() => navigate("..")}
      style={{ height: 500 }}
      visible={true}
      footer={[
        <Button
          onClick={() => {
            navigate("..")
          }}
          key="contact"
        >
          Schließen
        </Button>,
        <Button
          key="contact"
          onClick={() => {
            navigate("..")
          }}
          type="primary"
          icon={<MailOutlined />}
        >
          Kontaktieren
        </Button>,
      ]}
    >
      <ErrorBanner message={error} />
      {offer && (
        <div>
          {Object.keys(offer).map((v, i) => (
            <Row key={i}>
              <Col md={6}>
                <b>{v}</b>
              </Col>
              <Col md={18}>{offer[v]}</Col>
            </Row>
          ))}
        </div>
      )}
    </Modal>
  )
}
