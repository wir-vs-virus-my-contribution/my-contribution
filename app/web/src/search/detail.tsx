import * as React from "react"
import { Modal } from "antd"
import { useParams } from "react-router"
import { useNavigate } from "react-router-dom"
import { useQuery } from "react-query"

export function Detail() {
  const { id } = useParams<{ id: string }>()
  const { data, status, error } = useQuery(
    id,
    fetch(`/api/offer/${id}`).then(v => v.json()),
  )
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
      {JSON.stringify(data, null, 4)}
    </Modal>
  )
}
