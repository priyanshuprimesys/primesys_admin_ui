import "../../styles/GlobalCss.css";


interface ButtonProps {
  onHandleSubmit?: () => void;
  success: boolean;
  isLoading?:boolean | null;
  name?:string;
  type?:"button" | "submit" | "reset";
  customWidth?:string;
}



const Button: React.FC<ButtonProps> = ({ onHandleSubmit, success,isLoading,name,type,customWidth }) => {
  return (
    <button
      onClick={onHandleSubmit}
      type={type ? type : "button"}
      className={`outline-none 
        ripple
                overflow-hidden
                ${customWidth ? customWidth : 'w-full'} 
                bg-gradient-to-r
                ${success ?
          'from-green-700 to-green-600 border-2 hover:border-green-900 border-green-600 text-white'
          :
          'text-black bg-white border-2 border-red-700'} 
                 
                font-medium 
                rounded-lg 
                text-sm 
                px-5 
                py-2.5 
                me-2 
                mb-2
                uppercase
                tracking-wider
                transition-all
                duration-300
                ease-in
                hover:shadow-hoverBlackShadow`}>
                 
      {/* {isLoading ? 'Loading....' : success ? name ?  name : 'Save' : 'Cancel'} */}
      {isLoading ? 'Loading....' :  name ? name : success ? 'Save' : 'Cancel'}
      
    </button>
  )
}

export default Button
