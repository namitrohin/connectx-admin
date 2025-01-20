import { useMemo, useState } from 'react';
import CommonDataGrid from '../components/CommonDataGrid';
import MainLayout from '../components/MainLayout';
import moment from 'moment';
import { userService } from '../../service/service';
import DeleteModal from '../components/DeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from 'react-bootstrap';
import { BsEyeFill, BsPenFill, BsTrash3Fill } from 'react-icons/bs';
import {
  hideModal,
  showModal,
  toggleSpinnerAndDisableButton,
} from '../Redux/Modals';
import { MdOutlineEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import config from '../../service/config';

function Branch() {
  const deleteMessage = useSelector((state) => state.removeModal.message);
  const [updateGrid, setupdateGrid] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [body, setbody] = useState({
    refresh: '',
  });
  const deleteModalData = {
    id: deleteMessage?.branch_id,
    name: deleteMessage?.branch_code,
  };
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleDelete(id) {
    const obj = {
      p_action: 'delete',
      branch_id: id,
    };
    try {
      const response = await userService.post(
        '/api/v0/web/web_master_branch_delete',
        obj
      );

      if (response.data.valid) {
        setShowSuccess(true);
        setbody({
          ...body,
          refresh: 2,
        });
        setupdateGrid(updateGrid + 1);
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error('Error occurred while deleting:', err);
    } finally {
      dispatch(hideModal());
      dispatch(toggleSpinnerAndDisableButton(false));
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  }

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
        accessorKey: 'branch_code',
        header: 'Branch Code',
        enableColumnFilter: false,
        size: 130,
      },
      {
        accessorKey: 'city',
        header: 'City',
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: 'state',
        header: 'State',
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: 'country',
        header: 'Country',
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        enableColumnFilter: false,
        size: 250,
      },
      {
        accessorKey: 'gstin',
        header: 'GSTIN',
        enableColumnFilter: false,
        size: 180,
      },
      {
        accessorKey: 'created_by_name',
        header: 'Created by',
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: 'created_at',
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
    const obj = {
      ...data,
    };
    obj.type = 'Preview';
    navigate('/branch/add', {
      state: {
        id: obj.branch_id,
        type: 'preview',
      },
    });
  };

  const handleEdit = (data) => {
    const obj = { ...data };
    obj.p_action = 'update';
    navigate('/branch/add', {
      state: {
        id: obj.branch_id,
        type: 'edit',
      },
    });
  };
  return (
    <MainLayout
      pageName="Branch"
      hasAddButton={true}
      linkto={'/branch/add'}
      // branchDropdown={true}
    >
      <CommonDataGrid
        url={'/api/v0/web/web_branch_browse'}
        columns={gridColumns}
        body={body}
        jsonUpd={updateGrid}
      />
      <DeleteModal removeId={handleDelete} data={deleteModalData} />
      {/* <SuccessMessage hidden={showSuccess} /> */}
    </MainLayout>
  );
}

export default Branch;
