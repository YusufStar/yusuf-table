'use client'
import {ToastContainer} from "react-toastify";
import {useTheme} from "next-themes";

const ToastProvider = ({ children }: { children: any }) => {
    const { theme } = useTheme()

        return (
            <div>
               <ToastContainer className="text-xs font-semibold" theme={theme}/>
                {children}
            </div>
        )
}

export default ToastProvider