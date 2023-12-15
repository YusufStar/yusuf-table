'use client'

import {FC, useEffect, useState} from "react";
import {
    ColumnDef, ColumnFiltersState,
    getCoreRowModel,
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
    const [columnFilters, setColumnFilters ] = useState<ColumnFiltersState>([])
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

        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setCurrentPage,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,

        state: {
            sorting: sortable ? sorting : undefined,
            columnFilters,
            pagination: currentPage,
            columnVisibility: columnVisibility,
            rowSelection: rowSelection
        }
    });

    return (
        <div className="" >
            {/* Input */}
            {filters && (
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter First Name"
                        value={table.getColumn("first_name")?.getFilterValue() as string || ""}
                        onChange={e => table.getColumn("first_name")?.setFilterValue(e.target.value as string)}
                        className="max-w-sm outline-none !ring-0"
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger className="!ring-0 ml-4">
                            <Button variant="outline" className="!ring-0">
                                Columns
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="!ring-0">
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
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => {
                            return (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
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