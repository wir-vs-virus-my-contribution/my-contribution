import * as React from "react"
<<<<<<< HEAD
import {} from "react-router-dom"
import { Modal } from "antd"

export function Detail() {
  const params = useParams()
  return <Modal></Modal>
=======
import { useParams } from "react-router"
import { Modal, notification } from "antd"
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
>>>>>>> add search prototype
}
