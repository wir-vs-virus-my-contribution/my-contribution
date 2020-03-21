import * as React from "react"
import "./App.css"
import { Menu, Layout, Breadcrumb } from "antd"
import { UserOutlined, GithubOutlined } from "@ant-design/icons"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { LandingPage } from "./landing-page/landig-page"
import { RegisterView } from "./registration"
import { Search } from "./search"
<<<<<<< HEAD
=======
import { Detail } from "./search/detail"
>>>>>>> add search prototype
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
            <Menu.Item>
              <Link to="www.github.com" />
              <GithubOutlined />
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ margin: "16px" }}>
          <div
            style={{
              padding: 10,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<RegisterView />} />
              <Route path="/search" element={<Search />}>
                <Route path=":id" element={<Detail />}></Route>
              </Route>
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
