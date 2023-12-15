'use client'

import {FC, useEffect, useMemo, useState} from "react";
import {
    ColumnDef, ColumnFiltersState,
    getCoreRowModel, getFacetedMinMaxValues, getFacetedRowModel, getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel, PaginationState, SortingState
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
import {bool} from "prop-types";
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

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination?: boolean;
    sortable?: boolean;
    filters?: boolean;
    maxPerPage?: number;
}

function CustomTable<TData, TValue>({columns, data, pagination, sortable, filters, maxPerPage = 10}: DataTableProps<TData, TValue>) {
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

    const table = useReactTable({
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
            columnVisibility: columnVisibility,
            rowSelection: rowSelection,
            globalFilter,
        }
    });

    return (
        <div className="">
            {/* Input */}
            {filters && (
                <div className="flex items-center py-4">
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
                        <AlertDialogTrigger className="ml-4">
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
                                <AlertDialogAction onClick={() => setDt([])}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
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
                                                ? <TableHead key={header.id}>
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                                : <TableHead key={header.id}>
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
                                                            <SelectItem value="all">{header.column.columnDef.header}</SelectItem>
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