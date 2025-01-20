import { FormControl, TextField } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { Col, Container, Row } from 'react-bootstrap';
import { CommonController } from '../components/CommonController';
import PaginationCustom from '../components/Paginations';
import { TableExportButton } from './Common';
import { BiSearchAlt } from 'react-icons/bi';
import { useEffect, useState } from 'react';
export default function CommonDataGrid({
  // eslint-disable-next-line react/prop-types
  url, //api url
  // eslint-disable-next-line react/prop-types
  body, //api body request
  // eslint-disable-next-line react/prop-types
  columns, //column header
  // eslint-disable-next-line react/prop-types
  jsonUpd, //boolean
  // eslint-disable-next-line react/prop-types
  // browseData,
}) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState({
    p_search: '',
    // chk_all: false,
  });
  const [browseListData, setBrowseListData] = useState([]);
  // const [columnDraggable, setColumnDraggable] = useState(null);
  const [columnSizing, setColumnSizing] = useState({});
  const [visibleColumns, setVisibleColumns] = useState({});
  const [totalRecord, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jsonUpdate, setJsonUpdate] = useState(jsonUpd);
  const [excelRecord, setexcel] = useState([]);
  const [params, setParams] = useState({
    page_number: 1,
    page_size: 10,
    sort_column: '',
    sort_order: '',
    p_search: '',
  });
  const getBrowseListData = async () => {
    setLoading(true);
    const obj = {
      ...globalFilter,
      ...body,
    };

    await CommonController.commonBrowseApiCallNew(url, obj, params, 'node')
      .then((data) => {
        if (data.valid) {
          setLoading(false);
          setBrowseListData(data.data);
          setTotalRecords(data.data[0]?.total_records || 0);
          // const excelData = data.data[0]?.excelRecord;
          // console.log("Excel Record Data:", excelData);
          setexcel(data.data);
        } else {
          console.warn('Invalid response from API.');
        }
      })
      .catch((error) => {
        console.error('Error fetching browse list data:', error);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    setGlobalFilter({ ...globalFilter, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setJsonUpdate(jsonUpdate + 1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [globalFilter]);

  const handleShortData = (short) => {
    if (short.length > 0) {
      setParams({
        ...params,
        sort_column: short[0].field,
        sort_order: short[0].sort,
      });
    } else {
      setParams({
        ...params,
        sort_column: '',
        sort_order: '',
      });
    }
  };
  useEffect(() => {
    getBrowseListData();
  }, [jsonUpdate, params]);

  useEffect(() => {
    if (sorting.length > 0) {
      if (sorting[0].desc) {
        setParams({
          ...params,
          sort_column: sorting[0].id,
          sort_order: 'desc',
        });
      } else {
        setParams({ ...params, sort_column: sorting[0].id, sort_order: 'asc' });
      }
    }
  }, [sorting]);

  return (
    <Container fluid className="p-0">
      <Row>
        <Col md={6} className="d-flex align-items-center gap-4">
          <FormControl
            size="small"
            variant="outlined"
            className="gridsearchbar bg-white"
          >
            <BiSearchAlt color="#000" />
            <TextField
              fullWidth
              id="filter_value"
              size="small"
              onChange={handleSearch}
              value={globalFilter.p_search}
              name="p_search"
              variant="outlined"
              autoComplete="off"
              placeholder="Search"
            />
          </FormControl>
        </Col>
      </Row>
      <Col md={12} className="mt-3">
        <TableExportButton excelData={excelRecord} fileName={``} />
        <div className="datagridtablewrapper">
          <MaterialReactTable
            layoutMode="grid"
            // enableColumnPinning={true}
            // enableEditing={true}
            enableResizing={true}
            columns={columns}
            data={browseListData}
            enableColumnActions={false}
            manualFiltering
            enableColumnFilterModes
            enablePagination={false}
            enableColumnFilters={false}
            enableGlobalFilter={false}
            enableSorting
            enableFullScreenToggle={false}
            enableColumnResizing
            enableHiding={true}
            onSortModelChange={(sort) => handleShortData(sort)}
            enableStickyHeader={true}
            manualSorting
            onSortingChange={setSorting}
            onColumnSizingChange={setColumnSizing}
            enableDensityToggle={false}
            initialState={{
              showColumnFilters: true,
              columnVisibility: visibleColumns,
              density: 'compact',
              showGlobalFilter: true,
              columnPinning: {
                right: ['action'],
              },
            }}
            onColumnVisibilityChange={setVisibleColumns}
            state={{
              sorting,
              columnVisibility: visibleColumns,
              columnSizing: columnSizing,
              isLoading: loading,
            }}
            muiTableBodyProps={{
              sx: {
                '& .MuiTableCell-root': {
                  borderLeft: '1px solid #ececec',
                  borderBottom: '1px solid  #ececec',
                  overflowWrap: 'break-word',
                  whiteSpace: 'unset',
                  padding: '8px',
                  fontSize: '.9em',
                },
                '& .Mui-TableHeadCell-Content-Wrapper': {
                  borderLeft: '1px solid rgba(224, 224, 224, 1)',
                  overflowWrap: 'break-word',
                  whiteSpace: 'unset',
                },
                '& .MuiTableHead-root th': {
                  borderLeft: '1px solid rgba(224, 224, 224, 1)',
                },
              },
            }}
            muiTableContainerProps={{
              sx: {
                height: `calc(100vh - 305px)`,
                paddingLeft: '0',
              },
            }}
            // enableRowActions={true}
          />
        </div>
      </Col>
      <PaginationCustom
        getParam={params}
        totalRecord={totalRecord}
        paramPage={setParams}
        jsonfilter={setJsonUpdate}
        // excel={setexcel}
      />
    </Container>
  );
}
