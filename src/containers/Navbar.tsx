import { useNavigate } from "react-router-dom"
import Logoicon from "../components/icons/Logoicon"

interface NavbarProps{
   heading:string;
}

const Navbar:React.FC<NavbarProps>=({heading})=>{
    const navigate = useNavigate()
    const signOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }
    return <div className="logo flex place-items-center justify-between">
        <div className="flex place-items-center">
            <Logoicon />
            <div className="text-[20px] md:text-[24px] font-[500] md:font-[600] pl-10">
                {heading}
            </div>
        </div>
        <div className="text-[14px] md:text-[16px] font-[500] md:font-[600] text-[#367AFF] underline" onClick={signOut}>
            Sign Out
        </div>
    </div>
}


export default Navbar