/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import CommonDataGrid from '../../components/CommonDataGrid'
import MainLayout from '../../components/MainLayout'
import { useMemo } from 'react';
import moment from 'moment';
import { Badge } from 'react-bootstrap';
import { MdOutlineEdit } from 'react-icons/md';
import { FaEye } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

function Attendance() {
    const gridColumns = useMemo(
        () => [
          {
            accessorKey: 'id',
            header: 'S.No.',
            enableColumnFilter: false,
            Cell: ({ row }) => Number(row.id) + 1,
            size: 90,
          },
          {
            accessorKey: 'r_customer',
            header: 'Customer',
            enableColumnFilter: false,
            size: 150,
          },
          {
            accessorKey: 'r_created_at',
            header: 'Created at',
            enableColumnFilter: false,
            size: 150,
            Cell: ({ renderedCellValue, row }) => {
                return (
                  <span>{moment(row.original.r_created_at).format('DD/MM/YYY')}</span>
                );
              },
          },
          {
            accessorKey: 'r_emp_code',
            header: 'Emp. Code',
            enableColumnFilter: false,
            size: 150,
          },
          {
            accessorKey: 'r_guard_name',
            header: 'Guard Name',
            enableColumnFilter: false,
            size: 200,
          },
          {
            accessorKey: 'r_check_type',
            header: 'Type',
            enableColumnFilter: false,
            size: 200,
          },
          {
            accessorKey: 'r_check_time',
            header: 'Check Time',
            enableColumnFilter: false,
            size: 160,
            Cell: ({ renderedCellValue, row }) => {
              return (
                <span>{moment(row.original.r_check_time).format('LT')}</span>
              );
            },
          },
          {
            accessorKey: 'latitude_longitude',
            header: 'Location',
            enableColumnFilter: false,
            size: 120,
            Cell: ({ row }) => {
              const { r_latitude, r_longitude } = row.original;
              if (r_latitude && r_longitude) {
                const googleMapsUrl = `https://www.google.com/maps?q=${r_latitude},${r_longitude}`;
                return (
                  <Link to={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <FaMapMarkerAlt
                      size={20}
                      className="text-primary cursor-pointer"
                    />
                  </Link>
                );
              }
              return null;
            },
          },
          // {
          //   accessorKey: 'action',
          //   header: 'Action',
          //   enableColumnFilter: false,
          //   size: 90,
          //   // eslint-disable-next-line react/prop-types
          //   Cell: ({ row }) => (
          //     <div className="d-flex align-items-center gap-1">
          //       <Badge
          //         bg="primary"
          //         onClick={() => {
          //           console.log('handleEdit', row.original);
          //           handleEdit(row.original);
          //         }}
          //         title="Edit SRF"
          //       >
          //         <MdOutlineEdit />
          //       </Badge>
          //       <Badge bg="success" onClick={() => handlePreview(row.original)}>
          //         <FaEye />
          //       </Badge>
          //     </div>
          //   ),
          // },
        ],
        []
      );
  return (
    <MainLayout
      pageName="Attendance"
      hasAddButton={false}
    //   linkto={'/guards/guards/add'}
      // branchDropdown={true}
    >
      <CommonDataGrid
        url={'/api/v0/web/web_guard_attendance'}
        columns={gridColumns}
        body={{from_date:new Date(1/1/2024),to_date:new Date()}}
        // jsonUpd={updateGrid}
      />
      {/* <DeleteModal removeId={handleDelete} data={deleteModalData} /> */}
      {/* <SuccessMessage hidden={showSuccess} /> */}
    </MainLayout>
  )
}

export default Attendance