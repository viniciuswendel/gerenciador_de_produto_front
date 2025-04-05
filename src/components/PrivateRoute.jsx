import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom"


const PrivateRoute = ({ children }) => {
    const { usuario } = useContext(AuthContext)
    return usuario ? children : <Navigate to="/login" />
}

export default PrivateRoute