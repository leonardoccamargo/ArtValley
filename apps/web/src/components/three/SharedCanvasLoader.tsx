"use client";

import dynamic from "next/dynamic";

export const SharedCanvasLoader = dynamic(() => import("./SharedCanvas"), { ssr: false });
