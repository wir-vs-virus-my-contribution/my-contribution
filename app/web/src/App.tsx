import * as React from "react"
import "./App.css"
import { Menu, Layout, Breadcrumb } from "antd"
import { UserOutlined } from "@ant-design/icons"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { LandingPage } from "./landing-page/landig-page"
import { RegisterView } from "./registration"
const { Header, Footer, Sider, Content } = Layout

function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Header style={{ background: "#fff", height: "auto", padding: 0 }}>
          <Menu
            mode="horizontal"
            style={{
              gridColumnStart: 2,
              gridColumnEnd: 3,
              display: "flex",
              flexDirection: "row-reverse",
            }}
            selectedKeys={[]}
          >
            <Menu.Item>
              <Link to="/foo">FAQ</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/foo">KONTAKT</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ margin: "16px" }}>
          <div style={{ padding: 10, background: "white", display: "flex" }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<RegisterView />} />
              <Route path="/foo" element={<div>bar</div>} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>WirVsCorona</Footer>
      </Layout>
    </Layout>
  )
}

function Root() {
  return (
    <Router>
      <App />
    </Router>
  )
}

export default Root
