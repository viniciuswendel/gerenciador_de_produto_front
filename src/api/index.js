// import axios from 'axios';

// const instance = axios.create({
//     baseURL: 'http://localhost:8080'//3000 era do jsonServer
// })

// instance.interceptors.request.use(
//      (config) => {
//         const token = localStorage.getItem("token")
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`
//         }
//         return config
//      },
//      (error) => Promise.reject(error)
// )

// export default instance

import axios from 'axios'

// Lê a URL da API do arquivo .env
const baseURL = import.meta.env.VITE_API_URL

/**
 * “Interceptor é como um ‘porteiro’ que intercepta todas as requisições que o front envia para o backend. Se você tiver um token, ele automaticamente coloca esse token no cabeçalho da requisição. Isso evita que a gente tenha que escrever esse código manualmente toda vez.”
 * INTERCEPTOR DE REQUISIÇÃO
 * 
 * Antes de qualquer requisição ser enviada para o backend,
 * esse interceptor é executado automaticamente.
 * 
 * Aqui, estamos pegando o token salvo no localStorage (caso exista)
 * e adicionando ele no cabeçalho da requisição (Authorization).
 * 
 * Isso é essencial para acessar rotas protegidas no backend com segurança.
 */
const instance = axios.create({
  baseURL: baseURL 
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // Recupera o token salvo
    if (token) {
      config.headers.Authorization = `Bearer ${token}` // Adiciona o token no header
    }
    return config // Retorna a configuração modificada da requisição
  },
  (error) => Promise.reject(error) // Caso haja erro ao configurar a requisição
)

export default instance