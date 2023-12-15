'use client'

import {FC} from "react";
import {Button} from "@/components/ui/button";
import {ArrowUpDownIcon} from "lucide-react";

const TableSortable: FC<{ column: any, children: any }> = ({column, children}) => {
    return (
        <Button variant="ghost" onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc")
        }}>
            {children}
            <ArrowUpDownIcon className="ml-1 h-4 w-4"/>
        </Button>
    )
}

export default TableSortable