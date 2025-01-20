/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useMemo, useState } from 'react';
import MainLayout from '../../components/MainLayout';
import CommonDataGrid from '../../components/CommonDataGrid';
import moment from 'moment';
import { Badge } from 'react-bootstrap';
import { BsEyeFill, BsPenFill, BsTrash3Fill } from 'react-icons/bs';
import { MdOutlineEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import DeleteModal from '../../components/DeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  hideModal,
  showModal,
  toggleSpinnerAndDisableButton,
} from '../../Redux/Modals';
import { userService } from '../../../service/service';
import { AutoCompletedDropdown } from '../../components/AutoCompleteDropdown';
function Guard() {
  const [updateGrid, setupdateGrid] = useState(0);
  const [body, setbody] = useState({
    refresh: '',
  });
  const [filters, setFilters] = useState({
    category: '',
    category_id: null,
    subcategory: '',
    subcategory_id: null,
    detail: '',
    detail_id: null,
    company: '',
    customer_id: null,
    branch: '',
    branch_id: null,
    branchManager: '',
    branch_manager_id: null,
    opsManager: '',
    ops_manager_id: null,
    areaManager: '',
    area_manager_id: null,
    grievance_status: "",
    grievanceStatus: "",
  });
  const deleteMessage = useSelector((state) => state.removeModal.message);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const deleteModalData = {
    id: deleteMessage?.guard_id,
    name: deleteMessage?.full_name,
  };
  async function handleDelete(id) {
    try {
      const response = await userService.get(
        `/web_master_guard_delete?guard_id=${id}`
      );

      if (response.data.valid) {
        setShowSuccess(true);
        setbody({
          ...body,
          refresh: 2,
        });
      }
    } catch (err) {
      console.error('Error occurred while deleting:', err);
    } finally {
      dispatch(hideModal());
      dispatch(toggleSpinnerAndDisableButton(false));
      setShowSuccess(true);
      setupdateGrid(updateGrid + 1);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  }
  const handleFilterChange = (filterKey, value, filterKeyId, id) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value || '',
      [filterKeyId]: id
    }));
    setupdateGrid((prev) => prev + 1);
  };

  const gridColumns = useMemo(
    () => [
      // {
      //   accessorKey: 'branch_code',
      //   header: 'Branch Code',
      //   enableColumnFilter: false,
      //   size: 200,
      // },
      {
        accessorKey: 'id',
        header: 'S.No.',
        enableColumnFilter: false,
        Cell: ({ renderedCellValue, row }) => Number(row.id) + 1,
        size: 90,
      },
      {
        accessorKey: 'emp_code',
        header: 'Emp. Code',
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: 'full_name',
        header: 'Name',
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: 'mobile',
        header: 'Mobile',
        enableColumnFilter: false,
        size: 120,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: 'father_name',
        header: 'Father Name',
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: 'date_of_joining',
        header: 'Date Of Joining',
        enableColumnFilter: false,
        size: 160,
        Cell: ({ renderedCellValue, row }) => {
          return <span>{moment(renderedCellValue).format('DD/MM/YYYY')}</span>;
        },
      },
      {
        accessorKey: 'date_of_birth',
        header: 'Date Of Birth',
        enableColumnFilter: false,
        size: 160,
        Cell: ({ renderedCellValue, row }) => {
          return <span>{moment(renderedCellValue).format('DD/MM/YYYY')}</span>;
        },
      },
      {
        accessorKey: 'bank_name',
        header: 'Bank Name',
        enableColumnFilter: false,
        size: 150,
      },
       {
              id: 'company_name',
              Header: () => {
                return (
                  <div className="tabletopheader">
                    <AutoCompletedDropdown
                      url={'/api/v0/web/web_customer_dropdown'}
                      handleDataChange={(value) =>
                        handleFilterChange('company', value?.company_name, 'customer_id', value.customer_id)
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
                  header: 'Customer Details',
                  enableColumnFilter: false,
                  size: 350,
                  Cell: ({ row }) => (
                    <>
                      <div>
                        {row.original.customer_code} - {row.original.company_name}
                      </div>
                    </>
                  ),
                },
              ],
            },

      
      
      {
        accessorKey: 'created_by_name',
        header: 'Created by',
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: 'created_at',
        header: 'Created Date',
        enableColumnFilter: false,
        size: 180,
        Cell: ({ renderedCellValue, row }) => {
          return (
            <span>
              {moment(renderedCellValue).format('DD/MM/YYYY')} (
              {moment(renderedCellValue).format('LT')})
            </span>
          );
        },
      },
      {
        accessorKey: 'action',
        header: 'Action',
        enableColumnFilter: false,
        size: 90,
        // eslint-disable-next-line react/prop-types
        Cell: ({ row }) => (
          <div className="d-flex align-items-center gap-1">
            <Badge
              bg="primary"
              onClick={() => {
                handleEdit(row.original);
              }}
              title="Edit SRF"
            >
              <MdOutlineEdit />
            </Badge>
            <Badge bg="success" onClick={() => handlePreview(row.original)}>
              <FaEye />
            </Badge>
            {/* <Badge bg="danger" className="cursor-pointer" onClick={() => dispatch(showModal(row.original))}>
              <BsTrash3Fill />
            </Badge> */}
          </div>
        ),
      },
    ],
    []
  );

  const handlePreview = (data) => {
    const obj = { ...data };
    obj.p_action = 'UPDATE';
    navigate('/guards/guards/add', {
      state: {
        id: obj.guard_id,
        type: 'preview',
      },
    });
  };

  const handleEdit = (data) => {
    const obj = { ...data };
    obj.p_action = 'UPDATE';
    navigate('/guards/guards/add', {
      state: {
        id: obj.guard_id,
        type: 'edit',
      },
    });
  };
  return (
    <MainLayout
      pageName="Guard"
      hasAddButton={true}
      linkto={'/guards/guards/add'}
      // branchDropdown={true}
    >
      <CommonDataGrid
        url={'/api/v0/web/web_master_guard_browse'}
        columns={gridColumns}
        body={body}
        jsonUpd={updateGrid}
      />
      <DeleteModal removeId={handleDelete} data={deleteModalData} />
      {/* <SuccessMessage hidden={showSuccess} /> */}
    </MainLayout>
  );
}

export default Guard;
