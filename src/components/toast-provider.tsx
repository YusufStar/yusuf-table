import {ToastContainer} from "react-toastify";
import * as React from "react";
import {useTheme} from "next-themes";

const ToastProvider = ({ children }: { children: any }) => {
    const { theme } = useTheme()

        return (
            <>
                <ToastContainer className="text-xs font-semibold" theme={theme}/>
                {children}
            </>
        )
}

export default ToastProvider