"use client"

import * as React from "react"
import {ThemeProvider as NextThemesProvider, useTheme} from "next-themes"
import {type ThemeProviderProps} from "next-themes/dist/types"
import {ToastContainer} from "react-toastify";
import ToastProvider from "@/components/toast-provider";

export function ThemeProvider({children, ...props}: ThemeProviderProps) {

    return <NextThemesProvider {...props}>
        <ToastProvider>
            {children}
        </ToastProvider>
    </NextThemesProvider>
}
