

export const useUser=()=>{
    const storedUser=localStorage.getItem('user');
    let user=null;
    if(storedUser){
       try{
           user=JSON.parse(storedUser);
       }catch(error){
        console.error("Failed to parse user from localstorage",error)
       }
    }

    return user
}