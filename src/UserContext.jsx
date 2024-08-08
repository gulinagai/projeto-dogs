import React from 'react'
import { TOKEN_POST, USER_GET, TOKEN_VALIDATE_POST } from './Api'
import { useNavigate } from 'react-router-dom'

export const UserContext = React.createContext()

export const UserStorage = ({ children }) => {
  const [data, setData] = React.useState(null)
  const [login, setLogin] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const navigate = useNavigate()

  
  const userLogout = React.useCallback(async function () {
    setData(null)
    setError(null)
    setLoading(false)
    setLogin(false)
    window.localStorage.removeItem('token')
    navigate('/login')
  }, [navigate])


  async function getUser(token) {
    const {url, options} = USER_GET(token)
    const response = await fetch(url, options)
    const json = await response.json()
    setData(json)
    setLogin(true)
  }

  async function userLogin(username, password) {
    try {
        setError(null)
        setLoading(true)
        const {url, options} = TOKEN_POST({
            username, 
            password
          })
          // aqui eu enviei o username e senha validados(estão nos padrões aceitos) e farei o fetch para obter um token(autenticação, o token é único.)
          const tokenRes = await fetch(url, options)
          console.log(tokenRes)
          if(!tokenRes.ok) throw new Error(`Erro: Usuário Inválido.`)
            // esse erro criado acima será o erro dentro de 'err' no catch
          const { token } = await tokenRes.json()
          window.localStorage.setItem('token', token)
          await getUser(token)
          navigate('/conta')
    } catch (err) {
        setError(err.message)
        setLogin(false)
    } finally {
        setLoading(false)
    }
  } 

  React.useEffect(()=>{
    async function autoLogin() {
        const token = window.localStorage.getItem('token')
        if(token) {
            try {
                setError(null)
                setLoading(true)
                const { url, options } = TOKEN_VALIDATE_POST(token)
                const response = await fetch(url, options)
                if(!response.ok) throw new Error ('Token inválido')
                await getUser(token)
                // essa função realiza um login automatico caso já exista um token no localStorage quando o usuário entrar
                // será feito um fetch post enviando o token do localStorage para verificar se ele é válido ou não, é isso que a resposta do json retorna.
                // a função getUser() fará com que seja puxado os dados do usuário, pois é uma função get
                // se o response não for ok, ele automaticamente vai para o catch, com o erro 'Token inválido', não passando pela função getUser(), responsável por mostrar os dados do usuário na tela
            } catch (err) {
                userLogout()
            } finally {
                setLoading(false)
            }
        } else {
          setLogin(false)
        }
    }
    autoLogin()
  }, [userLogout])

  return (
    <UserContext.Provider value={{ userLogin, data, userLogout, error, loading, login }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
