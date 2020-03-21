import * as React from "react"
import styled from "styled-components"
import { Row, Button } from "antd"
import { useNavigate } from "react-router-dom"

const StockPhoto = styled.div`
  height: 400px;
  margin: 20px;
  background: gray;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const PrimaryButton = styled(Button)`
  width: 200px;
`

const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
`

export function LandingPage() {
  const navigate = useNavigate()
  return (
    <Container>
      <StockPhoto />

      <Buttons>
        <PrimaryButton
          size="large"
          type="primary"
          onClick={() => navigate("/register")}
        >
          Ich möchte helfen
        </PrimaryButton>
        <PrimaryButton size="large" type="primary">
          Ich suche Hilfe
        </PrimaryButton>
      </Buttons>
      <Row>
        <Button>Ich kenne jemanden...</Button>
      </Row>
    </Container>
  )
}
