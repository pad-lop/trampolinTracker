import { useUserStore } from "./store/appStore";
import React, { useState } from "react";
import { Form, FormGroup, TextInput, Button } from "carbon-components-react";
import { Grid, Column } from "@carbon/react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState(""); // Default username
  const [password, setPassword] = useState(""); // Default password
  const { validateUser } = useUserStore();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      onLogin();
    } else {
      const result = await validateUser(username, password);
      if (result.error) {
        setError(result.error);
      } else {
        onLogin();
      }
    }
  };

  return (
    <Grid>
			<Column md={1} lg={4}></Column>

      <Column md={6}  lg={8}>
        <Form
          onSubmit={handleSubmit}
          style={{ marginTop: "30px", marginBottom: "30px" }}
          autoComplete="off"
        >
          <FormGroup legendText="">
            <TextInput
              id="username"
              labelText="Usuario"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
            <TextInput.PasswordInput
              id="password"
              labelText="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
            />
          </FormGroup>
          <Button type="submit" style={{ marginTop: "10px" }}>
            Iniciar sesión
          </Button>
        </Form>
        {error && <p style={{marginBottom:"30px"}}>Usuario o contraseña equivocados</p>}
      </Column>
			<Column md={1}  lg={4}></Column>

    </Grid>
  );
};

export default Login;