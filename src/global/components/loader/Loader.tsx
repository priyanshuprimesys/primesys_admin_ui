import {ColorRing} from "react-loader-spinner";


const Loader = () => {
    return (
        <>
             <div className="h-[100vh] w-full flex items-center justify-center">
                <ColorRing
                    visible={true}
                    height={100}
                    width={100}
                    ariaLabel="color-ring-loading"
                    wrapperClass="color-ring-wrapper"
                    colors={['#2E6FF2', '#26488C', '#0D1526', '#1D3759', '#A7BDD9']}
                />
            </div>
        </>

    );
};



export default Loader;