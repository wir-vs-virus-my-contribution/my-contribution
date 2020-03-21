import * as React from "react"
import "./App.css"
import { Menu, Icon, Layout, Breadcrumb } from "antd"
import { Introduction } from "./Introduction"
import { Link, Router } from "@reach/router"
import { CreateContact } from "./contacts/create-contact"
const { Header, Footer, Sider, Content } = Layout

function App() {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible={true} collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: "32px",
            background: "rgba(255, 255, 255, 0.2)",
            margin: "16px",
          }}
        />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item>
            <Link to="/contacts/create">
              <Icon type="user" />
              <span>Create contact</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>

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
            <Menu.Item key="mail">
              <Icon type="mail" />
              Mail
            </Menu.Item>
            <Menu.SubMenu
              title={
                <span>
                  <Icon type="setting" />
                  Settings
                </span>
              }
            >
              <Menu.ItemGroup title="Item 1">
                <Menu.Item key="setting:1">Option 1</Menu.Item>
                <Menu.Item key="setting:2">Option 2</Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup title="Item 2">
                <Menu.Item key="setting:3">Option 3</Menu.Item>
                <Menu.Item key="setting:4">Option 4</Menu.Item>
              </Menu.ItemGroup>
            </Menu.SubMenu>
          </Menu>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>

          <div style={{ padding: 10, background: "white" }}>
            <Router primary={false}>
              <Introduction path="/" />
              <CreateContact path="/contacts/create" />
            </Router>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>asp-antd-react</Footer>
      </Layout>
    </Layout>
  )
}

export default App
