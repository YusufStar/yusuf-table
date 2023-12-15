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
        footer: props => props.column.id,
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
    },
    {
        header:  ({column}) => <TableSortable column={column}>Last Name</TableSortable>,
        accessorKey: "last_name",
        enableColumnFilter: false,
    },
    {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
    },
    {
        header: "Gender",
        accessorKey: "gender",
        enableColumnFilter: true,
    },
    {
        header: "Date of birth",
        accessorKey: "date_of_birth",
        cell: TableDate,
        enableColumnFilter: false,
    },
    {
        header: "Department",
        accessorKey: "department",
        enableColumnFilter: true,
    },
    {
        id: "actions",
        cell: TableActions
    }
]