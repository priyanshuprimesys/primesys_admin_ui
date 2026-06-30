import { useEffect, useRef, useState } from "react";
import { IStudentDevice } from "../../../../../../interfaces/AppInterfaces/StudentDeviceInterface/StudentDeviceInterface";
import { useGetStudentDeviceDetailQuery } from "../../../../../../api/queries/app/hooks/student-device-detail-api-hooks";

type Props = {
    divisionId: string;
    selected: number[];
    onChange: (students: number[]) => void;
};

export default function MultiStudentSelect({ divisionId, selected, onChange }: Props) {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data, isFetching } = useGetStudentDeviceDetailQuery(divisionId);
    const allStudents = data?.data.data.result ?? [];

    const filtered = allStudents.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) &&
            !selected.some((sel) => sel === s.imeiNo)
    );

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const add = (student: IStudentDevice) => {
        onChange([...selected, student.imeiNo]);
        setSearch("");
        setOpen(true);
    };


    const remove = (studentId: number) => {
        onChange(selected.filter((s) => s !== studentId));
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <div
                className={`flex flex-wrap gap-1.5 border-2 rounded-lg px-3 py-2 min-h-[40px] cursor-text bg-white transition-colors ${open ? "border-blue-500 ring-1 ring-blue-200" : "border-gray-300 hover:border-gray-400"}`}
                onClick={() => { setOpen(true); inputRef.current?.focus(); }}
            >
                {selected.map((imei, index) => {
                    const student = allStudents.find((s) => s.imeiNo === imei);
                    return (
                        <span
                            key={index}
                            className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-2 py-1 rounded-md"
                        >
                            {student ? student.name : imei}
                            <button
                                type="button"
                                className="ml-0.5 text-blue-400 hover:text-blue-700 leading-none text-sm"
                                onClick={(e) => { e.stopPropagation(); remove(imei); }}
                            >
                                &times;
                            </button>
                        </span>
                    );
                })}
                <input
                    disabled={!divisionId}
                    ref={inputRef}
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    placeholder={selected.length === 0 ? (divisionId ? "Search and select students…" : "Select a parent first") : ""}
                    className="flex-1 min-w-[160px] outline-none text-sm bg-transparent text-gray-700 placeholder:text-gray-400"
                />
                {selected.length > 0 && (
                    <span className="ml-auto self-center text-xs text-gray-400 shrink-0">
                        {selected.length} selected
                    </span>
                )}
            </div>

            {open && divisionId && (
                <div className="absolute z-[1200] top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-lg shadow-xl max-h-56 overflow-y-auto">
                    {isFetching && (
                        <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-400">
                            <span className="animate-spin text-base">⟳</span> Loading students…
                        </div>
                    )}
                    {!isFetching && filtered.length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-400">
                            {search ? `No results for "${search}"` : "All students selected"}
                        </div>
                    )}
                    {filtered.map((s) => (
                        <button
                            key={s.studentId}
                            type="button"
                            onClick={() => add(s)}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 flex justify-between items-center gap-3 border-b border-gray-50 last:border-0"
                        >
                            <span className="font-medium text-gray-800">{s.name}</span>
                            <span className="text-xs text-gray-400 shrink-0">{s.imeiNo}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
