
interface StaticProps {
    name: string;
    disabled?: boolean;
    onHandleButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    padding?:string;
    width?:string;
    success:boolean;
}

const StaticCssButton: React.FC<StaticProps> = ({ name, disabled, onHandleButtonClick,padding,width,success }) => {

    const defaultCss = `appearance-none opacity-100 user-select-none touch-manipulation active:translate-y-px duration-300 transition-all duration-300 align-top whitespace-nowrap  translate-y-0 duration-300 shadow-buttonShadow hover:shadow-buttonHoverShadow rounded border-none ${success ? 'bg-[#27ae60] hover:bg-[#1e8449]' : 'bg-[#be2f19] hover:bg-[#84201e]'} box-border text-white cursor-pointer inline-block font-semibold text-base tracking-normal leading-6 outline-none overflow-hidden relative text-center no-underline`;
    const disabledCss = `${success ? 'bg-theme-successColor text-white font-medium':'bg-red-700 text-white font-medium'} cursor-pointer rounded`;

    return (
        <button
            disabled={disabled}
            onClick={onHandleButtonClick}
            className={`${disabled ? disabledCss : defaultCss} ${width ? width: 'w-full'} ${padding ? padding : 'py-2 px-2'}`} role="button">
            {name}
        </button>
    )
}

export default StaticCssButton
