
function logout(){
    return new Promise(()=>{
        return true;
    })
}



export const dataLoader = async() => {
     alert('data');
     const data= await logout();
     return data;
}


