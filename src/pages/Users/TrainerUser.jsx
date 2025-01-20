import { useMemo, useState } from 'react';
import { FaPenAlt, FaEye, FaTrash } from 'react-icons/fa';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from 'react-bootstrap';
import { BsEyeFill, BsPenFill, BsTrash3Fill } from 'react-icons/bs';
import MainLayout from '../../components/MainLayout';
import CommonDataGrid from '../../components/CommonDataGrid';
import DeleteModal from '../../components/DeleteModal';
import { userService } from '../../../service/service';
import {
  hideModal,
  showModal,
  toggleSpinnerAndDisableButton,
} from '../../Redux/Modals';
import { AutoCompletedDropdown } from '../../components/AutoCompleteDropdown';
import { useNavigate } from 'react-router-dom';
import { MdOutlineEdit } from 'react-icons/md';

function TrainerUser() {
  const navigate = useNavigate();
  const deleteMessage = useSelector((state) => state.removeModal.message);
  const [updateGrid, setupdateGrid] = useState(0);
  const dispatch = useDispatch();
  const [body, setbody] = useState({
    refresh: '',
  });
  const deleteModalData = {
    id: deleteMessage?.user_id,
    name: deleteMessage?.emp_code,
  };
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleDelete(id) {
    const obj = {
      user_id: id,
    };
    try {
      const response = await userService.post(
        '/api/v0/web/web_user_branch_delete',
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
        header: 'EMP. Code',
        enableColumnFilter: false,
        minSize: 100,
      },
      {
        id: 'branch_code',
        Header: () => {
          return (
            <div className="tabletopheader">
              <AutoCompletedDropdown
                url={'/api/v0/web/web_branch_dropdown'}
                handleDataChange={() => { }}
                // valueInput={formData.branch_code}
                objLevel={'branch_code'}
              />
            </div>
          );
        },
        columns: [
          {
            accessorKey: 'branch_code',
            header: 'Branch Code',
            width: 280,
            enableColumnFilter: false,
            minSize: 200,
          },
        ],
      },
      {
        accessorKey: 'city',
        header: 'City',
        enableColumnFilter: false,
        minSize: 100,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        enableColumnFilter: false,
        minSize: 200,
      },
      {
        accessorKey: 'full_name',
        header: 'Name',
        enableColumnFilter: false,
        minSize: 150,
      },
      {
        accessorKey: 'mobile',
        header: 'Mobile',
        enableColumnFilter: false,
        minSize: 150,
      },
      {
        accessorKey: 'type',
        header: 'Type',
        enableColumnFilter: false,
        minSize: 150,
      },
      {
        accessorKey: 'created_by_name',
        header: 'Created by',
        enableColumnFilter: false,
        minSize: 150,
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
        size: 160,
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
        minSize: 100,
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
    navigate('/users/branch-manager/add', {
      state: {
        id: obj.user_id,
        type: 'preview',
      },
    });
  };

  const handleEdit = (data) => {
    const obj = { ...data };
    obj.p_action = 'update';
    navigate('/users/branch-manager/add', {
      state: {
        id: obj.user_id,
        type: 'edit',
      },
    });
  };
  return (
    <MainLayout
      pageName="Trainer Users"
      hasAddButton={true}
      linkto={'/users/trainer/add'}
    // branchDropdown={true}
    >
      <CommonDataGrid
        url={'/api/v0/web/web_user_branch_browse'}
        columns={gridColumns}
        body={body}
        jsonUpd={updateGrid}
      />
      <DeleteModal removeId={handleDelete} data={deleteModalData} />
      {/* <SuccessMessage hidden={showSuccess} /> */}
    </MainLayout>
  );
}

export default TrainerUser;
