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
import SuccessMessage from '../../components/SuccessMessage';

export default function SahyogReason() {
  const dispatch = useDispatch();
  const addButton = useSelector((state) => state.addFormButton.show);
  const spinnerButton = useSelector(
    (state) => state.toggleSpinnerAndDisableButton.show
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [formTitle, setFormTitle] = useState('Add Sahyog Reason');

  const deleteMessage = useSelector((state) => state.removeModal.message);
  const deleteModalData = {
    id: deleteMessage?.p_category_id,
  };

  const initialValues = {
    p_operation: 'INSERT',
    p_reason_id: 1,
    p_reason: '',
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
    setFormTitle('Add Sahyog Reason');
    setinputValues(initialValues);
    dispatch(toggleForm());
  };

  const disableCategory = async (row) => {
    try {
      const updatedDisableValue = {
        ...disableValue,
        p_is_disabled: !row.original.p_is_disabled,
        p_subcategory_id: row.original.p_subcategory_id,
      };

      const response = await userService.post(
        '/api/v0/web/issue_subcategory_disable',
        updatedDisableValue
      );

      if (response.data.valid) {
        setShowSuccess(true);

        // Refresh Grid Data
        setbody((prevState) => ({
          ...prevState,
          refresh: prevState.refresh + 1,
        }));

        setTimeout(() => {
          setShowSuccess(false);
        }, 1600);
      } else {
        alert('Error updating category');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (data) => {
    dispatch(toggleForm());
    setFormTitle('Edit Sahyog Reason');
    try {
      const response = await userService.post(
        '/api/v0/web/issue_subcategory_preview',
        { p_category_id: data.original.p_category_id }
      );
      console.log('😎', response.data);

      if (response.data.valid) {
        console.log(response.data);
        let value = response.data.data;
        let tempData = { ...inputValues };
        for (let key in inputValues) {
          if (value.hasOwnProperty(key)) {
            tempData[key] = value[key];
          }
        }
        setinputValues(tempData);
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
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
        accessorKey: 'reason',
        header: 'Sahyog Reason',
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: 'is_disabled',
        header: 'Disable',
        enableColumnFilter: false,
        size: 100,
        Cell: ({ row, renderedCellValue }) => {
          return (
            <div className="actionswitch">
              <Form.Check
                type="switch"
                size="sm"
                variant="danger"
                defaultChecked={renderedCellValue}
                onChange={() => disableCategory(row)}
              />
            </div>
          );
        },
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
        Cell: ({ row }) => (
          <div className="d-flex align-items-center gap-1">
            <Badge bg="primary" onClick={() => handleEdit(row)}>
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
        '/api/v0/web/web_sahyog_reason_manage',
        inputValues
      );
      if (response.status === 200) {
        if (response.data.status === 400) {
          alert(response.data.message || 'Found Duplicate Entries');
          dispatch(toggleSpinnerAndDisableButton(false));
          return;
        } else {
          setinputValues({
            p_operation: 'INSERT',
            p_reason_id: 1,
            p_reason: '',
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
            label={'Sahyog Reason'}
            name="p_reason"
            value={inputValues.p_reason}
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
      p_subcategory_id: id,
    };
    try {
      const response = await userService.post(
        '/api/v0/web/issue_subcategory_delete',
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
      pageName={'Sahyog Reason'}
      hasAddButton={true}
      branchDropdown={false}
    >
      <CommonDataGrid
        url={'/api/v0/web/web_sahyog_reason_browse'}
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
      <SuccessMessage hidden={showSuccess} />
    </MainLayout>
  );
}
