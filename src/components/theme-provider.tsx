'use client'
import * as React from "react"
import {ThemeProvider as NextThemesProvider} from "next-themes"
import {type ThemeProviderProps} from "next-themes/dist/types"
import dynamic from "next/dynamic";

const ToastProvider = dynamic(() => import('@/components/toast-provider'), {ssr: false})

function ThemeProvider({children, ...props}: ThemeProviderProps) {
    return <NextThemesProvider {...props}>
        <ToastProvider>
            {children}
        </ToastProvider>
    </NextThemesProvider>
}

export default ThemeProvider