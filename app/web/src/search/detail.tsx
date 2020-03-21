import * as React from "react"
import { Modal } from "antd"
import { useParams } from "react-router"
import { useNavigate } from "react-router-dom"

export function Detail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <Modal
      afterClose={() => navigate("..")}
      visible={true}
      onOk={() => {
        navigate("..")
      }}
      onCancel={() => {
        navigate("..")
      }}
    >
      hello
    </Modal>
  )
}
