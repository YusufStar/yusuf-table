'use client'
import TableSortable from "@/components/table/TableSortable";
import TableImage from "@/components/table/TableImage";
import TableDate from "@/components/table/TableDate";
import TableActions from "@/components/table/TableActions";
import {Checkbox} from "@/components/ui/checkbox";

export const TestColumns = [
    {
        id: "select",
        header: ({ table }) => {
            return <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}>
            </Checkbox>;
        },
        cell: ({ row }) => {
            return <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}>
            </Checkbox>;
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        header: ({column}) => <TableSortable column={column}>Id</TableSortable>,
        accessorKey: "id",
    },
    {
        header: "Photo",
        accessorKey: "photo",
        cell: TableImage,
    },
    {
        header: "First Name",
        accessorKey: "first_name"
    },
    {
        header: "Last Name",
        accessorKey: "last_name"
    },
    {
        header: "Email",
        accessorKey: "email"
    },
    {
        header: "Gender",
        accessorKey: "gender"
    },
    {
        header: "Date of birth",
        accessorKey: "date_of_birth",
        cell: TableDate
    },
    {
        header: "Department",
        accessorKey: "department",
    },
    {
        id: "actions",
        cell: TableActions
    }
]