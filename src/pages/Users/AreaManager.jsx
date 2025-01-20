import { useMemo, useState } from "react";
import SuccessMessage from "../../components/SuccessMessage";
import CommonDataGrid from "../../components/CommonDataGrid";
import MainLayout from "../../components/MainLayout";
import { Badge } from "react-bootstrap";
import { BsEyeFill, BsPenFill, BsTrash3Fill } from "react-icons/bs";
import moment from "moment";
import { userService } from "../../../service/service";
import { hideModal, showModal, toggleSpinnerAndDisableButton } from "../../Redux/Modals";
import DeleteModal from "../../components/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AreaManager() {
  const [updateGrid, setupdateGrid] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deleteMessage = useSelector((state) => state.removeModal.message);
  const [body, setbody] = useState({
    refresh: "",
  });
  const deleteModalData = {
    id: deleteMessage?.area_manager_id,
    name: deleteMessage?.emp_code
  };
  const [showSuccess, setShowSuccess] = useState(false);


  async function handleDelete(id) {
    const obj = {
      p_action: "DELETE",
      area_manager_id: id,
    };
    try {
      const response = await userService.post(
        "/api/v0/web/web_area_manager_delete",
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
      console.error("Error occurred while deleting:", err);
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
        accessorKey: "emp_code",
        header: "Employee Code",
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: "branch_code",
        header: "Branch Code",
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: "branch_manager_code",
        header: "Branch Manager Code",
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: "branch_manager_name",
        header: "Branch Manager Name",
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: "ops_manager_name",
        header: "OPS Manager Name",
        enableColumnFilter: false,
        size: 200,
      },


      {
        accessorKey: "full_name",
        header: "Full Name",
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "mobile",
        header: "Mobile",
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: "created_by_name",
        header: "Created by",
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: "created_by_time",
        header: "Created Date",
        // Cell: ({ value }) => moment(value).format('YYYY-MM-DD HH:mm:ss'),
        Cell: ({ renderedCellValue, row }) => {
          return <span>{moment(renderedCellValue).format("DD-MM-YYYY")}</span>;
        },
        enableColumnFilter: false,
        minSize: 180,
      },
      {
        accessorKey: "action",
        header: "Action",
        enableColumnFilter: false,
        size: 100,
        Cell: ({row}) => (
          <div className="d-flex align-items-center gap-1">
           <Badge
              bg="primary"
              onClick={() => {
                console.log('handleEdit', row.original);
                handleEdit(row.original);
              }}
              title="Edit SRF"
            >
              <MdOutlineEdit />
            </Badge>
            <Badge bg="success" onClick={() => handlePreview(row.original)}>
              <FaEye />
            </Badge>
            <Badge bg="danger" className="cursor-pointer" onClick={() => dispatch(showModal(row.original))} >
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
      ...data
    };
    obj.type = "Preview";
    navigate('/users/area-manager/add', {
      state: {
        id: obj.area_manager_id,
        type: 'preview'
      }
    });

  };


  const handleEdit = (data) => {
    const obj = { ...data };
    console.log('data', obj.area_manager_id);
    obj.p_action = 'UPDATE';
    navigate('/users/area-manager/add', {
      state: {
        id: obj.area_manager_id,
        type: 'edit'
      }
    });
  };

  // console.log("data",url={"/api/v0/web/web_branch_browse"});

  return (
    <MainLayout
      pageName="Area Manager"
      hasAddButton={true}
      linkto={"/users/area-manager/add"}
    // branchDropdown={true}
    >
      <CommonDataGrid
        url={"/api/v0/web/web_area_manager_browse"}
        columns={gridColumns}
        body={body}
        jsonUpd={updateGrid}
      />
      <DeleteModal removeId={handleDelete} data={deleteModalData} />
      {/* <SuccessMessage hidden={showSuccess} /> */}
    </MainLayout>
  );
}

export default AreaManager;
