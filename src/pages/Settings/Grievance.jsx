import { useMemo, useState } from 'react';
import MainLayout from '../../components/MainLayout';
import CommonDataGrid from '../../components/CommonDataGrid';
import { Badge, Button, Col, Form, Row } from 'react-bootstrap';
import { BsChatLeftDotsFill } from 'react-icons/bs';
import { AutoCompletedDropdown } from '../../components/AutoCompleteDropdown';
import { userService } from '../../../service/service';
import ModalComponent from '../../components/ModalComponent';
import { useDispatch } from 'react-redux';
import { toggleForm } from '../../Redux/Modals';
function Grievance() {
  const dispatch = useDispatch();
  const [formTitle, setFormTitle] = useState('Add Sahyog Reason');

  const [updateGrid, setupdateGrid] = useState(0);
  const [statusForm, setStatusForm] = useState({
    status: '',
    remarks: '',
    grievance_id: null,
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
    grievance_status: '',
    grievanceStatus: '',
  });

  const [remarksModal, setRemarksModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newRemark, setNewRemark] = useState('');

  const handleFilterChange = (filterKey, value, filterKeyId, id) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: value || '',
      [filterKeyId]: id,
    }));
    setupdateGrid((prev) => prev + 1);
  };

  const handleOpenRemarksModal = (row) => {
    setStatusForm(row.original);
    setRemarksModal(true);
  };

  const handleSaveRemarks = async () => {
    if (!statusForm) return;

    try {
      const response = await userService.post(
        '/api/v0/web/web_grievance_history_browse',
        {
          grievance_id: statusForm.id,
          status: statusForm,
          remarks: statusForm,
        }
      );

      if (response.data.valid) {
        alert('Grievance updated successfully!');
        console.log(response.data.data[0]);

        const value = response.data.data[0];
        let tempData = { ...statusForm };
        for (let key in tempData) {
          tempData[key] = value[key];
        }
        setStatusForm(tempData);
        handleCloseRemarksModal();
        setupdateGrid((prev) => prev + 1);
      } else {
        alert('Failed to update grievance!');
      }
    } catch (error) {
      console.error('Error updating grievance:', error);
      alert('An error occurred while updating the grievance.');
    }
  };
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
        accessorKey: 'grievance_no',
        header: 'Grienvance No.',
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: 'guard_name',
        header: 'Guard Name',
        enableColumnFilter: false,
        size: 250,
      },
      {
        id: 'category_name',
        Header: () => (
          <AutoCompletedDropdown
            url={'/api/v0/app/issue_category_dropdown'}
            body={{
              category_id: filters.category_id,
            }}
            handleDataChange={(value) =>
              handleFilterChange(
                'category',
                value?.category_name,
                'category_id',
                value.category_id
              )
            }
            valueInput={filters.category}
            objLevel="category_name"
          />
        ),
        columns: [
          {
            accessorKey: 'category_name',
            header: 'Category Name',
            width: 290,
            enableColumnFilter: false,
            minSize: 260,
          },
        ],
      },
      {
        id: 'subcategory_name',
        Header: () => {
          return (
            <div className="tabletopheader">
              <AutoCompletedDropdown
                url={'/api/v0/app/issue_subcategory_dropdown'}
                // handleDataChange={() => {}}
                handleDataChange={(value) =>
                  handleFilterChange(
                    'subcategory',
                    value?.subcategory_name,
                    'subcategory_id',
                    value.subcategory_id
                  )
                }
                valueInput={filters.subcategory}
                objLevel={'subcategory_name'}
              />
            </div>
          );
        },
        columns: [
          {
            accessorKey: 'subcategory_name',
            header: 'Sub-Category Name',
            width: 360,
            enableColumnFilter: false,
            minSize: 250,
          },
        ],
      },
      {
        id: 'detail_name',
        Header: () => {
          return (
            <div className="tabletopheader">
              <AutoCompletedDropdown
                url={'/api/v0/app/issue_detail_dropdown'}
                handleDataChange={(value) =>
                  handleFilterChange(
                    'detail',
                    value?.detail_name,
                    'detail_id',
                    value.detail_id
                  )
                }
                valueInput={filters.detail}
                objLevel={'detail_name'}
              />
            </div>
          );
        },
        columns: [
          {
            accessorKey: 'issue_detail_name',
            header: 'issue Detail Name',
            width: 280,
            enableColumnFilter: false,
            minSize: 300,
          },
        ],
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
            accessorKey: 'customer_name',
            header: 'Customer Name',
            width: 280,
            enableColumnFilter: false,
            minSize: 350,
          },
        ],
      },
      {
        id: 'branch_code',
        Header: () => {
          return (
            <div className="tabletopheader">
              <AutoCompletedDropdown
                url={'/api/v0/web/web_branch_dropdown'}
                handleDataChange={(value) =>
                  handleFilterChange(
                    'branch',
                    value?.branch_code,
                    'branch_id',
                    value.branch_id
                  )
                }
                valueInput={filters.branch}
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
            minSize: 230,
          },
        ],
      },
      {
        id: 'branch_manager_code',
        Header: () => {
          return (
            <div className="tabletopheader">
              <AutoCompletedDropdown
                url={'/api/v0/web/web_branch_manager_dropdown'}
                handleDataChange={(value) =>
                  handleFilterChange(
                    'branchManager',
                    value?.emp_code,
                    'branch_manager_id',
                    value.branch_manager_id
                  )
                }
                valueInput={filters.branchManager}
                objLevel={'emp_code'}
              />
            </div>
          );
        },
        columns: [
          {
            accessorKey: 'branch_manager_name',
            header: 'Branch Manager Code',
            width: 280,
            enableColumnFilter: false,
            minSize: 200,
          },
        ],
      },
      {
        id: 'full_name',
        Header: () => {
          return (
            <div className="tabletopheader">
              <AutoCompletedDropdown
                url={'/api/v0/web/web_ops_manager_dropdown'}
                handleDataChange={(value) =>
                  handleFilterChange(
                    'opsManager',
                    value?.full_name,
                    'ops_manager_id',
                    value.ops_manager_id
                  )
                }
                valueInput={filters.opsManager}
                objLevel={'full_name'}
              />
            </div>
          );
        },
        columns: [
          {
            accessorKey: 'ops_manager_name',
            header: 'OPS Manager Name',
            width: 280,
            enableColumnFilter: false,
            minSize: 200,
          },
        ],
      },
      {
        id: 'full_name',
        Header: () => {
          return (
            <div className="tabletopheader">
              <AutoCompletedDropdown
                url={'/api/v0/web/web_area_manager_dropdown'}
                handleDataChange={(value) =>
                  handleFilterChange(
                    'areaManager',
                    value?.areaManager,
                    'area_manager_id',
                    value.area_manager_id
                  )
                }
                valueInput={filters.areaManager}
                objLevel={'full_name'}
              />
            </div>
          );
        },
        columns: [
          {
            accessorKey: 'area_manager_name',
            header: 'Area Manager Name',
            width: 280,
            enableColumnFilter: false,
            minSize: 200,
          },
        ],
      },
      {
        id: 'grievance_status',
        Header: () => {
          return (
            <div className="tabletopheader">
              <Form.Select
                size="sm"
                value={filters.grievanceStatus || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'grievanceStatus',
                    e.target.value,
                    'grievance_status',
                    null
                  )
                }
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="In Process">In Process</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </div>
          );
        },
        columns: [
          {
            accessorKey: 'grievance_status',
            header: 'Status',
            size: 190,
            enableColumnFilter: false,
          },
        ],
      },
      {
        accessorKey: 'action',
        header: 'Action',
        enableColumnFilter: false,
        size: 90,
        Cell: ({ row }) => (
          <div className="align-items-center gap-1">
            <Badge
              bg="info"
              className="cursor-pointer"
              onClick={() => handleOpenRemarksModal(row)}
            >
              <BsChatLeftDotsFill />
            </Badge>
          </div>
        ),
      },
    ],
    [filters]
  );

  const handleCloseRemarksModal = () => {
    setFormTitle('Add Sahyog Reason');
    // setinputValues(initialValues);
    dispatch(toggleForm());
  };

  const addFormJsx = (
    <>
      <Form.Group>
        <Form.Label>Status</Form.Label>
        <Form.Select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="In Process">In Process</option>
          <option value="Completed">Completed</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mt-3">
        <Form.Label>Remarks</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={newRemark}
          onChange={(e) => setNewRemark(e.target.value)}
        />
      </Form.Group>
      <Button variant="secondary" onClick={handleCloseRemarksModal}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSaveRemarks}>
        Save
      </Button>
    </>
  );

  const handleClose = () => {
    setRemarksModal(false);
  };

  const [remarksFormData, setRemarksFormData] = useState({
    remarks: '',
    status: '',
  });

  const remarksJsx = (
    <Form>
      <Row>
        <Col md={12} className="mb-4">
          <Form.Select
            value={remarksFormData.status}
            onChange={(e) =>
              setRemarksFormData((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
          >
            <option value="">-- Select Status</option>
            <option value="Pending">Pending</option>
            <option value="In Process">In Process</option>
            <option value="Completed">Completed</option>
          </Form.Select>
        </Col>
        <Col md={12} className="mb-4">
          <Form.Control
            as={'textarea'}
            placeholder="Add Remarks"
            value={remarksFormData.remarks}
            onChange={(e) =>
              setRemarksFormData((prev) => ({
                ...prev,
                remarks: e.target.value,
              }))
            }
            style={{ height: '100px' }}
          />
        </Col>
        <Col md={12} className="d-flex justify-content-end gap-2">
          <Button
            size="sm"
            variant="none"
            className="canclebutton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant="none"
            type="button"
            className="savebutton"
            onClick={handleSaveRemarks}
            // disabled={spinnerButton}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );

  return (
    <MainLayout pageName="Grievance" hasAddButton={false}>
      <CommonDataGrid
        url={'/api/v0/web/web_guard_grievance_browse'}
        columns={gridColumns}
        body={filters}
        jsonUpd={updateGrid}
      />

      <ModalComponent
        innerJsx={remarksJsx}
        modalTitle={'Remarks'}
        hidden={remarksModal}
      />

      <ModalComponent
        innerJsx={addFormJsx}
        modalTitle={formTitle}
        // hidden={addButton}
      />
    </MainLayout>
  );
}

export default Grievance;
