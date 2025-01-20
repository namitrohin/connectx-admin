import { useMemo, useState } from "react";
import CommonDataGrid from "../../components/CommonDataGrid";
import MainLayout from "../../components/MainLayout";
import { Badge } from "react-bootstrap";
import { BsEyeFill, BsPenFill, BsTrash3Fill } from "react-icons/bs";
import { AutoCompletedDropdown } from "../../components/AutoCompleteDropdown";
import { userService } from "../../../service/service";
import { hideModal, showModal, toggleSpinnerAndDisableButton } from "../../Redux/Modals";
import DeleteModal from "../../components/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import moment from "moment";

function OPSManager() {
  const [updateGrid, setupdateGrid] = useState(0);
  const deleteMessage = useSelector((state) => state.removeModal.message);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [body, setbody] = useState({
    refresh: ""
  });
  const deleteModalData = {
    id: deleteMessage?.ops_manager_id,
    name: deleteMessage?.emp_code
  };
  const [showSuccess, setShowSuccess] = useState(false);
  const [filter, setFilter] = useState({
    branch_code: "",
    p_branch_id: null,
    branchcode:"",
    branchmanagercode:""
  })

  const handleFilterChange = (filterKey, value, filterKeyId, id) => {
    setFilter((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value || '',
      [filterKeyId]: id
    }));
    setupdateGrid((prev) => prev + 1);
  };


  async function handleDelete(id) {
    const obj = {
      p_action: "DELETE",
      ops_manager_id: id,
    };
    try {
      const response = await userService.post(
        "/api/v0/web/web_ops_manager_delete",
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
        size: 80,
      },
      {
        id: "branch_code",
        Header: () => {
          return (
            <div className="tabletopheader">
              <AutoCompletedDropdown
                url={"/api/v0/web/web_branch_dropdown"}
                handleDataChange={(value) => handleFilterChange('branchcode', value?.branch_code, 'p_branch_id', value.p_branch_id)}
                valueInput={filter.branchcode} 
                objLevel={"branch_code"}
              />
            </div>
          );
        },
        columns: [
          {
            accessorKey: "branch_code",
            header: "Branch Code",
            width: 280,
            enableColumnFilter: false,
            minSize: 200,
          },
        ],
      },
      {
        id: "branch_manager_code",
        Header: () => {
          return (
            <div className="tabletopheader">
              <AutoCompletedDropdown
                url={"/api/v0/web/web_branch_manager_dropdown"}
                handleDataChange={(value) => handleFilterChange('branchmanagercode', value?.branch_manager_code, 'p_branch_id', value.p_branch_id)}
                valueInput={filter.branchmanagercode} 
                objLevel={"emp_code"}
              />
            </div>
          );
        },
        columns: [
          {
            accessorKey: "branch_manager_code",
            header: "Branch Manager",
            width: 280,
            enableColumnFilter: false,
            minSize: 230,
            Cell: ({ row }) => {
              const { branch_manager_code, branch_manager_name } = row.original;
              if (!branch_manager_code || !branch_manager_name) return;
              return (
                <span>
                  <strong>{branch_manager_code}</strong> - {branch_manager_name}
                </span>
              );
            },
          },
        ],
      },
      {
        accessorKey: "emp_code",
        header: "Employee Code",
        enableColumnFilter: false,
        size: 140,
      },
      {
        accessorKey: "full_name",
        header: "Full Name",
        enableColumnFilter: false,
        size: 200,
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
        accessorKey: "action",
        header: "Action",
        enableColumnFilter: false,
        size: 100,
        Cell: ({ row }) => (
          <div className="d-flex align-items-center gap-1">
            <Badge
              bg="primary"
              onClick={() => handleEdit(row.original)}
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
    [filter] // Add `filter` as a dependency to ensure grid updates with the new filter state
  );



  const handlePreview = (data) => {
    const obj = {
      ...data
    };
    obj.type = "Preview";
    navigate('/users/ops-manager/add', {
      state: {
        id: obj.ops_manager_id,
        type: 'preview'
      }
    });

  };

  const handleEdit = (data) => {
    const obj = { ...data };
    console.log('data', obj.ops_manager_id);
    obj.p_action = 'update';
    navigate('/users/ops-manager/add', {
      state: {
        id: obj.ops_manager_id,
        type: 'edit'
      }
    });
  };

  return (
    <MainLayout
      pageName="OPS Manager"
      hasAddButton={true}
      linkto={"/users/ops-manager/add"}
    // branchDropdown={true}
    >
      <CommonDataGrid
        url={"/api/v0/web/web_ops_manager_browse"}
        columns={gridColumns}
        body={body}
        jsonUpd={updateGrid}
      />
      <DeleteModal removeId={handleDelete} data={deleteModalData} />
      {/* <SuccessMessage hidden={showSuccess} /> */}
    </MainLayout>
  );
}

export default OPSManager;
