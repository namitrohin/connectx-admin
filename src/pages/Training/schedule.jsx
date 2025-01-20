import { useMemo, useState } from 'react';
import MainLayout from '../../components/MainLayout';
import CommonDataGrid from '../../components/CommonDataGrid';
import { Col, Row } from 'react-bootstrap';
import { AutoCompletedDropdown } from '../../components/AutoCompleteDropdown';
import ModalComponent from '../../components/ModalComponent';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { ConnectXDateRange } from '../../components/DateRange';
import { TextField } from '@mui/material';
export default function Schedule() {
  const dispatch = useDispatch();
  const [formTitle, setFormTitle] = useState('');

  const date = new Date();
  const [updateGrid, setupdateGrid] = useState(0);
  const [filters, setFilters] = useState({
    company: '',
    customer_id: null,
    area: '',
    from_date: moment().format('YYYY-MM-DD'),
    to_date: `${date.getFullYear()}-${date.getMonth() + 1}-${
      date.getDate() + 1
    }`,
    category_id: null,
  });

  const handleFilterChange = (filterKey, value, filterKeyId, id) => {
    console.log('date', handleFilterChange);

    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value || '',
      [filterKeyId]: id,
    }));
    setupdateGrid((prev) => prev + 1);
  };

  // const handleDateChange = (key, date) => {
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     [key]: date,
  //   }));
  //   setupdateGrid((prev) => prev + 1);
  // };

  const gridColumns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'S.No.',
        enableColumnFilter: false,
        Cell: ({ renderedCellValue, row }) => Number(row.id) + 1,
        size: 90,
      },
      {
        id: 'company_name',
        Header: () => {
          return (
            <div className="tabletopheader">
              <AutoCompletedDropdown
                url={'/api/v0/web/web_customer_dropdown'}
                handleDataChange={(value) =>
                  handleFilterChange(
                    'company',
                    value?.company_name,
                    'customer_id',
                    value.customer_id
                  )
                }
                valueInput={filters.company}
                objLevel={'company_name'}
              />
            </div>
          );
        },
        columns: [
          {
            accessorKey: 'customer_code',
            header: 'Customer Name',
            width: 280,
            enableColumnFilter: false,
            minSize: 350,
            cell: ({ row }) => {
              const customerCode = row.original.customer_code || '';
              const companyName = row.original.company_name || '';
              return `${customerCode}-${companyName}`;
            },
          },
        ],
      },
      {
        accessorKey: 'training_date',
        header: 'Training Date',
        enableColumnFilter: false,
        size: 160,
        Cell: ({ row }) => (
          <span>
            {moment(row.original.incident_date).format('DD/MM/YYYY')} (
            {moment(row.original.incident_date).format('LT')})
          </span>
        ),
      },
      {
        accessorKey: 'trainer_ids',
        header: 'Trainers',
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: 'location',
        header: 'Location',
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: 'training_type',
        header: 'Training Type',
        enableColumnFilter: false,
        size: 250,
      },
      {
        accessorKey: 'from_time',
        header: 'Start Time',
        enableColumnFilter: false,
        size: 160,
        Cell: ({ row }) => {
          const time = row.original.scan_time;
          return <span>{time ? moment(time).format('HH:MM') : 'N/A'}</span>;
        },
      },
      {
        accessorKey: 'to_time',
        header: 'End Time',
        enableColumnFilter: false,
        size: 160,
        Cell: ({ row }) => {
          const time = row.original.scan_time;
          return <span>{time ? moment(time).format('HH:MM') : 'N/A'}</span>;
        },
      },
    ],
    [filters]
  );
  // const dateFilter = (date) => {
  //   const startDate = moment(date.from_date).format("MM/DD/YYYY");
  //   const endDate = moment(date.to_date).format("MM/DD/YYYY");
  //   setDatefilterRange({ ...dateFilterRange, startDate: startDate, endDate: endDate });
  // };

  const dateFilter = (date) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      from_date: moment(date.startDate || new Date()).format('YYYY-MM-DD'),
      to_date: moment(date.endDate || new Date()).format('YYYY-MM-DD'),
    }));
    setupdateGrid((prev) => prev + 1);
  };

  return (
    <MainLayout pageName="Training Schedule" hasAddButton={false}>
      <Row className="mb-3">
        <Col md={12}>
          <div className="picker text-end">
            <ConnectXDateRange
              onChange={dateFilter}
              dateLevel="Date Filter"
              getData={{
                startDate: filters.from_date
                  ? moment(filters.from_date).toDate()
                  : moment().toDate(),
                endDate: filters.to_date
                  ? moment(filters.to_date).toDate()
                  : moment().toDate(),
              }}
            />
          </div>
        </Col>
      </Row>
      <CommonDataGrid
        url={'/api/v0/web/browse_training_schedules'}
        columns={gridColumns}
        body={filters}
        jsonUpd={updateGrid}
      />

      <ModalComponent modalTitle={formTitle} />
    </MainLayout>
  );
}
