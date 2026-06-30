## Global Data Table

import DataTable from "global/DataTable/DataTable";

Need Input:

* Data type `Array`
* Columns:

  * ```
    const column:interface of Table<interface of Data>[]=[
        {
          accessorKey: type String;
          header: type String;
          cell: string | number| boolean| ReactElement;
        }
    ];

    example: 
    const column:DataTableColumnInterface<UserInterface>[]=[
       {
                accessorKey:'id',
                header:'Id',
                cell:(props)=> <>{props.getValue()}</>
            },
            {
                accessorKey:'name',
                header:'Name',
                cell:(props)=> <>{props.getValue()}</>
            },

    ]
    ```
