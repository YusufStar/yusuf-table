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
        enableColumnFilter: false,
    },
    {
        header: ({column}) => <TableSortable column={column}>Id</TableSortable>,
        accessorKey: "id",
        enableColumnFilter: false,
    },
    {
        header: "Photo",
        accessorKey: "photo",
        cell: TableImage,
        enableColumnFilter: false,
    },
    {
        header: ({column}) => <TableSortable column={column}>First Name</TableSortable>,
        accessorKey: "first_name",
        enableColumnFilter: false,
        enableForm: true,
        type: "text"
    },
    {
        header:  ({column}) => <TableSortable column={column}>Last Name</TableSortable>,
        accessorKey: "last_name",
        enableColumnFilter: false,
        enableForm: true,
        type: "text"
    },
    {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
        enableForm: true,
        type: "email",
    },
    {
        header: "Gender",
        accessorKey: "gender",
        enableColumnFilter: true,
        enableForm: true,
        type: "text"
    },
    {
        header: "Date of birth",
        accessorKey: "date_of_birth",
        cell: TableDate,
        enableColumnFilter: false,
        enableForm: true,
        type: "date"
    },
    {
        header: "Department",
        accessorKey: "department",
        enableColumnFilter: true,
        enableForm: true,
        type: "text",
    },
    {
        header: "Password",
        accessorKey: "password",
        enableColumnFilter: false,
        enableHiding: false,
        enableSorting: false,
        enableForm: true,
        type: "password"
    },
    {
        id: "actions",
        cell: TableActions
    }
]