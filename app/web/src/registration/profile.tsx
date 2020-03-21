import * as React from "react"
import { Modal } from "antd"
import { useNavigate } from "react-router-dom"
import { Offer } from "../models/helpers/Offer"

export function Profile({ offer }: { offer: Offer }) {
  const navigate = useNavigate()
  return (
    <Modal
      title="Danke!"
      visible={true}
      onOk={() => {
        navigate("/")
      }}
    >
      {JSON.stringify(offer, null, 4)}
    </Modal>
  )
}
