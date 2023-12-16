'use client';

import {FC} from "react";
import CustomTable from "@/components/table/CustomTable";
import {data} from "@/data";
import {TestColumns} from "@/lib/columns";

const Page: FC<{}> = () => {
    return <div className="w-screen h-screen flex flex-col items-center justify-center gap-12">
        <h1>Table Task</h1>

        <div className="container py-10 mx-auto">
            <CustomTable
                secretFields={{
                    "password": false
                }}
                columns={TestColumns}
                data={data}
                filters={true}
                maxPerPage={5}
                pagination={true}
                sortable={true}
            />
        </div>
    </div>
}

export default Page