import * as React from "react"
import {
  Input,
  FormikDebug,
  SubmitButton,
  FormItem,
  ResetButton,
} from "formik-antd"
import { Formik } from "formik"
import { message, PageHeader } from "antd"

interface Contact {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export const CreateContact = (props: any) => {
  return (
    <Formik<Contact>
      initialValues={{
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
      }}
      validate={values => {
        return values.firstName ? undefined : { firstName: "required" }
      }}
      onSubmit={async values => {
        const response = await fetch("/api/Contacts/create?api-version=1.0", {
          method: "POST",
          body: JSON.stringify(values),
          headers: { "content-type": "application/json" },
        })
        if (response.ok) {
          message.success("success")
        } else {
          message.error("error: " + response.statusText)
        }
      }}
    >
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: 10 }}
      >
        <div style={{ display: "grid", gridGap: 10, maxWidth: 400 }}>
          <PageHeader
            title="Create Contact"
            extra={[
              <SubmitButton>Create</SubmitButton>,
              <ResetButton>Reset</ResetButton>,
            ]}
          >
            <FormItem name="firstName" label="Firstname">
              <Input name="firstName" />
            </FormItem>
            <FormItem name="lastName" label="Lastname">
              <Input name="lastName" />
            </FormItem>
            <FormItem name="email" label="Email">
              <Input name="email" />
            </FormItem>
            <FormItem name="phone" label="Phone">
              <Input name="phone" />
            </FormItem>
          </PageHeader>
        </div>
        <div>
          <FormikDebug />
        </div>
      </div>
    </Formik>
  )
}
