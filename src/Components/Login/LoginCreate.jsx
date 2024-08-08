import React from 'react'
import Input from '../Forms/Input'
import Button from '../Forms/Button'
import Error from '../Helper/Error'
import useForm from '../../Hooks/useForm'
import { USER_POST } from '../../Api'
import UserContext from '../../UserContext'
import useFetch from '../../Hooks/useFetch'
import Head from '../Helper/Head'

const LoginCreate = () => {
  const username = useForm()
  const email = useForm('email')
  const password = useForm('password')

  const { userLogin } = React.useContext(UserContext)
  const { loading, error, request } = useFetch()

  async function handleSubmit(event) {
    event.preventDefault()
    const { url, options } = USER_POST({
      username: username.value,
      email: email.value,
      password: password.value,
    })
    // no lugar de fetch, utiliza o 'request', ele foi criado à mão no hook useFetch, possui a mesma usabilidade do fetch, mas ele lida com os estados de data, loading e error e retorna um objeto contendo o response e o json.
    const { response } = await request(url, options)
    console.log(response)
    if(response.ok) userLogin(username.value, password.value)
  }

  return (
    <section className="animeLeft">
      <Head title="Crie sua conta"/>
      <h1 className="title">Cadastre-se</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="Usuário"
          type="text"
          name="username"
          {...username}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          {...email}
        />
        <Input
          label="Senha"
          type="password"
          name="password"
          {...password}
        />
        {loading ? (
          <Button disabled>Cadastrando...</Button>
        ) : (
          <Button>Cadastrar</Button>
        )}
        <Error error={error}/>
      </form>
    </section>
  )
}

export default LoginCreate
