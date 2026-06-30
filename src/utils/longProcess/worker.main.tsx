const useWebWorker = () =>{

    
   const  myWorker = new Worker(new URL('./myworker.ts',import.meta.url),{type:"module"});
       
    
  

    const onWebWorkerConnect = () =>{
        myWorker.postMessage("Hello Response data");
    }


    myWorker.onmessage = (message:MessageEvent) =>{
        const response = message.data;
        return response;
    }


    return{
        onWebWorkerConnect,
    }
}



export default useWebWorker;