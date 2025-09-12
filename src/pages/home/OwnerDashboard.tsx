import Navbar from "../../containers/Navbar";
import { useUser } from "../../hooks/useUser";

function OwnerDashboard() {
  let user = useUser();

  return (
    <div className="md:h-full p-3">
      <div className="h-full p-1 md:p-4">
        <Navbar heading="Shop Owner Dashboard"/>
        <div className="md:flex w-full md:justify-center md:items-center">
          <div className="md:min-w-2xl lg:min-w-2xl md:px-4">
            <div className="border-1 rounded-2xl border-gray-200 p-4 flex flex-col items-start justify-center my-12 shadow-xl">

              <p className="text-[22px] font-[700] md:text-[32px] text-[#232323] ">Welcome, {user.name}</p>

              <p className="text-[18px] md:text-[22px] font-[400] text-[#969696] py-4 ">Email: {user.email}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}


export default OwnerDashboard