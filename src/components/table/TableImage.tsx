'use client'
import Image from "next/image";
import {FC} from "react";

const TableImage : FC<{row: any;}> = ({row}) => {
        const val = row?.getValue("photo")
        if(row?.getValue("photo")  && val !==0) {
            return <img className="object-fill !w-8 !h-8 rounded-full bg-slate-200" src={val} alt={row.id}/>
        } else {
            return <Image width={1024} height={1024} className="object-cover !w-8 !h-8" src="/no-image2.png" alt={row.id}/>
        }
}

export default TableImage