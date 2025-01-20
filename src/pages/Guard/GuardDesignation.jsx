import { useMemo, useState } from 'react';
import moment from 'moment';
import { Badge, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  hideModal,
  toggleForm,
  toggleSpinnerAndDisableButton,
} from '../../Redux/Modals';
import { BsEyeFill, BsPenFill, BsTrash3Fill } from 'react-icons/bs';
import DeleteModal from '../../components/DeleteModal';
import CommonDataGrid from '../../components/CommonDataGrid';
import MainLayout from '../../components/MainLayout';
import { userService } from '../../../service/service';
import ModalComponent from '../../components/ModalComponent';

export default function GuardDesignation() {
  const dispatch = useDispatch();
  const addButton = useSelector((state) => state.addFormButton.show);
  const spinnerButton = useSelector(
    (state) => state.toggleSpinnerAndDisableButton.show
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [formTitle, setFormTitle] = useState('Add Guard Designation');

  const deleteMessage = useSelector((state) => state.removeModal.message);
  const deleteModalData = {
    name: deleteMessage?.p_designation,
    id: deleteMessage?.p_designation_id,
  };

  const initialValues = {
    p_action: 'INSERT',
    p_designation_id: 5,
    p_designation: '',
  };

  const [inputValues, setinputValues] = useState(initialValues);

  const [disableValue, setdisableValue] = useState({
    p_designation_id: '',
    disable: false,
  });
  const [body, setbody] = useState({
    refresh: '',
  });
  const [updateGrid, setupdateGrid] = useState(0);

  const handleClose = () => {
    setFormTitle('Add Guard Designation');
    setinputValues(initialValues);
    dispatch(toggleForm());
  };

  const gridColumn = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'S.No.',
        enableColumnFilter: false,
        Cell: ({ renderedCellValue, row }) => Number(row.id) + 1,
        size: 90,
      },
      {
        accessorKey: 'designation',
        header: 'Designation',
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: 'created_by_name',
        header: 'Created By',
        enableColumnFilter: false,
        size: 270,
      },
      {
        accessorKey: 'created_at',
        header: 'Created Date',
        enableColumnFilter: false,
        size: 160,
        Cell: ({ renderedCellValue, row }) => {
          return (
            <span>
              {moment(row.original.datetime).format('DD/MM/YYYY')} (
              {moment(row.original.datetime).format('LT')})
            </span>
          );
        },
      },
      {
        accessorKey: 'updated_by_name',
        header: 'Updated By',
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: 'updated_at',
        header: 'Updated Date',
        enableColumnFilter: false,
        size: 160,
        Cell: ({ renderedCellValue, row }) => {
          return (
            <span>
              {moment(row.original.datetime).format('DD/MM/YYYY')} (
              {moment(row.original.datetime).format('LT')})
            </span>
          );
        },
      },
      {
        accessorKey: 'action',
        header: 'Action',
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
            <Badge bg="danger" className="cursor-pointer">
              <BsTrash3Fill />
            </Badge>
          </div>
        ),
      },
    ],
    []
  );

  const handleChange = (event) => {
    setinputValues({
      ...inputValues,
      [event.target.name]: event.target.value,
    });
  };

  const insertForm = async () => {
    dispatch(toggleSpinnerAndDisableButton(true));
    try {
      const response = await userService.post(
        '/api/v0/web/web_master_guard_designation_manage',
        inputValues
      );
      if (response.status === 200) {
        if (response.data.status === 400) {
          alert(response.data.message || 'Found Duplicate Entries');
          dispatch(toggleSpinnerAndDisableButton(false));
          return;
        } else {
          setinputValues({
            p_action: 'INSERT',
            p_designation_id: 5,
            p_designation: '',
          });
        }
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(toggleForm());
      dispatch(toggleSpinnerAndDisableButton(false));
      setShowSuccess(true);
      setupdateGrid(updateGrid + 1);
      setbody({
        ...body,
        refresh: 2,
      });
      setTimeout(() => {
        setShowSuccess(false);
      }, 1200);
    }
  };

  const addFormJsx = (
    <Form>
      <Row>
        <Col md={12} className="mb-4">
          <TextField
            size="small"
            fullWidth
            label={'Guard Designation'}
            name="p_designation"
            value={inputValues.p_designation}
            onChange={handleChange}
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
            onClick={insertForm}
            disabled={spinnerButton}
          >
            {spinnerButton ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              'Submit'
            )}
          </Button>
        </Col>
      </Row>
    </Form>
  );

  async function handleDelete(id) {
    const obj = {
      p_guard_designation_id: id,
    };
    try {
      const response = await userService.post(
        'settings/settings_fabric_delete',
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

  return (
    <MainLayout
      pageName={'Guard Designation'}
      hasAddButton={true}
      branchDropdown={false}
    >
      <CommonDataGrid
        url={'/api/v0/web/web_master_guard_designation_browse'}
        columns={gridColumn}
        body={body}
        jsonUpd={updateGrid}
      />
      <ModalComponent
        innerJsx={addFormJsx}
        modalTitle={formTitle}
        hidden={addButton}
      />
      <DeleteModal removeId={handleDelete} data={deleteModalData} />
      {/* <SuccessMessage hidden={showSuccess} /> */}
    </MainLayout>
  );
}
