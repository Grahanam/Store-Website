

export const useUser=()=>{
    const storedUser=localStorage.getItem('user');
    const token=localStorage.getItem('token');
    let user=null;
    if(storedUser){
       try{
           user=JSON.parse(storedUser);
           user.token=token;
       }catch(error){
        console.error("Failed to parse user from localstorage",error)
       }
    }

    return user
}