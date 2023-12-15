'use client'

import {FC, useEffect, useMemo, useState} from "react";
import {
    ColumnDef, ColumnFiltersState,
    getCoreRowModel, getFacetedMinMaxValues, getFacetedRowModel, getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel, PaginationState, SortingState, TableState, Updater
} from "@tanstack/table-core";
import {flexRender, useReactTable, VisibilityState} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import ModeToggle from "@/components/ThemeToggle";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {toast} from "react-toastify";
import {ArrowDownIcon} from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination?: boolean;
    sortable?: boolean;
    filters?: boolean;
    maxPerPage?: number;
    secretFields?: VisibilityState;
}

function CustomTable<TData, TValue>({columns, data, pagination, sortable, filters, maxPerPage = 10, secretFields}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState<string>("")
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [currentPage, setCurrentPage] = useState<PaginationState>({
        pageSize: maxPerPage,
        pageIndex: 0
    })
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [dt, setDt] = useState(data)
    const [addModalState, setAddModalState] = useState({})
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);

    const table = useReactTable({
        onStateChange(updater: Updater<TableState>): void {
        }, renderFallbackValue: undefined,
        data: dt,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),

        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setCurrentPage,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,

        state: {
            sorting: sortable ? sorting : undefined,
            columnFilters: columnFilters,
            pagination: currentPage,
            columnVisibility: {
                ...secretFields,
                ...columnVisibility
            },
            rowSelection: rowSelection,
            globalFilter,
        }
    });

    useEffect(() => {
        const result = {};

        columns.forEach((item) => {
            // @ts-ignore
            if (item?.accessorKey) {
                // @ts-ignore
                result[item?.accessorKey] = "";
            }
        });

        setAddModalState(result)
    }, [table])

    return (
        <div className="">
            {/* Input */}
            {filters && (
                <div className="flex items-center pb-8">
                    <Input
                        placeholder="Search all columns"
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(e.target.value as string)}
                        className="max-w-sm outline-none"
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger className=" ml-4">
                            <Button variant="outline" className="">
                                Columns
                                <ArrowDownIcon className="w-3.5 h-3.5 ml-2"/>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="">
                            {table.getAllColumns().filter(column => column.getCanHide()).map(column => {
                                return (
                                    <DropdownMenuCheckboxItem onCheckedChange={(value: boolean) => {
                                        column.toggleVisibility(!!value);
                                    }} checked={column.getIsVisible()} key={column.id} className="capitalize">
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <ModeToggle className="ml-4"/>

                    <Button disabled={table.getFilteredSelectedRowModel().rows.length === 0} onClick={() => {
                        const filtered = dt.filter((item, index) => {
                            // @ts-ignore
                            return !rowSelection[index] || true;
                        });

                        setDt(filtered)
                        table.toggleAllRowsSelected(false)
                    }} variant="outline" className="ml-auto">
                        Delete Selected Rows
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger disabled={dt.length === 0} className="ml-4 disabled:pointer-events-none disabled:opacity-50">
                            <Button variant="outline">
                                Delete All
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Delete all rows
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                    setDt([])
                                    toast.error("Deleted All Row's")
                                }}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
                        <DialogTrigger asChild className="ml-4">
                            <Button variant="outline">Add Data</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <form className="outline-none rounded-md" onSubmit={(e) => {
                                e.preventDefault()
                                const x = addModalState
                                // @ts-ignore
                                setDt(prevState => {
                                    const res = [...prevState, x]
                                    toast.success(`New Data Created`)
                                    return res
                                })
                                setOpenAddModal(false)
                                setAddModalState({})
                            }}>
                            <DialogHeader>
                                <DialogTitle>Add Data</DialogTitle>
                                <DialogDescription>
                                    Click add when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {columns
                                    // @ts-ignore
                                    .filter(x => x?.enableForm)
                                    .map((column) => (
                                    <div className="grid grid-cols-4 items-center gap-4" key={column.id}>
                                            <Label htmlFor="name" className="text-right w-fit capitalize">
                                                {// @ts-ignore
                                                    column?.accessorKey?.replaceAll("_", " ") as string}
                                            </Label>
                                            <Input
                                                onChange={(event) => setAddModalState(prevState => ({...prevState, [column?.accessorKey]: event.target.value}))}
                                                type={column?.type}
                                                required
                                                id={column?.accessorKey as string}
                                                placeholder={column?.accessorKey?.replaceAll("_", " ") as string}
                                                className="col-span-3"
                                            />
                                    </div>
                                ))}
                            </div>
                            <DialogFooter>
                                <DialogClose className="mr-4">
                                    <Button variant="secondary" type="reset">
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button type="submit" variant="destructive">Add Data</Button>
                            </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            )}

            {/* Table */}
            <div className="rounded-md">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => {
                            return (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                            !header.column.getCanFilter()
                                                ? <TableHead className="w-fit" key={header.id}>
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                                : <TableHead className="w-fit" key={header.id}>
                                                    <Select onValueChange={e => {
                                                        if(e === "all") {
                                                            return header.column.setFilterValue("")
                                                        }
                                                        header.column.setFilterValue(e)
                                                    }}>
                                                    <SelectTrigger className="!ring-0 w-36 !ring-transparent">
                                                        <SelectValue className="!ring-0 !ring-transparent" placeholder={header.column.columnDef.header as string}/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Filter {header.column.columnDef.header as string}</SelectLabel>
                                                            <SelectItem value="all">All</SelectItem>
                                                            {Array.from(header.column.getFacetedUniqueValues().keys()).map((value, key) => (
                                                                <SelectItem value={value}>{value}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                </TableHead>
                                    ))}
                                </TableRow>
                            )
                        })}
                    </TableHeader>

                    <TableBody>
                        {pagination
                            ? table.getPaginationRowModel().rows?.length ? (
                                table.getPaginationRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell>
                                        No Results
                                    </TableCell>
                                </TableRow>
                            )
                            : table.getCoreRowModel().rows?.length ? (
                                table.getCoreRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell>
                                        No Results
                                    </TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center w-fit justify-center space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => {
                    table.previousPage()
                }}
                        disabled={!table.getCanPreviousPage()}
                >Previous</Button>
                <Button variant="outline" size="sm" onClick={() => {
                    table.nextPage()
                }}
                        disabled={!table.getCanNextPage()}
                >Next</Button>
            </div>

            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of {' '}
                {table.getFilteredRowModel().rows.length} row(s) selected
            </div>
        </div>
    )
}

export default CustomTable