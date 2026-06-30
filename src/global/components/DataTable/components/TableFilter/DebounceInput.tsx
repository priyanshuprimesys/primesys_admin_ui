import { useEffect, useState } from "react";


// interface DebounceProps{
//     value: string | number;
//     onChange:(value:string|number)=>void;
//     debounce?:number;
//     className:string;
//     placeHolder:string;
//     type:string;
// }



// const DebounceInput: React.FC<DebounceProps> = ({value:initialValue,onChange,debounce=500,className,placeHolder,type}) => {
//     const [value, setValue] = useState(initialValue);

//     useEffect(()=>{
//         setValue(initialValue);
//     },[initialValue]);

//     useEffect(()=>{
//         const timeOut = setTimeout(()=>{
//             onChange(value);
//         },debounce);

//         return () => clearTimeout(timeOut);
//     },[value]);

//   return (
//     <>
//      <input type={type ? type : "text"} className={className} placeholder={placeHolder} value={value} onChange={e=> setValue(e.target.value)} /> 
//     </>
//   )
// }

// export default DebounceInput

export function DebounceInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = useState(initialValue);
  
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value);
      }, debounce);
  
      return () => clearTimeout(timeout);
    }, [value]);
  
    return (
      <input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  }
