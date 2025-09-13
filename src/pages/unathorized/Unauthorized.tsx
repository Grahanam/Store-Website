import { useNavigate } from "react-router-dom"
import { useUser } from "../../hooks/useUser"
import { useEffect } from "react"


function Unauthorized() {
    const navigate = useNavigate()
    const user = useUser()
    function todashboard() {
        if (user.role == 'admin') {
            navigate('/adminDashboard')
        } else if (user.role == "owner") {
            navigate('/ownerDashboard')
        } else {
            navigate('/')
        }
    }
    useEffect(()=>{
         todashboard()
    },[])
    return <>
        <div className="flex flex-col h-full justify-center ">
            <h1>Unauthorized Page</h1>
            <br/>
            <button  className=" rounded-md bg-[#367AFF] py-2 px-4 border border-transparent text-center text-[16px] md:text-[18px] text-white font-[600] transition-all shadow-md hover:shadow-lg focus:bg-slate-700" onClick={todashboard}>
                Navigate Back to Dashboard
            </button>
        </div>
    </>
}

export default Unauthorized