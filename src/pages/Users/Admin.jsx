import { useMemo, useState } from 'react';
import CommonDataGrid from '../../components/CommonDataGrid';
import MainLayout from '../../components/MainLayout';
import { Badge } from 'react-bootstrap';
import { BsEyeFill, BsPenFill, BsTrash3Fill } from 'react-icons/bs';
import {
  hideModal,
  showModal,
  toggleSpinnerAndDisableButton,
} from '../../Redux/Modals';
import { useDispatch, useSelector } from 'react-redux';
import { userService } from '../../../service/service';
import DeleteModal from '../../components/DeleteModal';
import SuccessMessage from '../../components/SuccessMessage';
import moment from 'moment';
import { Navigate, useNavigate } from 'react-router-dom';
import { MdOutlineEdit } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';

function Admin() {
  const deleteMessage = useSelector((state) => state.removeModal.message);
  const [updateGrid, setupdateGrid] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [body, setbody] = useState({
    refresh: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const deleteModalData = {
    id: deleteMessage?.user_id,
    name: deleteMessage?.full_name,
  };
  async function handleDelete(id) {
    const obj = {
      user_id: id,
    };
    try {
      const response = await userService.post(
        '/api/v0/web/web_user_admin_delete',
        obj
      );
      if (response.data.valid) {
        setShowSuccess(true);
        setbody({
          ...body,
          refresh: 2,
        });
        dispatch(toggleSpinnerAndDisableButton(false));
        setTimeout(() => {
          setShowSuccess(false);
        }, 1700);
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
    dispatch(hideModal());
  }

  const gridColumns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'S.No.',
        enableColumnFilter: false,
        Cell: ({ renderedCellValue, row }) => Number(row.id) + 1,
        size: 80,
      },
      {
        accessorKey: 'emp_code',
        header: 'Employee Code',
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: 'full_name',
        header: 'Full Name',
        enableColumnFilter: false,
        size: 180,
      },
      {
        accessorKey: 'mobile',
        header: 'Mobile',
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableColumnFilter: false,
        size: 240,
      },
      {
        accessorKey: 'created_by_name',
        header: 'Created by',
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: 'created_by_time',
        header: 'Date',
        Cell: ({ renderedCellValue }) => {
          if (!renderedCellValue) return <span>-</span>;
          const formattedDate = moment(renderedCellValue).isValid()
            ? moment(renderedCellValue).format('DD-MM-YYYY')
            : '-';
          const formattedTime = moment(renderedCellValue).isValid()
            ? moment(renderedCellValue).format('LT')
            : '-';
          return (
            <span>
              {formattedDate} ({formattedTime})
            </span>
          );
        },
        enableColumnFilter: false,
        size: 180,
      },
      {
        accessorKey: 'updated_by_name',
        header: 'Updated by',
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: 'updated_at',
        header: 'Updated Date',
        Cell: ({ renderedCellValue }) => {
          if (!renderedCellValue) return <span>-</span>;
          const formattedDate = moment(renderedCellValue).isValid()
            ? moment(renderedCellValue).format('DD-MM-YYYY')
            : '-';
          const formattedTime = moment(renderedCellValue).isValid()
            ? moment(renderedCellValue).format('LT')
            : '-';
          return (
            <span>
              {formattedDate} ({formattedTime})
            </span>
          );
        },
        enableColumnFilter: false,
        size: 180,
      },
      {
        accessorKey: 'action',
        header: 'Action',
        enableColumnFilter: false,
        size: 100,
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
            <Badge
              bg="danger"
              className="cursor-pointer"
              onClick={() => dispatch(showModal(row.original))}
            >
              <BsTrash3Fill />
            </Badge>
          </div>
        ),
      },
    ],
    []
  );

  const handlePreview = (data) => {
    const obj = { ...data };
    obj.p_action = 'update';
    navigate('/users/admin/add', {
      state: {
        id: obj.user_id,
        type: 'preview',
      },
    });
  };

  const handleEdit = (data) => {
    const obj = { ...data };
    console.log('data', obj.user_id);
    obj.p_action = 'update';
    navigate('/users/admin/add', {
      state: {
        id: obj.user_id,
        type: 'edit',
      },
    });
    console.log('Edit', handleEdit);
  };

  return (
    <MainLayout
      pageName="Admin"
      hasAddButton={true}
      linkto={'/users/admin/add'}
    // branchDropdown={true}
    >
      <CommonDataGrid
        url={'/api/v0/web/web_user_admin_browse'}
        columns={gridColumns}
        body={body}
        jsonUpd={updateGrid}
      />
      <DeleteModal removeId={handleDelete} data={deleteModalData} />
      <SuccessMessage hidden={showSuccess} />
    </MainLayout>
  );
}

export default Admin;
