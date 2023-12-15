'use client'
import Image from "next/image";
import {FC} from "react";

const TableImage : FC<{row: any;}> = ({row}) => {
        const val = row?.getValue("photo")
        if(row?.getValue("photo")  && val !==0) {
            return <img draggable="false" className="object-contain w-2/3 rounded-full bg-slate-200" src={val} alt={row.id}/>
        } else {
            return <Image draggable="false" width={1024} height={1024} className="object-contain w-2/3" src="/no-image2.png" alt={row.id}/>
        }
}

export default TableImage