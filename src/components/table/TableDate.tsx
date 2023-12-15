'use client'

import {FC} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";

const TableActions : FC<{row: any;}> = ({row}) => {
    const date_of_birth = row.getValue("date_of_birth")
    const formatted = new Date(date_of_birth as string).toLocaleDateString("TR-tr")
    return <span className="font-medium">{formatted}</span>
}

export default TableActions