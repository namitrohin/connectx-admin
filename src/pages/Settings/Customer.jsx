import { useMemo, useState } from "react";
import MainLayout from "../../components/MainLayout";
import CommonDataGrid from "../../components/CommonDataGrid";
import moment from "moment";
import { Badge } from "react-bootstrap";
import { BsEyeFill, BsPenFill, BsTrash3Fill } from "react-icons/bs";

function Customer() {
  const [updateGrid, setupdateGrid] = useState(0);
  const [body, setbody] = useState({
    refresh: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);


  // async function handleDelete(id) {
  //   const obj = {
  //     user_id: id,
  //   };
  //   try {
  //     const response = await userService.post(
  //       "masters/Masters_user_delete",
  //       obj
  //     );

  //     if (response.data.valid) {
  //       setShowSuccess(true);
  //       setbody({
  //         ...body,
  //         refresh: 2,
  //       });
  //     } else {
  //       alert(response.data.message);
  //     }
  //   } catch (err) {
  //     console.error("Error occurred while deleting:", err);
  //   } finally {
  //     dispatch(hideModal());
  //     dispatch(toggleSpinnerAndDisableButton(false));
  //     setShowSuccess(true);
  //     setupdateGrid(updateGrid + 1);
  //     setTimeout(() => {
  //       setShowSuccess(false);
  //     }, 3000);
  //   }
  // }


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
        accessorKey: "branch_code",
        header: "Branch Code",
        enableColumnFilter: false,
        size: 100,
      },
      {
        accessorKey: "customer_code",
        header: "Customer Code",
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "customer_group_name",
        header: "Customer group Name",
        enableColumnFilter: false,
        size: 150,
      },

      {
        accessorKey: "company_name",
        header: "Company Name",
        enableColumnFilter: false,
        size: 300,
      },
      {
        accessorKey: "display_name",
        header: "Display Name",
        enableColumnFilter: false,
        size: 300,
      },
      {
        accessorKey: "contact_person",
        header: "Contact Person",
        enableColumnFilter: false,
        size: 180,
      },
      {
        accessorKey: "email",
        header: "Email",
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
        accessorKey: "gstin",
        header: "GSTIN",
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "created_by_name",
        header: "Created by",
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "created_by_time",
        header: "Created Date",
        enableColumnFilter: false,
        size: 160,
        Cell: ({ renderedCellValue, row }) => {
          return (
            <span>
              {moment(row.original.created_by_time).format("DD/MM/YYYY")}{" "}
            </span>
          );
        },
      },
      {
        accessorKey: "updated_by_name",
        header: "Updated by",
        enableColumnFilter: false,
        size: 150,
      },
      {
        accessorKey: "updated_by_time",
        header: "Updated Date",
        enableColumnFilter: false,
        size: 160,
        Cell: ({ row }) => {
          const date = row.original.updated_by_time;
          return (
            <span>
              {date ? moment(date).format("DD/MM/YYYY") : "N/A"}
            </span>
          );
        },
      },
      {
        accessorKey: "action",
        header: "Action",
        enableColumnFilter: false,
        size: 100,
        Cell: () => (
          <div className="d-flex align-items-center gap-1">
            <Badge bg="primary" className="cursor-pointer">
              <BsPenFill />
            </Badge>
            <Badge bg="success" className="cursor-pointer">
              <BsEyeFill />
            </Badge>
            <Badge bg="danger" className="cursor-pointer" >
              <BsTrash3Fill />
            </Badge>
          </div>
        ),
      },
    ],
    []
  );
  return (
    <MainLayout
      pageName="Customer"
      hasAddButton={true}
      linkto={"/customers/customer/add"}
    // branchDropdown={true}
    >
      <CommonDataGrid
        url={"/api/v0/web/web_master_customer_browse"}
        columns={gridColumns}
        body={body}
        jsonUpd={updateGrid}
      />
      {/* <DeleteModal removeId={handleDelete} data={deleteModalData} /> */}
      {/* <SuccessMessage hidden={showSuccess} /> */}
    </MainLayout>
  );
}

export default Customer;
